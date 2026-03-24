import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface PolicyScreenProps {
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function PolicyScreen({ onClose }: PolicyScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Informativa sulla Privacy</Text>
          <Text style={styles.date}>Ultimo aggiornamento: 24 Marzo 2026</Text>
          
          <Text style={styles.paragraph}>
            La presente Informativa descrive come <Text style={{fontWeight: 'bold'}}>Filippo Ferri</Text> ("noi", "nostro" o il "Titolare") raccoglie, utilizza e protegge i dati personali degli utenti ("utente" o "tu") attraverso l'applicazione <Text style={{fontWeight: 'bold'}}>Doc Relief</Text>.
          </Text>
          <Text style={styles.paragraph}>
            Il trattamento dei dati avviene nel pieno rispetto del <Text style={{fontWeight: 'bold'}}>Regolamento UE 2016/679 (GDPR)</Text> e del D.Lgs. 196/2003 (Codice Privacy).
          </Text>

          <View style={[styles.divider, { height: 1, backgroundColor: '#EEE', marginVertical: 20 }]} />

          <Text style={styles.sectionTitle}>1. TITOLARE DEL TRATTAMENTO E DPO</Text>
          <Text style={styles.paragraph}>
            Il Titolare del trattamento è <Text style={{fontWeight: 'bold'}}>Filippo Ferri</Text>, con sede in <Text style={{fontWeight: 'bold'}}>Corso Vittorio Emanuele II 198 (Pesaro)</Text>. 
            {"\n"}Email di contatto: <Text style={{fontWeight: 'bold'}}>filippo.ferri@example.com</Text> (inserire email definitiva).
          </Text>

          <Text style={styles.sectionTitle}>2. TIPOLOGIA DI DATI RACCOLTI</Text>
          <Text style={styles.paragraph}>
            Raccogliamo i seguenti dati:
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Dati Identificativi:</Text> Nome, email, data di nascita (per verifica età).
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Dati sull'Utilizzo:</Text> Log di accesso, tempo trascorso sull'app, funzionalità preferite.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Dati Particolari (Dati sulla Salute):</Text> Informazioni inserite volontariamente dall'utente riguardanti i sintomi del DOC, diari delle ossessioni, registrazioni di compulsioni, livelli di ansia e progressi nei percorsi di esposizione (ERP).
          </Text>

          <Text style={styles.sectionTitle}>3. BASE GIURIDICA DEL TRATTAMENTO</Text>
          <Text style={styles.paragraph}>
            • <Text style={{fontWeight: 'bold'}}>Esecuzione del Contratto:</Text> Per fornirti i servizi dell'App.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Consenso Esplicito:</Text> Per il trattamento dei <Text style={{fontWeight: 'bold'}}>dati sulla salute</Text> (Art. 9 GDPR). Senza il tuo consenso esplicito, non potremo analizzare o memorizzare i tuoi progressi terapeutici.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Legittimo Interesse:</Text> Per migliorare la sicurezza dell'App e prevenire frodi.
          </Text>

          <Text style={styles.sectionTitle}>4. FINALITÀ DEL TRATTAMENTO</Text>
          <Text style={styles.paragraph}>
            I dati sono trattati per:
            {"\n"}1. Fornire percorsi personalizzati per la gestione del DOC.
            {"\n"}2. Monitorare i progressi dell'utente nel tempo.
            {"\n"}3. Inviare notifiche push (promemoria per esercizi).
            {"\n"}4. Analisi statistica aggregata e anonima per migliorare l'efficacia dell'App.
          </Text>

          <Text style={styles.sectionTitle}>5. CONSERVAZIONE E SICUREZZA 🔒</Text>
          <Text style={styles.paragraph}>
            • <Text style={{fontWeight: 'bold'}}>Crittografia:</Text> Tutti i dati sulla salute sono protetti da protocolli di crittografia avanzata (AES-256) sia in transito che a riposo.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Localizzazione:</Text> I dati sono conservati su server sicuri situati all'interno dello Spazio Economico Europeo (SEE).
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Periodo di conservazione:</Text> I dati saranno conservati per la durata dell'account. In caso di inattività prolungata o richiesta di cancellazione, i dati saranno eliminati in modo irreversibile.
          </Text>

          <Text style={styles.sectionTitle}>6. CONDIVISIONE DEI DATI</Text>
          <Text style={styles.paragraph}>
            Non vendiamo i tuoi dati a terzi. Condividiamo i dati solo con:
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Fornitori tecnici:</Text> (Es. hosting Supabase) vincolati da contratti di nomina a Responsabili del Trattamento.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Store di Applicazioni:</Text> Apple e Google per la gestione degli abbonamenti.
          </Text>

          <Text style={styles.sectionTitle}>7. DIRITTI DELL'INTERESSATO</Text>
          <Text style={styles.paragraph}>
            Ai sensi del GDPR, hai il diritto di:
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Accedere</Text> ai tuoi dati.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Rettificare</Text> dati inesatti.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Cancellare</Text> i tuoi dati ("Diritto all'oblio").
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Revocare il consenso</Text> in qualsiasi momento.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Portabilità:</Text> Esportare i tuoi dati.
            {"\n"}• <Text style={{fontWeight: 'bold'}}>Reclamo:</Text> Proporre reclamo al Garante Privacy.
          </Text>

          <Text style={styles.sectionTitle}>8. MODIFICHE ALLA POLICY</Text>
          <Text style={styles.paragraph}>
            Ci riserviamo il diritto di aggiornare questa informativa. In caso di modifiche sostanziali richiederemo nuovamente il tuo consenso esplicito al primo accesso utile.
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
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B7CF6',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 20,
  },
});
