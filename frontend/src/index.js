import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/style/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { applyTheme } from './Custom/Theme/theme.js';
import { ToastContainer } from 'react-toastify';
import { notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from './components/ui/Toastify';
import { default as ConfirmGlobal } from './components/confirm/ConfirmGlobal';
import { UserProvider } from './hooks/getdata/UserContext';

// Appliquer le thème au chargement initial
applyTheme();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <ToastContainer />
      <ConfirmGlobal />
      <App />
    </UserProvider>
  </BrowserRouter>,
);

reportWebVitals();
