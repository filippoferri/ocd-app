import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../config/Theme';

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
          <Ionicons name="chevron-back" size={28} color={Colors.onPrimary} />
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
            Se stai vivendo un'emergenza di salute mentale, contatta il <Text style={[styles.emergencyLink, { color: Colors.accent }]}>112</Text> o il centro di emergenza più vicino.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...Shadow.medium,
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
    color: Colors.onPrimary,
    letterSpacing: 0.5,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0D0140',
    marginBottom: Spacing.xl,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.light,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.light,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0140',
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
    color: '#0D0140',
    flex: 1,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.secondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginLeft: 16,
  },
  toggleActive: {
    backgroundColor: Colors.success,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.surface,
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
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  emergencyLink: {
    fontWeight: '800',
  },
});
