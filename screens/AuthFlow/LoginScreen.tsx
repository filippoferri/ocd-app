import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../../services/AuthService';

interface LoginScreenProps {
  onNavigateToSignup: () => void;
  onNavigateToEmailLogin: () => void;
}

export default function LoginScreen({
  onNavigateToSignup,
  onNavigateToEmailLogin,
}: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await AuthService.signInWithGoogle();
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Login fallito');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bentornato</Text>
          <Text style={styles.subtitle}>
            Accedi per continuare il tuo percorso di consapevolezza.
          </Text>
        </View>

        <View style={styles.mainActionContainer}>
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="logo-google" size={24} color="#EA4335" />
                <Text style={styles.socialButtonText}>Continua con Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.emailButton]}
            onPress={onNavigateToEmailLogin}
            disabled={isLoading}
          >
            <Ionicons name="mail" size={24} color="#6B7280" />
            <Text style={styles.socialButtonText}>Continua con Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Non hai ancora un account? </Text>
            <TouchableOpacity onPress={onNavigateToSignup}>
              <Text style={styles.signupLink}>Registrati</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  mainActionContainer: {
    gap: 16,
    marginBottom: 48,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  socialButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  googleButton: {},
  emailButton: {
    backgroundColor: '#F9FAFB',
  },
  footer: {
    alignItems: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
});