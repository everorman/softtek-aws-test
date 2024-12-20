import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';

const cognito = new AWS.CognitoIdentityServiceProvider();


interface AuthResult {
  AuthenticationResult: {
    AccessToken: string;
    IdToken: string;
    RefreshToken: string;
  };
}

const calculateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  const message = username + clientId;
  return crypto.createHmac('sha256', clientSecret).update(message).digest('base64');
};

exports.handler = async (event) => {
    console.log('Event Body', event.body)
  const { username, password } = JSON.parse(event.body);
  const clientId = '6bfp1smukujvm2cqabucaaplqt'; // ID de cliente de la app Cognito
  const clientSecret = '5fjh635i0glvvcpcf1r48434jsi9uva163f485pdm9h8booi7se'; // El Client Secret de Cognito

  const secretHash = calculateSecretHash(username, clientId, clientSecret);

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  };

  try {
    // Llamada al método initiateAuth de Cognito
    const authResult = await cognito.initiateAuth(params).promise() as AuthResult;

    // Devuelve los tokens de la respuesta
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: authResult.AuthenticationResult.AccessToken,
        idToken: authResult.AuthenticationResult.IdToken,
        refreshToken: authResult.AuthenticationResult.RefreshToken,
      }),
    };
  } catch (error) {
    console.error('Error de autenticación:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Autenticación fallida' }),
    };
  }
};
