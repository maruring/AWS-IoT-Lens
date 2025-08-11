import * as cdk from 'aws-cdk-lib';
import { aws_ecr } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export interface EcrConstructProps extends cdk.StackProps {
    repositoryName: string;
    envName: string;
    projectName: string;
}

export class EcrStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EcrConstructProps) {
        super(scope, id);

        // Create a ECR Repository
        const repository = new aws_ecr.Repository(this, props.repositoryName, {
            repositoryName: `${props.repositoryName}`,
            // イメージをスキャンして脆弱性がないか調べる
            imageScanOnPush: true,
            // 変更または更新されたバージョンの画像が、同一のタグで画像リポジトリにプッシュされるのを防ぐ
            imageTagMutability: aws_ecr.TagMutability.IMMUTABLE
        })
    }
}