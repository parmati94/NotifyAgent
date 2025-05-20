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
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import SessionExpiryDialog from './components/SessionExpiryDialog';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import ResponsiveAppBar from './components/Navbar';
import theme from './theme/theme';

function App() {  return (
    <ThemeProvider theme={theme}>      <AuthProvider>
        <SessionExpiryDialog />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={
                <>
                  <ResponsiveAppBar />
                  <MessageForm />
                </>
              } />
              <Route path="/templates" element={
                <>
                  <ResponsiveAppBar />
                  <TemplateForm />
                </>
              } />
              <Route path="/history" element={
                <>
                  <ResponsiveAppBar />
                  <MessageHistoryForm />
                </>
              } />
              <Route path="/email" element={
                <>
                  <ResponsiveAppBar />
                  <EmailForm />
                </>
              } />
              <Route path="/webhook" element={
                <>
                  <ResponsiveAppBar />
                  <WebhookForm />
                </>
              } />
              <Route path="/configuration" element={
                <>
                  <ResponsiveAppBar />
                  <ConfigurationForm />
                </>
              } />
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