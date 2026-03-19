import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';
import { LOGIN_PATH, LOGOUT_PATH } from './constants';

const SSORedirect = () => {
  const hasAttempted = useRef(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    console.log('🔄 UnauthRoutes: SSORedirect rendered');
    console.log('🔄 UnauthRoutes: Full URL:', window.location.href);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    console.log('🔄 UnauthRoutes: code in URL:', code ? 'YES' : 'NO');
    console.log('🔄 UnauthRoutes: error in URL:', error || 'none');

    // OAuth callback — let Amplify process it, don't re-trigger SSO
    if (code || error) {
      console.log('✅ UnauthRoutes: OAuth callback detected, waiting for Amplify to process');
      return;
    }

    // Already attempted SSO this session — don't loop
    if (hasAttempted.current) {
      console.log('⚠️ UnauthRoutes: SSO already attempted, not retrying');
      return;
    }

    hasAttempted.current = true;

    // Listen for auth failures so we can show an error instead of looping
    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      if (event === 'cognitoHostedUI_failure' || event === 'signIn_failure') {
        console.log('❌ UnauthRoutes: Auth failure event:', event, data);
        setAuthError(data?.message || 'Authentication failed. Please try again.');
        unsubscribe();
      }
    });

    const initiateSSO = async () => {
      try {
        console.log('🚀 UnauthRoutes: Initiating SSO via federatedSignIn');
        await Auth.federatedSignIn({ provider: 'EntraID' });
      } catch (err) {
        console.log('❌ UnauthRoutes: federatedSignIn failed:', err);
        setAuthError(err?.message || 'Failed to initiate login. Please refresh and try again.');
        unsubscribe();
      }
    };

    initiateSSO();

    return () => unsubscribe();
  }, []);

  if (authError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p style={{ color: 'red' }}>Authentication error: {authError}</p>
        <button type="button" onClick={() => { hasAttempted.current = false; setAuthError(null); }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p>Redirecting to Entra ID for authentication...</p>
    </div>
  );
};

const UnauthRoutes = () => (
  <Switch>
    <Route path={LOGOUT_PATH}>
      <Redirect to={LOGIN_PATH} />
    </Route>
    <Route>
      <SSORedirect />
    </Route>
  </Switch>
);

export default UnauthRoutes;
