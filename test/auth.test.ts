import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login('inagozeixd', 'ryuto.shimada');
  const idToken = await service.getIdToken();
  // console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());
  console.log('idToken', idToken);
  const credentials = await service.generateTemporaryCredentials();
  const buckets = await listBuckets(credentials);
  // console.log(buckets);
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();