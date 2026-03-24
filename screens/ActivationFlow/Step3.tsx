import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step3Props {
  onNext: (data: { description: string; type: 'ossessione' | 'compulsione' | null }) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function Step3({ onNext, onBack, onClose }: Step3Props) {
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<'ossessione' | 'compulsione' | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleContinue = () => {
    onNext({ description, type: selectedType });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Descrivi il disagio</Text>
          <TouchableOpacity onPress={() => setShowInfoModal(true)} style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.pillsContainer}>
          <TouchableOpacity 
            style={[styles.pill, selectedType === 'ossessione' && styles.pillSelected]}
            onPress={() => setSelectedType(selectedType === 'ossessione' ? null : 'ossessione')}
          >
            <Text style={[styles.pillText, selectedType === 'ossessione' && styles.pillTextSelected]}>OSSESSIONE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, selectedType === 'compulsione' && styles.pillSelected]}
            onPress={() => setSelectedType(selectedType === 'compulsione' ? null : 'compulsione')}
          >
            <Text style={[styles.pillText, selectedType === 'compulsione' && styles.pillTextSelected]}>COMPULSIONE</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            autoFocus
          />
        </View>
        <Text style={styles.helperText}>
          es: sento un'attivazione che mi porterebbe a controllare più volte la chiusura della porta.
        </Text>
      </View>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={description.trim().length === 0 || selectedType === null}
      />

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Informazioni</Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Ossessione</Text>
                <Text style={styles.infoSectionText}>
                  Le ossessioni sono pensieri, immagini o impulsi ricorrenti e persistenti che causano ansia o disagio. Sono involontari e la persona cerca di ignorarli, sopprimerli o neutralizzarli.
                </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Compulsione</Text>
                <Text style={styles.infoSectionText}>
                  Le compulsioni sono comportamenti ripetitivi o azioni mentali che la persona si sente obbligata a compiere in risposta a un'ossessione o secondo regole rigide. Sono finalizzate a ridurre l'ansia o prevenire eventi temuti.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f7ff',
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  infoButton: {
    padding: 4,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  pill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pillSelected: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  pillTextSelected: {
    color: 'white',
  },
  inputContainer: {
    backgroundColor: '#e5e3fd',
    borderRadius: 16,
    padding: 16,
    minHeight: 200,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  helperText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    fontStyle: 'italic',
    paddingHorizontal: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      }
    } as any),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoSectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
