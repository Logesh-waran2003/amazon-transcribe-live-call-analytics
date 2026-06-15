import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';
import { LOGIN_PATH, LOGOUT_PATH } from './constants';

const SSO_KEY = 'lca_sso_initiated';

const SSORedirect = () => {
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    // OAuth callback — code or error in URL means Amplify is processing, never re-trigger
    if (code || error) {
      return;
    }

    // Already initiated SSO — code_verifier is in localStorage, don't overwrite it
    if (sessionStorage.getItem(SSO_KEY)) {
      return;
    }

    sessionStorage.setItem(SSO_KEY, '1');

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
        await Auth.federatedSignIn({ customProvider: 'EntraID' });
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
        <button type="button" onClick={() => { sessionStorage.removeItem(SSO_KEY); setAuthError(null); }}>
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
