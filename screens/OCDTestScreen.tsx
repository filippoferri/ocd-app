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

const ResultCircle = ({ text }: { text: string }) => (
  <View style={styles.circleContainer}>
    <Svg width="247" height="241" viewBox="0 0 247 241" fill="none">
      <G clipPath="url(#clip0_157_11949)">
        <Path d="M61.5553 16.9655C0.771564 53.7427 -22.3446 144.259 26.102 200.707C63.0845 243.962 124.115 252.047 176.209 226.596C275.889 177.896 272.183 25.9196 152.86 2.47987C121.38 -3.7051 85.8139 1.88324 61.5553 16.9655Z" fill="#B8B8FF"/>
        <Path d="M50.7825 55.7889C2.03544 108.508 20.081 200.549 97.55 214.45C158.266 225.345 214.117 182.561 222.073 129.559C224.24 96.9257 212.999 62.8075 185.088 41.7564C164.835 26.4883 138.883 20.8274 116.975 22.9955C90.814 25.5817 68.3731 36.1119 50.7825 55.7889Z" fill="#9381FF"/>
        <Path d="M30.8078 116.934H30.7914C30.6681 116.932 30.5459 116.905 30.4328 116.857C30.3195 116.807 30.2168 116.736 30.1312 116.647C30.0453 116.559 29.978 116.454 29.9325 116.339C29.8873 116.224 29.8652 116.101 29.8673 115.978C30.0521 105.561 32.9133 95.368 38.1748 86.381C38.2372 86.2746 38.3197 86.1816 38.4182 86.1072C38.5165 86.0327 38.6284 85.9784 38.7475 85.9472C38.8669 85.9162 38.991 85.9089 39.1132 85.9261C39.2351 85.943 39.3526 85.9838 39.4589 86.0463C39.5651 86.1088 39.658 86.1915 39.7324 86.2899C39.8067 86.3883 39.8609 86.5006 39.8919 86.6199C39.9231 86.7395 39.9303 86.8637 39.9132 86.9859C39.8963 87.1083 39.8555 87.2259 39.7931 87.3324C34.6951 96.0389 31.9231 105.914 31.7437 116.006C31.7406 116.252 31.6407 116.488 31.4655 116.662C31.2905 116.835 31.0541 116.933 30.8078 116.934Z" fill="white"/>
        <Path d="M30.4583 134.015C30.2538 134.015 30.0547 133.948 29.8917 133.824C29.7286 133.7 29.6104 133.526 29.5553 133.329C28.8737 130.872 28.8566 128.278 29.5061 125.813C29.5757 125.58 29.7326 125.383 29.944 125.264C30.155 125.144 30.4046 125.112 30.6394 125.173C30.8744 125.233 31.0768 125.383 31.2039 125.59C31.331 125.797 31.373 126.045 31.3214 126.283C30.7534 128.427 30.7679 130.685 31.3636 132.822C31.4023 132.962 31.4082 133.108 31.381 133.251C31.3535 133.393 31.2937 133.527 31.206 133.643C31.1183 133.758 31.0053 133.851 30.8756 133.915C30.7459 133.98 30.603 134.013 30.4583 134.013V134.015Z" fill="white"/>
        <Path d="M61.5519 192.316C61.353 192.316 61.1591 192.253 60.9982 192.135C53.0217 186.214 46.3229 178.739 41.3052 170.159C36.2874 161.58 33.0545 152.072 31.8004 142.208C31.7692 141.961 31.8374 141.711 31.9901 141.515C32.1428 141.317 32.3673 141.189 32.6142 141.158C32.8612 141.127 33.1103 141.196 33.3071 141.348C33.5036 141.501 33.6314 141.726 33.6626 141.973C35.9869 161.061 46.6187 179.24 62.1078 190.597C62.2668 190.714 62.3848 190.879 62.4448 191.067C62.5049 191.255 62.5042 191.457 62.4425 191.644C62.381 191.834 62.2617 191.997 62.1017 192.114C61.942 192.229 61.7494 192.293 61.5519 192.293V192.316Z" fill="white"/>
        <Path d="M201.175 166.805C200.999 166.805 200.828 166.755 200.678 166.661C200.53 166.567 200.41 166.433 200.333 166.276C200.256 166.119 200.225 165.943 200.244 165.766C200.26 165.593 200.328 165.426 200.436 165.287C205.891 158.28 210.756 147.634 210.756 144.146C210.756 143.897 210.854 143.658 211.03 143.482C211.206 143.305 211.445 143.207 211.694 143.207C211.943 143.207 212.182 143.305 212.358 143.482C212.534 143.658 212.632 143.897 212.632 144.146C212.632 148.454 207.329 159.494 201.928 166.433C201.839 166.549 201.726 166.643 201.595 166.708C201.463 166.772 201.32 166.805 201.175 166.805Z" fill="white"/>
        <Path d="M196.061 27.4209C195.864 27.4204 195.67 27.357 195.51 27.24C184.705 19.3734 174.305 14.2929 164.631 12.1528C164.509 12.1275 164.394 12.0781 164.291 12.0081C164.19 11.9374 164.1 11.8475 164.035 11.7432C163.967 11.6384 163.92 11.5217 163.899 11.3993C163.875 11.2767 163.878 11.1512 163.906 11.0298C163.932 10.9081 163.983 10.7935 164.054 10.6918C164.126 10.5898 164.218 10.5034 164.323 10.4374C164.429 10.3709 164.546 10.3263 164.668 10.3061C164.79 10.2859 164.914 10.2899 165.036 10.3183C174.964 12.5239 185.587 17.7083 196.613 25.732C196.775 25.8485 196.894 26.0129 196.955 26.2018C197.016 26.3906 197.016 26.594 196.955 26.7831C196.894 26.972 196.775 27.1366 196.613 27.2534C196.453 27.3699 196.261 27.4328 196.061 27.4326V27.4209Z" fill="#9381FF"/>
        <Path d="M121.381 5.404C121.132 5.41574 120.889 5.32789 120.705 5.15947C120.521 4.99153 120.411 4.7571 120.399 4.50788C120.388 4.25866 120.476 4.01508 120.643 3.83092C120.811 3.64629 121.045 3.5366 121.294 3.52485C122.251 3.43348 123.011 3.40999 124.981 3.52485C125.23 3.53918 125.463 3.65193 125.629 3.8382C125.795 4.02447 125.88 4.26923 125.865 4.51845C125.851 4.76767 125.739 5.00092 125.553 5.16699C125.367 5.33329 125.122 5.41833 124.873 5.404C123.027 5.30064 122.331 5.31944 121.472 5.404H121.381Z" fill="#9381FF"/>
        <Path d="M143.684 6.28041C143.626 6.28064 143.567 6.27501 143.51 6.26397C139.152 5.44654 138.116 5.25158 133.606 5.41624C133.357 5.42516 133.115 5.33473 132.932 5.1649C132.75 4.99531 132.643 4.75995 132.633 4.51073C132.625 4.2615 132.715 4.01862 132.884 3.83635C133.054 3.6536 133.289 3.54602 133.538 3.53709C138.099 3.37243 139.237 3.55119 143.857 4.41794C144.087 4.4614 144.292 4.58918 144.432 4.77592C144.573 4.96266 144.638 5.19544 144.617 5.42798C144.595 5.66123 144.487 5.87733 144.315 6.03495C144.142 6.19256 143.917 6.27994 143.684 6.28041Z" fill="#9381FF"/>
        <Path d="M198.577 125.023C198.532 125.027 198.49 125.027 198.445 125.023C198.323 125.006 198.206 124.965 198.098 124.903C197.992 124.84 197.899 124.757 197.826 124.659C197.751 124.56 197.697 124.448 197.666 124.328C197.636 124.208 197.629 124.084 197.645 123.962C198.114 120.699 198.096 119.694 198.072 117.009C198.072 116.431 198.072 115.78 198.06 115.014C198.06 114.765 198.159 114.526 198.335 114.35C198.511 114.174 198.75 114.075 198.999 114.075C199.247 114.075 199.486 114.174 199.662 114.35C199.838 114.526 199.937 114.765 199.937 115.014V116.999C199.963 119.787 199.97 120.83 199.491 124.232C199.456 124.45 199.346 124.65 199.179 124.795C199.01 124.939 198.797 125.02 198.577 125.023Z" fill="#030404"/>
        <Path d="M123.084 192.081C119.422 192.081 115.765 191.827 112.138 191.322C104.154 190.244 96.4048 187.839 89.2096 184.21C81.9409 180.536 75.435 175.514 70.0382 169.412C64.3529 162.958 59.9857 155.343 57.0633 146.777C53.9345 137.616 52.4593 127.32 52.6821 116.215C52.687 115.969 52.7881 115.735 52.9633 115.562C53.1387 115.39 53.3747 115.294 53.6203 115.294H53.639C53.7622 115.296 53.8837 115.323 53.9967 115.373C54.1095 115.422 54.2115 115.493 54.2969 115.582C54.3823 115.671 54.4494 115.776 54.4942 115.891C54.5392 116.006 54.561 116.129 54.5584 116.252C53.5968 164.157 83.8057 185.478 112.396 189.462C115.816 189.934 119.264 190.169 122.716 190.167C152.78 190.167 185.941 172.728 195.424 136.498C195.494 136.265 195.651 136.068 195.863 135.949C196.074 135.829 196.322 135.797 196.557 135.857C196.791 135.918 196.995 136.068 197.122 136.275C197.249 136.482 197.291 136.73 197.239 136.968C194.885 146.175 190.719 154.819 184.987 162.394C179.257 169.971 172.073 176.325 163.859 181.086C156.08 185.643 147.585 188.844 138.735 190.554C133.58 191.567 128.338 192.076 123.084 192.081Z" fill="#030404"/>
        <Path d="M180.449 72.7929C180.315 72.7922 180.184 72.7629 180.062 72.707C179.94 72.6511 179.832 72.5698 179.745 72.4688C156.561 45.6299 116.966 37.9254 89.5854 54.9317C83.75 58.5561 77.9686 63.5875 72.8626 69.495C72.7861 69.601 72.6886 69.6898 72.576 69.7558C72.4634 69.8218 72.3382 69.8633 72.2085 69.8781C72.079 69.8929 71.9476 69.8807 71.8231 69.8417C71.6986 69.8027 71.5834 69.7384 71.4851 69.6524C71.3869 69.5664 71.3076 69.461 71.2522 69.3426C71.1971 69.2242 71.1671 69.0955 71.1643 68.9649C71.1615 68.8343 71.1859 68.7044 71.2361 68.5837C71.2862 68.4632 71.3608 68.3542 71.4553 68.2642C76.6809 62.2251 82.6125 57.0668 88.6074 53.3438C102.485 44.7232 119.848 42.022 137.495 45.738C145.892 47.5123 153.953 50.6176 161.371 54.9364C168.83 59.2337 175.521 64.7471 181.169 71.2497C181.286 71.3855 181.361 71.552 181.387 71.7293C181.413 71.9069 181.387 72.0878 181.312 72.251C181.239 72.4143 181.12 72.5529 180.97 72.6506C180.82 72.7483 180.644 72.8009 180.465 72.8023L180.449 72.7929Z" fill="#030404"/>
        <Path d="M114.776 236.049C109.616 236.049 104.784 235.708 100.579 234.997C100.453 234.98 100.331 234.94 100.222 234.877C100.112 234.813 100.016 234.726 99.9403 234.625C99.8643 234.524 99.8099 234.407 99.7801 234.285C99.7503 234.16 99.7459 234.031 99.767 233.907C99.7881 233.782 99.8343 233.662 99.9028 233.554C99.9715 233.449 100.061 233.357 100.166 233.284C100.271 233.214 100.389 233.164 100.514 233.141C100.639 233.117 100.767 233.117 100.891 233.146C114.199 235.391 134.102 233.874 149.288 229.453C149.408 229.413 149.533 229.401 149.658 229.411C149.783 229.423 149.904 229.46 150.015 229.519C150.125 229.578 150.223 229.657 150.302 229.756C150.381 229.852 150.44 229.965 150.475 230.085C150.51 230.207 150.52 230.332 150.505 230.456C150.491 230.581 150.451 230.703 150.39 230.811C150.328 230.921 150.245 231.015 150.146 231.093C150.046 231.168 149.933 231.224 149.811 231.257C139.165 234.362 126.226 236.049 114.776 236.049Z" fill="#9381FF"/>
        <Path d="M163.909 227.118C163.681 227.116 163.461 227.033 163.29 226.881C163.121 226.73 163.01 226.521 162.98 226.296C162.952 226.07 163.006 225.84 163.135 225.652C163.261 225.462 163.454 225.326 163.674 225.269C167.023 224.386 169.001 223.449 170.286 222.136C170.459 221.957 170.699 221.856 170.947 221.852C171.069 221.852 171.191 221.875 171.306 221.92C171.421 221.967 171.525 222.035 171.613 222.122C171.703 222.206 171.773 222.31 171.82 222.425C171.869 222.537 171.895 222.66 171.895 222.782C171.897 222.906 171.874 223.028 171.827 223.143C171.782 223.259 171.714 223.362 171.627 223.451C170.089 225.025 167.852 226.113 164.153 227.087C164.073 227.108 163.991 227.118 163.909 227.118Z" fill="#9381FF"/>
      </G>
      <Defs>
        <ClipPath id="clip0_157_11949">
          <Rect width="247" height="241" fill="white"/>
        </ClipPath>
      </Defs>
    </Svg>
    <View style={styles.circleTextContainer}>
      <Text style={styles.circleText}>{text}</Text>
    </View>
  </View>
);

