import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import { S3Stack } from './stacks/s3-stack';
// import { EC2Stack } from './stacks/ec2-stack';
import { ApprunnerStack } from './stacks/apprunner-stack';
import { AppRunnerAlarmStack } from './stacks/alarms/apprunner-alarm-stack';
import { SecretManagerStack } from './stacks/secret-manager-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class App extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apprunnerStack = new ApprunnerStack(this, 'AppRunner', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'eu-central-1',
      },
    });

    const secretStack = new SecretManagerStack(this, 'SecretManagerStack', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
      },
    });

    new AppRunnerAlarmStack(this, 'AppRunnerAlarmStack', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
      },
      serviceName: apprunnerStack.appRunnerServiceName,
      appSecret: secretStack.appSecret,
    });
  }
}
