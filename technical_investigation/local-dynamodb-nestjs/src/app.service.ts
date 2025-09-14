// サービス、リポジトリ、ファクトリなど、ビジネスロジックをカプセル化するクラスです。@Injectable()デコレーターを使用します。
// コントローラーは、受け取ったリクエストの具体的なビジネスロジックを、サービスに委譲します。
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
