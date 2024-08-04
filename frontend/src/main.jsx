import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { StudentContextProvider } from './store/student-context';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {import.meta.env.VITE_REACT_APP_AUTH === 'TEST' && (
      <Auth0Provider
        domain={import.meta.env.VITE_REACT_AUTH_DOMAIN}
        clientId={import.meta.env.VITE_REACT_APP_AUTH_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: 'https://balancedev.au.auth0.com/api/v2/',
          scope: 'openid profile email',
        }}
      >
        <StudentContextProvider>
          <App />
        </StudentContextProvider>
      </Auth0Provider>
    )}

    {import.meta.env.VITE_REACT_APP_AUTH === 'DEV' && (
      <StudentContextProvider>
        <App />
      </StudentContextProvider>
    )}
  </React.StrictMode>
);
