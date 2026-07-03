// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EmailForm from './components/EmailForm';
import WebhookForm from './components/WebhookForm';
import MessageForm from './components/MessageForm';
import ConfigurationForm from './components/ConfigurationForm';
import MessageHistoryForm from './components/MessageHistoryForm';
import TemplateForm from './components/TemplateForm';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import SessionExpiryDialog from './components/SessionExpiryDialog';
import AppShell from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <AuthProvider>
        <SessionExpiryDialog />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes - Require Authentication */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<MessageForm />} />
                <Route path="/templates" element={<TemplateForm />} />
                <Route path="/history" element={<MessageHistoryForm />} />
                <Route path="/email" element={<EmailForm />} />
                <Route path="/webhook" element={<WebhookForm />} />
                <Route path="/configuration" element={<ConfigurationForm />} />
              </Route>
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
