/**
 * Created by xiyuanbupt on 11/3/16.
 * 执行数据库的连接
 */

var MongoClient = require('mongodb').MongoClient;

var state = {
    db:null,
};

exports.connect = function (url,cb) {
    if(state.db)return cb();
    MongoClient.connect(url, function (err,db) {
        state.db = db;
        cb(err);
    })
};

exports.get = function () {
    return state.db;
};

exports.close = function (done) {
    if(state.db){
        state.db.close(function (err,result) {
            state.db = null;
            done(err);
        })
    }
};
