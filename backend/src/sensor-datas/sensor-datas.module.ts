import { Module } from '@nestjs/common';
import { SensorDatasController } from './sensor-datas.controller';
import { SensorDatasService } from './sensor-datas.service';

@Module({
  controllers: [SensorDatasController],
  providers: [SensorDatasService]
})
export class SensorDatasModule {}
