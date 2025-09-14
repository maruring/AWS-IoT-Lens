// HTTPリクエストを受け付け、ルーティングを処理します。@Controller()デコレーターを使用します。
// HTTPリクエストが送信されると、そのリクエストはまずコントローラーに到達します
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
