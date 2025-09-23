import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DeviceRepository } from '../infrastructures/device-repository';
import { DynamoDBModule } from '../infrastructures/dynamodb.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DynamoDBModule, UtilsModule],
  controllers: [DevicesController],
  providers: [DevicesService, DeviceRepository]
})
export class DevicesModule {}
