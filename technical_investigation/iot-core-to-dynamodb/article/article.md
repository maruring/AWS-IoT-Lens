# 概要
IoT 

# やってみた


## CDK
```typescript:stack.ts
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
```

## WioTerminalのソースコード
```ino:WioTerminal.ino
#include <AWS_IOT.h>
#include <rpcWiFi.h>
#include <ArduinoJson.h>
#include "SPI.h"
#include "secrets.h"
#include "RTC_SAMD51.h"
#include "DateTime.h"

RTC_SAMD51 rtc;
AWS_IOT hornbill;

static auto constexpr TOPIC_NAME = "topic/device/data";

int msgReceived = 0;
char reportpayload[512];
char rcvdPayload[512];
char desiredPayload[512];

// 測定周期 
int period = 5000;

void publishMessage()
{
  StaticJsonDocument<200> doc;
  
  // ランダムな値を生成
  // humidity: 40.0 ~ 80.0
  float humidity = random(400, 801) / 10.0;
  // temperature: 15.0 ~ 35.0
  float temperature = random(150, 351) / 10.0;
  // 時間
  DateTime now = rtc.now();
  char timestamp_buf[25];
  sprintf(timestamp_buf, "%04d-%02d-%02d %02d:%02d:%02d",
          now.year(),
          now.month(),
          now.day(),
          now.hour(),
          now.minute(),
          now.second());
  
  doc["humidity"] = humidity;
  doc["temperature"] = temperature;
  doc["timestamp"] = timestamp_buf;
  doc["deviceId"] = "00001";
  
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);

  if(hornbill.publish(TOPIC_NAME, jsonBuffer) == 0)
  {        
    Serial.print("Publish Message:");
    Serial.println(jsonBuffer);
  }
  else {
    Serial.println("Publish Failed");
  }
}

void alarmMatch(uint32_t flag)
{
  Serial.println("アラーム一致！");
  DateTime now = rtc.now();
  Serial.print(now.year(), DEC);
  Serial.print('/');
  Serial.print(now.month(), DEC);
  Serial.print('/');
  Serial.print(now.day(), DEC);
  Serial.print(" ");
  Serial.print(now.hour(), DEC);
  Serial.print(':');
  Serial.print(now.minute(), DEC);
  Serial.print(':');
  Serial.print(now.second(), DEC);
  Serial.println();
}

void setup() {
  rtc.begin();
  Serial.println(period);
  Serial.begin(9600);
  
  DateTime now = DateTime(F(__DATE__), F(__TIME__));
  Serial.println("時間を調整します！");
  rtc.adjust(now);

  DateTime alarm = DateTime(now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second() + 15);
  rtc.setAlarm(0,alarm); // 15秒後に一致
  rtc.enableAlarm(0, rtc.MATCH_HHMMSS); // 毎日一致

  rtc.attachInterrupt(alarmMatch); // アラームが一致した際のコールバック

  // ランダム関数の初期化
  randomSeed(analogRead(0));
  
  // WiFiに接続
  delay(2000);
  Serial.print("Attempting to connect WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while(WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Success Connect to WiFi!!");

  //AWSに接続
  Serial.print("Attempting to connect AWS");
  while(hornbill.connect(AWS_IOT_ENDPOINT, CLIENT_ID, AWS_CERT_CA, AWS_CERT_CRT, AWS_CERT_PRIVATE) != 0)
  {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("");
  Serial.println("Success Connect to AWS!!");
  delay(2000);
}

void loop() {
  publishMessage();
  delay(period);
}
```