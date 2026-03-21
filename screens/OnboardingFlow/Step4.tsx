import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ButtonNav from '../../components/ButtonNav';
import OnboardingHeader from '../../components/OnboardingHeader';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4({ onNext, onBack }: Step4Props) {
  return (
    <View style={styles.container}>
      <OnboardingHeader onBack={onBack} color="white" />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Conosciamoci meglio</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-4.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <ButtonNav 
        label="CONTINUA" 
        onPress={onNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B7CF6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 240,
    height: 240,
    marginTop: 60,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 38,
  },
});