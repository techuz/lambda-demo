"use strict";

// requiring node modules which will be used in logic of action.

var aws =  require("aws-sdk"),
  async = require("async"),
  uuidV4 = require("uuid/v4"),
  path = require("path"),
  config = require(path.resolve("config/config")),
  User = require(path.resolve("model/user")),
  cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();

// setting AWS region
aws.config.update({
  region: config.AWS_REGION
});

module.exports = class CreateUser {
  constructor() {}

  execute (event, context, callback) {
    async.waterfall([
      function (callback) {

        var userObj = new User(), obj = {};
        obj.email = event.data.email;
        obj.userId = " ";
        
        // Check user with same email address exist or not
        userObj.getUserDetails(obj, function(err, result) {
          if (err) {
            console.error(err);
            callback(err);
          } else if (result && result.Count) {
            var resultObj = Object.assign({}, config.RESULT_OBJECT);
            resultObj.status = 0;
            resultObj.message = config.MSG.USER_EXIST;
            callback(resultObj);
          } else {
            callback(null);
          }
        });
      },
      function (callback) {
        
        var userId = uuidV4();
        var params = {
          ClientId: config.USER_POOL_DETAILS.ClientId,
          Username: event.data.email,
          Password: event.data.password,
          UserAttributes: [
            {
              Name: "custom:userName",
              Value: event.data.userName
            },
            {
              Name: "custom:userId",
              Value: userId
            }
          ],
          ValidationData: []
        };

        // Create user in cognito user pool
        cognitoIdentityServiceProvider.signUp(params, function(err, data) {
          if (err) {
            console.error(err);
            var resultObj = Object.assign({}, config.RESULT_OBJECT);
            resultObj.status = 0;
            resultObj.message = err.message;
            resultObj.error = err;
            callback(resultObj);
          }
          else {
            callback(null, userId);
          }
        });
      },
      function (userId, callback) {

        var userObj = new User(), obj = {};
        obj.userId = userId;
        obj.userName = event.data.userName;
        obj.email = event.data.email;
        obj.status = config.PENDING_STATUS;

        // Storing user details in DynamoDB
        userObj.createUser(obj, function(err, result) {
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