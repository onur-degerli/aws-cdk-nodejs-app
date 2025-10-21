import * as cdk from 'aws-cdk-lib';
// import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // const suffix = this.getSuffix();

    /* const photosBucket = new Bucket(this, 'PhotoBucket', {
      bucketName: `photos-bucket-${suffix}`,
    }); */
  }

  /* private getSuffix() {
    const shortStackId = cdk.Fn.select(2, cdk.Fn.split('/', this.stackId));
    return cdk.Fn.select(4, cdk.Fn.split('-', shortStackId));
  } */
}
