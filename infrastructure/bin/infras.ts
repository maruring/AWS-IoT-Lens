import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr-stack';
import { InfraStack } from '../lib/infra-stack';
import { getAppParameters } from './parameters';

const app = new cdk.App();
const argContext = 'environment';
const envKey = app.node.tryGetContext(argContext);
const appParameter = getAppParameters(envKey);

// デプロイパイプラインからタグの指定がある場合は、優先して使用する
const imageTag = app.node.tryGetContext('imageTag')
  ? app.node.tryGetContext('imageTag')
  : appParameter.imageTag;

  new EcrStack(
    app,
    `${appParameter.envNameUpper}-${appParameter.projectName}-Ecr-Stack`,
    {
      projectName: appParameter.projectName,
      envName: appParameter.envName,
      repositoryName: appParameter.repositoryName
    }
  );

new InfraStack(
  app,
  `${appParameter.envNameUpper}-${appParameter.projectName}-Infra-Stack`,
  {
    vpcCidr: appParameter.vpcCidr,
    projectName: appParameter.projectName,
    envName: appParameter.envName,
    envNameUpper: appParameter.envNameUpper,
    repositoryName: appParameter.repositoryName,
    imageTag: appParameter.imageTag,
    taskCpu: appParameter.taskCpu,
    taskMemory: appParameter.taskMemory,
    containerCpu: appParameter.containerCpu,
    containerMemory: appParameter.containerMemory
  }
);