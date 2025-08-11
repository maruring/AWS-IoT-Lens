// L3コンストラクトで作成する
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { aws_ecs as ecs } from 'aws-cdk-lib';
import { aws_ecs_patterns as ecs_patterns } from 'aws-cdk-lib';
import { aws_ecr as ecr } from 'aws-cdk-lib';

export interface EcsConstructProps extends cdk.StackProps {
    myVpc: ec2.Vpc;
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

export class EcsConstruct extends Construct {
    public readonly loadBalancerDnsName: string;

    constructor(scope: Construct, id: string, props: EcsConstructProps) {
        super(scope, id);

        // Cluster
        const cluster = new ecs.Cluster(this, `${id}-Ecs-Cluster`, {
            vpc: props.myVpc,
            clusterName: `${props.envNameUpper}-${props.projectName}-EcsCluster`
        });

        // ECR Repository
        const ecrRepository = ecr.Repository.fromRepositoryName(
            this,
            `${id}-EcrRepo`,
            props.repositoryName
        );

        // Fargate and ALB
        const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${id}-FargateSerivice`, {
            cluster: cluster,
            cpu: props.taskCpu,
            memoryLimitMiB: props.taskMemory,
            taskSubnets: {subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS},
            publicLoadBalancer: true,
            loadBalancerName: `${props.envNameUpper}-${props.projectName}-AppALB`,
            taskImageOptions: {
                image: ecs.ContainerImage.fromEcrRepository(ecrRepository, `${props.imageTag}`)
            }
        });

        this.loadBalancerDnsName = fargateService.loadBalancer.loadBalancerDnsName;
    }
}