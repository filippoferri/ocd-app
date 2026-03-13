import React, { useState } from 'react';
import { Alert } from 'react-native';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import EmailLoginScreen from './EmailLoginScreen';
import EmailSignupScreen from './EmailSignupScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import SuccessScreen from './SuccessScreen';
import CheckEmailScreen from './CheckEmailScreen';
import AuthService, { User } from '../../services/AuthService';

type AuthScreen = 
  | 'login' 
  | 'signup' 
  | 'emailLogin' 
  | 'emailSignup' 
  | 'forgot' 
  | 'success' 
  | 'checkEmail';

interface AuthFlowProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [userEmail, setUserEmail] = useState('');

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      const user = await AuthService.login(email, password);
      onAuthSuccess(user);
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Errore durante il login');
    }
  };

  const handleEmailSignup = async (fullName: string, email: string, password: string) => {
    try {
      await AuthService.signup(fullName, email, password);
      setUserEmail(email);
      setCurrentScreen('success');
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
    if (!userEmail) return;
    try {
      await AuthService.resendEmailConfirmation(userEmail);
      Alert.alert('Successo', 'Email di conferma inviata nuovamente');
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Errore durante il reinvio');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigateToSignup={() => setCurrentScreen('signup')}
            onNavigateToEmailLogin={() => setCurrentScreen('emailLogin')}
          />
        );
      
      case 'signup':
        return (
          <SignupScreen
            onNavigateToLogin={() => setCurrentScreen('login')}
            onNavigateToEmailSignup={() => setCurrentScreen('emailSignup')}
          />
        );

      case 'emailLogin':
        return (
          <EmailLoginScreen
            onLogin={handleEmailLogin}
            onNavigateToSignup={() => setCurrentScreen('signup')}
            onForgotPassword={() => setCurrentScreen('forgot')}
            onBack={() => setCurrentScreen('login')}
          />
        );

      case 'emailSignup':
        return (
          <EmailSignupScreen
            onSignup={handleEmailSignup}
            onNavigateToLogin={() => setCurrentScreen('emailLogin')}
            onBack={() => setCurrentScreen('signup')}
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
            title="Benvenuto!"
            subtitle="Il tuo account è pronto. Ora puoi accedere e iniziare il tuo percorso."
            buttonText="VAI AL LOGIN"
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
            onNavigateToSignup={() => setCurrentScreen('signup')}
            onNavigateToEmailLogin={() => setCurrentScreen('emailLogin')}
          />
        );
    }
  };

  return renderScreen();
}