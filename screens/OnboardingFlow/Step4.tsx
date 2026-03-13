import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4({ onNext, onBack }: Step4Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Conosciamoci</Text>
          <Text style={styles.titleHighlight}>meglio</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  imageContainer: {
    width: 200,
    height: 200,
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
  titleHighlight: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 38,
  },
});