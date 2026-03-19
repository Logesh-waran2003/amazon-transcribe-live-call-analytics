import Amplify from 'aws-amplify';
import awsExports from '../aws-exports';

// awsExports is a static import — configure once synchronously so the OAuth
// callback (?code=...) is processed immediately on page load, before any
// React render cycle. This avoids the race condition where cognitoHostedUI
// fires before Hub listeners are registered.
Amplify.configure(awsExports);
console.log('✅ useAwsConfig: Amplify configured synchronously');
console.log('🔧 useAwsConfig: oauth config:', awsExports.oauth);

const useAwsConfig = () => awsExports;

export default useAwsConfig;
