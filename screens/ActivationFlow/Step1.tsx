import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, Dimensions, KeyboardAvoidingView, Platform, Alert, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Icons from 'phosphor-react-native';
import { 
  Plus,
  PlusCircle,
  X,
  PencilSimple
} from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonNav from '../../components/ButtonNav';

const { width, height } = Dimensions.get('window');

interface Step1Props {
  onNext: (data: { date: string; time: string; symptoms: string[] }) => void;
  onClose: () => void;
  onBack?: () => void;
}

const SYMPTOMS_STORAGE_KEY = 'custom_symptoms_list';

// Helper to get icon component by name
const getIcon = (name: string): React.FC<any> => {
  return (Icons as any)[name] || PlusCircle;
};

const commonSymptoms = [
  { id: 'contamination', label: 'Paura di contaminazioni', iconName: 'Virus' },
  { id: 'harm', label: 'Azioni o pensieri lesivi', iconName: 'BoxingGlove' },
  { id: 'control', label: 'Perdita di controllo', iconName: 'Sparkle' },
  { id: 'sexuality', label: 'Pensieri legati alla sessualità', iconName: 'GenderIntersex' },
  { id: 'order', label: 'Controllo e ordine', iconName: 'AlignLeft' },
  { id: 'detachment', label: 'Difficoltà a distaccarsi', iconName: 'ArrowsInCardinal' },
  { id: 'error', label: 'Timore di errore', iconName: 'Warning' },
  { id: 'superstition', label: 'Pensieri o azioni scaramantiche', iconName: 'Pepper' },
  { id: 'invasion', label: 'Invasione mente da fattori esterni', iconName: 'Brain' },
  { id: 'hypochondria', label: 'Ipocondria', iconName: 'Pill' },
  { id: 'rituals', label: 'Idee o azioni di rituali', iconName: 'Repeat' },
];

const AVAILABLE_ICONS = [
  'Smiley', 'SmileySad', 'SmileyAngry', 'SmileyMeh', 'SmileyNervous',
  'Brain', 'Heart', 'Pill', 'Stethoscope', 'Bandaids', 'FirstAid',
  'Warning', 'Lightning', 'Bomb', 'Sparkle', 'CloudRain', 'Sun', 'Moon', 
  'Fire', 'Lock', 'Shield', 'Key', 'Bell', 'SpeakerHigh', 'Eye', 'Ear', 
  'Hand', 'Square', 'Star', 'Repeat', 'PlusCircle', 'Infinity',
  'Atom', 'Cpu', 'Plugs', 'Globe', 'Compass', 'MapPin', 'Calendar',
  'Clock', 'Camera', 'Microphone', 'Paperclip', 'PushPin', 'Trash',
  'Briefcase', 'GraduationCap', 'Flask', 'Pizza', 'Coffee'
];

