# Express + TypeScript + Docker プロジェクト

このプロジェクトは、Node.jsのExpressフレームワークをTypeScriptで実装し、Dockerでコンテナ化したサンプルアプリケーションです。

## 🚀 機能

- Express.js フレームワーク
- TypeScript サポート
- Docker コンテナ化
- 開発環境と本番環境の分離
- ホットリロード対応（開発環境）
- ヘルスチェックエンドポイント

## 📋 前提条件

- Docker
- Docker Compose

## 🛠️ セットアップと実行

### アプリケーションの起動
#### Docker Composeで起動
```bash
docker-compose up app
```

#### 直接Dockerでビルド・実行
```bash
docker build -t express-app .
docker run -p 3000:3000 -v $(pwd):/app express-app
```

## 🌐 API エンドポイント

アプリケーションが起動したら、以下のエンドポイントにアクセスできます：

- **メインページ**: `http://localhost:3000/`
- **ヘルスチェック**: `http://localhost:3000/health`
- **ユーザー一覧**: `http://localhost:3000/api/users`
- **ユーザー作成**: `POST http://localhost:3000/api/users`

### ユーザー作成の例

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "山田太郎", "email": "yamada@example.com"}'
```

## 📁 プロジェクト構造

```
.
├── src/
│   └── index.ts          # メインアプリケーションファイル
├── dist/                 # コンパイルされたJavaScriptファイル
├── Dockerfile            # Dockerfile
├── docker-compose.yml    # Docker Compose設定
├── package.json          # 依存関係とスクリプト
├── tsconfig.json         # TypeScript設定
└── README.md            # このファイル
```