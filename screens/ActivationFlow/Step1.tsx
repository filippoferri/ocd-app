import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step1Props {
  onNext: (data: { date: string; time: string; symptoms: string[] }) => void;
  onClose: () => void;
  onBack?: () => void;
}

const symptoms = [
  { id: 'contamination', label: 'Paura di contaminazioni', icon: 'medical' },
  { id: 'harm', label: 'Azioni o pensieri lesivi', icon: 'warning' },
  { id: 'control', label: 'Perdita di controllo', icon: 'flash' },
  { id: 'sexuality', label: 'Pensieri legati alla sessualità', icon: 'heart' },
  { id: 'order', label: 'Controllo e ordine', icon: 'grid' },
  { id: 'detachment', label: 'Difficoltà a distaccarsi', icon: 'link' },
  { id: 'error', label: 'Timore di errore', icon: 'alert-triangle' },
  { id: 'superstition', label: 'Pensieri o azioni scaramantiche', icon: 'star' },
  { id: 'invasion', label: 'Invasione mente da fattori esterni', icon: 'eye' },
  { id: 'hypochondria', label: 'Ipocondria', icon: 'fitness' },
  { id: 'rituals', label: 'Idee o azioni di rituali', icon: 'repeat' },
];

export default function Step1({ onNext, onClose, onBack }: Step1Props) {
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const [customSymptoms, setCustomSymptoms] = useState<Array<{id: string, label: string, icon: string}>>([]);
  
  // Get current date and time
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
  
  // Add symptom modal state
  const [showAddSymptomModal, setShowAddSymptomModal] = useState(false);
  const [newSymptomText, setNewSymptomText] = useState('');

  const toggleSymptom = (id: string) => {
    setSelectedSymptom(selectedSymptom === id ? '' : id);
  };

  const handleAddCustomSymptom = () => {
    if (newSymptomText.trim()) {
      const newSymptom = {
        id: `custom-${Date.now()}`,
        label: newSymptomText.trim(),
        icon: 'add-circle'
      };
      setCustomSymptoms([...customSymptoms, newSymptom]);
      setNewSymptomText('');
      setShowAddSymptomModal(false);
    }
  };

  const handleContinue = () => {
    if (selectedSymptom) {
      onNext({ date, time, symptoms: [selectedSymptom] });
    }
  };

  // Combina sintomi predefiniti e personalizzati
  const allSymptoms = [...symptoms, ...customSymptoms];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quando è successo?</Text>
        
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity style={styles.dateBox} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeBox} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Quale sintomo si è proposto?</Text>

        <View style={styles.symptomsGrid}>
          {allSymptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom.id}
              style={[
                styles.symptomCard,
                selectedSymptom === symptom.id && styles.symptomCardSelected
              ]}
              onPress={() => toggleSymptom(symptom.id)}
            >
              <View style={styles.symptomIcon}>
                <Ionicons 
                  name={symptom.icon as any} 
                  size={24} 
                  color="#8B7CF6" 
                />
              </View>
              <Text style={styles.symptomText}>{symptom.label}</Text>
            </TouchableOpacity>
          ))}
          
          {/* Pulsante Aggiungi */}
          <TouchableOpacity
            style={styles.addSymptomCard}
            onPress={() => setShowAddSymptomModal(true)}
          >
            <View style={styles.symptomIcon}>
              <Ionicons 
                name="add" 
                size={24} 
                color="#8B7CF6" 
              />
            </View>
            <Text style={styles.symptomText}>Aggiungi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={!selectedSymptom}
      />

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.modalCancel}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setDate(`${selectedDay} ${selectedMonth} ${selectedYear}`);
                setShowDatePicker(false);
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
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={styles.modalCancel}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setTime(`${selectedHour}:${selectedMinute}`);
                setShowTimePicker(false);
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
          </View>
        </View>
      </Modal>

      {/* Add Symptom Modal */}
      <Modal
        visible={showAddSymptomModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddSymptomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addSymptomModalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {
                setShowAddSymptomModal(false);
                setNewSymptomText('');
              }}>
                <Text style={styles.modalCancel}>Annulla</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Aggiungi Sintomo</Text>
              <TouchableOpacity onPress={handleAddCustomSymptom}>
                <Text style={[styles.modalDone, { opacity: newSymptomText.trim() ? 1 : 0.5 }]}>Salva</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.addSymptomContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nuovo sintomo</Text>
                <TextInput
                  style={styles.textInput}
                  value={newSymptomText}
                  onChangeText={setNewSymptomText}
                  placeholder="Inserisci il nome del sintomo..."
                  maxLength={50}
                  autoFocus={true}
                />
              </View>
              <View style={styles.iconPreview}>
                <View style={styles.previewIcon}>
                  <Ionicons name="add-circle" size={24} color="#8B7CF6" />
                </View>
                <Text style={styles.iconLabel}>Icona predefinita</Text>
              </View>
            </View>
          </View>
        </View>
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
    paddingTop: 50,
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
    marginBottom: 30,
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
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
  },
  symptomCardSelected: {
    backgroundColor: '#F0EFFF',
    borderColor: '#8B7CF6',
  },
  addSymptomCard: {
    width: '47%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '50%',
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
  addSymptomModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addSymptomContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  iconPreview: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  previewIcon: {
    marginBottom: 8,
  },
  iconLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});