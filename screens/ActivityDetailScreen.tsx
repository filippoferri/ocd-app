import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../components/ButtonNav';

interface ActivityDetailScreenProps {
  activity: {
    id: string;
    type: 'ossessione' | 'compulsione' | 'test';
    symptom: string;
    intensity: string;
    description: string;
    time: string;
    duration?: string; // Per gli esercizi
    date: string;
  };
  onBack: () => void;
  onSave: (description: string) => void;
  onDelete: () => void;
}

const symptomIcons: { [key: string]: string } = {
  'contamination': 'medical',
  'harm': 'warning',
  'control': 'flash',
  'sexuality': 'heart',
  'order': 'grid',
  'detachment': 'link',
  'error': 'alert-triangle',
  'superstition': 'star',
  'invasion': 'eye',
  'hypochondria': 'fitness',
  'rituals': 'repeat',
};

// Funzione per ottenere l'icona del sintomo
const getSymptomIcon = (symptomId: string): string => {
  // Se è un sintomo personalizzato (inizia con 'custom-'), usa l'icona predefinita
  if (symptomId.startsWith('custom-')) {
    return 'add-circle';
  }
  // Altrimenti usa la mappatura esistente
  return symptomIcons[symptomId] || 'help-circle';
};

const symptomLabels: { [key: string]: string } = {
  'contamination': 'Paura di contaminazioni',
  'harm': 'Azioni o pensieri lesivi',
  'control': 'Perdita di controllo',
  'sexuality': 'Pensieri legati alla sessualità',
  'order': 'Controllo e ordine',
  'detachment': 'Difficoltà a distaccarsi',
  'error': 'Timore di errore',
  'superstition': 'Pensieri o azioni scaramantiche',
  'invasion': 'Invasione mente da fattori esterni',
  'hypochondria': 'Ipocondria',
  'rituals': 'Idee o azioni di rituali',
};

const intensityColors: { [key: string]: string } = {
  'bassa': '#EFEFEF',
  'media': '#fcefc6',
  'alta': '#efb3aa',
};

const intensityBorderColors: { [key: string]: string } = {
  'bassa': 'rgba(239, 239, 239, 0.5)',
  'media': 'rgba(252, 239, 198, 0.5)',
  'alta': 'rgba(239, 179, 170, 0.5)',
};

const intensityTextColors: { [key: string]: string } = {
  'bassa': '#656565',
  'media': '#E0A500',
  'alta': '#990809',
};

const intensityLabels: { [key: string]: string } = {
  'bassa': 'Bassa',
  'media': 'Media',
  'alta': 'Alta',
};

export default function ActivityDetailScreen({ 
  activity, 
  onBack, 
  onSave, 
  onDelete 
}: ActivityDetailScreenProps) {
  const [description, setDescription] = useState(activity.description);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const isExercise = activity.description.includes('Esercizio completato:');

  const handleSave = () => {
    if (hasChanges) {
      onSave(description);
      setHasChanges(false);
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    setHasChanges(text !== activity.description);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dragHandle} />
        <View style={styles.headerTitleRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Attivazione</Text>
          
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#1a1a2e" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View>
            {/* Title */}
            <Text style={styles.title}>
              {isExercise ? (
                activity.description.includes('Esercizio completato:') 
                  ? activity.description.match(/Esercizio completato: (.+?)(\.|$)/)?.[1] || 'Esercizio'
                  : 'Esercizio'
              ) : (activity.type === 'ossessione' ? 'Ossessione' : 'Compulsione')}
            </Text>

            <Text style={styles.dateSubtitle}>
              {new Date(activity.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })} - {activity.time}
            </Text>

            {isExercise ? (
              <View style={styles.exerciseContent}>
                <TextInput
                  style={styles.descriptionInput}
                  value={description}
                  onChangeText={handleDescriptionChange}
                  placeholder="Aggiungi una descrizione..."
                  multiline
                  textAlignVertical="top"
                />
              </View>
            ) : (
              /* Regular Activity Content */
              <>
                {/* Symptom Pill */}
                <View style={styles.symptomPill}>
                  <Ionicons 
                    name={getSymptomIcon(activity.symptom) as any} 
                    size={16} 
                    color="#1a1a2e" 
                  />
                  <Text style={styles.symptomText}>
                    {symptomLabels[activity.symptom] || (activity.symptom.startsWith('custom-') ? activity.symptom.replace('custom-', '') : activity.symptom)}
                  </Text>
                </View>

                {/* Description */}
                <TextInput
                  style={styles.descriptionInput}
                  value={description}
                  onChangeText={handleDescriptionChange}
                  placeholder="Descrivi la tua esperienza..."
                  multiline
                  textAlignVertical="top"
                />
              </>
            )}
          </View>

          {!isExercise && (
            /* Intensity Section inside the card */
            <View style={styles.intensityContainer}>
              <View style={[
                styles.intensityOuterRectangle,
                { backgroundColor: activity.intensity === 'alta' ? '#fee2e2' : activity.intensity === 'media' ? '#fef3c7' : '#f3f4f6' }
              ]}>
                <View style={[
                  styles.intensityInnerRectangle,
                  { backgroundColor: activity.intensity === 'alta' ? '#fecaca' : activity.intensity === 'media' ? '#fde68a' : '#e5e7eb' }
                ]}>
                  <Text style={[
                    styles.intensityLabel,
                    { color: intensityTextColors[activity.intensity] || '#666' }
                  ]}>Intensità</Text>
                  <Text style={[
                    styles.intensityValue,
                    { color: intensityTextColors[activity.intensity] || '#666' }
                  ]}>
                    {intensityLabels[activity.intensity] || activity.intensity}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <ButtonNav 
        label="SALVA" 
        onPress={handleSave}
        disabled={!hasChanges}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Sei sicuro?</Text>
            <Text style={styles.confirmMessage}>
              Sei sicuro di voler cancellare questa registrazione dal diario?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.cancelButton]} 
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.confirmDeleteButton]} 
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Sì</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  header: {
    backgroundColor: '#f1f0fa',
    paddingTop: 15,
    paddingBottom: 20,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#1a1a2e',
    borderRadius: 3,
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  backButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    backgroundColor: '#f1f0fa',
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 25,
    paddingBottom: 16, // User requested 16px from the bottom of the white card
    minHeight: 600,
    justifyContent: 'space-between', // Push intensity to the bottom if content is short
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8, // Title to Date: 8px
  },
  dateSubtitle: {
    fontSize: 16,
    color: '#a0a0b8',
    marginBottom: 16, // Date to Pill: 16px
    fontWeight: '500',
  },
  symptomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16, // Pill to Description: 16px
    gap: 10,
  },
  symptomText: {
    fontSize: 15,
    color: '#1a1a2e',
    fontWeight: '500',
  },
  descriptionInput: {
    fontSize: 17,
    color: '#1a1a2e',
    lineHeight: 26,
    textAlign: 'left',
    minHeight: 150,
  },
  intensityContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  intensityOuterRectangle: {
    width: '100%',
    padding: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityInnerRectangle: {
    width: '100%',
    paddingVertical: 35,
    paddingHorizontal: 20,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  intensityValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    minWidth: 280,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmDeleteButton: {
    backgroundColor: '#F44336',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  exerciseContent: {
    marginBottom: 40,
  },
  exerciseDescription: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    marginBottom: 12,
  },
  exerciseDuration: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
});
