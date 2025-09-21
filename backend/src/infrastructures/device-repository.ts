// Deviceテーブルとの処理
import { Injectable } from "@nestjs/common";
import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

import { DynamoDBClinetProvider } from "./dynamodb.provider";
import { UtilsService } from "src/utils/utils.module";

export interface DeviceData {
    departmentId: string;
    departmentName: string;
    deviceId: string;
    deviceName: string;
};

@Injectable()
export class DeviceRepository {
    private readonly deviceTableName: string;

    constructor(private dbProvider: DynamoDBClinetProvider, private utilsService: UtilsService) {
        this.deviceTableName = utilsService.getDeviceTableName();
    };

    async getDevices(departmentId: string): Promise<DeviceData[]> {
        const params: GetItemCommandInput = {
            TableName: this.deviceTableName,
            Key: {
                'departmentId': {'S': departmentId}
            }
        };
        const command = new GetItemCommand(params);
        const response = await this.dbProvider.dynamoDBClient.send(command);

        return response.Item as DeviceData[];
    }
}