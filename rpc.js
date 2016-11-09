/**
 * Created by xiyuanbupt on 11/3/16.
 * 负责所有的rpc 通信
 */

"use strict";

var supervisord = require('supervisord');
var conf = require('./config')();


var client = supervisord.connect(conf.supervisor.api);

var connect = function () {
};

connect();

var Supervisor = function () {
};

Supervisor.prototype.sayhello = function () {
    client.getAllProcessInfo(function(err, result)
    {

        /*
         [ { description: 'pid 22083, uptime 0:10:36',
         pid: 22083,
         stderr_logfile: '/tmp/test-stderr---supervisor-G27SFc.log',
         stop: 1316236587,
         logfile: '/tmp/test-stdout---supervisor-izrtu6.log',
         exitstatus: 0,
         spawnerr: '',
         now: 1316237455,
         group: 'app-1',
         name: 'app-1',
         statename: 'RUNNING',
         start: 1316236819,
         state: 20,
         stdout_logfile: '/tmp/test-stdout---supervisor-izrtu6.log' } ]
         */
    });

    client.listMethods(function (err,result) {
    });

    client.getAPIVersion(function (err,version) {
        client.getSupervisorVersion(function (err,sup_version) {
            client.getIdentification(function (err,iden) {
                console.log("Supervisor connected, API version is :" + version, + ", supervisor version " +
                    "is : " + sup_version + ", identification is : " + iden);
            });
        });
    });
};

module.exports = new Supervisor();
