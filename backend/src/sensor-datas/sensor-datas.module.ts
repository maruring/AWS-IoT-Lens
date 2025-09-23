import { Module } from '@nestjs/common';
import { SensorDatasController } from './sensor-datas.controller';
import { SensorDatasService } from './sensor-datas.service';
import { SensorDataRepository } from 'src/infrastructures/sensorData-repository';
import { DynamoDBModule } from 'src/infrastructures/dynamodb.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [DynamoDBModule, UtilsModule],
  controllers: [SensorDatasController],
  providers: [SensorDatasService, SensorDataRepository]
})
export class SensorDatasModule {}
