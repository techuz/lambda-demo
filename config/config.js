"use strict";

module.exports = {
	AWS_REGION: "us-east-2",
	AXIONCORE_USER_TABLE: "user",
	SELF: "self",
	ACTIVE_STATUS: "ACTIVE",
	PENDING_STATUS: "PENDING",
	RESULT_OBJECT: {
		status: 1,
		result: {},
		error: {},
		message: ""
	},
	MSG: {
		SUCCESS: "Success",
		USER_EXIST: "User already exist with same email address.",
		NO_SUCH_USER_EXIST: "No such user exist.",
    	USER_ALREADY_VERIFIED: "User is already verified.",
    	NO_SUCH_ACTION_EXIST: "No such action exist."
	},
	USER_POOL_DETAILS: {
		UserPoolId : process.env.UserPoolId,
    	ClientId : process.env.ClientId 
	}
};
