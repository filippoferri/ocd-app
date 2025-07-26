import React, { useState } from 'react';
import { Alert } from 'react-native';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import SuccessScreen from './SuccessScreen';
import CheckEmailScreen from './CheckEmailScreen';
import AuthService, { User } from '../../services/AuthService';

type AuthScreen = 'login' | 'signup' | 'forgot' | 'success' | 'checkEmail';

interface AuthFlowProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await AuthService.login(email, password);
      onAuthSuccess(user);
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Errore durante il login');
    }
  };

  const handleSignup = async (fullName: string, email: string, password: string) => {
    try {
      const user = await AuthService.signup(fullName, email, password);
      setCurrentScreen('success');
      setTimeout(() => {
        onAuthSuccess(user);
      }, 2000);
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Errore durante la registrazione');
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await AuthService.requestPasswordReset(email);
      setUserEmail(email);
      setCurrentScreen('checkEmail');
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Errore durante l\'invio dell\'email');
    }
  };

  const handleResendEmail = async () => {
    try {
      // TODO: Implementare reinvio email
      Alert.alert('Info', 'Email inviata nuovamente');
    } catch (error) {
      Alert.alert('Errore', 'Errore durante il reinvio');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToSignup={() => setCurrentScreen('signup')}
            onForgotPassword={() => setCurrentScreen('forgot')}
          />
        );
      
      case 'signup':
        return (
          <SignupScreen
            onSignup={handleSignup}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );
      
      case 'forgot':
        return (
          <ForgotPasswordScreen
            onSendReset={handleForgotPassword}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );
      
      case 'success':
        return (
          <SuccessScreen
            title="Successo!"
            subtitle="Il tuo account è stato creato con successo. Benvenuto in Odeecy!"
            buttonText="CONTINUA"
            onContinue={() => setCurrentScreen('login')}
          />
        );
      
      case 'checkEmail':
        return (
          <CheckEmailScreen
            email={userEmail}
            onBackToLogin={() => setCurrentScreen('login')}
            onResendEmail={handleResendEmail}
          />
        );
      
      default:
        return (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToSignup={() => setCurrentScreen('signup')}
            onForgotPassword={() => setCurrentScreen('forgot')}
          />
        );
    }
  };

  return renderScreen();
}