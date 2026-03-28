import { Exercise, ExerciseProgress } from '../types/Exercise';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ExerciseService {
  private static exercises: Exercise[] = [
    {
      id: 'body-scan',
      name: 'Body Scan',
      introText: 'Il Body Scan è una pratica di mindfulness che ti guida in un viaggio di consapevolezza attraverso tutto il corpo. Con un sottofondo musicale rilassante, uno scanner visivo ti accompagnerà dall\'alto verso il basso, aiutandoti a portare attenzione a ogni parte del corpo e a rilasciare tensioni accumulate.',
      benefitsText: '• Riduce l\'ansia e lo stress\n• Migliora la consapevolezza corporea\n• Favorisce il rilassamento profondo\n• Aiuta a riconoscere le tensioni fisiche\n• Sviluppa la capacità di osservazione senza giudizio',
      objectiveText: 'Sviluppare consapevolezza corporea e ridurre le tensioni fisiche',
      duration: 8,
      image: './assets/exercises/body-scan.png',
      steps: [
        {
          id: 'preparation',
          type: 'default',
          title: 'Azioni preparatorie',
          content: [
            'Trova un luogo tranquillo dove non sarai disturbato per i prossimi 8 minuti',
            'Siediti comodamente o sdraiati, con la schiena supportata',
            'Chiudi gli occhi e fai 3 respiri profondi per rilassarti',
            'Segui lo scanner visivo: porta l\'attenzione a ogni zona del corpo che evidenzia',
            'Osserva le sensazioni senza giudicarle — tensione, calore, formicoli, nulla: tutto va bene'
          ]
        }
      ],
      category: 'mindfulness',
      difficulty: 'easy',
      // Metadata per ordinamento
      journeyPhase: 'support_anytime',
      defaultDisplayOrder: 2,
      usageType: 'regulation',
      recommendedTimeSlots: ['evening', 'anytime'],
      priorityInCriticalMode: 'high',
      mentalLoad: 'low',
      primaryCategory: 'corporeo'
    },
    {
      id: 'contrasta-compulsione',
      name: 'Contrasta la compulsione',
      introText: 'Questo esercizio ti aiuta a riconoscere e resistere alle compulsioni attraverso tecniche di esposizione graduale. Imparerai a tollerare l\'ansia senza cedere ai comportamenti compulsivi, rafforzando la tua capacità di controllo.',
      benefitsText: '• Riduce la forza delle compulsioni\n• Aumenta la tolleranza all\'ansia\n• Migliora il senso di controllo\n• Sviluppa strategie di coping\n• Migliora l’autocontrollo e la consapevolezza',
      objectiveText: 'Resistere alle compulsioni e tollerare l\'ansia',
      duration: 5,
      image: './assets/exercises/contrasta-compulsione.png',
      steps: [
        {
          id: 'identify-trigger',
          type: 'withtextarea',
          title: 'Identifica il Trigger',
          placeholder: 'Descrivi la situazione o il pensiero che ha scatenato l\'impulso compulsivo...'
        },
        {
          id: 'resistance-techniques',
          type: 'default',
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
          type: 'withtextarea',
          title: 'Risultato',
          placeholder: 'Come è andata? Sei riuscito a resistere? Cosa hai imparato da questa esperienza?'
        }
      ],
      category: 'exposure',
      difficulty: 'medium',
      journeyPhase: 'support_anytime',
      defaultDisplayOrder: 10, // Più basso di default
      usageType: 'regulation',
      mentalLoad: 'medium',
      priorityInCriticalMode: 'medium'
    },
    {
      id: 'contrasta-ossessione',
      name: 'Contrasta l\'ossessione',
      introText: 'Questo esercizio ti aiuta a riconoscere e resistere alle ossessioni attraverso tecniche di mindfulness e distanziamento cognitivo. Imparerai a osservare i pensieri ossessivi senza identificarti con essi, riducendo il loro impatto emotivo.',
      benefitsText: '• Riduce l\'intensità delle ossessioni\n• Aumenta la capacità di distanziamento cognitivo\n• Migliora il senso di controllo sui pensieri\n• Sviluppa strategie di coping per i pensieri intrusivi\n• Migliora l’autocontrollo e la consapevolezza',
      objectiveText: 'Riconoscere e resistere alle ossessioni',
      duration: 5,
      image: './assets/exercises/contrasta-ossessione.png',
      steps: [
        {
          id: 'identify-obsession',
          type: 'withtextarea',
          title: 'Identifica l\'Ossessione',
          placeholder: 'Descrivi il pensiero ossessivo che stai sperimentando...'
        },
        {
          id: 'resistance-techniques',
          type: 'default',
          title: 'Tecniche di Resistenza',
          content: [
            'Osserva il pensiero come un osservatore esterno',
            'Etichetta il pensiero come "ossessione" senza giudicarlo',
            'Pratica la mindfulness: focalizzati sul respiro',
            'Usa il distanziamento: "Sto avendo il pensiero che..."',
            'Rimanda l\'attenzione al pensiero a un momento successivo',
            'Ricorda che i pensieri non sono fatti'
          ]
        },
        {
          id: 'outcome-reflection',
          type: 'withtextarea',
          title: 'Risultato',
          placeholder: 'Come è andata? Sei riuscito a distanziarti dal pensiero? Cosa hai imparato?'
        }
      ],
      category: 'mindfulness',
      difficulty: 'medium',
      journeyPhase: 'support_anytime',
      defaultDisplayOrder: 11,
      usageType: 'regulation',
      mentalLoad: 'medium',
      priorityInCriticalMode: 'medium'
    },
    {
      id: 'gratitudine-mattino',
      name: 'Gratitudine del mattino',
      introText: 'Inizia la giornata con un atteggiamento positivo attraverso la pratica della gratitudine. Questo esercizio ti aiuta a focalizzarti sugli aspetti positivi della vita, migliorando l\'umore e riducendo i pensieri negativi.',
      benefitsText: '• Migliora l\'umore e l\'ottimismo\n• Riduce i pensieri negativi\n• Aumenta la soddisfazione di vita\n• Sviluppa una prospettiva positiva\n• Rafforza la resilienza emotiva',
      objectiveText: 'Coltivare gratitudine e positività',
      duration: 10,
      image: './assets/exercises/gratitudine-mattino.png',
      steps: [
        {
          id: 'morning-setup',
          type: 'default',
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
          type: 'withtextarea',
          title: 'Pratica della Gratitudine',
          placeholder: 'Scrivi 3 cose per cui sei grato oggi. Possono essere piccole o grandi, semplici o complesse...'
        },
        {
          id: 'intention-setting',
          type: 'withtextarea',
          title: 'Intenzione per la Giornata',
          placeholder: 'Qual è la tua intenzione positiva per oggi? Come vuoi affrontare la giornata?'
        }
      ],
      category: 'positivity',
      difficulty: 'easy',
      // Metadata per ordinamento
      journeyPhase: 'start_day',
      defaultDisplayOrder: 1,
      usageType: 'preventive',
      recommendedTimeSlots: ['morning'],
      priorityInCriticalMode: 'low',
      mentalLoad: 'low'
    },
    {
      id: 'gratitudine-sera',
      name: 'Gratitudine della sera',
      introText: 'Concludi la giornata con un atteggiamento positivo attraverso la pratica della gratitudine. Questo esercizio ti aiuta a riflettere sugli aspetti positivi della giornata, migliorando l\'umore e favorendo un sonno tranquillo.',
      benefitsText: '• Migliora l\'umore serale\n• Riduce i pensieri negativi prima di dormire\n• Aumenta la soddisfazione per la giornata\n• Sviluppa una prospettiva positiva\n• Favorisce un sonno più riposante',
      objectiveText: 'Riflettere sulla gratitudine e positività serale',
      duration: 10,
      image: './assets/exercises/gratitudine-sera.png',
      steps: [
        {
          id: 'evening-setup',
          type: 'default',
          title: 'Preparazione Serale',
          content: [
            'Trova un momento tranquillo prima di dormire',
            'Siediti comodamente o sdraiati',
            'Fai alcuni respiri profondi',
            'Porta l\'attenzione alla giornata trascorsa'
          ]
        },
        {
          id: 'gratitude-practice',
          type: 'withtextarea',
          title: 'Pratica della Gratitudine',
          placeholder: 'Scrivi 3 cose per cui sei grato della giornata. Possono essere piccole o grandi, semplici o complesse...'
        },
        {
          id: 'reflection-setting',
          type: 'withtextarea',
          title: 'Riflessione sulla Giornata',
          placeholder: 'Qual è stata la cosa più positiva di oggi? Come ti senti riguardo alla giornata?'
        }
      ],
      category: 'positivity',
      difficulty: 'easy',
      // Metadata per ordinamento
      journeyPhase: 'end_day',
      defaultDisplayOrder: 3,
      usageType: 'decompression',
      recommendedTimeSlots: ['evening'],
      priorityInCriticalMode: 'low',
      mentalLoad: 'low'
    },
    {
      id: 'scrittura',
      name: 'Scrittura terapeutica',
      introText: 'La scrittura terapeutica è uno strumento potente per elaborare pensieri ed emozioni. Attraverso la scrittura libera, potrai esplorare i tuoi sentimenti, chiarire i pensieri e trovare nuove prospettive sui problemi.',
      benefitsText: '• Chiarisce pensieri ed emozioni\n• Riduce lo stress e l\'ansia\n• Migliora l\'autoconsapevolezza\n• Facilita l\'elaborazione emotiva\n• Sviluppa nuove prospettive',
      objectiveText: 'Elaborare pensieri ed emozioni attraverso la scrittura',
      duration: 25,
      image: './assets/exercises/scrittura.png',
      steps: [
        {
          id: 'writing-setup',
          type: 'default',
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
          type: 'withtextarea',
          title: 'Scrittura Libera',
          placeholder: 'Scrivi liberamente sui tuoi pensieri e sentimenti attuali. Non preoccuparti della grammatica o della struttura, lascia fluire le parole...'
        },
        {
          id: 'reflection-insights',
          type: 'withtextarea',
          title: 'Riflessioni e Intuizioni',
          placeholder: 'Rileggi quello che hai scritto. Quali intuizioni o pattern noti? Cosa hai imparato su te stesso?'
        }
      ],
      category: 'reflection',
      difficulty: 'medium',
      journeyPhase: 'support_anytime',
      defaultDisplayOrder: 20,
      usageType: 'reflection',
      mentalLoad: 'high',
      priorityInCriticalMode: 'low'
    },
    {
      id: 'respirazione-consapevole',
      name: 'Respirazione consapevole',
      introText: 'La respirazione consapevole è una tecnica fondamentale di mindfulness che ti aiuta a calmare la mente e ridurre l\'ansia. Attraverso l\'attenzione al respiro, svilupperai maggiore consapevolezza del momento presente e imparerai a gestire lo stress in modo naturale.',
      benefitsText: '• Riduce ansia e stress immediatamente\n• Migliora la concentrazione e la chiarezza mentale\n• Attiva il sistema nervoso parasimpatico\n• Favorisce il rilassamento profondo\n• Sviluppa la consapevolezza del momento presente\n• Migliora la qualità del sonno',
      objectiveText: 'Calmare la mente e ridurre l\'ansia attraverso il respiro',
      duration: 3,
      image: './assets/exercises/respirazione-consapevole.png',
      steps: [
        {
          id: 'text-guide',
          type: 'default',
          title: 'Azioni preparatorie',
          content: [
            'Trova un luogo tranquillo dove non sarai disturbato per i prossimi minuti',
            'Siediti in una posizione comoda, con la schiena eretta ma non rigida',
            'Rilassa le spalle, allenta la tensione nella mascella e nel viso',
            'Ricorda che questa pratica è disponibile in qualsiasi momento della giornata'
          ]
        }
      ],
      category: 'mindfulness',
      difficulty: 'easy',
      journeyPhase: 'support_anytime',
      defaultDisplayOrder: 4,
      usageType: 'regulation',
      mentalLoad: 'low',
      priorityInCriticalMode: 'medium'
    },
    {
      id: 'respirazione-triangolare',
      name: 'Mindfulness',
      introText: 'Una tecnica di mindfulness in 3 fasi per calmare il sistema nervoso e ridurre l\'ansia. Visualizza un triangolo mentre respiri: inspira per 4 secondi, trattieni per 4 secondi, espira per 4 secondi.',
      benefitsText: '• Calma il sistema nervoso in pochi minuti\n• Riduce ansia e attacchi di panico\n• Favorisce la concentrazione e la chiarezza mentale\n• Regola il ritmo cardiaco\n• Tecnica utilizzabile ovunque e in qualsiasi momento',
      objectiveText: 'Calmare il sistema nervoso attraverso la respirazione ritmica triangolare',
      duration: 3,
      category: 'mindfulness',
      isGuided: true,
      image: './assets/exercises/triangle-breathing.png',
      journeyPhase: 'support_anytime',
      defaultDisplayOrder: 5,
      usageType: 'regulation',
      mentalLoad: 'low',
      priorityInCriticalMode: 'high',
      primaryCategory: 'respirazione',
      steps: [
        {
          id: 'step1',
          type: 'preparation',
          title: 'Preparazione alla respirazione',
          description: '',
          instruction: 'Sediti in una posizione comoda, chiudi gli occhi e segui il ritmo luminoso',
          content: [
            'Siediti in una posizione comoda con la schiena dritta',
            'Chiudi gli occhi o abbassa lo sguardo',
            'Rilassa le spalle e la mascella',
            'Porta l\'attenzione al tuo respiro naturale',
            'Quando sei pronto, segui il triangolo luminoso'
          ]
        }
      ]
    },
    {
      id: 'radicamento-sensoriale',
      name: 'Radicamento sensoriale',
      introText: 'Il radicamento sensoriale (Tecnica 5-4-3-2-1) è un metodo efficace per interrompere i cicli di pensieri negativi, ansia o panico. Ti aiuta a riconnetterti con la realtà circostante attraverso i tuoi cinque sensi, riportando la mente nel momento presente e calmando il sistema nervoso.',
      benefitsText: '• Interrompe i pensieri intrusivi e il rimuginio\n• Riduce rapidamente l\'ansia acuta\n• Riporta la consapevolezza al momento presente\n• Calma il sistema nervoso simpatico\n• Fornisce uno strumento pratico e veloce da usare ovunque',
      objectiveText: 'Riconnettersi con il presente e calmare l\'ansia attraverso i sensi',
      duration: 3,
      category: 'mindfulness',
      isGuided: true,
      image: './assets/exercises/grounding.png',
      journeyPhase: 'support_anytime',
      defaultDisplayOrder: 6,
      usageType: 'emergency',
      mentalLoad: 'low',
      priorityInCriticalMode: 'high',
      steps: [
        {
          id: 'preparation',
          type: 'default',
          title: 'Azioni preparatorie',
          content: [
            'Siediti comodamente o resta in piedi, sentendo il contatto con il suolo',
            'Fai un respiro profondo e consapevole',
            'Preparati a esplorare l\'ambiente intorno a te senza giudizio',
            'Segui le indicazioni visive per individuare elementi specifici tramite i tuoi sensi'
          ]
        }
      ]
    },
    {
      id: 'parcheggio-pensieri',
      name: 'Parcheggio dei pensieri',
      introText: 'Il "Parcheggio dei pensieri" (Thought Parking) ti aiuta a gestire i pensieri intrusivi, le idee improvvise o le distrazioni estraendoli dalla mente e "parcheggiandoli" in un luogo sicuro per occupartene dopo.',
      benefitsText: '• Favorisce il distacco cognitivo\n• Pulisce la mente dalle distrazioni immediate\n• Allenta la pressione del dover ricordare tutto ora\n• Tiene traccia delle preoccupazioni per affrontarle con lucidità\n• Previene il rimuginio continuo',
      objectiveText: 'Parcheggiare temporaneamente i pensieri per liberare la memoria di lavoro',
      duration: 0,
      category: 'thoughts',
      isGuided: false,
      image: './assets/exercises/thought-parking.png',
      journeyPhase: 'support_anytime',
      defaultDisplayOrder: 7,
      usageType: 'regulation',
      mentalLoad: 'low',
      priorityInCriticalMode: 'high',
      steps: [
        // Nessun step intermedio, si va dritti all'esercizio
      ]
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
    // Return specific exercises as daily recommendations
    return [
      this.exercises.find(ex => ex.id === 'gratitudine-mattino')!,
      this.exercises.find(ex => ex.id === 'scrittura')!,
      this.exercises.find(ex => ex.id === 'gratitudine-sera')!
    ];
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