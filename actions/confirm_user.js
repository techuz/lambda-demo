"use strict";

// requiring node modules which will be used in logic of action.

var aws =  require("aws-sdk"),
  async = require("async"),
  path = require("path"),
  config = require(path.resolve("config/config")),
  User = require(path.resolve("model/user")),
  cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();

// setting AWS region
aws.config.update({
  region: config.AWS_REGION
});

module.exports = class ConfirmUser {
  constructor() {}

  execute (event, context, callback) {
    async. waterfall([
      function (callback) {

        var userObj = new User(), obj = {};
        obj.email = event.data.email;
        obj.userId = " ";

        // Get user details
        userObj.getUserDetails(obj, function (err, result) {
          if (err) {
            console.error(err);
            callback(err);
          } else if (result && result.Count) {
            if (result.Items[0].status === config.ACTIVE_STATUS) {
              var resultObj = Object.assign({}, config.RESULT_OBJECT);
              resultObj.status = 0;
              resultObj.message = config.MSG.USER_ALREADY_VERIFIED;
              callback(resultObj);
            } else {
              callback(null, result.Items[0].userId);  
            }
          } else {
            var resultObj = Object.assign({}, config.RESULT_OBJECT);
            resultObj.status = 0;
            resultObj.message = config.MSG.NO_SUCH_USER_EXIST;
            callback(resultObj);
          }
        });
      },
      function (userId, callback) {

        var params = {
          ClientId: config.USER_POOL_DETAILS.ClientId,
          ConfirmationCode: event.data.verificationCode,
          Username: event.data.email
        };

        // Verify user verification code from cognito user pool
        cognitoIdentityServiceProvider.confirmSignUp(params, function (err, result) {
          if (err) {
            console.error(err);
            var resultObj = Object.assign({}, config.RESULT_OBJECT);
            resultObj.status = 0;
            resultObj.message = err.message;
            resultObj.error = err;
            callback(resultObj);
          } else {
            callback(null, userId);  
          }
        });
      },
      function (userId, callback) {
        
        var userObj = new User(), obj = {};
        obj.email = event.data.email;
        obj.userId = userId;
        obj.status = config.ACTIVE_STATUS;

        // Set user status to ACTIVE
        userObj.updateUserStatus(obj, function(err, result) {
          if (err) {
            console.error(err);
            callback(err);
          } else {
            var resultObj = Object.assign({}, config.RESULT_OBJECT);
            resultObj.message = config.MSG.SUCCESS;
            callback(null, resultObj);
          }
        });
      }
    ], function (err, result) {
      if (err && !err.status) {
        callback(null, err);
      } else if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  }
}