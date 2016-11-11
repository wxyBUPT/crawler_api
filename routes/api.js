/**
 * Created by xiyuanbupt on 11/3/16.
 */

'use strict';

var db = require('../db').get();

var supervisord = require('supervisord'),
    conf = require('../config')(),
    rpc = supervisord.connect(conf.supervisor.uri),
    rds = require('redis').createClient({
        host:conf.redis.host
    });

rds.on("ready", function () {
    console.log("Redis connect succeed");
});

rds.on("error", function (err) {
    console.log("Error " + err);
});


var express = require('express');
var router = express.Router();

var getProcessStatusByName = function (name) {
    return function (req,res) {
        rpc.getProcessInfo(name, function (err,result) {
            result.name = name;
            delete result.logfile;
            delete result.stderr_logfile;
            delete result.group;
            delete result.stdout_logfile;
            delete result.pid;
            delete result.spawnerr;
            res.jsonp(result);
        });
    }
};

// 结束进程
var stopProcessByName = function (name) {
    return function (req,res) {
        rpc.getProcessInfo(name, function (err,result) {
            // 如果当前进程正在执行
            var status = "fail";
            var reason = "Not Running";
            if(result.state == 20){

                // 下面是发送 SIGINT 信号
                // 进程不会强行结束,会保存报表数据
                if(req.body.sigint ){
                    console.log("Ctrl-C");
                    rpc.signalProcess(name,'2', function (err,result) {
                        res.jsonp(result);
                    });
                }
                else {
                    // 下面是强行终止
                    // 相当于kill -9
                    rpc.stopProcess(name, true, function (err, stopstatus) {

                        rpc.getProcessInfo(name, function (err, result) {
                            result.status = "success";
                            result.reason = "Stop success";
                            result.stoped = stopstatus;
                            delete result.logfile;
                            delete result.stderr_logfile;
                            delete result.group;
                            delete result.stdout_logfile;
                            delete result.pid;
                            delete result.spawnerr;
                            res.jsonp(result);
                            return;
                        });
                    });
                }
            }else {
                result.status = status;
                result.reason = reason;
                delete result.logfile;
                delete result.stderr_logfile;
                delete result.group;
                delete result.stdout_logfile;
                delete result.pid;
                delete result.spawnerr;
                res.jsonp(result);
            }
        });
    }
};

// 开始进程,其中不涉及参数的传递,适合于非topn 部分
var startProcessByName = function (name) {
    return function (req,res){
        rpc.getProcessInfo(name, function (err,result) {
            // 如果当前进程正在执行
            if(result.state == 20){
                var tmp = {
                    status:"fail",
                    reason:"stillrunning"
                };
                res.jsonp(tmp);
            }
            // 如果当前进程没有在执行
            else if(result.state == 0){
                rpc.startProcess(name,true,function (err,result) {
                });
                rpc.getProcessInfo(name, function (err,result) {
                    result.name = name;
                    delete result.logfile;
                    delete result.stderr_logfile;
                    delete result.group;
                    delete result.stdout_logfile;
                    delete result.pid;
                    delete result.spawnerr;
                    result.status = "success";
                    res.jsonp(result);
                });
            }else {
                res.jsonp({status:"fail",
                    reason:"Please start latter"
                });
            }
        });
    }
};

/**
 * 触发topn 进程,name为进程名称,webname 为配置项
 * @param name
 * @param webname
 * @returns {Function}
 */
var startTopnProcessByName = function (name) {
    return function (req,res,next) {
        var urls = req.body.urls;
        var topn_n = req.body.topn_n;

        // 设置topn_n 与保存的表明
        console.log(_conf);
        console.log(_conf.topn_n_key);

        if(!urls || !topn_n){
            var err = new Error("body must contains urls and topn_n parameters");
            next(err);
        }

        // 当前只负责处理urls.length == 0 的情况
        if(urls.length != 0){
            var err = new Error("指定url爬取时高级功能,在目前版本中还未实现");
            next(err);
        }
        console.log("执行到这里");
        console.log(req.body);

        console.log(req.body.urls.length);

        rds.set("foo","bar");
        rds.get("foo", function (err,reply) {
            console.log(reply.toString());
            console.log(reply);
        });
        console.log(req.body.topn_n);
        res.send(req.body);
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('crawler-api');
});

