# LCA Project Context

## What This Is
Amazon Transcribe Live Call Analytics UI — React app deployed to S3/CloudFront.
Microsoft Entra ID SSO via Cognito Hosted UI is fully implemented and working.

## Key AWS Resources (account: 025066253495, region: us-east-1)
- CloudFront: https://dna44ohv0ueyn.cloudfront.net (distribution: E1CO98XRGE0U7T)
- S3 bucket: lca-aistack-spfqarz85s1q-webappbucket-xarilravgfbq
- Cognito User Pool: us-east-1_2c7N4cvcO
- Cognito App Client: 4h3srt7vsn17qs9uj8m791cmgv
- Cognito Domain: tih-wellington-lca-qa.auth.us-east-1.amazoncognito.com
- AppSync API: ue2b3vkt2vhtnenm6q3t7tv62y.appsync-api.us-east-1.amazonaws.com/graphql
- Allowed email domain: crcgroup.com

## Working Directory
Repo root (UI is at the top level)

## Build & Deploy
```bash
# Build
NODE_OPTIONS=--max-old-space-size=1536 npm run build

# Deploy
aws s3 sync build/ s3://lca-aistack-spfqarz85s1q-webappbucket-xarilravgfbq --delete --profile lca
aws cloudfront create-invalidation --distribution-id E1CO98XRGE0U7T --paths "/*" --profile lca
```

## AWS Profile Setup (first time)
```bash
aws configure --profile lca
# Use credentials from LCA account (025066253495)
# Region: us-east-1
```

## SSO Implementation (completed)
- Auth: Microsoft Entra ID → Cognito Hosted UI → React app
- Amplify v4 with `federatedSignIn({ customProvider: 'EntraID' })`
- Email resolved from `custom:email_alias` attribute (not standard email)
- PKCE loop fix: `sessionStorage` key `lca_sso_attempted` prevents multiple SSO calls
- NameID format in Azure: Persistent (critical — prevents infinite loop)

## Key Files
- `src/aws-exports.js` — Amplify/Cognito config
- `src/index.js` — Amplify.configure() + CloudWatch log forwarder
- `src/routes/UnauthRoutes.jsx` — SSO redirect logic
- `src/hooks/use-user-auth-state.js` — auth state management
- `src/hooks/use-calls-graphql-api.js` — filters calls by agent email
- `src/components/call-analytics-top-navigation/CallAnalyticsTopNavigation.jsx` — email display

## Branch
`develop` — always work here, push to fork: `git@github.com:Logesh-waran2003/amazon-transcribe-live-call-analytics.git`
