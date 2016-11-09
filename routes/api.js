/**
 * Created by xiyuanbupt on 11/3/16.
 */

'use strict';

var rpc = require('../rpc');



var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('crawler-api');
});

module.exports = router;