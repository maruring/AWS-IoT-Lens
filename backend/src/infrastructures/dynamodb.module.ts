import { Module } from '@nestjs/common';
import { DynamoDBClinetProvider } from './dynamodb.provider';
import { UtilsService } from 'src/utils/utils.module';

@Module({
    providers: [DynamoDBClinetProvider, UtilsService],
    exports: [DynamoDBClinetProvider],
})

export class DynamoDBClientModule {}