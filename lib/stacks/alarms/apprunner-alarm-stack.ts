import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

interface AppRunnerAlarmStackProps extends cdk.StackProps {
  serviceName: string;
}

export class AppRunnerAlarmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppRunnerAlarmStackProps) {
    super(scope, id, props);

    const alarmQueue = new sqs.Queue(this, 'AppRunnerAlarmQueue', {
      queueName: 'app-runner-alarms',
      visibilityTimeout: cdk.Duration.seconds(60),
    });

    const alarmTopic = new sns.Topic(this, 'AppRunnerAlarmTopic', {
      displayName: 'App Runner Alarms',
    });
    alarmTopic.addSubscription(new subs.SqsSubscription(alarmQueue));

    /* const notifierLambda = new lambda.Function(this, 'NotifierLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/alarm')),
      environment: {
        SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL ?? '',
      },
    }); */

    const notifierLambda = new NodejsFunction(this, 'NotifierLambda', {
      entry: path.join(__dirname, '../../lambda/alarm/index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL ?? '',
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
        target: 'es2020',
        sourceMap: true,
      },
    });

    notifierLambda.addEventSource(new lambdaEventSources.SqsEventSource(alarmQueue));

    const cpuAlarm = new cloudwatch.Alarm(this, 'HighCPUAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/AppRunner',
        metricName: 'CPUUtilization',
        dimensionsMap: {
          ServiceName: props.serviceName,
        },
        statistic: 'Average',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Triggered when CPU exceeds 80%',
    });

    const memoryAlarm = new cloudwatch.Alarm(this, 'HighMemoryAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/AppRunner',
        metricName: 'MemoryUtilization',
        dimensionsMap: {
          ServiceName: props.serviceName,
        },
        statistic: 'Average',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Triggered when Memory exceeds 80%',
    });

    [cpuAlarm, memoryAlarm].forEach((alarm) => {
      alarm.addAlarmAction({
        bind: () => ({ alarmActionArn: alarmTopic.topicArn }),
      });
    });

    alarmQueue.grantConsumeMessages(notifierLambda);
    alarmTopic.grantPublish(new iam.ServicePrincipal('cloudwatch.amazonaws.com'));

    new cdk.CfnOutput(this, 'AlarmQueueUrl', {
      value: alarmQueue.queueUrl,
    });
  }
}
