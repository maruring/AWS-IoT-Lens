# Node.js 20 Alpine イメージを使用（最新LTS）
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# すべての依存関係をインストール（開発依存関係も含む）
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScriptをコンパイル
RUN npm run build

# 非rootユーザーを作成
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# アプリケーションファイルの所有者を変更
RUN chown -R nodejs:nodejs /app
USER nodejs

# ポート3000を公開
EXPOSE 3000

# 開発サーバーを起動（ホットリロード対応）
CMD ["npm", "run", "watch"]
