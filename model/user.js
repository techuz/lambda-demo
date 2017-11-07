"use strict";

// Requiring node modules
var aws = require("aws-sdk"),
	path = require("path"),
	config = require(path.resolve("config/config")),
	docClient = new aws.DynamoDB.DocumentClient();

// setting AWS region
aws.config.update({
  region: config.AWS_REGION
});

module.exports = class Users {
	constructor () {
		this.props = {};
	}

	// Create User
	createUser (dataObj, callback) {

		this.props = {
			TableName: config.AXIONCORE_USER_TABLE,
			Item: {
				"version": 1,	
			}
		};

		for (var key in dataObj) {
		    if( dataObj.hasOwnProperty(key) ) {
		      this.props.Item[key] = dataObj[key];
		    } 
		}

		docClient.put(this.props, function (err, data) {
			if (err) {
			  callback(err);
			} else {
			  callback(null, data);
			}
		});
	}

	// Get user id by email or id
	getUserDetails (dataObj, callback) {

		this.props = {
      		TableName: config.AXIONCORE_USER_TABLE,
      		FilterExpression:"email = :email OR userId = :userId",
      		ExpressionAttributeValues: {
        		":email": dataObj.email,
        		":userId": dataObj.userId
  			}
    	};

		docClient.scan(this.props, function (err, data) {
			if (err) {
			  callback(err);
			} else {
			  callback(null, data);
			}
		});
	}

	// Update user status
	updateUserStatus (dataObj, callback) {

		this.props = {
      		TableName: config.AXIONCORE_USER_TABLE,
      		Key: {
        		"userId": dataObj.userId
      		},
      		UpdateExpression: "set #status = :status, #version = #version + :version",
      		ConditionExpression: "email = :email",
      		ExpressionAttributeNames: {
        		"#status": "status",
	  			"#version": "version"
      		},
      		ExpressionAttributeValues:{
        		":status": dataObj.status,
        		":email": dataObj.email,
	    		":version": 1
      		},
      		ReturnValues:"ALL_NEW"
    	};

		docClient.update(this.props, function (err, data) {
			if (err) {
			  callback(err);
			} else {
			  callback(null, data);
			}
		});
	}
}