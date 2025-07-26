import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step8Props {
  onNext: (fragilityLevel: number) => void;
  onBack: () => void;
}

export default function Step8({ onNext, onBack }: Step8Props) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleContinue = () => {
    if (selectedLevel !== null) {
      onNext(selectedLevel);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Quanto valuteresti la tua fragilità da 1 a 10?</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-8.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.scaleContainer}>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Minima</Text>
            <Text style={styles.scaleLabel}>Massima</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.selectText}>
              {selectedLevel ? `Livello ${selectedLevel}` : 'Seleziona un livello...'}
            </Text>
            <Ionicons 
              name={showDropdown ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          
          {showDropdown && (
            <View style={styles.dropdown}>
              <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                  <TouchableOpacity
                    key={number}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedLevel(number);
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>Livello {number}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={selectedLevel === null}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
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
  scaleContainer: {
    width: '100%',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  scaleLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  selectText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  dropdown: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginTop: 8,
    height: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContainer: {
    flex: 1,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});