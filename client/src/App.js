import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import EmailForm from './components/EmailForm';
import WebhookForm from './components/WebhookForm';
import MessageForm from './components/MessageForm';
import ConfigurationForm from './components/ConfigurationForm';
import MessageHistoryForm from './components/MessageHistoryForm';
import TemplateForm from './components/TemplateForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';
import ResponsiveAppBar from './components/Navbar';
import theme from './theme/theme';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          {isAuthenticated && <ResponsiveAppBar onLogout={handleLogout} />}
          <Routes>
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm />} />
            {isAuthenticated ? (
              <>
                <Route path="/" element={<MessageForm />} />
                <Route path="/templates" element={<TemplateForm />} />
                <Route path="/history" element={<MessageHistoryForm />} />
                <Route path="/email" element={<EmailForm />} />
                <Route path="/webhook" element={<WebhookForm />} />
                <Route path="/configuration" element={<ConfigurationForm />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;