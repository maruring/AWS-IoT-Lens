import { Injectable, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Injectable()
export class UtilsService {
    private readonly deviceTableName: string;
    private readonly sensorDataTableName: string;

    constructor(private configService: ConfigService){
        this.deviceTableName = configService.get<string>('DEVICE_TABLE')!;
        this.sensorDataTableName = configService.get<string>('SENSOR_DATA_TABLE')!;
    };

    /**
     * デバイステーブル名を取得する
     * @returns デバイステーブル名
     */
    getDeviceTableName(): string {
        return this.deviceTableName;
    };

    /**
     * センサーテーブル名を取得する
     * @returns センサーデータテーブル名
     */
    getSensorDataTableName(): string {
        return this.sensorDataTableName;
    };

    /**
     * 一文字目だけを大文字にする
     * @param envName string
     * @returns 
     */
    private getUpperEnvName(envName: string): string {
        return envName.charAt(0).toUpperCase() + envName.slice(1);
    }
}

@Module({
    imports: [ConfigModule],
    providers: [UtilsService],
    exports: [UtilsService]
})
export class UtilsModule {}
