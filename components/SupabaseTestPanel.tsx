// Componente per testare l'integrazione Supabase direttamente nell'app
// Utile durante lo sviluppo per verificare che tutto funzioni

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';
import { runSupabaseTests, validateSupabaseConfig, debugSupabaseService } from '../tests/supabase-test';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

const SupabaseTestPanel: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<{
    supabaseCount: number;
    localCount: number;
    supabaseAvailable: boolean;
  } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await ExerciseServiceAdapter.getDataSourceStats();
      setStats(statsData);
    } catch (error) {
      console.error('Errore nel caricamento statistiche:', error);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    const testResults: TestResult[] = [];

    // Test 1: Validazione configurazione
    try {
      const isValid = validateSupabaseConfig();
      testResults.push({
        name: 'Configurazione',
        status: isValid ? 'success' : 'error',
        message: isValid ? 'Configurazione valida' : 'Configurazione mancante o non valida',
        details: isValid ? 'URL e chiave Supabase configurati correttamente' : 'Controlla il file .env'
      });
    } catch (error) {
      testResults.push({
        name: 'Configurazione',
        status: 'error',
        message: 'Errore nella validazione',
        details: String(error)
      });
    }

    setTests([...testResults]);

    // Test 2: Connessione
    try {
      const isConnected = await ExerciseServiceAdapter.testSupabaseConnection();
      testResults.push({
        name: 'Connessione',
        status: isConnected ? 'success' : 'error',
        message: isConnected ? 'Connessione riuscita' : 'Connessione fallita',
        details: isConnected ? 'Supabase è raggiungibile' : 'Verifica URL e chiave'
      });
    } catch (error) {
      testResults.push({
        name: 'Connessione',
        status: 'error',
        message: 'Errore di connessione',
        details: String(error)
      });
    }

    setTests([...testResults]);

    // Test 3: Caricamento esercizi
    try {
      ExerciseServiceAdapter.setDataSource('supabase');
      const exercises = await ExerciseServiceAdapter.getAllExercises();
      testResults.push({
        name: 'Caricamento Esercizi',
        status: exercises.length > 0 ? 'success' : 'error',
        message: `${exercises.length} esercizi caricati`,
        details: exercises.length > 0 ? 'Esercizi disponibili su Supabase' : 'Nessun esercizio trovato'
      });
    } catch (error) {
      testResults.push({
        name: 'Caricamento Esercizi',
        status: 'error',
        message: 'Errore nel caricamento',
        details: String(error)
      });
    }

    setTests([...testResults]);

    // Test 4: Adapter Hybrid
    try {
      ExerciseServiceAdapter.setDataSource('hybrid');
      const exercises = await ExerciseServiceAdapter.getAllExercises();
      testResults.push({
        name: 'Modalità Hybrid',
        status: exercises.length > 0 ? 'success' : 'error',
        message: `${exercises.length} esercizi in modalità hybrid`,
        details: 'Adapter funziona correttamente'
      });
    } catch (error) {
      testResults.push({
        name: 'Modalità Hybrid',
        status: 'error',
        message: 'Errore in modalità hybrid',
        details: String(error)
      });
    }

    setTests([...testResults]);
    setIsRunning(false);
    await loadStats();
  };

  const showMigrationInfo = () => {
    Alert.alert(
      'Migrazione Dati',
      'La migrazione copia gli esercizi locali su Supabase. Assicurati di aver configurato correttamente Supabase prima di procedere.',
      [
        { text: 'Annulla', style: 'cancel' },
        { text: 'Procedi', onPress: runMigration }
      ]
    );
  };

  const runMigration = async () => {
    try {
      setIsRunning(true);
      const result = await ExerciseServiceAdapter.migrateLocalToSupabase();
      
      Alert.alert(
        'Migrazione Completata',
        `Migrati: ${result.migrated} esercizi\nErrori: ${result.errors.length}`,
        [{ text: 'OK', onPress: () => loadStats() }]
      );
    } catch (error) {
      Alert.alert('Errore Migrazione', String(error));
    } finally {
      setIsRunning(false);
    }
  };

  const showDebugInfo = () => {
    debugSupabaseService();
    Alert.alert(
      'Debug Info',
      'Informazioni di debug stampate nella console. Apri gli strumenti di sviluppo per visualizzarle.'
    );
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '#34C759';
      case 'error': return '#FF3B30';
      case 'pending': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Test Supabase</Text>
          <Text style={styles.subtitle}>Verifica l'integrazione con Supabase</Text>
        </View>

        {/* Statistiche */}
        {stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Statistiche</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Esercizi Locali:</Text>
              <Text style={styles.statValue}>{stats.localCount}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Esercizi Supabase:</Text>
              <Text style={styles.statValue}>{stats.supabaseCount}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Supabase Disponibile:</Text>
              <Text style={[styles.statValue, { color: stats.supabaseAvailable ? '#34C759' : '#FF3B30' }]}>
                {stats.supabaseAvailable ? 'Sì' : 'No'}
              </Text>
            </View>
          </View>
        )}

        {/* Pulsanti di azione */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={runAllTests}
            disabled={isRunning}
          >
            {isRunning ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Esegui Test</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={showMigrationInfo}
            disabled={isRunning}
          >
            <Text style={styles.secondaryButtonText}>Migra Dati</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={showDebugInfo}
          >
            <Text style={styles.secondaryButtonText}>Debug Info</Text>
          </TouchableOpacity>
        </View>

        {/* Risultati test */}
        {tests.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Risultati Test</Text>
            {tests.map((test, index) => (
              <View key={index} style={styles.testResult}>
                <View style={styles.testHeader}>
                  <Text style={styles.testIcon}>{getStatusIcon(test.status)}</Text>
                  <Text style={styles.testName}>{test.name}</Text>
                </View>
                <Text style={[styles.testMessage, { color: getStatusColor(test.status) }]}>
                  {test.message}
                </Text>
                {test.details && (
                  <Text style={styles.testDetails}>{test.details}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Istruzioni */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Istruzioni</Text>
          <Text style={styles.instructionText}>
            1. Configura Supabase seguendo SUPABASE_SETUP.md{"\n"}
            2. Crea il file .env con le credenziali{"\n"}
            3. Esegui i test per verificare la connessione{"\n"}
            4. Migra i dati quando tutto funziona
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  statsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#666666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  actionsContainer: {
    margin: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  testResult: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  testIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  testMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  testDetails: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  instructionsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default SupabaseTestPanel;