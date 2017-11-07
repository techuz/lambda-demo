# lambda-demo
This project demonstrates Serverless application using Microservice architecture through AWS Lambda. It also includes how to query AWS DynamoDB table, get and store user details in AWS Cognito User Pool, set and access environment variables of AWS Lambda and access third party libraries in AWS Lambda.

# Description:
This project demonstrates Serverless application using Microservice architecture through AWS Lambda. I have created one module of the application i.e. “Users” which supports basic functionality like creating user, confirm user by verifying email, login, get user details and logout.It also includes how to query AWS DynamoDB table, get and store user details in AWS Cognito User Pool, set and access environment variables of AWS Lambda and access third party libraries in AWS Lambda. I have included detailed information of concepts in "user_info.pdf" file which is located in docs sub-folder.

# Prerequisites:
  1). Need to have active AWS Account.
  
  2). You have to create DynamoDB table whose table name will be “user” and partition key of table will be “userId” whose  data type will be String. You can create table through AWS Console and also from NodeJS using createTable operation. 
  
  3). You have to create Cognito User pool whose username attributes will be “Email” and custom attributes will be “userName”    and “userId” whose data type will be string. Verifications attribute of Cognito User Pool will be set to “Email” for verifying user email address.

# Steps to access project:

1). Clone repository

    git clone https://github.com/techuz/lambda-demo.git
    
2). Go in project repository

    cd lambda-demo 
    
3). Create zip file of all sub-folder

4). Upload created zip file to AWS Lambda function whose handler name will be “user_handler.handler”.

5). Set Environment Variable in AWS Lambda. Key will be UserPoolId and ClientId whose value will be fetched from Cognito User Pool which you have created. For more details please check in "user_info.pdf" file located in docs sub-folder.

6). Save your AWS Lambda function.

# Test Cases: 

# Test Case 1: Create user
    
    {
      "context": {
          "action": "CreateUser" // Don’t Change because based on action name it will perform action.
      },
      "data": {
        "email": "abc@domain.com",
        "password": "Abc@12345", // Atleast 8 characters long with one uppercase character, one lowercase, one symbol and one digit.
        "userName": "Lambda Demo"
      }
    }

# Test Case 2: Confirm User
    {
      "context": {
        "action": "ConfirmUser"// Don’t Change because based on action name it will perform action.
      },
      "data": {
        "email": "abc@domain.com",
        "verificationCode": "156600" // Enter code which sent to your email address.
      }
    }

# Test Case 3: Login
    {
      "context": {
        "action": "Login" // Don’t Change because based on action name it will perform action.
      },
      "data": {
        "email": "abc@domain.com",
        "password": "Abc@12345"
      }
    }

# Test Case 4: Get User Details
    {
      "context": {
        "action": "GetUser"// Don’t Change because based on action name it will perform action.
      },
      "data": {
        "userId": "0c3de391-92b3-4390-aae5-32bc8cc0a1c" // Enter user id for getting user details.
      }
    }

# Test Case 5: Logout
    {
      "context": {
        "action": "Logout",// Don’t Change because based on action name it will perform action.
        "accessToken": "accessToken"
      }
    }

