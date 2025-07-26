import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, UserActivity } from '../services/AuthService';

interface ProfileScreenProps {
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  userActivities: UserActivity[];
  testCompleted: boolean;
  testResult: number | null;
  onRetakeTest: () => void;
  onResetOnboarding?: () => void;
}

export default function ProfileScreen({ onClose, user, onLogout, userActivities, testCompleted, testResult, onRetakeTest, onResetOnboarding }: ProfileScreenProps) {
  const [showSettings, setShowSettings] = useState(false);

  // Calcola il numero totale di attivazioni (ossessioni + compulsioni)
  const totalActivations = userActivities.length;
  
  // Gli esercizi sono una funzionalità futura, per ora mostriamo 0
  const totalExercises = 0;

  const renderSettings = () => {
    return (
      <Modal visible={showSettings} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.settingsTitle}>General Settings</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.settingsContent}>
            <View style={styles.settingsSection}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="notifications" size={20} color="#333" />
                  <Text style={styles.settingItemText}>Notifiche</Text>
                </View>
                <View style={[styles.toggle, styles.toggleActive]}>
                  <View style={[styles.toggleThumb, styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Text style={styles.settingItemText}>In-app vibration</Text>
                </View>
                <View style={styles.toggle}>
                  <View style={styles.toggleThumb} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="lock-closed" size={20} color="#333" />
                  <Text style={styles.settingItemText}>Password</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingItemText}>Open Sources used by ODEECY</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingItemText}>Piano di pagamento</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              {onResetOnboarding && (
                <TouchableOpacity style={styles.settingItem} onPress={onResetOnboarding}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="refresh" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Rifai Onboarding</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Sicurezza e privacy</Text>
            <View style={styles.settingsSection}>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingItemText}>Help Desk</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingItemText}>Sicurezza</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={onLogout}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="exit" size={20} color="#333" />
                  <Text style={styles.settingItemText}>Esci</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingItem, styles.deleteItem]}>
                <Text style={[styles.settingItemText, styles.deleteText]}>Cancella l'account</Text>
                <Ionicons name="chevron-forward" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>

            <Text style={styles.versionText}>Odeecy v1.0.0</Text>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Utente'}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalActivations}</Text>
          <Text style={styles.statLabel}>Attivazioni</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalExercises}</Text>
          <Text style={styles.statLabel}>Esercizi</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esercizi</Text>
          <View style={styles.exerciseCalendar}>
            {['Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom', 'Lun'].map((day, index) => (
              <View key={day} style={styles.calendarDay}>
                <View style={[styles.calendarDot, index === 6 && styles.calendarDotActive]} />
                <Text style={styles.calendarDayText}>{day}</Text>
                <Text style={styles.calendarDayNumber}>{10 + index}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.exerciseText}>Gli esercizi saranno disponibili presto</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Obiettivi settimanali</Text>
          <View style={styles.goalSection}>
            <Text style={styles.goalText}>1 di 3</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '33%' }]} />
            </View>
          </View>
          <Text style={styles.goalDescription}>
            Se esegui gli esercizi tre volte a settimana, i nostri dati dimostrano che ci sono miglioramenti tangibili.
          </Text>
        </View>

        {testCompleted && testResult !== null && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risultato Test DOC</Text>
            <View style={styles.testResultCard}>
              <View style={styles.testResultHeader}>
                <View style={styles.testScoreCircle}>
                  <Text style={styles.testScoreText}>{testResult}</Text>
                </View>
                <View style={styles.testResultInfo}>
                  <Text style={styles.testResultTitle}>Disturbo Ossessivo Compulsivo</Text>
                  <Text style={styles.testResultStatus}>PRESENTE</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.retakeButton} onPress={onRetakeTest}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.retakeButtonText}>Rifai il test</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {renderSettings()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B7CF6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  exerciseCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  calendarDay: {
    alignItems: 'center',
  },
  calendarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8E8E8',
    marginBottom: 8,
  },
  calendarDotActive: {
    backgroundColor: '#8B7CF6',
  },
  calendarDayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  calendarDayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  exerciseText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  goalSection: {
    marginBottom: 15,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B7CF6',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B7CF6',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Settings Modal Styles
  settingsContainer: {
    flex: 1,
    backgroundColor: '#8B7CF6',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    paddingHorizontal: 2,
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
  deleteItem: {
    backgroundColor: '#FFE8E8',
  },
  deleteText: {
    color: '#F44336',
    marginLeft: 0,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginTop: 20,
    marginBottom: 40,
  },
  // Test Result Styles
  testResultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  testScoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B7CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  testScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  testResultInfo: {
    flex: 1,
  },
  testResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  testResultStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B7CF6',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B7CF6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});