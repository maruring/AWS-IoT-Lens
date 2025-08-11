import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { VpcConstruct } from './construct/vpc-construct';
import { EcsConstruct } from './construct/ecs-construct';
import { DynamodbConstruct } from './construct/dynamo-construct';

export interface InfraStackProps extends cdk.StackProps {
  vpcCidr: string;
  projectName: string;
  envName: string;
  envNameUpper: string;
  repositoryName: string;
  imageTag: string;
  taskCpu: number;
  taskMemory: number;
  containerCpu: number;
  containerMemory: number;
};

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    const vpc = new VpcConstruct(this, `${id}-vpc`, {
      vpcCidr: props.vpcCidr,
      projectName: props.projectName,
      envName: props.envName,
      envNameUpper: props.envNameUpper
    });

    const dynamodb = new DynamodbConstruct(this, `${id}-dynamodb`, {
      envName: props.envName,
      envNameUpper: props.envNameUpper,
      projectName: props.projectName
    });

    const ecs = new EcsConstruct(this, `${id}-ecs`, {
      myVpc: vpc.myVpc,
      projectName: props.projectName,
      envName: props.envName,
      envNameUpper: props.envNameUpper,
      repositoryName: props.repositoryName,
      imageTag: props.imageTag,
      taskCpu: props.taskCpu,
      taskMemory: props.taskMemory,
      containerCpu: props.containerCpu,
      containerMemory: props.containerMemory,
      deviceTabel: dynamodb.deviceTable,
      sensorDataTable: dynamodb.sensorDataTable,
    });

  }
}
