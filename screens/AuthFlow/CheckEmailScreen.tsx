import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckEmailScreenProps {
  email: string;
  onBackToLogin: () => void;
  onResendEmail: () => void;
}

export default function CheckEmailScreen({
  email,
  onBackToLogin,
  onResendEmail,
}: CheckEmailScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Controlla la tua email</Text>
        <Text style={styles.subtitle}>
          Abbiamo inviato un link di reset password a {email}
        </Text>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <View style={styles.emailContainer}>
              <Ionicons name="mail" size={40} color="#FF6B35" />
            </View>
            <View style={styles.envelopeContainer}>
              <Ionicons name="mail-open" size={24} color="#8B5CF6" />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.openEmailButton} onPress={() => {}}>
          <Text style={styles.openEmailButtonText}>APRI L'APP EMAIL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
          <Text style={styles.backButtonText}>BACK TO LOGIN</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Non hai ricevuto nessuna email? </Text>
          <TouchableOpacity onPress={onResendEmail}>
            <Text style={styles.resendLink}>Clicca per inviare di nuovo</Text>
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
  emailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  envelopeContainer: {
    position: 'absolute',
    top: 15,
    right: 20,
  },
  openEmailButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  openEmailButtonText: {
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
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resendLink: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});