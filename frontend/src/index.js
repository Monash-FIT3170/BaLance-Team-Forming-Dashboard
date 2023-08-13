import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StudentContextProvider } from './store/student-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StudentContextProvider>
      <App />
    </StudentContextProvider>
  </React.StrictMode>
);
