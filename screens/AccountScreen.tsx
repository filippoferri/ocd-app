import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, TextInput, Dimensions, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../config/Theme';
import { Image } from 'react-native';
import AvatarPicker, { PREDEFINED_AVATARS } from '../components/AvatarPicker';
import SlideModal from '../components/SlideModal';
import AuthService from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';

interface AccountScreenProps {
  onClose: () => void;
  onLogout: () => void;
  userEmail?: string;
  provider?: string;
  avatarUrl?: string;
}

export default function AccountScreen({ onClose, onLogout, userEmail = "utente@esempio.com", provider, avatarUrl }: AccountScreenProps) {
  const insets = useSafeAreaInsets();
  const { currentUser, handleUpdateAvatar } = useAuth();
  const isGoogleAccount = provider === 'google';
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(isGoogleAccount);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showEmailLinking, setShowEmailLinking] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
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

  const handleAvatarSelect = async (avatarId: string) => {
    try {
      await handleUpdateAvatar(avatarId);
      setShowAvatarPicker(false);
      Alert.alert("Successo", "Immagine profilo aggiornata!");
    } catch (e) {
      Alert.alert("Errore", "Impossibile aggiornare l'avatar.");
    }
  };

  const renderAvatar = () => {
    const avatarToRender = currentUser?.avatar_url || avatarUrl;
    const predefinedAvatar = PREDEFINED_AVATARS.find(a => a.id === avatarToRender);
    if (predefinedAvatar) {
      return <Image source={predefinedAvatar.source} style={styles.avatarImage} />;
    }

    if (avatarToRender) {
      return <Image source={{ uri: avatarToRender }} style={styles.avatarImage} />;
    }

    return (
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={32} color={Colors.secondary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Immagine Profilo</Text>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => setShowAvatarPicker(true)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.avatarIconContainer}>
                {renderAvatar()}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Cambia Avatar</Text>
                <Text style={styles.cardSubtitle}>Scegli tra le illustrazioni Calm Tech</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.border} />
            </View>
          </TouchableOpacity>
        </View>

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
                <Ionicons name="mail" size={24} color={Colors.accent} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Email</Text>
                <Text style={styles.cardSubtitle}>
                  {isEmailLinked ? userEmail : "Non collegata"}
                </Text>
              </View>
              {isEmailLinked ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
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
                  placeholderTextColor={Colors.secondary}
                />
                
                <Text style={styles.formLabel}>Imposta Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Minimo 8 caratteri"
                  value={linkPassword}
                  onChangeText={setLinkPassword}
                  placeholderTextColor={Colors.secondary}
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
                    <Ionicons name="key" size={24} color={Colors.accent} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>Cambia Password</Text>
                    <Text style={styles.cardSubtitle}>Ultima modifica: 3 mesi fa</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.border} />
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
                  placeholderTextColor={Colors.secondary}
                />
                
                <Text style={styles.formLabel}>Nuova password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Minimo 8 caratteri"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor={Colors.secondary}
                />
                
                <Text style={styles.formLabel}>Conferma nuova password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Ripeti la nuova password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor={Colors.secondary}
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
              const handleConfirmLogout = () => {
                console.log('🚪 [AccountScreen] Logout confermato');
                onLogout();
              };

              if (Platform.OS === 'web') {
                if (window.confirm("Sei sicuro di voler uscire?")) {
                  handleConfirmLogout();
                }
              } else {
                Alert.alert(
                  "Esci",
                  "Sei sicuro di voler uscire?",
                  [
                    { text: "Annulla", style: "cancel" },
                    { text: "Esci", style: "destructive", onPress: handleConfirmLogout }
                  ]
                );
              }
            }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF5F5' }]}>
                <Ionicons name="exit-outline" size={24} color={Colors.danger} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: Colors.danger }]}>Esci dall'account</Text>
                <Text style={styles.cardSubtitle}>Tornerai alla schermata di login</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FED7D7" />
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

      {/* Avatar Picker Bottom Sheet (Native Modal style) */}
      <Modal 
        visible={showAvatarPicker} 
        transparent 
        animationType="fade"
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowAvatarPicker(false)} 
          />
          <SlideModal
            visible={showAvatarPicker}
            onClose={() => setShowAvatarPicker(false)}
            direction="vertical"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.bottomSheetContainer}>
                <AvatarPicker 
                  onSelect={handleAvatarSelect}
                  onClose={() => setShowAvatarPicker(false)}
                  currentAvatarId={currentUser?.avatar_url || avatarUrl}
                />
              </View>
              <View style={styles.modalBottomSpacer} />
            </View>
          </SlideModal>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  modalBottomSpacer: {
    height: 0,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...Shadow.medium,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onPrimary,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0140',
    marginBottom: Spacing.md,
    marginLeft: 4,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.light,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0140',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: '500',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
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
  linkButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  linkButtonText: {
    fontSize: 14,
    color: '#0D0140',
    fontWeight: '700',
  },
  linkingForm: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '700',
    marginLeft: 4,
  },
  formLabel: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0D0140',
    fontWeight: '500',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.secondary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    ...Shadow.medium,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.onPrimary,
    fontWeight: '700',
  },
  logoutCard: {
    borderColor: 'rgba(229, 62, 62, 0.2)',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: -8,
    paddingHorizontal: Spacing.sm,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 13,
    color: Colors.secondary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  avatarIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 56,
    height: 56,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
