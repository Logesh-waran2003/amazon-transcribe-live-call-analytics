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

### Multi-Environment Setup

We maintain 4 environments with separate configuration files:

```
.env.sandbox    → Sandbox environment
.env.dev        → Development environment
.env.uat        → User Acceptance Testing
.env.prod       → Production environment
```

### Local Development

1. **Copy the environment file you want to use:**
   ```bash
   cp .env.sandbox .env    # For sandbox
   cp .env.dev .env        # For dev
   cp .env.uat .env        # For UAT
   cp .env.prod .env       # For prod
   ```

2. **Start the dev server:**
   ```bash
   npm start
   ```

The `.env` file is gitignored and stays local to your machine.

### Required Variables

- `REACT_APP_AWS_REGION` - AWS region (e.g., us-east-1)
- `REACT_APP_USER_POOL_ID` - Cognito User Pool ID
- `REACT_APP_USER_POOL_CLIENT_ID` - Cognito App Client ID
- `REACT_APP_IDENTITY_POOL_ID` - Cognito Identity Pool ID
- `REACT_APP_APPSYNC_GRAPHQL_URL` - AppSync GraphQL endpoint
- `REACT_APP_CLOUDFRONT_DOMAIN` - CloudFront distribution URL
- `REACT_APP_APP_URL` - Application URL
- `REACT_APP_SETTINGS_PARAMETER` - SSM parameter name
- `REACT_APP_ENABLE_LEX_AGENT_ASSIST` - Enable Lex chatbot (true/false)
- `REACT_APP_COGNITO_DOMAIN` - Cognito hosted UI domain
- `DISABLE_ESLINT_PLUGIN` - Disable ESLint plugin in build (true/false)

## CI/CD

GitHub Actions automatically builds and deploys on push to `develop` branch.
