import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';

export async function postSpacesWithDoc(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>  {

  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

  const randomId = v4();

  const result = await ddbDocClient.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { 
      "id" : randomId,
      location: JSON.parse(event.body)
    }
  }));

  return {
    statusCode: 201,
    body: JSON.stringify({id: randomId})
  }
}