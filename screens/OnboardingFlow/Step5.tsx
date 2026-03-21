import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import ButtonNav from '../../components/ButtonNav';
import OnboardingHeader from '../../components/OnboardingHeader';

interface Step5Props {
  onNext: (age: number) => void;
  onBack: () => void;
}

export default function Step5({ onNext, onBack }: Step5Props) {
  const [age, setAge] = useState('');

  const handleContinue = () => {
    if (age.trim() && parseInt(age) > 0 && parseInt(age) < 120) {
      onNext(parseInt(age));
    }
  };

  const isValidAge = age.trim() && parseInt(age) > 0 && parseInt(age) < 120;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <OnboardingHeader onBack={onBack} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>La tua età</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.helperText}>Inserisci i tuoi anni</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={3}
              textAlign="center"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ButtonNav 
          label="CONTINUA" 
          onPress={handleContinue}
          disabled={!isValidAge}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  buttonContainer: {
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 200,
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 80,
    height: 80,
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    color: '#333',
    textAlign: 'center',
    padding: 0,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 24,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
});