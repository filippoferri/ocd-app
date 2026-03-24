import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface TermsScreenProps {
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function TermsScreen({ onClose }: TermsScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termini e Condizioni</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Termini e Condizioni d'Uso</Text>
          <Text style={styles.date}>Ultimo aggiornamento: 24 Marzo 2026</Text>
          
          <Text style={styles.paragraph}>
            I presenti Termini e Condizioni (di seguito "Termini") disciplinano l’accesso e l’utilizzo dell’applicazione mobile <Text style={{fontWeight: 'bold'}}>Doc Relief</Text> (di seguito "App"), di proprietà di <Text style={{fontWeight: 'bold'}}>Filippo Ferri</Text>, con sede legale in <Text style={{fontWeight: 'bold'}}>Corso Vittorio Emanuele II 198</Text>, P.IVA/CF <Text style={{fontWeight: 'bold'}}>02341330419</Text> (di seguito "Titolare").
          </Text>
          <Text style={styles.paragraph}>
            L’utente, scaricando, installando o utilizzando l’App, dichiara di aver letto, compreso e accettato integralmente i presenti Termini.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>1. NATURA DEL SERVIZIO E DISCLAIMER MEDICO</Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>1.1. Scopo Informativo:</Text> L'App fornisce strumenti di auto-aiuto, tecniche di mindfulness, monitoraggio dei sintomi e percorsi educativi volti ad alleviare i disagi legati al Disturbo Ossessivo-Compulsivo (DOC).
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>1.2. Assenza di Parere Medico:</Text> Doc Relief <Text style={{fontWeight: 'bold'}}>non è un dispositivo medico</Text>. I contenuti dell’App non costituiscono, né sostituiscono, una diagnosi medica, una psicoterapia o una consulenza psichiatrica.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>1.3. Limitazione di Responsabilità:</Text> L'utente riconosce che l'uso dell'App non stabilisce un rapporto medico-paziente. Il Titolare non è responsabile per decisioni cliniche o terapeutiche prese dall'utente sulla base delle informazioni contenute nell'App.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>1.4. Situazioni di Emergenza:</Text> In caso di pensieri autolesionistici, crisi d'ansia acute o emergenze psichiatriche, l'utente è istruito a non fare affidamento sull'App e a contattare immediatamente i numeri di emergenza nazionali (es. 112/118) o il proprio medico curante.
          </Text>

          <Text style={styles.sectionTitle}>2. REQUISITI DI ETÀ E CAPACITÀ</Text>
          <Text style={styles.paragraph}>
            2.1. L’App è destinata a utenti che abbiano compiuto <Text style={{fontWeight: 'bold'}}>18 anni</Text>. Gli utenti di età compresa tra i 14 e i 17 anni possono utilizzare l'App solo sotto la supervisione e con il consenso dei genitori o dei tutori legali.
          </Text>

          <Text style={styles.sectionTitle}>3. REGISTRAZIONE E ACCOUNT</Text>
          <Text style={styles.paragraph}>
            3.1. Per accedere ad alcune funzionalità, l'utente deve creare un account fornendo dati veritieri e completi.
          </Text>
          <Text style={styles.paragraph}>
            3.2. L'utente è l’unico responsabile della riservatezza delle proprie credenziali di accesso.
          </Text>

          <Text style={styles.sectionTitle}>4. SERVIZI A PAGAMENTO E ABBONAMENTI</Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>4.1. Modello Freemium:</Text> L'App può offrire contenuti gratuiti e contenuti "Premium" accessibili tramite abbonamento ricorrente o acquisto una tantum.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>4.2. Gestione Pagamenti:</Text> Gli acquisti sono gestiti tramite gli store digitali (Apple App Store o Google Play Store). I termini di pagamento e fatturazione sono soggetti alle condizioni di tali store.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{fontWeight: 'bold'}}>4.3. Diritto di Recesso:</Text> Ai sensi dell'art. 59 del Codice del Consumo (D.Lgs. 206/2005), l'utente accetta che, iniziando la fruizione dei contenuti digitali non forniti su supporto materiale, perde il diritto di recesso di 14 giorni.
          </Text>

          <Text style={styles.sectionTitle}>5. PROTEZIONE DEI DATI PERSONALI (GDPR)</Text>
          <Text style={styles.paragraph}>
            5.1. Il trattamento dei dati personali, inclusi i dati relativi alla salute inseriti volontariamente dall'utente avviene in conformità al <Text style={{fontWeight: 'bold'}}>Regolamento UE 2016/679 (GDPR)</Text>.
          </Text>
          <Text style={styles.paragraph}>
            5.2. Per i dettagli sul trattamento, la conservazione e i diritti dell'interessato, si rimanda alla Privacy Policy.
          </Text>

          <Text style={styles.sectionTitle}>6. REGOLE DI CONDOTTA E COMMUNITY</Text>
          <Text style={styles.paragraph}>
            6.1. Se l'App consente l'interazione tra utenti, è severamente vietato:
            {"\n"}• Pubblicare contenuti offensivi, discriminatori o illegali.
            {"\n"}• Condividere descrizioni grafiche di ossessioni o compulsioni che possano fungere da "trigger" per altri utenti.
            {"\n"}• Fornire consigli medici non qualificati ad altri membri.
          </Text>
          <Text style={styles.paragraph}>
            6.2. Il Titolare si riserva il diritto di sospendere l’account dell’utente in caso di violazione delle presenti regole.
          </Text>

          <Text style={styles.sectionTitle}>7. PROPRIETÀ INTELLETTUALE</Text>
          <Text style={styles.paragraph}>
            7.1. Tutti i contenuti (testi, audio, video, loghi, algoritmi) sono di proprietà esclusiva del Titolare o dei suoi licenziatari e sono protetti dalle leggi sul diritto d'autore. È vietata la riproduzione o distribuzione non autorizzata.
          </Text>

          <Text style={styles.sectionTitle}>8. LIMITAZIONE DI GARANZIA</Text>
          <Text style={styles.paragraph}>
            8.1. L’App viene fornita "così com’è" e "secondo disponibilità". Il Titolare non garantisce che l’uso dell’App porti a risultati specifici di guarigione o miglioramento clinico dei disturbi ossessivo-compulsivi.
          </Text>

          <Text style={styles.sectionTitle}>9. MODIFICHE AI TERMINI</Text>
          <Text style={styles.paragraph}>
            9.1. Il Titolare si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Gli utenti saranno informati tramite notifica in-app o email. L'uso continuato dell'App costituirà accettazione delle modifiche.
          </Text>

          <Text style={styles.sectionTitle}>10. LEGGE APPLICABILE E FORO COMPETENTE</Text>
          <Text style={styles.paragraph}>
            10.1. I presenti Termini sono regolati dalla <Text style={{fontWeight: 'bold'}}>legge italiana</Text>.
          </Text>
          <Text style={styles.paragraph}>
            10.2. Per ogni controversia derivante dall'interpretazione o esecuzione dei presenti Termini, sarà competente il Foro di residenza o domicilio dell'utente, se consumatore ai sensi del Codice del Consumo.
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
