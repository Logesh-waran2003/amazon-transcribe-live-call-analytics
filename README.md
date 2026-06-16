# LCA UI

React application for Live Call Analytics with Agent Assist.

## Stack

- React 18
- AWS Amplify
- Cloudscape Design System
- Amazon Connect integration
- Microsoft Entra ID SSO via Cognito

## Build & Deploy

```bash
# Install dependencies
npm install

# Development
npm start

# Production build
NODE_OPTIONS=--max-old-space-size=1536 npm run build

# Deploy (requires AWS credentials)
aws s3 sync build/ s3://lca-aistack-spfqarz85s1q-webappbucket-xarilravgfbq --delete --profile lca
aws cloudfront create-invalidation --distribution-id E1CO98XRGE0U7T --paths "/*" --profile lca
```

## Environment Variables

See `.env.wellington` for reference. Required:

- `REACT_APP_USER_POOL_ID`
- `REACT_APP_USER_POOL_CLIENT_ID`
- `REACT_APP_IDENTITY_POOL_ID`
- `REACT_APP_APPSYNC_GRAPHQL_URL`
- `REACT_APP_AWS_REGION`
- `REACT_APP_COGNITO_DOMAIN`
- `REACT_APP_COGNITO_REDIRECT_SIGNIN`
- `REACT_APP_COGNITO_REDIRECT_SIGNOUT`

## CI/CD

GitHub Actions automatically builds and deploys on push to `develop` branch.
