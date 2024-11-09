import { Amplify } from 'aws-amplify';
import { SignInOutput, fetchAuthSession, signIn } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { AuthStack } from '../outputs.json';

const region = 'ap-northeast-1';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: AuthStack.SpaceUserPoolId,
      userPoolClientId: AuthStack.SpaceUserPoolClientId,
      identityPoolId: AuthStack.SpaceIdentityPoolId
    }
  }
});

export class AuthService {
  async login (username: string, password: string): Promise<SignInOutput> {
    const signInOutput: SignInOutput = await signIn({
      username: username,
      password: password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH'
      }
    });
    return signInOutput;
  }
  async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${region}.amazonaws.com/ap-northeast-1_0KL0etcnw`;
    const cognitoIdentityClient = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'ap-northeast-1:187f8e83-c48d-4c28-87cc-1449f231be83',
        logins: {
          [cognitoIdentityPool]: idToken
        }
      })
    });
    const credentials = await cognitoIdentityClient.config.credentials();
    return credentials;
  }
}