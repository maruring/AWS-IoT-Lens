import { Injectable } from "@nestjs/common";
import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

@Injectable()
export class DynamoDBClinetProvider {
    private readonly dynamoDBClient: DynamoDBDocument

    constructor() {
        const dynamoDBClient = new DynamoDBClient({
            endpoint: 'http://localhost:8000',
            region: 'ap-northeast-1', // Note: Localなので適当
            credentials: {
                accessKeyId: 'dummy_access_key', // Note: Localなので適当
                secretAccessKey: 'dummy_secret_key' // Note: Localなので適当
            }
        });
        this.dynamoDBClient = DynamoDBDocument.from(dynamoDBClient);
    }

    async putItem(tableName: string, item: any): Promise<void> {
        const command = new PutItemCommand({
            TableName: tableName,
            Item: item
        });
        await this.dynamoDBClient.send(command);
    }

    async getItem(tableName: string, key: any): Promise<any> {
        const command = new GetItemCommand({
            TableName: tableName,
            Key: key
        });

        const response = await this.dynamoDBClient.send(command);
        return response.Item;
    }
}