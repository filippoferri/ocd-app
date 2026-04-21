const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://dnccjqrocbidnzuhiejh.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuY2NqcXJvY2JpZG56dWhpZWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjM0ODAsImV4cCI6MjA4ODg5OTQ4MH0.oaImC06VQ2vX1PUpp7Ci8umibexM6Sj-vRcgq-h6aH4';
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
});

// Esercizi locali da migrare
const exercises = [
  {
    id: 'body-scan',
    name: 'Body Scan',
    introText: 'Il Body Scan è una tecnica di mindfulness che ti aiuta a sviluppare consapevolezza del tuo corpo e a rilasciare le tensioni accumulate. Attraverso un\'attenzione sistematica a ogni parte del corpo, imparerai a riconoscere e sciogliere lo stress fisico.',
    benefitsText: '• Riduce la tensione muscolare e lo stress fisico\n• Migliora la consapevolezza corporea\n• Favorisce il rilassamento profondo\n• Aiuta a identificare aree di tensione\n• Migliora la qualità del sonno\n• Sviluppa la capacità di ascolto del corpo',
    objectiveText: 'Sviluppare consapevolezza corporea e rilasciare tensioni',
    duration: 15,
    image: './assets/exercises/body-scan.png',
    steps: [
      {
        id: 'preparation',
        type: 'default',
        title: 'Preparazione',
        content: [
          'Trova un luogo tranquillo dove non sarai disturbato',
          'Sdraiati comodamente su un letto o un tappetino',
          'Chiudi gli occhi e fai alcuni respiri profondi',
          'Rilassa tutto il corpo e preparati per il viaggio interiore'
        ]
      },
      {
        id: 'body-scan-practice',
        type: 'withaudio',
        title: 'Pratica del Body Scan',
        content: [
          'Inizia portando l\'attenzione ai piedi',
          'Muoviti lentamente verso l\'alto, parte per parte',
          'Nota le sensazioni senza giudicarle',
          'Rilascia consapevolmente ogni tensione che trovi',
          'Termina con una sensazione di rilassamento totale'
        ],
        audioFile: './assets/audio/body-scan-guide.mp3',
        duration: 900
      }
    ],
    category: 'mindfulness',
    difficulty: 'easy'
  },
  {
    id: 'contrasta-compulsione',
    name: 'Contrasta la compulsione',
    introText: 'Questo esercizio ti aiuta a riconoscere e gestire le compulsioni attraverso tecniche di esposizione graduale e prevenzione della risposta. Imparerai a tollerare l\'ansia senza cedere ai comportamenti compulsivi.',
    benefitsText: '• Riduce la frequenza delle compulsioni\n• Aumenta la tolleranza all\'ansia\n• Sviluppa strategie di coping alternative\n• Migliora il senso di controllo\n• Riduce l\'interferenza del DOC nella vita quotidiana',
    objectiveText: 'Gestire e ridurre i comportamenti compulsivi',
    duration: 20,
    image: './assets/exercises/contrasta-compulsione.png',
    steps: [
      {
        id: 'identification',
        type: 'withtextarea',
        title: 'Identificazione della Compulsione',
        placeholder: 'Descrivi la compulsione che vuoi affrontare oggi. Cosa ti spinge a compiere questo comportamento?'
      },
      {
        id: 'exposure-planning',
        type: 'default',
        title: 'Pianificazione dell\'Esposizione',
        content: [
          'Identifica il trigger che scatena la compulsione',
          'Valuta il livello di ansia da 1 a 10',
          'Pianifica di resistere alla compulsione per un tempo specifico',
          'Prepara strategie alternative di coping'
        ]
      },
      {
        id: 'exposure-practice',
        type: 'withtextarea',
        title: 'Pratica di Esposizione',
        placeholder: 'Descrivi come ti senti mentre resisti alla compulsione. Nota i cambiamenti nell\'ansia nel tempo.'
      },
      {
        id: 'reflection',
        type: 'withtextarea',
        title: 'Riflessione',
        placeholder: 'Cosa hai imparato da questa esperienza? Come ti senti ora rispetto all\'inizio?'
      }
    ],
    category: 'exposure',
    difficulty: 'hard'
  },
  {
    id: 'contrasta-ossessione',
    name: 'Contrasta l\'ossessione',
    introText: 'Questo esercizio ti insegna a riconoscere e gestire i pensieri ossessivi attraverso tecniche cognitive e di mindfulness. Imparerai a osservare i pensieri senza esserne sopraffatto.',
    benefitsText: '• Riduce l\'intensità dei pensieri ossessivi\n• Migliora la capacità di distacco dai pensieri\n• Sviluppa strategie cognitive efficaci\n• Aumenta la consapevolezza metacognitiva\n• Riduce l\'ansia associata alle ossessioni',
    objectiveText: 'Gestire e ridurre l\'impatto dei pensieri ossessivi',
    duration: 18,
    image: './assets/exercises/contrasta-ossessione.png',
    steps: [
      {
        id: 'thought-identification',
        type: 'withtextarea',
        title: 'Identificazione del Pensiero',
        placeholder: 'Scrivi il pensiero ossessivo che ti sta disturbando. Cerca di essere specifico e dettagliato.'
      },
      {
        id: 'cognitive-techniques',
        type: 'default',
        title: 'Tecniche Cognitive',
        content: [
          'Riconosci che è solo un pensiero, non una realtà',
          'Etichetta il pensiero: "Sto avendo il pensiero che..."',
          'Pratica il distacco: osserva il pensiero come una nuvola che passa',
          'Non cercare di sopprimere, ma lascia che il pensiero si dissolva naturalmente'
        ]
      },
      {
        id: 'mindfulness-practice',
        type: 'withtextarea',
        title: 'Pratica di Mindfulness',
        placeholder: 'Descrivi come cambia la tua relazione con il pensiero quando lo osservi senza giudizio.'
      },
      {
        id: 'alternative-focus',
        type: 'withtextarea',
        title: 'Focus Alternativo',
        placeholder: 'Su cosa puoi concentrare la tua attenzione ora? Descrivi un\'attività o un pensiero più costruttivo.'
      }
    ],
    category: 'cognitive',
    difficulty: 'medium'
  },
  {
    id: 'gratitudine-mattino',
    name: 'Gratitudine del mattino',
    introText: 'Inizia la giornata con un atteggiamento positivo attraverso la pratica della gratitudine. Questo esercizio ti aiuta a focalizzarti sugli aspetti positivi della vita, migliorando l\'umore e la prospettiva generale.',
    benefitsText: '• Migliora l\'umore e l\'energia mattutina\n• Riduce pensieri negativi e ansia\n• Aumenta la motivazione per la giornata\n• Sviluppa una prospettiva più positiva\n• Migliora le relazioni e la gratitudine interpersonale',
    objectiveText: 'Coltivare gratitudine e positività per iniziare bene la giornata',
    duration: 8,
    image: './assets/exercises/gratitudine-mattino.png',
    steps: [
      {
        id: 'morning-setup',
        type: 'default',
        title: 'Preparazione Mattutina',
        content: [
          'Trova un momento tranquillo al risveglio',
          'Siediti comodamente o rimani a letto',
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
    difficulty: 'easy'
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
    difficulty: 'easy'
  },
  {
    id: 'scrittura',
    name: 'Scrittura terapeutica',
    introText: 'La scrittura terapeutica è uno strumento potente per elaborare pensieri ed emozioni. Attraverso la scrittura libera, potrai esplorare i tuoi sentimenti, chiarire i pensieri e trovare nuove prospettive sui problemi.',
    benefitsText: '• Chiarisce pensieri ed emozioni\n• Riduce lo stress e l\'ansia\n• Migliora l\'autoconsapevolezza\n• Facilita l\'elaborazione emotiva\n• Sviluppa nuove prospettive',
    objectiveText: 'Elaborare pensieri ed emozioni attraverso la scrittura',
    duration: 0,
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
    difficulty: 'medium'
  },
  {
    id: 'respirazione-consapevole',
    name: 'Respirazione consapevole',
    introText: 'La respirazione consapevole è una tecnica fondamentale di mindfulness che ti aiuta a calmare la mente e ridurre l\'ansia. Attraverso l\'attenzione al respiro, svilupperai maggiore consapevolezza del momento presente e imparerai a gestire lo stress in modo naturale.',
    benefitsText: '• Riduce ansia e stress immediatamente\n• Migliora la concentrazione e la chiarezza mentale\n• Attiva il sistema nervoso parasimpatico\n• Favorisce il rilassamento profondo\n• Sviluppa la consapevolezza del momento presente\n• Migliora la qualità del sonno',
    objectiveText: 'Calmare la mente e ridurre l\'ansia attraverso il respiro',
    duration: 12,
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
      },
      {
        id: 'audio-practice',
        type: 'withaudio',
        title: 'Pratica con Audio',
        content: [
          'Clicca Play per iniziare il sottofondo musicale',
          'Chiudi gli occhi e rilassati',
          'Inspira accogliendo energia, espira rilasciando tensione',
          'Prova un respiro più profondo: inspira contando fino a 4, espira fino a 6',
          'Ritorna gradualmente a un ritmo di respirazione naturale',
          'Mantieni l\'attenzione sulle sensazioni di ogni ciclo respiratorio',
          'Se la mente vaga, riportala gentilmente al respiro'
        ],
        audioFile: './assets/audio/breathing-guide.mp3',
        duration: 480
      }
    ],
    category: 'mindfulness',
    difficulty: 'easy'
  }
];

async function migrateExercises() {
  console.log('🚀 Inizio migrazione esercizi...');
  
  // Prima elimina tutti gli esercizi esistenti
  console.log('🗑️ Eliminazione esercizi esistenti...');
  const { error: deleteError } = await supabase
    .from('exercises')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Elimina tutto tranne un ID impossibile
  
  if (deleteError) {
    console.error('❌ Errore nell\'eliminazione:', deleteError);
  } else {
    console.log('✅ Esercizi esistenti eliminati');
  }
  
  let migrated = 0;
  let errors = [];
  
  // Inserisci tutti gli esercizi in un'unica operazione
  console.log('📝 Inserimento esercizi...');
  
  const exercisesToInsert = exercises.map(exercise => ({
    name: exercise.name,
    intro_text: exercise.introText,
    benefits_text: exercise.benefitsText,
    objective_text: exercise.objectiveText,
    duration: exercise.duration,
    image: exercise.image,
    steps: exercise.steps,
    category: exercise.category,
    difficulty: exercise.difficulty
  }));
  
  try {
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercisesToInsert);
    
    if (error) {
      console.error('❌ Errore nell\'inserimento batch:', error);
      errors.push(`Inserimento batch: ${error.message}`);
    } else {
      migrated = exercisesToInsert.length;
      console.log(`✅ ${migrated} esercizi inseriti con successo`);
    }
  } catch (err) {
    console.error('❌ Errore nell\'inserimento batch:', err);
    errors.push(`Inserimento batch: ${err.message}`);
  }
  
  console.log('\n📊 Risultati migrazione:');
  console.log(`✅ Esercizi migrati: ${migrated}`);
  console.log(`❌ Errori: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n🔍 Dettagli errori:');
    errors.forEach(error => console.log(`  - ${error}`));
  }
  
  // Verifica finale
  const { data: finalCheck } = await supabase.from('exercises').select('*');
  console.log(`\n🎯 Totale esercizi nel database: ${finalCheck?.length || 0}`);
  if (finalCheck && finalCheck.length > 0) {
    console.log('📋 Esercizi nel database:');
    finalCheck.forEach((ex, index) => console.log(`  ${index + 1}. ${ex.name}`));
  }
}

migrateExercises().catch(console.error);