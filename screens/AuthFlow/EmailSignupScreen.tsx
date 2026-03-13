import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmailSignupScreenProps {
  onSignup: (fullName: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

export default function EmailSignupScreen({
  onSignup,
  onNavigateToLogin,
  onBack,
}: EmailSignupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!fullName.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }
    if (!email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
    }
    if (!password) {
      newErrors.password = 'La password è obbligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La password deve avere almeno 6 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    if (!acceptTerms) {
      Alert.alert('Errore', 'Accetta i termini e condizioni per continuare');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSignup(fullName.trim(), email.trim().toLowerCase(), password);
    } catch {
       // handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.content}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Registrati con Email</Text>
            <Text style={styles.subtitle}>
              Crea un account per iniziare il tuo percorso.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput
                  style={[styles.input, errors.name ? styles.inputError : null]}
                  placeholder="Il tuo nome"
                  placeholderTextColor="#B0B0B0"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email ? styles.inputError : null]}
                  placeholder="nome@esempio.com"
                  placeholderTextColor="#B0B0B0"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  ref={emailRef}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Minimo 6 caratteri"
                    placeholderTextColor="#B0B0B0"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    secureTextEntry={!showPassword}
                    ref={passwordRef}
                    autoComplete="new-password"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={handleSignup}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                    {acceptTerms && (
                      <Ionicons name="checkmark" size={12} color="white" />
                    )}
                  </View>
                  <Text style={styles.termsText}>Accetto i </Text>
                  <Text style={styles.termsLink}>termini e condizioni</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.signupButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={isSubmitting}
              >
                <Text style={styles.signupButtonText}>
                  {isSubmitting ? 'REGISTRAZIONE...' : 'REGISTRATI'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Hai già un account? </Text>
                <TouchableOpacity onPress={onNavigateToLogin}>
                  <Text style={styles.loginLink}>Accedi qui</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    padding: 8,
    zIndex: 10,
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
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 6,
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
  inputError: {
    borderColor: '#E53935',
  },
  errorText: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 16,
  },
  termsContainer: {
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
  },
  termsLink: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});