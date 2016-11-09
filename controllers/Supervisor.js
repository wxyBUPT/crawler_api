/**
 * Created by xiyuanbupt on 11/4/16.
 */

'use strict';

var BaseController = require('./Base'),
    supervisord = require('supervisord'),
    tmp = require('../config'),
    config = tmp(tmp.mode),
    client = supervisord.connect(config.supervisor.uri);

module.exports = BaseController.extend({
    
});
