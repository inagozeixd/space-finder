import { APIGatewayProxyEvent } from "aws-lambda";
import { JsonError } from "./Validator";
import { v4 } from 'uuid';

export function createRandomId() {
  return v4();
}

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch(e) {
    throw new JsonError(e.message);
  }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const condition = event.requestContext.authorizer.claims['cognito:groups'];
  if (condition) {
    return (condition as string).includes('admins');
  }
  return false;
}