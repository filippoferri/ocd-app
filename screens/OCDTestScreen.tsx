import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { G, Path, ClipPath, Rect, Defs } from 'react-native-svg';

interface OCDTestScreenProps {
  onBack: () => void;
  onTestComplete: (score: number) => void;
}

interface Question {
  id: number;
  text: string;
}

const questions: Question[] = [
  { id: 1, text: "Ho pensieri indesiderati che mi disturbano" },
  { id: 2, text: "Controllo ripetutamente le cose (porte, finestre, gas)" },
  { id: 3, text: "Ho paura di contaminazione o sporcizia" },
  { id: 4, text: "Mi lavo le mani più del necessario" },
  { id: 5, text: "Conto oggetti o ripeto azioni un numero specifico di volte" },
  { id: 6, text: "Ho bisogno che le cose siano in ordine perfetto" },
  { id: 7, text: "Ho pensieri di fare del male a qualcuno" },
  { id: 8, text: "Evito certi luoghi o situazioni per paura" },
  { id: 9, text: "Ripeto parole o frasi nella mia mente" },
  { id: 10, text: "Ho difficoltà a buttare via oggetti inutili" },
  { id: 11, text: "Controllo ripetutamente il mio aspetto" },
  { id: 12, text: "Ho paura di dimenticare qualcosa di importante" },
  { id: 13, text: "Rifaccio le cose fino a quando non mi sembrano 'giuste'" },
  { id: 14, text: "Ho pensieri blasfemi o inappropriati" },
  { id: 15, text: "Organizzo e riorganizzo continuamente le mie cose" },
  { id: 16, text: "Ho paura di perdere il controllo" },
  { id: 17, text: "Cerco rassicurazioni dagli altri ripetutamente" },
  { id: 18, text: "Ho rituali mentali che devo completare" },
  { id: 19, text: "Evito di toccare certe superfici o oggetti" },
  { id: 20, text: "Ho pensieri ricorrenti su malattie o morte" },
  { id: 21, text: "Devo fare le cose in un ordine specifico" },
  { id: 22, text: "Ho paura di aver fatto qualcosa di sbagliato" },
  { id: 23, text: "Ripeto azioni per prevenire qualcosa di brutto" },
  { id: 24, text: "Ho difficoltà a prendere decisioni" },
  { id: 25, text: "I miei pensieri o comportamenti interferiscono con la vita quotidiana" }
];

type AnswerValue = 0 | 5 | 10;

