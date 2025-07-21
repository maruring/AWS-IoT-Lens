import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs'
import {
  aws_iot,
  aws_iam,
  aws_ec2,
  aws_dynamodb
 } from 'aws-cdk-lib';

const PREFIX = 'IotLens';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table for IoT Data
    const dynamoTable = new aws_dynamodb.Table(this, `${PREFIX}DynamoTable`, {
      tableName: `${PREFIX}SensorData`,
      partitionKey: { name: 'device_id', type: aws_dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: aws_dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 本番ではRETAINを推奨
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST
    });

    // IoT Policy
    const iotPolicy = new aws_iot.CfnPolicy(this, `${PREFIX}IoTPolicy`, {
      policyName: `${PREFIX}Policy`,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'iot:Connect',
              'iot:Publish',
              'iot:Subscribe',
              'iot:Receive'
            ],
            Resource: '*'
          }
        ]
      }
    });

    // IAM Role for IoT Rule (DynamoDB用)
    const iotRuleRole = new aws_iam.Role(this, `${PREFIX}IoTRuleRole`, {
      assumedBy: new aws_iam.ServicePrincipal('iot.amazonaws.com'),
      inlinePolicies: {
        DynamoDBPolicy: new aws_iam.PolicyDocument({
          statements: [
            new aws_iam.PolicyStatement({
              effect: aws_iam.Effect.ALLOW,
              actions: [
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DescribeTable'
              ],
              resources: [dynamoTable.tableArn]
            })
          ]
        })
      }
    });

    // IoT Rule to forward data to DynamoDB
    const iotRule = new aws_iot.CfnTopicRule(this, `${PREFIX}IoTRule`, {
      ruleName: `${PREFIX}Rule`,
      topicRulePayload: {
        sql: "SELECT * FROM 'topic/sensor/data'",
        actions: [
          {
            dynamoDBv2: {
              roleArn: iotRuleRole.roleArn,
              putItem: {
                tableName: dynamoTable.tableName
              }
            }
          }
        ],
        ruleDisabled: false
      }
    });

    new cdk.CfnOutput(this, 'DynamoDBTableName', {
      value: dynamoTable.tableName,
      description: 'DynamoDB Table Name for IoT Data'
    });

    new cdk.CfnOutput(this, 'IoTRuleName', {
      value: iotRule.ref,
      description: 'IoT Rule Name for DynamoDB Integration'
    });

    new cdk.CfnOutput(this, 'IoTTopicPattern', {
      value: 'topic/sensor/data',
      description: 'IoT Topic Pattern for sending data to DynamoDB'
    });
  }
}