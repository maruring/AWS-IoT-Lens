import { Module } from '@nestjs/common';
import { DynamoDBClinetProvider } from './dynamodb.provider';
import { UtilsModule } from '../utils/utils.module';

@Module({
    imports: [UtilsModule],
    providers: [DynamoDBClinetProvider],
    exports: [DynamoDBClinetProvider],
})

export class DynamoDBModule {}