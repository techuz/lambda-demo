"use strict";

// requiring node modules which will be used in logic of action.

var async = require("async"),
  path = require("path"),
  config = require(path.resolve("config/config")),
  User = require(path.resolve("model/user"));

module.exports = class GetUser {
  constructor() {}

  execute (event, context, callback) {
    var userObj = new User(), obj = {};
    obj.userId = event.data.userId === config.SELF ? event.context.userId : event.data.userId;
    obj.email = " ";

    // Get User details
    userObj.getUserDetails(obj, function(err, result) {
      if (err) {
        console.error(err);
        callback(err);
      } else if (result && result.Count) {
        var resultObj = Object.assign({}, config.RESULT_OBJECT);
        resultObj.message = config.MSG.SUCCESS;
        resultObj.result = {
          userDetails: result.Items[0]
        };
        callback(null, resultObj);
      } else {
        var resultObj = Object.assign({}, config.RESULT_OBJECT);
        resultObj.status = 0;
        resultObj.message = config.MSG.NO_SUCH_USER_EXIST;
        callback(null, resultObj);
      }
    });
  }
}