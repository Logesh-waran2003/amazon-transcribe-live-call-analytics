
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Logger } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';
import UnauthRoutes from './UnauthRoutes';
import useAppContext from '../contexts/app';
import AuthRoutes from './AuthRoutes';
import { REDIRECT_URL_PARAM } from './constants';

const logger = new Logger('Routes');

const Routes = () => {
  const { authState, user, currentCredentials } = useAppContext();
  const location = useLocation();
  const [urlSearchParams, setUrlSearchParams] = useState(new URLSearchParams({}));
  const [redirectParam, setRedirectParam] = useState('');

  console.log('🔄 Routes: Rendering');
  console.log('🔄 Routes: authState:', authState);
  console.log('🔄 Routes: user:', user ? user.username : 'null');
  console.log('🔄 Routes: currentCredentials:', currentCredentials ? 'exists' : 'null');
  console.log('🔄 Routes: Show Auth?', authState === AuthState.SignedIn && user && currentCredentials);

  useEffect(() => {
    if (!location?.search) return;
    const searchParams = new URLSearchParams(location.search);
    logger.debug('searchParams:', searchParams);
    setUrlSearchParams(searchParams);
  }, [location]);

  useEffect(() => {
    const redirect = urlSearchParams?.get(REDIRECT_URL_PARAM);
    if (!redirect) return;
    logger.debug('redirect:', redirect);
    setRedirectParam(redirect);
  }, [urlSearchParams]);

  // Signed in but credentials not yet fetched — show loading to prevent
  // SSORedirect from re-triggering while we wait for the async creds fetch
  if (authState === AuthState.SignedIn && user && !currentCredentials) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Loading session...</p></div>;
  }

  return !(authState === AuthState.SignedIn && user && currentCredentials) ? (
    <UnauthRoutes />
  ) : (
    <AuthRoutes redirectParam={redirectParam} />
  );
};

export default Routes;
