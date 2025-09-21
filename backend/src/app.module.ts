import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';
import { SensorDatasModule } from './sensor-datas/sensor-datas.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    DevicesModule, SensorDatasModule, UtilsModule,
    ConfigModule.forRoot({
      envFilePath: [`./env.%{process.env.NODE_ENV}.env`, '.env'],
      // .envファイルが見つからない場合はエラーとする
      ignoreEnvFile: true,
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
