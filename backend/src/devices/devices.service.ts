import { Injectable } from '@nestjs/common';
import { DeviceRepository, DeviceData } from 'src/infrastructures/device-repository';

@Injectable()
export class DevicesService {
    constructor(private deviceRepository: DeviceRepository){};

    async getDevices(departmentId: string): Promise<DeviceData[]> {
        try {
            const devices = await this.deviceRepository.getDevices(departmentId);

            return devices;
        } catch (e) {
            console.error(e);
            throw new Error(e); // TODO: 修正必須
        }
    }

}
