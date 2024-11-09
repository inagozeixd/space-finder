import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace"
import { deleteSpace } from "./DeleteSpace";
import { JsonError, MissingFieldError } from "../shared/Validator";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        response = await getSpaces(event, ddbClient);
        break;
      case 'POST':
        response = await postSpaces(event, ddbClient);
        break;
      case 'PUT':
        response = await updateSpace(event, ddbClient);
        break;
      case 'DELETE':
        response = await deleteSpace(event, ddbClient);
        break;
      default:
        break;
    }
    if (!response.headers) {
      response.headers = {};
    }
    response.headers['Access-Control-Allow-Origin'] = '*';
    response.headers['Access-Control-Allow-Methods'] = '*';    
    return response;
  } catch(e) {
    if (e instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(e.message)
      }  
    }
    if (e instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(e.message)
      }  
    }
    return {
      statusCode: 500,
      body: JSON.stringify(e.message)
    }
  }

}

export { handler }