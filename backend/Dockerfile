ARG NODE_ENV=prod
FROM node:20-alpine3.17

# 環境変数の設定
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm ci --only=production && npm cache clean --force
EXPOSE 3000

# ヘルスチェック用のcurlをインストール
RUN apk add --no-cache curl

# ヘルスチェックの設定
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "run", "start:prod"]