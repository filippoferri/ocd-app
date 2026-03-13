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
  'alta': 'Molto Alta',
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
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.time}>Ore {activity.time}</Text>
        
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>
          {isExercise ? (
            activity.description.includes('Esercizio completato:') 
              ? activity.description.match(/Esercizio completato: (.+?)(\.|$)/)?.[1] || 'Esercizio'
              : 'Esercizio'
          ) : (activity.type === 'ossessione' ? 'Ossessione' : 'Compulsione')}
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
                color="#666" 
              />
              <Text style={styles.symptomText}>
                {symptomLabels[activity.symptom] || activity.symptom}
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

            {/* Intensity Circle */}
            <View style={styles.intensityContainer}>
              <View style={[
                styles.intensityCircle,
                { 
                  backgroundColor: intensityColors[activity.intensity] || '#666',
                  borderColor: intensityBorderColors[activity.intensity] || 'rgba(102, 102, 102, 0.5)',
                  borderWidth: 10,
                }
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
          </>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f7ff',
  },
  backButton: {
    padding: 5,
  },
  time: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  symptomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 30,
    gap: 6,
  },
  symptomText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  descriptionInput: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'left',
    minHeight: 120,
    marginBottom: 40,
  },
  intensityContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  intensityCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  intensityLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  intensityValue: {
    fontSize: 16,
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
