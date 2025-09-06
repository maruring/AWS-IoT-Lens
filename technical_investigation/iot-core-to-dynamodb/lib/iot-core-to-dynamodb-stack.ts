import * as cdk from 'aws-cdk-lib';

import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iot from 'aws-cdk-lib/aws-iot';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IotCoreToDynamodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB
    const dataTable = new dynamodb.Table(this, 'IotDataTable', {
      partitionKey: { name: 'deviceId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // 本番環境ではDESTROYポリシーの使用に注意してください
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // AWS IoTポリシーを作成（AWS IoT Coreコンソールで確認可能）
    const iotPolicy = new iot.CfnPolicy(this, 'IoTPolicy', {
      policyName: 'IoTDevicePolicy',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'iot:Publish',
              'iot:Connect',
              'iot:Subscribe',
              'iot:Receive'
            ],
            Resource: [
              '*'
            ]
          }
        ]
      }
    });

    // IoTルールがDynamoDBに書き込むためのIAMロールを作成
    const iotRuleRole = new iam.Role(this, 'IotRuleRole', {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
    });

    // DynamoDBへの書き込み権限を追加
    iotRuleRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:PutItem'
      ],
      resources: [dataTable.tableArn]
    }));

    // IoT Core Rule
    const iotTopicRule = new iot.CfnTopicRule(this, 'IoTTopicRule',
      {
        ruleName: 'IoT_Topic_Rule_Attempt',
        topicRulePayload: {
          description: 'to DynamoDB',
          sql: "SELECT deviceId, timestamp, * FROM 'topic/device/data'",
          actions: [
            {
              dynamoDBv2: {
                roleArn: iotRuleRole.roleArn,
                putItem: {
                  tableName: dataTable.tableName
                }
              }
            }
          ],
          ruleDisabled: false,
          awsIotSqlVersion: '2016-03-23'
        }
      }
    );

  }
}
