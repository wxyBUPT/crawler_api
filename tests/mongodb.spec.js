/**
 * Created by xiyuanbupt on 11/4/16.
 */

'use strict';


describe("MongoDB", function () {
    it("is there a server running in ", function (next) {
        var config = require('../config')();
        var MongoClient = require('mongodb').MongoClient;

        MongoClient.connect(config.mongo.uri, function (err,db) {
            expect(err).toBe(null);
            expect(db).toBeDefined();
            db.close();
            next();
        })
    });
});
