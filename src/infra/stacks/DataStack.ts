import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { AttributeType, Table as DynamoDB, ITable as IDynamoDB} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { Bucket, IBucket, HttpMethods, ObjectOwnership, CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';

export class DataStack extends Stack {

  public readonly spacesTable: IDynamoDB;
  public readonly photosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);

    const suffix = getSuffixFromStack(this);

    this.photosBucket = new Bucket(this, 'SpaceFinderPhotos', {
      bucketName: `space-finder-photos-${suffix}`,
      cors: [{
        allowedMethods: [
          HttpMethods.HEAD,
          HttpMethods.GET,
          HttpMethods.PUT
        ],
        allowedOrigins: ['*'],
        allowedHeaders: ['*']
      }],
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      removalPolicy: RemovalPolicy.DESTROY
    });
    new CfnOutput(this, 'SpaceFinderPhotosBucketName', {
      value: this.photosBucket.bucketName
    });

    const bucketPolicy = new CfnBucketPolicy(this, 'SpaceFinderPhotosBP', {
      bucket: this.photosBucket.bucketName,
      policyDocument: {
        Statement: [
          {
            Action: 's3:Get*',
            Effect: 'Allow',
            Principal: {
              AWS: '*'
            },
            Resource: [
              // this.photosBucket.bucketArn,
              `${this.photosBucket.bucketArn}/*`
            ]
          }
        ],
        Version: '2012-10-17'
      }
    });

    this.spacesTable = new DynamoDB(this, 'SpacesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: `SpacesTable-${suffix}`,
      removalPolicy: RemovalPolicy.DESTROY
    });
  }
}