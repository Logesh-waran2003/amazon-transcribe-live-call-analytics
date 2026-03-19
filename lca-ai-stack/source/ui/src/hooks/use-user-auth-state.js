import { useState, useEffect } from 'react';
import { Auth, Hub, Logger } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';

const logger = new Logger('useUserAuthState');

const useUserAuthState = (awsconfig) => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  console.log('🔄 useUserAuthState: Called with awsconfig:', awsconfig ? 'exists' : 'undefined');

  useEffect(() => {
    console.log('🔄 useUserAuthState: useEffect triggered');
    console.log('🔄 useUserAuthState: awsconfig:', awsconfig ? 'exists' : 'undefined');
    
    if (!awsconfig) {
      console.log('⚠️ useUserAuthState: awsconfig is undefined, skipping');
      return;
    }

    console.log('🔍 useUserAuthState: Checking current auth state');
    Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        console.log('✅ useUserAuthState: User already authenticated:', currentUser.username);
        setAuthState(AuthState.SignedIn);
        setUser(currentUser);
      })
      .catch((err) => {
        console.log('ℹ️ useUserAuthState: No authenticated user:', err);
        setAuthState(AuthState.SignedOut);
      });

    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      console.log('🔐 useUserAuthState Hub event:', event);
      console.log('🔐 useUserAuthState Hub data:', data);
      switch (event) {
        case 'signIn':
          console.log('✅ useUserAuthState: SignIn event');
          setAuthState(AuthState.SignedIn);
          setUser(data);
          break;
        case 'cognitoHostedUI':
          console.log('✅ useUserAuthState: cognitoHostedUI event');
          setAuthState(AuthState.SignedIn);
          setUser(data);
          break;
        case 'signOut':
          console.log('ℹ️ useUserAuthState: SignOut event');
          setAuthState(AuthState.SignedOut);
          setUser(null);
          break;
        case 'signIn_failure':
          console.log('❌ useUserAuthState: signIn_failure:', data);
          setAuthState(AuthState.SignedOut);
          break;
        case 'cognitoHostedUI_failure':
          console.log('❌ useUserAuthState: cognitoHostedUI_failure:', data);
          setAuthState(AuthState.SignedOut);
          break;
        default:
          console.log('ℹ️ useUserAuthState: Unhandled event:', event);
          break;
      }
    });

    return () => {
      console.log('🔧 useUserAuthState: Cleanup');
      unsubscribe();
    };
  }, [awsconfig]);

  return { authState, user };
};

export default useUserAuthState;
