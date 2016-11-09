/**
 * Created by xiyuanbupt on 11/4/16.
 */

'use strict';

var Model = require('./Base'),
    model = new Model();

var XMLYModel = model.extend({

    audio: function () {
        if(this._audio){
            return this._audio;
        }
        return this._audio = this.db.collection('xmly_audio');
    },

    album: function () {
        if(this._album){
            return this._album;
        }
        return this._album = this.db.collection("xmly_album");
    },

    category: function () {
        if(this._category){
            return this._category;
        }
        return this._category = this.db.collection("xmly_category");
    },

    album_list: function (callback,query) {
        this.album().find(query||{}).toArray(callback);
    },

});

module.exports = XMLYModel;