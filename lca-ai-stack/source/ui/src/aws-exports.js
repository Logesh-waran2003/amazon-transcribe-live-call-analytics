const {
  REACT_APP_USER_POOL_ID,
  REACT_APP_USER_POOL_CLIENT_ID,
  REACT_APP_IDENTITY_POOL_ID,
  REACT_APP_APPSYNC_GRAPHQL_URL,
  REACT_APP_AWS_REGION,
  REACT_APP_COGNITO_DOMAIN,
  REACT_APP_APP_URL,
} = process.env;

const awsmobile = {
  aws_project_region: REACT_APP_AWS_REGION,
  aws_cognito_identity_pool_id: REACT_APP_IDENTITY_POOL_ID,
  aws_cognito_region: REACT_APP_AWS_REGION,
  aws_user_pools_id: REACT_APP_USER_POOL_ID,
  aws_user_pools_web_client_id: REACT_APP_USER_POOL_CLIENT_ID,
  oauth: {
    domain: REACT_APP_COGNITO_DOMAIN,
    scope: ['email', 'openid', 'phone'],
    redirectSignIn: REACT_APP_APP_URL,
    redirectSignOut: REACT_APP_APP_URL,
    responseType: 'code',
  },
  aws_cognito_login_mechanisms: ['email'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
  aws_appsync_graphqlEndpoint: REACT_APP_APPSYNC_GRAPHQL_URL,
  aws_appsync_region: REACT_APP_AWS_REGION,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
};

export default awsmobile;
