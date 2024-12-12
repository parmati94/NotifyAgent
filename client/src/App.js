// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import EmailForm from './components/EmailForm';
import WebhookForm from './components/WebhookForm';
import MessageForm from './components/MessageForm';
import ConfigurationForm from './components/ConfigurationForm';
import MessageHistoryForm from './components/MessageHistoryForm';
import TemplateForm from './components/TemplateForm';
import './App.css';
import ResponsiveAppBar from './components/Navbar';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <ResponsiveAppBar />
          <Routes>
            <Route path="/" element={<MessageForm />} />
            <Route path="/templates" element={<TemplateForm />} />
            <Route path="/history" element={<MessageHistoryForm />} />
            <Route path="/email" element={<EmailForm />} />
            <Route path="/webhook" element={<WebhookForm />} />
            <Route path="/configuration" element={<ConfigurationForm />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;