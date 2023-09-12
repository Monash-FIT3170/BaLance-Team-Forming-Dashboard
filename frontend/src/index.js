import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StudentContextProvider } from './store/student-context';
import {Auth0Provider} from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {(process.env.REACT_APP_AUTH === "TEST") &&
    <Auth0Provider
    domain='balance.au.auth0.com'
    clientId='pFIT5GPr6OsLiLsyBWGD5GNOBgEY6NbO'
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: 'balance-api-endpoint',
      scope: 'openid profile email'
    }}
    >
      <StudentContextProvider>
        <App />
      </StudentContextProvider>
    </Auth0Provider>
    }
    {(process.env.REACT_APP_AUTH === "DEV") &&
    <StudentContextProvider>
      <App />
    </StudentContextProvider>
    }
  </React.StrictMode>
);
