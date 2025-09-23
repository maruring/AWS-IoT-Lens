# 概要
Backend側の実装内容およびImageのbuild方法などを記載
## エイリアス
- ${REGION}: AWSリージョン
- ${AWS_ACCOUNT}: AWSアカウント
- ${REPOSITORY}: ECRのリポジトリ名
- ${IMAGE_TAG}: iamgeタグ

# Dockerを使用したImageのBuild
## Docker Client Auth
```
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com
```
## Build
```
docker build --no-cache -t iot-lens .
```
## Build
```
docker tag iot-lens:latest ${AWS_ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${REPOSITORY}:${IMAGE_TAG}
```
## Build
```
docker push ${AWS_ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${REPOSITORY}:${IMAGE_TAG}
```