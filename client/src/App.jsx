import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import EmailForm from './components/EmailForm';
import WebhookForm from './components/WebhookForm';
import MessageForm from './components/MessageForm';
import MessageHistoryForm from './components/MessageHistoryForm';
import TemplateForm from './components/TemplateForm';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import SessionExpiryDialog from './components/SessionExpiryDialog';
import AppShell from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import { AppearanceProvider } from './context/AppearanceContext';

function App() {
  return (
    <AppearanceProvider>
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
                {/* Settings is now a dialog opened from the sidebar */}
                <Route path="/configuration" element={<Navigate to="/" replace />} />
              </Route>
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </AppearanceProvider>
  );
}

export default App;
