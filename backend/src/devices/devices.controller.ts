import { Controller, Get, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DeviceData } from 'src/infrastructures/device-repository';

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {};

    // 部署に紐づくデバイスデータを取得する
    @Get(':departmentId')
    async getDepartmentDevices(@Param('departmentId') departmentId: string): Promise<DeviceData[]> {
        return this.devicesService.getDevices(departmentId);
    }
}
