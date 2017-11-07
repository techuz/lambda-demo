"use strict";

// requiring node modules which will be used in logic of action.

var aws =  require("aws-sdk"),
  path = require("path"),
  config = require(path.resolve("config/config")),
  cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();

// setting AWS region
aws.config.update({
  region: config.AWS_REGION
});

module.exports = class Logout {
  constructor() {}

  execute (event, context, callback) {

    var params = {
      AccessToken: event.context.accessToken
    };

    // Sign out user from all devices
    cognitoIdentityServiceProvider.globalSignOut(params, function (err, result) {
      if (err) {
        console.error(err);
        var resultObj = Object.assign({}, config.RESULT_OBJECT);
        resultObj.status = 0;
        resultObj.message = err.message;
        resultObj.error = err;
        callback(null, resultObj);
      } else {
        var resultObj = Object.assign({}, config.RESULT_OBJECT);
        resultObj.message = config.MSG.SUCCESS;
        callback(null, resultObj);
      }
    });
  }
}