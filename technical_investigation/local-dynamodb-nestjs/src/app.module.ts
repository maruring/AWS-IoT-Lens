// アプリケーションの構造を整理するための基本単位です。関連するコントローラー、プロバイダーなどをまとめます。
// NestJSは各モジュールをロードし、依存関係を解決.1番最初に実行される

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
