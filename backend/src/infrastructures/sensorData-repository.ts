// sensorDataテーブルとの処理
import { Injectable } from "@nestjs/common";
import { QueryCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";

import { DynamoDBClinetProvider } from "./dynamodb.provider";
import { UtilsService } from "src/utils/utils.module";

export interface SensorDataValue {
    type: string // Note: current(電流),acceleration(加速度)などが入る
    value: number,
    unit: string
};

export interface SensorData {
    deviceId: string;
    timeStamp: string;
    datas: SensorDataValue[];
};

@Injectable()
export class SensorDataRepository {
    private readonly sensorDataTableName: string;

    constructor(private dbProvider: DynamoDBClinetProvider, private utilService: UtilsService){
        this.sensorDataTableName = utilService.getSensorDataTableName();
    };

    async getSensorDatas(deviceId: string): Promise<SensorData[]> {
        const params: QueryCommandInput = {
            TableName: this.sensorDataTableName,
            KeyConditionExpression: 'deviceId = :deviceId',
            ExpressionAttributeValues: {
                ':deviceId': deviceId,
            },
        };

        console.debug('getSensorDatas QueryParams', params);
        const command = new QueryCommand(params);

        const response = await this.dbProvider.dynamoDBClient.send(command);
        console.info('SensorDatas', response);

        if (!response.Items || response.Items.length === 0) {
            return [];
        }

        const sensorDatas: SensorData[] = response.Items.map((item: any) => ({
            deviceId: item.deviceId ?? '',
            timeStamp: item.timeStamp ?? '',
            datas: item.datas ?? [],
        }));

        return sensorDatas;
    }
}