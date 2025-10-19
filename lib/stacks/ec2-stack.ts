import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class EC2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'AppVpc');

    const securityGroup = new ec2.SecurityGroup(this, 'AppVpcSecurityGroup', {
      vpc,
      description: 'Allow SSH Access',
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access');

    const instance = new ec2.Instance(this, 'Ec2Instance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup: securityGroup,
      keyName: 'my-keypair',
      role: this.getS3Role(),
    });

    cdk.Tags.of(instance).add('Name', 'AppServer');

    new cdk.CfnOutput(this, 'InstancePublicIP', {
      value: instance.instancePublicIp,
    });
  }

  private getS3Role() {
    const role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

    return role;
  }
}
