import type { AWS } from "@serverless/typescript";

import webhook from "./src/functions/webhook";

const SERVICE_NAME = "receeve-challenge";
const DYNAMODB_TABLE = `${SERVICE_NAME}-prod`;

const serverlessConfiguration: AWS = {
	service: SERVICE_NAME,
	frameworkVersion: "2",
	useDotenv: true,
	custom: {
		webpack: {
			webpackConfig: "./webpack.config.js",
			includeModules: true,
		},
	},
	plugins: ["serverless-webpack"],
	package: {
		individually: true,
	},
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
			DYNAMODB_TABLE,
		},
		lambdaHashingVersion: "20201221",
		iamRoleStatements: [
			{
				Effect: "Allow",
				Action: [
					"dynamodb:DescribeTable",
					"dynamodb:Query",
					"dynamodb:Scan",
					"dynamodb:GetItem",
					"dynamodb:PutItem",
				],
				Resource: [{ "Fn::GetAtt": ["WebhookDynamoTable", "Arn"] }],
			},
		],
	},
	resources: {
		Resources: {
			WebhookDynamoTable: {
				Type: "AWS::DynamoDB::Table",
				DeletionPolicy: "Retain",
				Properties: {
					TableName: "${self:provider.environment.DYNAMODB_TABLE}",
					AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
					KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
					ProvisionedThroughput: {
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					},
				},
			},
		},
	},
	// import the function via paths
	functions: { webhook },
};

module.exports = serverlessConfiguration;
