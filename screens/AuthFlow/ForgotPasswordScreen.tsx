import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ForgotPasswordScreenProps {
  onSendReset: (email: string) => void;
  onBackToLogin: () => void;
}

export default function ForgotPasswordScreen({
  onSendReset,
  onBackToLogin,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');

  const handleSendReset = () => {
    if (!email) {
      Alert.alert('Errore', 'Inserisci la tua email');
      return;
    }
    onSendReset(email);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Password dimenticata?</Text>
        <Text style={styles.subtitle}>
          Non ti preoccupare! Ti invieremo un link per reimpostare la tua password.
        </Text>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <View style={styles.lockContainer}>
              <Ionicons name="lock-closed" size={40} color="#FF6B35" />
            </View>
            <View style={styles.keyContainer}>
              <Ionicons name="key" size={24} color="#8B5CF6" />
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="nome@esempio.com"
              placeholderTextColor="#B0B0B0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={handleSendReset}
            />
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSendReset}>
            <Text style={styles.sendButtonText}>INVIAMI LA PASSWORD</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
            <Text style={styles.backButtonText}>TORNA AL LOGIN</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: 120,
    height: 120,
    backgroundColor: '#FFF3E0',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyContainer: {
    position: 'absolute',
    top: 20,
    right: 15,
    transform: [{ rotate: '45deg' }],
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  backButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
});