import { Injectable } from '@nestjs/common';
import { SensorDataRepository, SensorData } from 'src/infrastructures/sensorData-repository';

@Injectable()
export class SensorDatasService {
    constructor(private sensorDataRepository: SensorDataRepository){};

    async getSensorDatas(deviceId: string): Promise<SensorData[]> {
        try {
            const sensorDatas = await this.sensorDataRepository.getSensorDatas(deviceId);

            return sensorDatas;
        } catch(e) {
            console.error(e);
            throw new Error(e); // TODO: 修正必須
        }
    }
}
