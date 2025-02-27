import { DynamoDBClient, ReturnValue, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function updateSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>  {
  if (event.queryStringParameters && 'id' in event.queryStringParameters && event.body) {
    const parsedBody = JSON.parse(event.body);
    const spaceId = event.queryStringParameters['id'];
    const requestBodyKey = Object.keys(parsedBody)[0];
    const requestBodyValue = parsedBody[requestBodyKey];

    const updateResult = await ddbClient.send(new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        'id': { S: spaceId }
      },
      UpdateExpression: 'SET #updateTarget = :new',
      ExpressionAttributeNames: {
        '#updateTarget': requestBodyKey
      },
      ExpressionAttributeValues: {
        ':new': {
          S: requestBodyValue
        }
      },
      ReturnValues: ReturnValue.UPDATED_NEW
    }));
    return {
      statusCode: 204,
      body: JSON.stringify(updateResult)
    }
  }
  return {
    statusCode: 400,
    body: 'invalid parameter'
  }
}