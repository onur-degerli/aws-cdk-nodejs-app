import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class RdsStack extends cdk.Stack {
  public readonly dbInstance: rds.DatabaseInstance;
  public readonly dbSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'AppVpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    const dbSecret = new rds.DatabaseSecret(this, 'DbSecret', {
      username: 'dbadmin',
    });

    const dbInstance = new rds.DatabaseInstance(this, 'AppRdsInstance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      publiclyAccessible: true, // for easy connection from App Runner (no VPC connector)
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: 'appdb',
      multiAz: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // for dev only
      deleteAutomatedBackups: true, // for dev only
    });

    this.dbInstance = dbInstance;
    this.dbSecret = dbSecret;

    new cdk.CfnOutput(this, 'RdsEndpoint', { value: dbInstance.dbInstanceEndpointAddress });
    new cdk.CfnOutput(this, 'RdsSecretArn', { value: dbSecret.secretArn });
  }
}