router.route('/xmly/topn')
    .get(getProcessStatusByName(conf.supervisor.xmly_topn)
    )
    .post(
        function (req,res,next) {
            rpc.getProcessInfo(conf.supervisor.xmly_topn, function (err,result) {
                // 如果当前进程正在执行
                if (result.state == 20) {
                    var tmp = {
                        status: "fail",
                        reason: "stillrunning"
                    };
                    res.jsonp(tmp);
                }
                var urls = req.body.urls;
                var top_n = req.body.topn_n;
                if (!top_n) {
                    var err = new Error("Body must contains topn_n parm");
                    next(err);
                }

                if (urls.length != 0) {
                    var err = new Error("当前版本不支持指定urls 爬取");
                    next(err);
                }
                rds.set(conf.xmly.topn_n_key, top_n);
                var dNow = new Date();
                var s = '_' + dNow.getFullYear() + dNow.getMonth() + +dNow.getDate() + dNow.getHours() + dNow.getMinutes();
                rds.set(conf.xmly.topn_table, 'xmly_top' + top_n + s);
                rpc.startProcess(conf.supervisor.xmly_topn, true, function (err, result) {
                    rpc.getProcessInfo(conf.supervisor.xmly_topn, function (err, result) {
                        result.name = "xmly_topn";
                        delete result.logfile;
                        delete result.stderr_logfile;
                        delete result.group;
                        delete result.stdout_logfile;
                        delete result.pid;
                        delete result.spawnerr;
                        res.jsonp(result);
                    });
                });
            });
        }
    )
    .delete(
        stopProcessByName(conf.supervisor.xmly_topn)
    );

router.route('/kl/topn')
    .get(getProcessStatusByName(conf.supervisor.kl_topn))
    .post(
        startTopnProcessByName(conf.supervisor.kl_topn)
    )
    .delete(
        stopProcessByName(conf.supervisor.kl_topn)
    );

router.route('/qt/topn')
    .get(getProcessStatusByName(conf.supervisor.qt_topn))
    .post(
        function (req,res,next) {
            rpc.getProcessInfo(conf.supervisor.qt_topn, function (err,result) {
                // 如果当前进程正在执行
                if (result.state == 20) {
                    var tmp = {
                        status: "fail",
                        reason: "stillrunning"
                    };
                    res.jsonp(tmp);
                    return;
                }
                var topn_n = req.body.topn_n;
                if (!topn_n) {
                    var err = new Error("Body must contains topn_n parm");
                    next(err);
                    return;
                }
                else {
                    rpc.startProcess(conf.supervisor.qt_topn, true, function (err, result) {
                        rpc.getProcessInfo(conf.supervisor.qt_topn, function (err, result) {
                            result.name = "xmly_topn";
                            delete result.logfile;
                            delete result.stderr_logfile;
                            delete result.group;
                            delete result.stdout_logfile;
                            delete result.pid;
                            delete result.spawnerr;
                            res.jsonp(result);
                        });
                    });
                }
            });
        }
    )
    .delete(
        stopProcessByName(conf.supervisor.qt_topn)
    );

router.route('/kl/full')
    .get(getProcessStatusByName(conf.supervisor.kl_full))
    .post(
        startProcessByName(conf.supervisor.kl_full)
    )
    .delete(
        stopProcessByName(conf.supervisor.kl_full)
    );

router.route('/qt/full')
    .get(getProcessStatusByName(conf.supervisor.qt_full))
    .post(
        startProcessByName(conf.supervisor.qt_full)
    )
    .delete(
        stopProcessByName(conf.supervisor.qt_full)
    );

router.route('/xmly/full')
    .get(getProcessStatusByName(conf.supervisor.xmly_full))
    .post(
        startProcessByName(conf.supervisor.xmly_full)
    )
    .delete(
        stopProcessByName(conf.supervisor.xmly_full)
    );

router.route('/xmly/increment')
    .get(getProcessStatusByName(conf.supervisor.xmly_increment))
    .post(
        startProcessByName(conf.supervisor.xmly_increment)
    )
    .delete(
        stopProcessByName(conf.supervisor.xmly_increment)
    );

router.route('/qt/increment')
    .get(getProcessStatusByName(conf.supervisor.qt_increment))
    .post(
        startProcessByName(conf.supervisor.qt_increment)
    )
    .delete(
        stopProcessByName(conf.supervisor.qt_increment)
    );

router.route('/kl/increment')
    .get(getProcessStatusByName(conf.supervisor.kl_increment))
    .post(
        startProcessByName(conf.supervisor.kl_increment)
    )
    .delete(
        stopProcessByName(conf.supervisor.kl_increment)
    );


module.exports = router;