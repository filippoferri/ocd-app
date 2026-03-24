import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Dimensions, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface AccountScreenProps {
  onClose: () => void;
  onLogout: () => void;
  userEmail?: string;
  provider?: string;
}

const { width } = Dimensions.get('window');

export default function AccountScreen({ onClose, onLogout, userEmail = "utente@esempio.com", provider }: AccountScreenProps) {
  const insets = useSafeAreaInsets();
  const isGoogleAccount = provider === 'google';
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(isGoogleAccount);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showEmailLinking, setShowEmailLinking] = useState(false);
  
  // Stati per il form
  const [linkEmail, setLinkEmail] = useState(userEmail);
  const [linkPassword, setLinkPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Simulazione stato collegamento email (solo se il provider primario è email)
  const [isEmailLinked, setIsEmailLinked] = useState(provider === 'email');

  const handleToggleGoogle = () => {
    if (isGoogleAccount && isGoogleEnabled && !isEmailLinked) {
      Alert.alert(
        "Attenzione", 
        "Google è il tuo unico metodo di accesso. Collega prima un'email e una password per poterlo scollegare."
      );
      return;
    }

    const action = isGoogleEnabled ? "scollegare" : "collegare";
    Alert.alert(
      "Gestione Account",
      `Vuoi ${action} il tuo account Google?`,
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: isGoogleEnabled ? "Scollega" : "Collega", 
          onPress: () => setIsGoogleEnabled(!isGoogleEnabled) 
        }
      ]
    );
  };

  const handleLinkEmail = () => {
    if (!linkEmail || !linkPassword) {
      Alert.alert("Errore", "Email e password sono obbligatorie.");
      return;
    }
    // Simulazione collegamento
    Alert.alert("Successo", "Email collegata correttamente! Ora puoi accedere anche con queste credenziali.");
    setIsEmailLinked(true);
    setShowEmailLinking(false);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Errore", "Tutti i campi sono obbligatori.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Errore", "Le nuove password non coincidono.");
      return;
    }
    
    // Simulazione successo
    Alert.alert("Successo", "Password aggiornata correttamente!");
    setShowPasswordChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connessioni Account</Text>
          
          {/* Google Connection Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Google</Text>
                <Text style={styles.cardSubtitle}>
                  {isGoogleEnabled ? "Collegato" : "Non collegato"}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.toggle, isGoogleEnabled && styles.toggleActive]}
                onPress={handleToggleGoogle}
              >
                <View style={[styles.toggleThumb, isGoogleEnabled && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Email Connection Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={24} color="#8B7CF6" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Email</Text>
                <Text style={styles.cardSubtitle}>
                  {isEmailLinked ? userEmail : "Non collegata"}
                </Text>
              </View>
              {isEmailLinked ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.verifiedText}>Verificata</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={() => setShowEmailLinking(!showEmailLinking)}
                >
                  <Text style={styles.linkButtonText}>Collega</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Email Linking Form */}
            {showEmailLinking && (
              <View style={styles.linkingForm}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="La tua email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={linkEmail}
                  onChangeText={setLinkEmail}
                />
                
                <Text style={styles.formLabel}>Imposta Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Minimo 8 caratteri"
                  value={linkPassword}
                  onChangeText={setLinkPassword}
                />

                <View style={styles.formActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowEmailLinking(false)}
                  >
                    <Text style={styles.cancelButtonText}>Annulla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleLinkEmail}
                  >
                    <Text style={styles.saveButtonText}>Conferma</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Mostra la sezione Sicurezza SOLO se l'email è collegata */}
        {isEmailLinked && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sicurezza</Text>
            
            {!showPasswordChange ? (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => setShowPasswordChange(true)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="key" size={24} color="#8B7CF6" />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>Cambia Password</Text>
                    <Text style={styles.cardSubtitle}>Ultima modifica: 3 mesi fa</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.card}>
                <Text style={styles.formLabel}>Password attuale</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Inserisci password attuale"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                
                <Text style={styles.formLabel}>Nuova password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Minimo 8 caratteri"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                
                <Text style={styles.formLabel}>Conferma nuova password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Ripeti la nuova password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                <View style={styles.formActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowPasswordChange(false)}
                  >
                    <Text style={styles.cancelButtonText}>Annulla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleChangePassword}
                  >
                    <Text style={styles.saveButtonText}>Aggiorna</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Logout Button */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <TouchableOpacity 
            style={[styles.card, styles.logoutCard]} 
            onPress={() => {
              Alert.alert(
                "Esci",
                "Sei sicuro di voler uscire?",
                [
                  { text: "Annulla", style: "cancel" },
                  { text: "Esci", style: "destructive", onPress: onLogout }
                ]
              );
            }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF0F0' }]}>
                <Ionicons name="exit-outline" size={24} color="#FF4444" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: '#FF4444' }]}>Esci dall'account</Text>
                <Text style={styles.cardSubtitle}>Tornerai alla schermata di login</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFCCCC" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerInfo}>
          <Ionicons name="information-circle-outline" size={20} color="#999" />
          <Text style={styles.footerText}>
            Puoi utilizzare sia Google che la tua Email per accedere al tuo account.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#8B7CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
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
  linkButton: {
    backgroundColor: '#F0EFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkButtonText: {
    fontSize: 13,
    color: '#8B7CF6',
    fontWeight: 'bold',
  },
  linkingForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  formLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  logoutCard: {
    borderColor: 'rgba(255, 68, 68, 0.1)',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    paddingHorizontal: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});
