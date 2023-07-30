import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Auth0Provider} from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
    domain='balance.au.auth0.com'
    clientId='pFIT5GPr6OsLiLsyBWGD5GNOBgEY6NbO'
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: 'balance-api-endpoint',
      scope: 'openid profile email'
    }}
    >
    <App />
    </Auth0Provider>
  </React.StrictMode>
);
