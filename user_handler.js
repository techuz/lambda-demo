"use strict";

// Setting path to access node modules
process.env.PATH = process.env.PATH + ":" + process.env.LAMBDA_TASK_ROOT;

var path = require("path"),
  config = require(path.resolve("config/config")),
  CreateUser = require(path.resolve("actions/create_user")),
  ConfirmUser = require(path.resolve("actions/confirm_user")),
  Login = require(path.resolve("actions/login")),
  GetUser = require(path.resolve("actions/get_user")),
  Logout = require(path.resolve("actions/logout"));

var ACTION = {	
  "CreateUser": new CreateUser(),
  "ConfirmUser": new ConfirmUser(),
  "Login": new Login(),
  "GetUser": new GetUser(),
  "Logout": new Logout()
};

exports.handler = function(event, context, callback) {
  if (event.context.action in ACTION) {
    return ACTION[event.context.action].execute(event, context, callback);
  } else {
    var resultObj = Object.assign({}, config.RESULT_OBJECT);
    resultObj.status = 0;
    resultObj.message = config.MSG.NO_SUCH_ACTION_EXIST;
    callback(null, resultObj);
  }
};