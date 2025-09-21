import { Injectable } from "@nestjs/common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

@Injectable()
export class DynamoDBClinetProvider {
    readonly dynamoDBClient: DynamoDBDocument

    constructor() {
        const Client = new DynamoDBClient({
            region: 'ap-northeast-1'
        });
        this.dynamoDBClient = DynamoDBDocument.from(Client);
    }
}