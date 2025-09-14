# 初期テーブル作成
aws-cliコンテナに入り、以下のコマンドを実行

## 方法1: 環境変数を使用（推奨）
```bash
# 環境変数を設定（docker-compose.yamlで既に設定済みですが、念のため）
export AWS_ACCESS_KEY_ID=dummy_access_key
export AWS_SECRET_ACCESS_KEY=dummy_secret_key
export AWS_DEFAULT_REGION=ap-northeast-1

# DynamoDB Localでは認証情報を無効化するオプションを使用
aws dynamodb create-table \
    --table-name Device \
    --attribute-definitions \
        AttributeName=departmentId,AttributeType=S \
        AttributeName=deviceId,AttributeType=S \
    --key-schema AttributeName=departmentId,KeyType=HASH AttributeName=deviceId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://dynamodb:8000 \
    --no-verify-ssl
```

## 方法2: コマンドラインで環境変数を設定
```bash
AWS_ACCESS_KEY_ID=dummy_access_key AWS_SECRET_ACCESS_KEY=dummy_secret_key AWS_DEFAULT_REGION=ap-northeast-1 \
aws dynamodb create-table \
    --table-name Device \
    --attribute-definitions \
        AttributeName=departmentId,AttributeType=S \
        AttributeName=deviceId,AttributeType=S \
    --key-schema AttributeName=departmentId,KeyType=HASH AttributeName=deviceId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://dynamodb:8000
```

## 方法3: AWS認証設定ファイルを使用
```bash
aws configure set aws_access_key_id dummy_access_key
aws configure set aws_secret_access_key dummy_secret_key
aws configure set default.region ap-northeast-1

aws dynamodb create-table \
    --table-name Device \
    --attribute-definitions \
        AttributeName=departmentId,AttributeType=S \
        AttributeName=deviceId,AttributeType=S \
    --key-schema AttributeName=departmentId,KeyType=HASH AttributeName=deviceId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://dynamodb:8000 \
    --no-verify-ssl
```

## 方法4: DynamoDB Local専用の設定（最も確実）
```bash
# 認証情報を無効化してDynamoDB Localに接続
aws dynamodb create-table \
    --table-name Device \
    --attribute-definitions \
        AttributeName=departmentId,AttributeType=S \
        AttributeName=deviceId,AttributeType=S \
    --key-schema AttributeName=departmentId,KeyType=HASH AttributeName=deviceId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://dynamodb:8000 \
    --no-verify-ssl \
    --no-cli-pager
```

## トラブルシューティング
もし上記の方法でもエラーが発生する場合は、以下のコマンドでDynamoDB Localの状態を確認してください：

```bash
# DynamoDB Localのヘルスチェック
aws dynamodb list-tables --endpoint-url http://dynamodb:8000 --no-verify-ssl

# テーブル一覧の確認
aws dynamodb describe-table --table-name Device --endpoint-url http://dynamodb:8000 --no-verify-ssl
```
