import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

interface RdsStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class RdsStack extends cdk.Stack {
  public readonly dbInstance: rds.DatabaseInstance;
  public readonly dbSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: RdsStackProps) {
    super(scope, id, props);

    const dbSecret = new rds.DatabaseSecret(this, 'DbSecret', {
      username: 'dbadmin',
    });

    const { vpc } = props;

    const dbInstance = new rds.DatabaseInstance(this, 'AppRdsInstance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      publiclyAccessible: false,
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: 'appdb',
      // multiAz: false,
      allocatedStorage: 20,
      // maxAllocatedStorage: 100,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // for dev only
      // deleteAutomatedBackups: true, // for dev only
    });

    this.dbInstance = dbInstance;
    this.dbSecret = dbSecret;

    new cdk.CfnOutput(this, 'RdsEndpoint', { value: dbInstance.dbInstanceEndpointAddress });
    new cdk.CfnOutput(this, 'RdsSecretArn', { value: dbSecret.secretArn });
  }
}
