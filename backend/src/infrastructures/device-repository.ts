// Deviceテーブルとの処理
import { Injectable } from '@nestjs/common';
import {
    DynamoDBClient,
    PutItemCommand,
    GetItemCommand,
    DeleteItemCommand,
    GetItemCommandInput,
    QueryCommand,
    QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

import { DynamoDBClinetProvider } from './dynamodb.provider';
import { UtilsService } from 'src/utils/utils.module';

export interface DeviceData {
    departmentId: string;
    departmentName: string;
    deviceId: string;
    deviceName: string;
}

@Injectable()
export class DeviceRepository {
    private readonly deviceTableName: string;

    constructor(private dbProvider: DynamoDBClinetProvider,private utilsService: UtilsService) {
        this.deviceTableName = utilsService.getDeviceTableName();
    }

    /**
     * 部署に紐づくデバイスデータを取得する
     * @param departmentId 
     * @returns 
     */
    async getDevices(departmentId: string): Promise<DeviceData[]> {
        const params: QueryCommandInput = {
            TableName: this.deviceTableName,
            KeyConditionExpression: 'departmentId = :deptId',
            ExpressionAttributeValues: {
                ':deptId': { S: departmentId },
            },
        };
        console.debug('getDevices QueryParams', params);
        const command = new QueryCommand(params);
        const response = await this.dbProvider.dynamoDBClient.send(command);

        if (!response.Items || response.Items.length === 0) {
            return [];
        }

        const devices: DeviceData[] = response.Items.map((item: any) => ({
            departmentId: item.departmentId?.S || '',
            departmentName: item.departmentName?.S || '',
            deviceId: item.deviceId?.S || '',
            deviceName: item.deviceName?.S || '',
        }));

        return devices;
    }
}
