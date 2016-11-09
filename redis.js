/**
 * Created by xiyuanbupt on 11/8/16.
 */

var redis = require('redis');
var conf = require('./config')();

var client = redis.createClient({
    host:conf.redis.host
});

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("ready", function () {
    console.log("ready");
});

