import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilsService {
    private readonly projectgName: string;
    private readonly envName: string;
    private readonly envNameUpper: string;
    private readonly deviceTableName: string;
    private readonly sensorDataTableName: string;

    constructor(private configService: ConfigService){
        this.projectgName = configService.get<string>('PROJECT_NAME')!;
        this.envName = configService.get<string>('NODE_ENV')!;
        this.envNameUpper = this.getUpperEnvName(this.envName);
        this.deviceTableName = configService.get<string>('DEVICE_TABLE_NAME')!;
        this.sensorDataTableName = configService.get<string>('SensorDataTable')!;
    };

    /**
     * デバイステーブル名を取得する
     * @returns デバイステーブル名
     */
    getDeviceTableName(): string {
        return `${this.envNameUpper}-${this.projectgName}-${this.deviceTableName}`
    };

    /**
     * センサーテーブル名を取得する
     * @returns センサーデータテーブル名
     */
    getSensorDataTableName(): string {
        return `${this.envNameUpper}-${this.projectgName}-${this.sensorDataTableName}`
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
    providers: [UtilsService],
    exports: [UtilsService]
})
export class UtilsModule {}
