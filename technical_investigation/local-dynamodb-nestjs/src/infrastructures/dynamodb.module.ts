import { Module } from '@nestjs/common';
import { DynamoDBClinetProvider } from './dynamodb.provider';

@Module({
    providers: [DynamoDBClinetProvider],
    exports: [DynamoDBClinetProvider],
})

export class DynamoDBClientModule {}