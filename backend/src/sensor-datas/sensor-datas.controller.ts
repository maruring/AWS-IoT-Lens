import { Controller, Get, Param } from '@nestjs/common';
import { SensorDatasService } from './sensor-datas.service';
import { SensorData } from 'src/infrastructures/sensorData-repository';

@Controller('sensor-datas')
export class SensorDatasController {
    constructor(private readonly sensorDatasService: SensorDatasService) {};

    @Get(':deviceId')
    async getSensorDatas(@Param('deviceId') deviceId: string): Promise<SensorData[]> {
        return this.sensorDatasService.getSensorDatas(deviceId);
    }
}
