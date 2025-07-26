import { Exercise, ExerciseProgress } from '../types/Exercise';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ExerciseService {
  private static exercises: Exercise[] = [
    {
      id: 'body-scan',
      name: 'Body Scan',
      introText: 'Il Body Scan è una tecnica di mindfulness che ti aiuta a sviluppare consapevolezza del tuo corpo e delle sensazioni fisiche. Attraverso questa pratica, imparerai a osservare il tuo corpo senza giudizio, riducendo l\'ansia e migliorando la connessione mente-corpo.',
      benefitsText: '• Riduce l\'ansia e lo stress\n• Migliora la consapevolezza corporea\n• Favorisce il rilassamento profondo\n• Aiuta a riconoscere le tensioni fisiche\n• Sviluppa la capacità di osservazione senza giudizio',
      objectiveText: 'Sviluppare consapevolezza corporea e ridurre l\'ansia',
      duration: 15,
      image: 'body-scan',
      audioGuide: './assets/audio/body-scan.mp3',
      steps: [
        {
          id: 'preparation',
          type: 'list',
          title: 'Preparazione',
          content: [
            'Trova una posizione comoda, seduto o sdraiato',
            'Chiudi gli occhi o abbassa lo sguardo',
            'Fai 3 respiri profondi per rilassarti',
            'Porta l\'attenzione al momento presente'
          ]
        },
        {
          id: 'body-scan-practice',
          type: 'list',
          title: 'Pratica del Body Scan',
          content: [
            'Inizia dalla sommità della testa',
            'Scendi lentamente verso il viso e il collo',
            'Continua con spalle, braccia e mani',
            'Prosegui con petto, addome e schiena',
            'Termina con bacino, gambe e piedi',
            'Osserva ogni sensazione senza giudicare'
          ]
        },
        {
          id: 'reflection',
          type: 'textarea',
          title: 'Riflessione',
          placeholder: 'Descrivi cosa hai notato durante la pratica. Quali sensazioni hai percepito? Come ti senti ora?'
        }
      ],
      category: 'mindfulness',
      difficulty: 'easy'
    },
    {
      id: 'contrasta-compulsione',
      name: 'Contrasta la Compulsione',
      introText: 'Questo esercizio ti aiuta a riconoscere e resistere alle compulsioni attraverso tecniche di esposizione graduale. Imparerai a tollerare l\'ansia senza cedere ai comportamenti compulsivi, rafforzando la tua capacità di controllo.',
      benefitsText: '• Riduce la forza delle compulsioni\n• Aumenta la tolleranza all\'ansia\n• Migliora il senso di controllo\n• Sviluppa strategie di coping\n• Riduce la frequenza dei comportamenti compulsivi',
      objectiveText: 'Resistere alle compulsioni e tollerare l\'ansia',
      duration: 20,
      image: 'contrasta-compulsione',
      audioGuide: './assets/audio/contrasta-compulsione.mp3',
      steps: [
        {
          id: 'identify-trigger',
          type: 'textarea',
          title: 'Identifica il Trigger',
          placeholder: 'Descrivi la situazione o il pensiero che ha scatenato l\'impulso compulsivo...'
        },
        {
          id: 'resistance-techniques',
          type: 'list',
          title: 'Tecniche di Resistenza',
          content: [
            'Riconosci l\'impulso senza agire immediatamente',
            'Respira profondamente per 30 secondi',
            'Ricorda che l\'ansia è temporanea',
            'Usa la tecnica del "surfing" sull\'onda dell\'ansia',
            'Distrai la mente con un\'attività alternativa',
            'Ripeti a te stesso: "Questo passerà"'
          ]
        },
        {
          id: 'outcome-reflection',
          type: 'textarea',
          title: 'Risultato',
          placeholder: 'Come è andata? Sei riuscito a resistere? Cosa hai imparato da questa esperienza?'
        }
      ],
      category: 'exposure',
      difficulty: 'medium'
    },
    {
      id: 'gratitudine-mattino',
      name: 'Gratitudine del Mattino',
      introText: 'Inizia la giornata con un atteggiamento positivo attraverso la pratica della gratitudine. Questo esercizio ti aiuta a focalizzarti sugli aspetti positivi della vita, migliorando l\'umore e riducendo i pensieri negativi.',
      benefitsText: '• Migliora l\'umore e l\'ottimismo\n• Riduce i pensieri negativi\n• Aumenta la soddisfazione di vita\n• Sviluppa una prospettiva positiva\n• Rafforza la resilienza emotiva',
      objectiveText: 'Coltivare gratitudine e positività',
      duration: 10,
      image: 'gratitudine-mattino',
      audioGuide: './assets/audio/gratitudine-mattino.mp3',
      steps: [
        {
          id: 'morning-setup',
          type: 'list',
          title: 'Preparazione Mattutina',
          content: [
            'Trova un momento tranquillo al risveglio',
            'Siediti comodamente o resta a letto',
            'Fai alcuni respiri profondi',
            'Porta l\'attenzione al momento presente'
          ]
        },
        {
          id: 'gratitude-practice',
          type: 'textarea',
          title: 'Pratica della Gratitudine',
          placeholder: 'Scrivi 3 cose per cui sei grato oggi. Possono essere piccole o grandi, semplici o complesse...'
        },
        {
          id: 'intention-setting',
          type: 'textarea',
          title: 'Intenzione per la Giornata',
          placeholder: 'Qual è la tua intenzione positiva per oggi? Come vuoi affrontare la giornata?'
        }
      ],
      category: 'positivity',
      difficulty: 'easy'
    },
    {
      id: 'scrittura',
      name: 'Scrittura Terapeutica',
      introText: 'La scrittura terapeutica è uno strumento potente per elaborare pensieri ed emozioni. Attraverso la scrittura libera, potrai esplorare i tuoi sentimenti, chiarire i pensieri e trovare nuove prospettive sui problemi.',
      benefitsText: '• Chiarisce pensieri ed emozioni\n• Riduce lo stress e l\'ansia\n• Migliora l\'autoconsapevolezza\n• Facilita l\'elaborazione emotiva\n• Sviluppa nuove prospettive',
      objectiveText: 'Elaborare pensieri ed emozioni attraverso la scrittura',
      duration: 25,
      image: 'scrittura',
      audioGuide: './assets/audio/scrittura.mp3',
      steps: [
        {
          id: 'writing-setup',
          type: 'list',
          title: 'Preparazione alla Scrittura',
          content: [
            'Trova un luogo tranquillo e privato',
            'Prepara carta e penna o dispositivo digitale',
            'Elimina le distrazioni',
            'Stabilisci un tempo dedicato (15-20 minuti)'
          ]
        },
        {
          id: 'free-writing',
          type: 'textarea',
          title: 'Scrittura Libera',
          placeholder: 'Scrivi liberamente sui tuoi pensieri e sentimenti attuali. Non preoccuparti della grammatica o della struttura, lascia fluire le parole...'
        },
        {
          id: 'reflection-insights',
          type: 'textarea',
          title: 'Riflessioni e Intuizioni',
          placeholder: 'Rileggi quello che hai scritto. Quali intuizioni o pattern noti? Cosa hai imparato su te stesso?'
        }
      ],
      category: 'reflection',
      difficulty: 'medium'
    }
  ];

  static getAllExercises(): Exercise[] {
    return this.exercises;
  }

  static getExerciseById(id: string): Exercise | undefined {
    return this.exercises.find(exercise => exercise.id === id);
  }

  static getExercisesByCategory(category: string): Exercise[] {
    return this.exercises.filter(exercise => exercise.category === category);
  }

  static getDailyRecommendations(): Exercise[] {
    // Restituisce i primi 3 esercizi come raccomandazioni giornaliere
    // In futuro si può implementare una logica più sofisticata
    return this.exercises.slice(0, 3);
  }

  static getDailyRecommendedExercises(): Exercise[] {
    // Per ora restituisce i primi 3 esercizi
    // Successivamente implementeremo la logica personalizzata
    return this.exercises.slice(0, 3);
  }

  static async saveExerciseProgress(progress: ExerciseProgress): Promise<void> {
    try {
      const existingProgress = await this.getUserExerciseProgress();
      const updatedProgress = [...existingProgress, progress];
      await AsyncStorage.setItem('exerciseProgress', JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error saving exercise progress:', error);
      throw error;
    }
  }

  static async getUserExerciseProgress(): Promise<ExerciseProgress[]> {
    try {
      const progressData = await AsyncStorage.getItem('exerciseProgress');
      return progressData ? JSON.parse(progressData) : [];
    } catch (error) {
      console.error('Error loading exercise progress:', error);
      return [];
    }
  }

  static async getExerciseCompletionCount(exerciseId: string): Promise<number> {
    try {
      const progress = await this.getUserExerciseProgress();
      return progress.filter(p => p.exerciseId === exerciseId).length;
    } catch (error) {
      console.error('Error getting exercise completion count:', error);
      return 0;
    }
  }

  static async hasCompletedExerciseToday(exerciseId: string): Promise<boolean> {
    try {
      const progress = await this.getUserExerciseProgress();
      const today = new Date().toDateString();
      return progress.some(p => 
        p.exerciseId === exerciseId && 
        new Date(p.completedAt).toDateString() === today
      );
    } catch (error) {
      console.error('Error checking today\'s exercise completion:', error);
      return false;
    }
  }
}

export default ExerciseService;