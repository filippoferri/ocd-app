import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import AuthService from '../services/AuthService';

import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';

interface ActivationEntry {
  id: string;
  date: string;
  time: string;
  type: 'ossessione' | 'compulsione' | 'test';
  symptom: string;
  intensity: string;
  description: string;
}

interface DiaryScreenProps {
  onClose: () => void;
  onHomePress: () => void;
  onExplorePress: () => void;
  onAddPress: () => void;
  onActivityPress: (activity: ActivationEntry) => void;
  activeTab: 'home' | 'explore';
  testCompleted: boolean;
  testResult: string | null;
  onRetakeTest: () => void;
  userActivities: ActivationEntry[];
  onProfilePress?: () => void;
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

const intensityColors: { [key: string]: string } = {
  'bassa': '#EFEFEF',
  'media': '#fcefc6',
  'alta': '#efb3aa',
};

function DiaryScreen({ onClose, onHomePress, onExplorePress, onAddPress, onActivityPress, activeTab, testCompleted, testResult, onRetakeTest, userActivities, onProfilePress }: DiaryScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ActivationEntry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activations, setActivations] = useState<ActivationEntry[]>([]);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setActivations(userActivities || []);
  }, [userActivities]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getActivationsForDate = (date: Date) => {
    const dateString = getLocalDateString(date);
    return activations
      .filter(activation => (activation.date?.split('T')[0] === dateString))
      .sort((a, b) => {
        // Converte il tempo da formato "H:MM AM/PM" o "HH:MM" a minuti per confronto corretto
        const convertTimeToMinutes = (timeStr: string) => {
          // Controlla se il formato include AM/PM
          if (timeStr.includes(' ')) {
            // Formato 12 ore (H:MM AM/PM)
            const [time, period] = timeStr.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let totalMinutes = minutes;
            
            if (period === 'AM') {
              totalMinutes += hours === 12 ? 0 : hours * 60;
            } else {
              totalMinutes += hours === 12 ? 12 * 60 : (hours + 12) * 60;
            }
            
            return totalMinutes;
          } else {
            // Formato 24 ore (HH:MM)
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
          }
        };
        
        const timeA = convertTimeToMinutes(a.time);
        const timeB = convertTimeToMinutes(b.time);
        return timeB - timeA; // Ordine decrescente (più recente prima)
      });
  };

  const handleDeleteEntry = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteEntry = async () => {
    if (selectedEntry) {
      try {
        await AuthService.deleteActivity(selectedEntry.id);
        setActivations(prev => prev.filter(a => a.id !== selectedEntry.id));
        setSelectedEntry(null);
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error('Error deleting activity:', error);
        Alert.alert('Errore', 'Impossibile eliminare l\'attivazione');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEntryPress = (entry: ActivationEntry) => {
    onActivityPress(entry);
  };

  const handleDescriptionChange = (text: string) => {
    setEditedDescription(text);
    setHasChanges(text !== selectedEntry?.description);
  };

  const toggleEdit = async () => {
    if (isEditing && hasChanges && selectedEntry) {
      try {
        await AuthService.updateActivity(selectedEntry.id, { description: editedDescription });
        setActivations(prev => 
          prev.map(a => a.id === selectedEntry.id ? { ...a, description: editedDescription } : a)
        );
        setSelectedEntry({ ...selectedEntry, description: editedDescription });
        setHasChanges(false);
      } catch (error) {
        console.error('Error updating activity:', error);
        Alert.alert('Errore', 'Impossibile salvare le modifiche');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (hasChanges && selectedEntry) {
      try {
        await AuthService.updateActivity(selectedEntry.id, { description: editedDescription });
        setActivations(prev => 
          prev.map(a => a.id === selectedEntry.id ? { ...a, description: editedDescription } : a)
        );
        setSelectedEntry({ ...selectedEntry, description: editedDescription });
        setHasChanges(false);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating activity:', error);
        Alert.alert('Errore', 'Impossibile salvare le modifiche');
      }
    }
  };

  const renderCalendar = () => {
    return (
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Seleziona Data</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={(day: any) => {
                // Usa la dateString per evitare sfasamenti tra UTC e locale
                setSelectedDate(new Date(day.dateString + 'T12:00:00'));
                setShowCalendar(false);
              }}
              markedDates={{
                [getLocalDateString(selectedDate)]: {
                  selected: true,
                  selectedColor: '#8B7CF6',
                },
              }}
              theme={{
                selectedDayBackgroundColor: '#8B7CF6',
                todayTextColor: '#8B7CF6',
                arrowColor: '#8B7CF6',
              }}
            />
            <TouchableOpacity
              style={styles.calendarSelectButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.calendarSelectButtonText}>Conferma</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderEntryDetail = () => {
    return (
      <Modal
        visible={!!selectedEntry}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedEntry(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.entryDetailModal}>
            <View style={styles.entryDetailHeader}>
              <TouchableOpacity onPress={() => setSelectedEntry(null)}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteEntry}>
                <Ionicons name="trash" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
            
            {selectedEntry && (
              <ScrollView style={styles.entryDetailContent}>
                <Text style={styles.entryDetailTitle}>{selectedEntry.symptom}</Text>
                <Text style={styles.entryDetailTime}>Ore {selectedEntry.time}</Text>
                
                <View style={styles.intensityContainer}>
                  <Ionicons name="alert-circle" size={20} color="#666" />
                  <Text style={styles.intensityLabel}>Paura di contaminazioni</Text>
                </View>
                
                <Text style={styles.descriptionLabel}>{selectedEntry.description}</Text>
                
                <View style={[
                  styles.intensityBadge,
                  { backgroundColor: intensityColors[selectedEntry.intensity] || '#666' }
                ]}>
                  <Text style={styles.intensityText}>
                    Intensità{"\n"}{selectedEntry.intensity === 'alta' ? 'Alta' : (intensityColors[selectedEntry.intensity] ? selectedEntry.intensity.charAt(0).toUpperCase() + selectedEntry.intensity.slice(1) : selectedEntry.intensity)}
                  </Text>
                </View>
                
                <View style={styles.editSection}>
                  <View style={styles.editHeader}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={toggleEdit}
                    >
                      <Ionicons 
                        name={isEditing ? "checkmark" : "pencil"} 
                        size={20} 
                        color="#8B7CF6" 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <TextInput
                    style={[
                      styles.descriptionInput,
                      isEditing && styles.descriptionInputActive
                    ]}
                    value={editedDescription}
                    onChangeText={handleDescriptionChange}
                    multiline
                    editable={isEditing}
                    placeholder="Aggiungi una descrizione..."
                  />
                </View>
              </ScrollView>
            )}
            
            <View style={styles.saveButtonContainer}>
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  (!hasChanges || !isEditing) && styles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!hasChanges || !isEditing}
              >
                <Text style={[
                  styles.saveButtonText,
                  (!hasChanges || !isEditing) && styles.saveButtonTextDisabled
                ]}>SALVA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderDeleteConfirmModal = () => {
    return (
      <Modal
        visible={showDeleteConfirm}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelDelete}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModal}>
            <Text style={styles.deleteModalTitle}>Conferma eliminazione</Text>
            <Text style={styles.deleteModalText}>
              Sei sicuro di voler eliminare questa attivazione?
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.deleteModalButtonCancel]}
                onPress={cancelDelete}
              >
                <Text style={styles.deleteModalButtonCancelText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.deleteModalButtonConfirm]}
                onPress={confirmDeleteEntry}
              >
                <Text style={styles.deleteModalButtonConfirmText}>Elimina</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const todayActivations = getActivationsForDate(selectedDate);

  useEffect(() => {
    if (selectedEntry) {
      setEditedDescription(selectedEntry.description);
      setIsEditing(false);
      setHasChanges(false);
    }
  }, [selectedEntry]);

  const getExerciseImage = (description: string) => {
    if (description.includes('Respirazione')) {
      return require('../assets/exercises/body-scan.png');
    } else if (description.includes('Gratitudine')) {
      return require('../assets/exercises/gratitudine-mattino.png');
    } else if (description.includes('Scrittura')) {
      return require('../assets/exercises/scrittura.png');
    } else if (description.includes('Contrasta')) {
      return require('../assets/exercises/contrasta-compulsione.png');
    }
    return require('../assets/exercises/body-scan.png');
  };

  const isExerciseEntry = (activation: ActivationEntry) => {
    return activation.id?.startsWith('exercise_') || activation.description.includes('Esercizio completato');
  };

  const getExerciseName = (activation: ActivationEntry) => {
    if (activation.description.includes('Esercizio completato: ')) {
      const match = activation.description.match(/Esercizio completato: (.+?)(\.|$)/);
      if (match) return match[1];
    }
    return activation.symptom || 'Esercizio';
  };

  const getExerciseDuration = (description: string) => {
    const match = description.match(/Durata: (.+)/);
    return match ? match[1] : '';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <Ionicons name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={todayActivations}
        keyExtractor={(item) => item.id}
        style={styles.activationsList}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nessuna attivazione registrata per oggi</Text>
          </View>
        }
        renderItem={({ item: activation }) => {
          const isExercise = isExerciseEntry(activation);
          const isTest = activation.type === 'test';
          
          if (isTest) {
            return (
              <View style={styles.testLogCard}>
                <View style={styles.testLogHeader}>
                  <View style={styles.testLogIcon}>
                    <Ionicons name="clipboard-outline" size={20} color="#8B7CF6" />
                  </View>
                  <Text style={styles.testLogTitle}>Test DOC Completato</Text>
                  <Text style={styles.testLogTime}>{activation.time}</Text>
                </View>
                <View style={styles.testLogContent}>
                  <View style={styles.testLogScoreContainer}>
                    <View style={styles.testLogScoreCircle}>
                      <Text style={styles.testLogScoreText}>{testResult}</Text>
                    </View>
                    <View style={styles.testLogInfo}>
                      <Text style={styles.testLogResultTitle}>Disturbo Ossessivo Compulsivo</Text>
                      <Text style={styles.testLogResultStatus}>PRESENTE</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={onRetakeTest} style={styles.retakeTestButton}>
                  <Ionicons name="refresh" size={16} color="#8B7CF6" style={styles.retakeTestIcon} />
                  <Text style={styles.retakeTestText}>Ripeti il test</Text>
                </TouchableOpacity>
              </View>
            );
          }
          
          return (
            <TouchableOpacity
              style={[
                styles.activationItem,
                { borderLeftColor: isExercise ? '#8B7CF6' : (intensityColors[activation.intensity] || '#666') }
              ]}
              onPress={() => handleEntryPress(activation)}
            >
              <View style={styles.activationContent}>
                <View style={styles.activationHeader}>
                  {isExercise ? (
                    <View style={styles.exerciseImageContainer}>
                      <Image 
                        source={getExerciseImage(activation.description)}
                        style={styles.exerciseImage}
                      />
                    </View>
                  ) : (
                    <View style={styles.iconContainer}>
                      <Ionicons 
                        name={getSymptomIcon(activation.symptom) as any} 
                        size={18} 
                        color="#8B7CF6" 
                      />
                    </View>
                  )}
                  <Text style={styles.activationType}>
                    {isExercise ? getExerciseName(activation) : (activation.type === 'ossessione' ? 'Ossessione' : 'Compulsione')}
                  </Text>
                </View>
              </View>
              <Text style={styles.activationTime}>{activation.time}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {renderCalendar()}
      {renderEntryDetail()}
      {renderDeleteConfirmModal()}
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    // paddingTop handled dynamically
  },
  editButton: {
    padding: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  activationsList: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  activationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  activationContent: {
    flex: 1,
  },
  activationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activationType: {
       fontSize: 16,
       fontWeight: '600',
       color: '#333',
     },
  activationTime: {
    fontSize: 14,
    color: '#8B7CF6',
    fontWeight: '500',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  entryDetailModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  entryDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  entryDetailContent: {
    flex: 1,
    padding: 20,
  },
  entryDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  entryDetailTime: {
    fontSize: 16,
    color: '#8B7CF6',
    marginBottom: 20,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  intensityLabel: {
    fontSize: 16,
    color: '#333',
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  intensityBadge: {
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginVertical: 20,
    minWidth: 120,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editSection: {
    marginTop: 20,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#F8F9FA',
  },
  descriptionInputActive: {
    borderColor: '#8B7CF6',
    backgroundColor: 'white',
  },
  saveButtonContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: '#FF8C42',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  deleteModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '80%',
    maxWidth: 300,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteModalButtonCancel: {
    backgroundColor: '#F5F5F5',
  },
  deleteModalButtonConfirm: {
    backgroundColor: '#F44336',
  },
  deleteModalButtonCancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteModalButtonConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  calendarSelectButton: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  calendarSelectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Test Log Styles
  testLogCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testLogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testLogIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testLogTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  exerciseImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  retakeTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  retakeTestIcon: {
    marginRight: 6,
  },
  retakeTestText: {
    fontSize: 14,
    color: '#8B7CF6',
    fontWeight: '500',
  },
  testLogContent: {
    paddingLeft: 44,
  },
  testLogScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testLogScoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B7CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testLogScoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  testLogInfo: {
    flex: 1,
  },
  testLogResultTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  testLogResultStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B7CF6',
  },
  testLogTime: {
    fontSize: 14,
    color: '#8B7CF6',
    fontWeight: '500',
    marginLeft: 'auto',
  },
});

export default DiaryScreen;
