import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>La tua età</Text>
          
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/onboarding/onboarding-5.png')} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.helperText}>Inserisci la tua età</Text>
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 40,
    minHeight: 400,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    minHeight: 80,
    textAlignVertical: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 60,
  },
  image: {
    width: '100%',
    height: '100%',
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