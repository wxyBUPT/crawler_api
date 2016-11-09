/**
 * Created by xiyuanbupt on 11/4/16.
 */

'use strict';

var _ = require('underscore');

module.exports = {
    name:"base",
    extend: function (child) {
        return _.extend({},this,child);
    },
    run: function (req,res,next) {

    }
};