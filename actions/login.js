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

module.exports = class Login {
  constructor() {}

  execute (event, context, callback) {

    async.waterfall([
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
            callback(null);
          } else {
            var resultObj = Object.assign({}, config.RESULT_OBJECT);
            resultObj.status = 0;
            resultObj.message = config.MSG.NO_SUCH_USER_EXIST;
            callback(resultObj);
          }
        });
      },
      function (callback) {

        var params = {
          ClientId: config.USER_POOL_DETAILS.ClientId,
          UserPoolId: config.USER_POOL_DETAILS.UserPoolId,
          AuthFlow: "ADMIN_NO_SRP_AUTH",
          AuthParameters: {
            "USERNAME": event.data.email,
            "PASSWORD": event.data.password
          },
          ClientMetadata: {}
        };

        // Authenticate user and get token
        cognitoIdentityServiceProvider.adminInitiateAuth(params, function (err, result) {
          if (err) {
            console.error(err);
            var resultObj = Object.assign({}, config.RESULT_OBJECT);
            resultObj.status = 0;
            resultObj.message = err.message;
            resultObj.error = err;
            callback(resultObj);
          } else {
            var resultObj = Object.assign({}, config.RESULT_OBJECT);
            resultObj.message = config.MSG.SUCCESS;
            resultObj.result = {
              idToken: result.AuthenticationResult.IdToken,
              accessToken: result.AuthenticationResult.AccessToken
            };
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