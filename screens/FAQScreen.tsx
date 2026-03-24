import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface FAQScreenProps {
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const faqs = [
  {
    question: "Quali sono le ossessioni e compulsioni più comuni?",
    answer: "Ossessioni: paura di contaminazione, di far del male, necessità di simmetria o pensieri intrusivi violenti/sessuali.\n\nCompulsioni: lavaggio eccessivo, controllo di serrature o elettrodomestici, rituali mentali e ripetizione di azioni finché non sembrano \"giuste\"."
  },
  {
    question: "Cosa causa il DOC?",
    answer: "Sebbene la causa esatta sia sconosciuta, probabilmente deriva da una combinazione di fattori genetici, anomalie cerebrali e fattori ambientali. Non è causato solo da azioni o pensieri."
  },
  {
    question: "Il DOC è curabile?",
    answer: "Sì. Il trattamento più efficace è spesso una forma di terapia cognitivo-comportamentale chiamata Esposizione e Prevenzione della Risposta (ERP), a volte combinata con farmaci."
  },
  {
    question: "Esiste il DOC \"Pure O\"?",
    answer: "\"Pure O\" si riferisce a un DOC caratterizzato da pensieri puramente ossessivi senza compulsioni fisiche evidenti. Tuttavia, le persone con \"Pure O\" eseguono comunque rituali o compulsioni mentali."
  },
  {
    question: "Qual è la differenza tra perfezionismo e DOC?",
    answer: "Il DOC è debilitante, causa ansia grave e interferisce con la vita quotidiana, mentre il perfezionismo è generalmente un tratto della personalità."
  },
  {
    question: "Si può guarire dal DOC?",
    answer: "Mentre alcuni considerano i propri sintomi curati dopo un trattamento di successo, la maggior parte degli esperti lo vede come una condizione gestibile in cui la terapia e/o i farmaci riducono o eliminano significativamente l'impatto dei sintomi."
  }
];

export default function FAQScreen({ onClose }: FAQScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Domande Comuni (FAQs)</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.mainTitle}>Tutto quello che c'è da sapere sul DOC</Text>
        
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}

        <Text style={styles.disclaimer}>
          Nota: Queste informazioni hanno scopo puramente informativo e non sostituiscono il parere di un professionista sanitario.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#8B7CF6',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  question: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B7CF6',
    marginBottom: 10,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },
  disclaimer: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});