export default function OCDTestScreen({ onBack, onTestComplete }: OCDTestScreenProps) {
  const [answers, setAnswers] = useState<{ [key: number]: AnswerValue }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const handleAnswer = (questionId: number, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    const rawScore = Object.values(answers).reduce((sum, value) => sum + value, 0 as number);
    const percentage = Math.round((rawScore / 250) * 100);
    setTotalScore(percentage);
    setShowLoading(true);
    
    // Mostra loading per 3 secondi poi i risultati
    setTimeout(() => {
      setShowLoading(false);
      setShowResult(true);
    }, 3000);
  };

  const getResultMessage = (score: number) => {
    if (score >= 32) {
      return {
        title: "Abbiamo creato il tuo piano d'azione. Sei pronto ad iniziare?",
        message: "Stiamo analizzando i risultati del test...",
        subMessage: "Solo un po' di pazienza... Stiamo elaborando le tue risposte",
        color: "#8B7CF6",
        buttonText: "SONO PRONTO"
      };
    } else if (score >= 20) {
      return {
        title: "Abbiamo creato il tuo piano d'azione. Sei pronto ad iniziare?",
        message: "Stiamo analizzando i risultati del test...",
        subMessage: "Solo un po' di pazienza... Stiamo elaborando le tue risposte",
        color: "#8B7CF6",
        buttonText: "SONO PRONTO"
      };
    } else {
      return {
        title: "Abbiamo creato il tuo piano d'azione. Sei pronto ad iniziare?",
        message: "Stiamo analizzando i risultati del test...",
        subMessage: "Solo un po' di pazienza... Stiamo elaborando le tue risposte",
        color: "#8B7CF6",
        buttonText: "SONO PRONTO"
      };
    }
  };

  const resetTest = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResult(false);
    setShowLoading(false);
    setTotalScore(0);
  };

  if (showLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>Stiamo analizzando i risultati del test...</Text>
          <Text style={styles.loadingSubtitle}>Solo un po' di pazienza... Stiamo elaborando le tue risposte</Text>
          
          <View style={styles.loadingIconContainer}>
            <View style={styles.clipboard}>
              <View style={styles.clipboardTop} />
              <View style={styles.clipboardBody}>
                <View style={styles.checkmark1}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.line1} />
                <View style={styles.checkmark2}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.line2} />
                <View style={styles.checkmark3}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.line3} />
                <View style={styles.checkmark4}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.line4} />
              </View>
            </View>
            <View style={styles.pencil}>
              <View style={styles.pencilTip} />
              <View style={styles.pencilBody} />
              <View style={styles.pencilEnd} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (showResult) {
    const result = getResultMessage(totalScore);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Risultato Test</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.content, { backgroundColor: '#8B7CF6' }]}>
          <View style={[styles.resultCard, { borderColor: result.color, backgroundColor: '#8B7CF6' }]}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultHeaderText}>Questo è il tuo risultato:</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Svg width={200} height={200} viewBox="0 0 247 241" style={styles.svgBackground}>
                <Defs>
                  <ClipPath id="clip0_157_11949">
                    <Rect width="247" height="241" fill="white"/>
                  </ClipPath>
                </Defs>
                <G clipPath="url(#clip0_157_11949)">
                  <Path d="M61.5553 16.9655C0.771564 53.7427 -22.3446 144.259 26.102 200.707C63.0845 243.962 124.115 252.047 176.209 226.596C275.889 177.896 272.183 25.9196 152.86 2.47987C121.38 -3.7051 85.8139 1.88324 61.5553 16.9655Z" fill="#B8B8FF"/>
                  <Path d="M50.7825 55.7889C2.03544 108.508 20.081 200.549 97.55 214.45C158.266 225.345 214.117 182.561 222.073 129.559C224.24 96.9257 212.999 62.8075 185.088 41.7564C164.835 26.4883 138.883 20.8274 116.975 22.9955C90.814 25.5817 68.3731 36.1119 50.7825 55.7889Z" fill="#9381FF"/>
                </G>
              </Svg>
              <Text style={styles.scoreText}>{totalScore}</Text>
            </View>
            
            <Text style={styles.disorderText}>Disturbo Ossessivo Compulsivo</Text>
            <Text style={styles.statusText}>PRESENTE</Text>
            
            <Text style={styles.resultTitle}>
              {result.title}
            </Text>
            
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: '#FF8C00' }]} 
              onPress={() => onTestComplete(totalScore)}
            >
              <Text style={styles.primaryButtonText}>{result.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test DOC</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} di {questions.length}
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Domanda {currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{question.text}</Text>

          <View style={styles.answersContainer}>
            <TouchableOpacity
              style={[
                styles.answerButton,
                currentAnswer === 0 && styles.selectedAnswer
              ]}
              onPress={() => handleAnswer(question.id, 0)}
            >
              <Text style={[
                styles.answerText,
                currentAnswer === 0 && styles.selectedAnswerText
              ]}>
                Per nulla
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.answerButton,
                currentAnswer === 5 && styles.selectedAnswer
              ]}
              onPress={() => handleAnswer(question.id, 5)}
            >
              <Text style={[
                styles.answerText,
                currentAnswer === 5 && styles.selectedAnswerText
              ]}>
                Raramente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.answerButton,
                currentAnswer === 10 && styles.selectedAnswer
              ]}
              onPress={() => handleAnswer(question.id, 10)}
            >
              <Text style={[
                styles.answerText,
                currentAnswer === 10 && styles.selectedAnswerText
              ]}>
                Spesso
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestion === 0 && styles.disabledButton
            ]}
            onPress={prevQuestion}
            disabled={currentQuestion === 0}
          >
            <Text style={[
              styles.navButtonText,
              currentQuestion === 0 && styles.disabledButtonText
            ]}>
              Precedente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.primaryNavButton,
              currentAnswer === undefined && styles.disabledButton
            ]}
            onPress={nextQuestion}
            disabled={currentAnswer === undefined}
          >
            <Text style={[
              styles.navButtonText,
              styles.primaryNavButtonText,
              currentAnswer === undefined && styles.disabledButtonText
            ]}>
              {currentQuestion === questions.length - 1 ? 'Termina' : 'Avanti'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B7CF6',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 14,
    color: '#8B7CF6',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
  },
  selectedAnswer: {
    borderColor: '#8B7CF6',
    backgroundColor: '#F3F0FF',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedAnswerText: {
    color: '#8B7CF6',
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
  },
  primaryNavButton: {
    borderColor: '#8B7CF6',
    backgroundColor: '#8B7CF6',
  },
  disabledButton: {
    borderColor: '#E8E8E8',
    backgroundColor: '#F5F5F5',
  },
  navButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  primaryNavButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
  },
  resultCard: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 0,
  },
  scoreContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  resultHeader: {
    marginBottom: 20,
  },
  resultHeaderText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  disorderText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
    color: 'white',
    lineHeight: 22,
  },
  primaryButton: {
    width: '100%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 60,
  },
  loadingIconContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipboard: {
    width: 120,
    height: 150,
    position: 'relative',
  },
  clipboardTop: {
    width: 40,
    height: 12,
    backgroundColor: '#DDD',
    borderRadius: 6,
    position: 'absolute',
    top: -6,
    left: 40,
    zIndex: 2,
  },
  clipboardBody: {
    width: 120,
    height: 150,
    backgroundColor: '#8B7CF6',
    borderRadius: 12,
    padding: 20,
    paddingTop: 25,
  },
  checkmark1: {
    position: 'absolute',
    left: 15,
    top: 25,
  },
  checkmark2: {
    position: 'absolute',
    left: 15,
    top: 50,
  },
  checkmark3: {
    position: 'absolute',
    left: 15,
    top: 75,
  },
  checkmark4: {
    position: 'absolute',
    left: 15,
    top: 100,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  line1: {
    position: 'absolute',
    left: 35,
    top: 30,
    width: 60,
    height: 2,
    backgroundColor: 'white',
    opacity: 0.7,
  },
  line2: {
    position: 'absolute',
    left: 35,
    top: 55,
    width: 60,
    height: 2,
    backgroundColor: 'white',
    opacity: 0.7,
  },
  line3: {
    position: 'absolute',
    left: 35,
    top: 80,
    width: 60,
    height: 2,
    backgroundColor: 'white',
    opacity: 0.7,
  },
  line4: {
    position: 'absolute',
    left: 35,
    top: 105,
    width: 60,
    height: 2,
    backgroundColor: 'white',
    opacity: 0.7,
  },
  pencil: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 8,
    transform: [{ rotate: '45deg' }],
  },
  pencilTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
    position: 'absolute',
    left: 0,
    top: -12,
  },
  pencilBody: {
    width: 50,
    height: 8,
    backgroundColor: '#FF8C00',
    borderRadius: 4,
  },
  pencilEnd: {
    width: 8,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});