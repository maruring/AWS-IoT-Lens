import * as cdk from 'aws-cdk-lib';

import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface DynamodbConstructProps extends cdk.StackProps {
    envName: string;
    envNameUpper: string;
    projectName: string;
};

export class DynamodbConstruct extends Construct {
    public readonly deviceTable: dynamodb.Table;
    public readonly sensorDataTable: dynamodb.Table;

    constructor(scope: Construct, id: string, props: DynamodbConstructProps) {
        super(scope, id);

        /**
         * デバイステーブル
         */

        const deviceTable = new dynamodb.Table(this, `${id}-DeviceTable`, {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            deletionProtection: false, // ToDo: 必要に応じてはtrueにする
            removalPolicy: RemovalPolicy.DESTROY // ToDo: 必要に応じてRETAINにする
        });
        this.deviceTable = deviceTable;

        /**
         * センサーデータテーブル
         */
        const sensorDataTable = new dynamodb.Table(this, `${id}-SensorDataTable`, {
            partitionKey: {
                name: 'device_id',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'time',
                type: dynamodb.AttributeType.STRING
            },
                        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            deletionProtection: false, // ToDo: 必要に応じてはtrueにする
            removalPolicy: RemovalPolicy.DESTROY // ToDo: 必要に応じてRETAINにする
        });
        this.sensorDataTable = sensorDataTable;
    }
}