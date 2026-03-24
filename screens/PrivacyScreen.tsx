import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface PrivacyScreenProps {
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function PrivacyScreen({ onClose }: PrivacyScreenProps) {
  const insets = useSafeAreaInsets();
  const [helpImprove, setHelpImprove] = useState(true);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy dei dati</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.mainTitle}>La tua privacy è la nostra priorità</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.summaryText}>
            DOC Relief cripta, anonimizza e conserva in sicurezza i tuoi dati. Non vengono mai venduti.
          </Text>
        </View>

        <View style={styles.faqCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.question}>Aiutaci a migliorare DOC Relief</Text>
            <TouchableOpacity 
              onPress={() => setHelpImprove(!helpImprove)}
              style={[styles.toggle, helpImprove && styles.toggleActive]}
            >
              <View style={[styles.toggleThumb, helpImprove && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.answer}>
            Permetti l'uso dei tuoi dati anonimizzati per migliorare i nostri modelli AI, il che rende DOC Relief migliore per te e per tutti.
          </Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.question}>Come usiamo l'AI</Text>
          <Text style={styles.answer}>
            L'AI su DOC Relief è progettata per migliorare la tua esperienza nell'app rendendo più efficaci le raccomandazioni e aiutandoti a trovare i giusti esercizi più velocemente.
          </Text>
          <Text style={styles.answer}>
            La nostra AI è creata in collaborazione con i nostri consulenti clinici. Non diagnostica, tratta, cura o previene malattie mentali.
          </Text>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.emergencyText}>
            Se stai vivendo un'emergenza di salute mentale, contatta il <Text style={styles.emergencyLink}>112</Text> o il centro di emergenza più vicino.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#8B7CF6',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  faqCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B7CF6',
    flex: 1,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
    marginBottom: 10,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginLeft: 16,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  footerContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },
  emergencyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  emergencyLink: {
    color: '#00A896',
    fontWeight: '700',
  },
});
