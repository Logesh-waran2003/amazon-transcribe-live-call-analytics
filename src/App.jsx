import React, { useState } from 'react';
import Amplify, { Logger } from 'aws-amplify';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from './contexts/app';
import useUserAuthState from './hooks/use-user-auth-state';
import useAwsConfig from './hooks/use-aws-config';
import useCurrentSessionCreds from './hooks/use-current-session-creds';
import Routes from './routes/Routes';
import '@cloudscape-design/global-styles/index.css';
import './App.css';

Amplify.Logger.LOG_LEVEL = 'DEBUG';
const logger = new Logger('App');

const App = () => {
  console.log('🔄 App.jsx: Rendering');
  
  const awsConfig = useAwsConfig();
  console.log('🔄 App.jsx: awsConfig:', awsConfig);

  const { authState, user } = useUserAuthState(awsConfig) || {};
  console.log('🔄 App.jsx: authState:', authState);
  console.log('🔄 App.jsx: user:', user);

  const { currentSession, currentCredentials } = useCurrentSessionCreds({ authState });
  console.log('🔄 App.jsx: currentCredentials:', currentCredentials ? 'exists' : 'null');

  const [errorMessage, setErrorMessage] = useState();
  const [navigationOpen, setNavigationOpen] = useState(true);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const appContextValue = {
    authState,
    awsConfig,
    errorMessage,
    currentCredentials,
    currentSession,
    setErrorMessage,
    user,
    navigationOpen,
    setNavigationOpen,
  };
  logger.debug('appContextValue', appContextValue);

  return (
    <div className="App">
      <AppContext.Provider value={appContextValue}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
};

export default App;