export default function Step1({ onNext, onClose, onBack }: Step1Props) {
  const insets = useSafeAreaInsets();
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const [customSymptoms, setCustomSymptoms] = useState<Array<{id: string, label: string, iconName: string}>>([]);
  
  // Ref to always have the latest state in async callbacks (prevents closure/stale issues)
  const symptomsRef = React.useRef(customSymptoms);
  React.useEffect(() => {
    symptomsRef.current = customSymptoms;
  }, [customSymptoms]);
  const now = new Date();
  const currentDay = now.getDate().toString();
  const currentMonth = now.toLocaleDateString('it-IT', { month: 'long' });
  const currentYear = now.getFullYear().toString();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMinute = now.getMinutes().toString().padStart(2, '0');
  
  const [date, setDate] = useState(`${currentDay} ${currentMonth} ${currentYear}`);
  const [time, setTime] = useState(`${currentHour}:${currentMinute}`);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedHour, setSelectedHour] = useState(currentHour);
  const [selectedMinute, setSelectedMinute] = useState(currentMinute);
  
  // Add/Edit symptom modal state
  const [showAddSymptomModal, setShowAddSymptomModal] = useState(false);
  const [showIconGrid, setShowIconGrid] = useState(false);
  const [newSymptomText, setNewSymptomText] = useState('');
  const [newSymptomIconName, setNewSymptomIconName] = useState('PlusCircle');
  const [editingSymptomId, setEditingSymptomId] = useState<string | null>(null);

  // New Modal Animation State
  const dateModalOpacity = useRef(new Animated.Value(0)).current;
  const dateModalSlide = useRef(new Animated.Value(height)).current;
  const timeModalOpacity = useRef(new Animated.Value(0)).current;
  const timeModalSlide = useRef(new Animated.Value(height)).current;

  const openDatePicker = () => {
    setShowDatePicker(true);
    Animated.parallel([
      Animated.timing(dateModalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dateModalSlide, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeDatePicker = () => {
    Animated.parallel([
      Animated.timing(dateModalOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(dateModalSlide, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
        useNativeDriver: true,
      })
    ]).start(() => setShowDatePicker(false));
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
    Animated.parallel([
      Animated.timing(timeModalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(timeModalSlide, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeTimePicker = () => {
    Animated.parallel([
      Animated.timing(timeModalOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(timeModalSlide, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
        useNativeDriver: true,
      })
    ]).start(() => setShowTimePicker(false));
  };

  // Load custom symptoms from storage
  useEffect(() => {
    const loadCustomSymptoms = async () => {
      try {
        const stored = await AsyncStorage.getItem(SYMPTOMS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCustomSymptoms(parsed);
        }
      } catch (e) {
        console.error('Error loading symptoms:', e);
      }
    };
    loadCustomSymptoms();
  }, []);

  const toggleSymptom = (id: string) => {
    setSelectedSymptom(selectedSymptom === id ? '' : id);
  };

  const handleOpenEditModal = (id: string) => {
    const symptom = customSymptoms.find(s => s.id === id);
    if (symptom) {
      setNewSymptomText(symptom.label);
      setNewSymptomIconName(symptom.iconName);
      setEditingSymptomId(id);
      setShowAddSymptomModal(true);
    }
  };

  const persistToStorage = async (list: any[]) => {
    try {
      await AsyncStorage.setItem(SYMPTOMS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Persistence failed:', e);
    }
  };

  const handleSaveSymptom = async () => {
    if (!newSymptomText.trim()) return;

    const symptomData = {
      label: newSymptomText.trim(),
      iconName: newSymptomIconName
    };

    let nextList;
    if (editingSymptomId) {
      nextList = symptomsRef.current.map(s => 
        s.id === editingSymptomId ? { ...s, ...symptomData } : s
      );
    } else {
      const newId = `custom-${Date.now()}`;
      const newSymptom = { id: newId, ...symptomData };
      nextList = [newSymptom, ...symptomsRef.current];
      setSelectedSymptom(newId);
    }

    // 1. Update State
    setCustomSymptoms(nextList);
    
    // 2. Persist to Storage explicitly
    await persistToStorage(nextList);
    
    // 3. Clear and close
    closeModal();
  };

  const handleDeleteSymptom = () => {
    const idToDelete = editingSymptomId;
    if (!idToDelete) return;

    const performDelete = async () => {
      // Use the ref to get the absolute latest list before filtering
      const nextList = symptomsRef.current.filter(s => s.id !== idToDelete);
      
      // 1. Update State
      setCustomSymptoms(nextList);
      
      // 2. Update selection
      if (selectedSymptom === idToDelete) {
        setSelectedSymptom('');
      }

      // 3. Persist to Storage explicitly
      await persistToStorage(nextList);
      
      // 4. Close modal
      closeModal();
    };

    if (Platform.OS === 'web') {
      // On Web, window.confirm is more reliable than Alert polyfills
      if (window.confirm("Sei sicuro di voler eliminare questo sintomo?")) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Elimina Sintomo",
        "Sei sicuro di voler eliminare questo sintomo?",
        [
          { text: "Annulla", style: "cancel" },
          { text: "Elimina", style: "destructive", onPress: performDelete }
        ]
      );
    }
  };

  const closeModal = () => {
    setNewSymptomText('');
    setNewSymptomIconName('PlusCircle');
    setEditingSymptomId(null);
    setShowAddSymptomModal(false);
  };

  const handleContinue = () => {
    if (selectedSymptom) {
      onNext({ date, time, symptoms: [selectedSymptom] });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.leftSection}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Plus size={24} color="#333" weight="bold" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Plus size={24} color="#333" weight="bold" style={{ transform: [{ rotate: '45deg' }] }} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quando è successo?</Text>
        
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity style={styles.dateBox} onPress={openDatePicker}>
            <Text style={styles.dateText}>{date}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeBox} onPress={openTimePicker}>
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        </View>

        {/* I MIEI SINTOMI SECTION */}
        <Text style={styles.sectionSubtitle}>I miei sintomi</Text>
        <View style={styles.symptomsGrid}>
          {/* Add Button as first item in My Symptoms */}
          <TouchableOpacity
            style={styles.addSymptomCard}
            onPress={() => setShowAddSymptomModal(true)}
          >
            <View style={styles.symptomIcon}>
              <Plus 
                size={32} 
                color="#FF8C00" 
                weight="bold"
              />
            </View>
            <Text style={[styles.symptomText, { color: '#FF8C00' }]}>Aggiungi</Text>
          </TouchableOpacity>

          {customSymptoms.map((symptom) => {
            const IconComponent = getIcon(symptom.iconName);
            return (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  selectedSymptom === symptom.id && styles.symptomCardSelected
                ]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <TouchableOpacity 
                  style={styles.editIconBadge}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(symptom.id);
                  }}
                >
                  <PencilSimple size={14} color="white" weight="bold" />
                </TouchableOpacity>
                <View style={styles.symptomIcon}>
                  <IconComponent 
                    size={32} 
                    color={selectedSymptom === symptom.id ? "#8B7CF6" : "#333"} 
                    weight={selectedSymptom === symptom.id ? "fill" : "regular"}
                  />
                </View>
                <Text style={styles.symptomText}>{symptom.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SINTOMI COMUNI SECTION */}
        <Text style={styles.sectionSubtitle}>Sintomi comuni</Text>
        <View style={styles.symptomsGrid}>
          {commonSymptoms.map((symptom) => {
            const IconComponent = getIcon(symptom.iconName);
            return (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  selectedSymptom === symptom.id && styles.symptomCardSelected
                ]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <View style={styles.symptomIcon}>
                  <IconComponent 
                    size={32} 
                    color={selectedSymptom === symptom.id ? "#8B7CF6" : "#333"} 
                    weight={selectedSymptom === symptom.id ? "fill" : "regular"}
                  />
                </View>
                <Text style={styles.symptomText}>{symptom.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={!selectedSymptom}
      />

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalBackdrop, 
              { opacity: dateModalOpacity }
            ]} 
          >
            <TouchableOpacity 
              style={{ flex: 1 }} 
              activeOpacity={1} 
              onPress={closeDatePicker} 
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.modalContent, 
              { transform: [{ translateY: dateModalSlide }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeDatePicker}>
                <Text style={styles.modalCancel}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setDate(`${selectedDay} ${selectedMonth} ${selectedYear}`);
                closeDatePicker();
              }}>
                <Text style={styles.modalDone}>Fatto</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'].map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[styles.pickerItem, selectedMonth === month && styles.pickerItemSelected]}
                    onPress={() => setSelectedMonth(month)}
                  >
                    <Text style={[styles.pickerText, selectedMonth === month && styles.pickerTextSelected]}>{month}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {Array.from({length: 31}, (_, i) => (i + 1).toString()).map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.pickerItem, selectedDay === day && styles.pickerItemSelected]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[styles.pickerText, selectedDay === day && styles.pickerTextSelected]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {[currentYear, (parseInt(currentYear) - 1).toString()].map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.pickerItem, selectedYear === year && styles.pickerItemSelected]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[styles.pickerText, selectedYear === year && styles.pickerTextSelected]}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalBackdrop, 
              { opacity: timeModalOpacity }
            ]} 
          >
            <TouchableOpacity 
              style={{ flex: 1 }} 
              activeOpacity={1} 
              onPress={closeTimePicker} 
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.modalContent, 
              { transform: [{ translateY: timeModalSlide }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeTimePicker}>
                <Text style={styles.modalCancel}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setTime(`${selectedHour}:${selectedMinute}`);
                closeTimePicker();
              }}>
                <Text style={styles.modalDone}>Fatto</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[styles.pickerItem, selectedHour === hour && styles.pickerItemSelected]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text style={[styles.pickerText, selectedHour === hour && styles.pickerTextSelected]}>{hour}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[styles.pickerItem, selectedMinute === minute && styles.pickerItemSelected]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text style={[styles.pickerText, selectedMinute === minute && styles.pickerTextSelected]}>{minute}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Add/Edit Symptom Modal */}
      <Modal
        visible={showAddSymptomModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.newModalContent}>
            <View style={styles.dragHandle} />
            
            <View style={styles.newModalHeader}>
              <Text style={styles.newModalTitle}>
                {editingSymptomId ? 'Modifica Sintomo' : 'Aggiungi Sintomo'}
              </Text>
              <TouchableOpacity style={styles.newCloseButton} onPress={closeModal}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.newModalBody}>
              <TouchableOpacity 
                style={styles.iconSelectionCircle}
                onPress={() => setShowIconGrid(true)}
              >
                <View style={styles.selectedIconContainer}>
                  {React.createElement(getIcon(newSymptomIconName), {
                    size: 32,
                    color: "#8B7CF6",
                    weight: "fill"
                  })}
                  <View style={styles.miniPlusBadge}>
                    <Plus size={10} color="white" weight="bold" />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.newInputContainer}>
                <TextInput
                  style={styles.newTextInput}
                  value={newSymptomText}
                  onChangeText={setNewSymptomText}
                  placeholder="Nome del sintomo"
                  placeholderTextColor="#999"
                  maxLength={50}
                  textAlign="center"
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.saveButtonLarge, 
                  !newSymptomText.trim() && styles.saveButtonDisabled
                ]}
                onPress={handleSaveSymptom}
                disabled={!newSymptomText.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {editingSymptomId ? 'AGGIORNA' : 'SALVA'}
                </Text>
              </TouchableOpacity>

              {editingSymptomId && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDeleteSymptom}
                >
                  <Text style={styles.deleteButtonText}>ELIMINA SINTOMO</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Icon Grid Modal */}
        <Modal 
          visible={showIconGrid} 
          transparent 
          animationType="fade"
          onRequestClose={() => setShowIconGrid(false)}
        >
          <View style={styles.iconGridOverlay}>
            <View style={styles.iconGridContent}>
              <View style={styles.iconGridHeader}>
                <Text style={styles.iconGridTitle}>Scegli un'icona</Text>
                <TouchableOpacity onPress={() => setShowIconGrid(false)}>
                  <X size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView 
                contentContainerStyle={styles.iconGridScroll}
                showsVerticalScrollIndicator={false}
              >
                {AVAILABLE_ICONS.map((iconName) => (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.iconGridItem,
                      newSymptomIconName === iconName && styles.iconGridItemSelected
                    ]}
                    onPress={() => {
                      setNewSymptomIconName(iconName);
                      setShowIconGrid(false);
                    }}
                  >
                    {React.createElement(getIcon(iconName), {
                      size: 28,
                      color: newSymptomIconName === iconName ? "#8B7CF6" : "#666",
                      weight: newSymptomIconName === iconName ? "fill" : "regular"
                    })}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingTop handled dynamically
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  dateBox: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  timeBox: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 24,
    marginBottom: 16,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  symptomCard: {
    width: '47%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  symptomCardSelected: {
    backgroundColor: '#F0EFFF',
    borderColor: '#8B7CF6',
  },
  editIconBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#8B7CF6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addSymptomCard: {
    width: '47%',
    backgroundColor: '#ffeedd',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFDAB9',
    borderStyle: 'dashed',
  },
  symptomIcon: {
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    height: height * 0.45,
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
  modalCancel: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalDone: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 200,
  },
  picker: {
    flex: 1,
    paddingHorizontal: 10,
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  pickerText: {
    fontSize: 18,
    color: '#333',
  },
  pickerTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },

  // NEW MODAL STYLES
  newModalContent: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#2D1F50',
    borderRadius: 3,
    marginTop: 12,
    marginBottom: 8,
  },
  newModalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  newModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  newCloseButton: {
    position: 'absolute',
    right: 24,
    padding: 4,
  },
  newModalBody: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 10,
  },
  iconSelectionCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D6D1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedIconContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPlusBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#8B7CF6',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D6D1FF',
  },
  newInputContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  newTextInput: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  saveButtonLarge: {
    width: '100%',
    backgroundColor: '#FFAD76',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.8, // Reduced opacity but not fully disabled look
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  deleteButton: {
    marginTop: 16,
    padding: 10,
  },
  deleteButtonText: {
    color: '#FF4B4B',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ICON GRID STYLES
  iconGridOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconGridContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 32,
    maxHeight: '80%',
    padding: 24,
  },
  iconGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconGridTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  iconGridScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 20,
  },
  iconGridItem: {
    width: (width - 110) / 4,
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGridItemSelected: {
    backgroundColor: '#F0EFFF',
    borderWidth: 2,
    borderColor: '#8B7CF6',
  },
});