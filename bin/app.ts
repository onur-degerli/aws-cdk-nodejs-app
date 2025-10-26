#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/network-stack';
import { RdsStack } from '../lib/stacks/rds-stack';
import { ApprunnerStack } from '../lib/stacks/apprunner-stack';
import { SecretManagerStack } from '../lib/stacks/secret-manager-stack';
import { AppRunnerAlarmStack } from '../lib/stacks/alarms/apprunner-alarm-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'eu-central-1',
};

const networkStack = new NetworkStack(app, 'NetworkStack', { env });

const rdsStack = new RdsStack(app, 'RdsStack', {
  env,
  vpc: networkStack.vpc,
});

const appRunnerStack = new ApprunnerStack(app, 'AppRunnerStack', {
  env,
  vpc: networkStack.vpc,
  dbInstance: rdsStack.dbInstance,
  dbHost: rdsStack.dbInstance.dbInstanceEndpointAddress,
  dbName: 'appdb',
  dbSecret: rdsStack.dbSecret,
});

const secretStack = new SecretManagerStack(app, 'SecretManagerStack', { env });

new AppRunnerAlarmStack(app, 'AppRunnerAlarmStack', {
  env,
  serviceName: appRunnerStack.appRunnerServiceName,
  appSecret: secretStack.appSecret,
});
