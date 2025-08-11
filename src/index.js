// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './ThemeContext'; // ✅ Import your ThemeProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="162611655128-s6n6jov2d27gelaoln4kjtk3np2erg13.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
