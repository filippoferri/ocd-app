import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ButtonNav from '../../components/ButtonNav';
import OnboardingHeader from '../../components/OnboardingHeader';

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  return (
    <View style={styles.container}>
      <OnboardingHeader />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Sei nel posto giusto.</Text>
          
          <Text style={styles.subtitle}>
            Inizia il tuo percorso verso il benessere. Ti aiuteremo a gestire le ossessioni e ridurre i rituali con esercizi semplici e guidati.
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-1.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <ButtonNav 
        label="INIZIAMO" 
        onPress={onNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically in the space between header and footer
  },
  imageContainer: {
    width: 240,
    height: 240,
    marginTop: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 22,
  },
});