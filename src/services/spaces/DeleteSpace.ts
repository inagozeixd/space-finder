import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hasAdminGroup } from '../shared/Utils';

export async function deleteSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>  {

  const isAuthorized = hasAdminGroup(event);
  if (!isAuthorized) {
    return {
      statusCode: 401,
      body: 'Not authorized!'
    }  
  }

  if (event.queryStringParameters && 'id' in event.queryStringParameters) {

    const spaceId = event.queryStringParameters['id'];

    await ddbClient.send(new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        'id': { S: spaceId }
      }
    }));
    return {
      statusCode: 200,
      body: 'Deleted space with id ' + spaceId
    }
  }
  return {
    statusCode: 400,
    body: 'invalid parameter'
  }
}