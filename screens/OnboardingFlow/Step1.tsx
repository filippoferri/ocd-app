import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Sei nel posto</Text>
          <Text style={styles.titleHighlight}>giusto</Text>
          
          <Text style={styles.subtitle}>
            Ti aiuteremo a costruire un futuro migliore da vivere,{"\n"}
            preparandoti a migliorare giorno dopo giorno.
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 38,
  },
  titleHighlight: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B7CF6',
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