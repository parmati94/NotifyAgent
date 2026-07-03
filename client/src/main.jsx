import React from 'react';
import ReactDOM from 'react-dom/client';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <InitColorSchemeScript defaultMode="dark" attribute="class" />
    <App />
  </React.StrictMode>
);
