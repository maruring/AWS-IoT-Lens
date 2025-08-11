#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkEcsFargateStack } from '../lib/cdk-ecs-fargate-stack';

const app = new cdk.App();
new CdkEcsFargateStack(app, 'CdkEcsFargateStack', {
    projectName: 'CdkEcsFargateAttempt',
    repositoryName: 'attempt/sample1'
});