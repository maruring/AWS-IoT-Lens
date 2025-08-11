import * as cdk from 'aws-cdk-lib';

import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { NatProvider, Peer } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface VpcConstructProps extends cdk.StackProps {
    vpcCidr: string;
    envName: string;
    envNameUpper: string;
    projectName: string;
};

export class VpcConstruct extends Construct {
    public readonly myVpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props: VpcConstructProps) {
        super(scope, id);

        const natProvider = NatProvider.instanceV2({
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T4G,
                ec2.InstanceSize.NANO
            ),
            machineImage: ec2.MachineImage.latestAmazonLinux2023({
                cpuType: ec2.AmazonLinuxCpuType.ARM_64,
            }),
            defaultAllowedTraffic: ec2.NatTrafficDirection.OUTBOUND_ONLY
        });

        const myVpc = new ec2.Vpc(this, `${id}-Vpc`, {
            ipAddresses: ec2.IpAddresses.cidr(props.vpcCidr),
            maxAzs: 2,
            natGateways: 1,
            natGatewayProvider: natProvider,
            flowLogs: {},
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC
                },
                {
                    cidrMask: 24,
                    name: 'Protected',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
                }
            ]
        });

        natProvider.securityGroup.addIngressRule(
            Peer.ipv4(myVpc.vpcCidrBlock),
            ec2.Port.allTraffic()
        );

        // VPC EndPoint for DynamoDB
        myVpc.addGatewayEndpoint(`${id}-DynamoDBVpcEndpointForPrivate`, {
            service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
            subnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }]
        })
        
        this.myVpc = myVpc;
    }
}