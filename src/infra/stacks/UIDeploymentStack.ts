import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import { getSuffixFromStack } from '../Utils';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { existsSync } from 'fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { S3OriginAccessControl, Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class UIDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, 'uiDeploymentBucket', {
      bucketName: `space-finder-frontend-${suffix}`,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const uiDir = join(__dirname, '..', '..', '..', '..', 'space-finder-frontend', 'dist');

    if (!existsSync(uiDir)) {
      console.warn('UI dir not found : ' + uiDir);
      return;
    }

    new BucketDeployment(this, 'SpaceFinderDeployment', {
      sources: [Source.asset(uiDir)],
      destinationBucket: deploymentBucket
    });

    const oac = new S3OriginAccessControl(this, 'SpacesFinderOAC');
    const s3Origin = S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
      originAccessControl: oac
    });
    const distribution = new Distribution(this, 'SpaceFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: s3Origin
      }
    });

    new CfnOutput(this, 'SpaceFinderUrl', {
      value: distribution.distributionDomainName
    });
  }
}