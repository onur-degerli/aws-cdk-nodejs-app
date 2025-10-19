import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3Stack } from './stacks/s3-stack';
import { EC2Stack } from './stacks/ec2-stack';
import { ApprunnerApiStack } from './stacks/apprunner-api-stack';
import { AppRunnerAlarmStack } from './stacks/alarms/apprunner-alarm-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class App extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apprunnerApiStack = new ApprunnerApiStack(this, 'AppRunner', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'eu-central-1',
      },
    });

    new AppRunnerAlarmStack(this, 'AppRunnerAlarmStack', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
      },
      serviceName: apprunnerApiStack.appRunnerServiceName,
    });
  }
}