interface OCDTestScreenProps {
  onBack: () => void;
  onTestComplete: (result: string) => void;
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
  const [intensityByQuestion, setIntensityByQuestion] = useState<{ [key: number]: number }>({});
  const [finalEvaluation, setFinalEvaluation] = useState<string>('');

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
    const entries = Object.entries(answers);
    let weightedSum = 0;
    let maxPossible = 0;
    entries.forEach(([qid, ans]) => {
      const qidNum = Number(qid);
      if (ans === 5 || ans === 10) {
        const intensity = intensityByQuestion[qidNum] || 0;
        const weight = ans === 10 ? 2 : 1;
        weightedSum += weight * intensity;
        maxPossible += weight * 5;
      }
    });
    const ratio = maxPossible > 0 ? weightedSum / maxPossible : 0;
    const evaluation = ratio === 0
      ? 'Nessuna'
      : ratio < 0.33
      ? 'Bassa'
      : ratio < 0.66
      ? 'Moderata'
      : 'Alta';
    setFinalEvaluation(evaluation);
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      setShowResult(true);
    }, 2000);
  };

  const getResultMessage = (result: string) => {
    return {
      title: "Abbiamo creato il tuo piano d'azione. Sei pronto ad iniziare?",
      message: "Stiamo analizzando i risultati del test...",
      subMessage: "Solo un po' di pazienza... Stiamo elaborando le tue risposte",
      color: "#8B7CF6",
      buttonText: "SONO PRONTO"
    };
  };

  if (showLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrapper}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingTitle}>Stiamo analizzando i risultati del test...</Text>
            <Text style={styles.loadingSubtitle}>Solo un po' di pazienza... Stiamo elaborando le tue risposte</Text>
            
            <View style={styles.loadingIconContainer}>
              <View style={styles.clipboard}>
                <View style={styles.clipboardTop} />
                <View style={styles.clipboardBody}>
                  {[1,2,3,4].map((i) => (
                    <React.Fragment key={i}>
                      <View style={(styles as any)[`checkmark${i}`]}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                      <View style={(styles as any)[`line${i}`]} />
                    </React.Fragment>
                  ))}
                </View>
              </View>
              <View style={styles.pencil}>
                <View style={styles.pencilTip} />
                <View style={styles.pencilBody} />
                <View style={styles.pencilEnd} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (showResult) {
    const result = getResultMessage(finalEvaluation);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}></Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={[styles.content, { backgroundColor: '#8B7CF6', borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultHeaderText}>Presenza DOC</Text>
              </View>
              
              <ResultCircle text={finalEvaluation !== 'Nessuna' ? finalEvaluation : 'Nessuna'} />
              {/* Rimosso Disturbo Ossessivo Compulsivo PRESENTE/ASSENTE */}
              
              <Text style={styles.resultTitle}>
                {result.title}
              </Text>
              
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: '#FF8C00' }]} 
                onPress={() => onTestComplete(finalEvaluation)}
              >
                <Text style={styles.primaryButtonText}>{result.buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentIntensity = intensityByQuestion[question.id];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerWrapper}>
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
              {[
                { val: 0, label: 'Per nulla' },
                { val: 5, label: 'Raramente' },
                { val: 10, label: 'Spesso' }
              ].map((ans) => (
                <TouchableOpacity
                  key={ans.val}
                  style={[
                    styles.answerButton,
                    currentAnswer === ans.val && styles.selectedAnswer
                  ]}
                  onPress={() => handleAnswer(question.id, ans.val as AnswerValue)}
                >
                  <Text style={[
                    styles.answerText,
                    currentAnswer === ans.val && styles.selectedAnswerText
                  ]}>
                    {ans.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {(currentAnswer === 5 || currentAnswer === 10) && (
              <View style={styles.intensitySection}>
                <Text style={styles.intensityLabel}>Intensità (1–5)</Text>
                <View style={styles.intensityButtons}>
                  {[1,2,3,4,5].map((lvl) => (
                    <TouchableOpacity
                      key={lvl}
                      style={[
                        styles.intensityButton,
                        currentIntensity === lvl && styles.intensityButtonSelected
                      ]}
                      onPress={() => setIntensityByQuestion(prev => ({ ...prev, [question.id]: lvl }))}
                    >
                      <Text style={styles.intensityButtonText}>{lvl}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
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
                (currentAnswer === undefined || ((currentAnswer === 5 || currentAnswer === 10) && !currentIntensity)) && styles.disabledButton
              ]}
              onPress={nextQuestion}
              disabled={currentAnswer === undefined || ((currentAnswer === 5 || currentAnswer === 10) && !currentIntensity)}
            >
              <Text style={[
                styles.navButtonText,
                styles.primaryNavButtonText,
                (currentAnswer === undefined || ((currentAnswer === 5 || currentAnswer === 10) && !currentIntensity)) && styles.disabledButtonText
              ]}>
                {currentQuestion === questions.length - 1 ? 'Termina' : 'Avanti'}
              </Text>
            </TouchableOpacity>
          </View>
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
  centerWrapper: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
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
    borderWidth: 1,
    borderColor: '#E8E8E8',
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
  
  resultHeader: {
    marginBottom: 20,
  },
  resultHeaderText: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 34,
  },
  circleContainer: {
    width: 247,
    height: 241,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    alignSelf: 'center',
  },
  circleTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  circleText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: 'white',
  },
  disorderText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  presentText: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  statusText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  intensitySection: {
    marginTop: 16,
  },
  intensityLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  intensityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
  },
  intensityButtonSelected: {
    borderColor: '#8B7CF6',
    backgroundColor: '#F3F0FF',
  },
  intensityButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 30,
    color: 'white',
    lineHeight: 20,
    paddingHorizontal: 10,
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
