const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase from environment variables
// Use Service Role Key to bypass RLS if available, otherwise fallback to Anon Key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Warning: SUPABASE_SERVICE_ROLE_KEY not found. Using Anon Key (might fail if RLS is enabled for INSERT).');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Unified Exercise List
const exercises = [
  {
    name: 'Body Scan',
    intro_text: 'Il Body Scan è una tecnica di mindfulness che ti aiuta a sviluppare consapevolezza del tuo corpo e a rilasciare le tensioni accumulate. Attraverso un\'attenzione sistematica a ogni parte del corpo, imparerai a riconoscere e sciogliere lo stress fisico.',
    benefits_text: '• Riduce la tensione muscolare e lo stress fisico\n• Migliora la consapevolezza corporea\n• Favorisce il rilassamento profondo\n• Aiuta a identificare aree di tensione\n• Migliora la qualità del sonno\n• Sviluppa la capacità di ascolto del corpo',
    objective_text: 'Sviluppare consapevolezza corporea e rilasciare tensioni',
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
    name: 'Contrasta la compulsione',
    intro_text: 'Questo esercizio ti aiuta a riconoscere e gestire le compulsioni attraverso tecniche di esposizione graduale e prevenzione della risposta. Imparerai a tollerare l\'ansia senza cedere ai comportamenti compulsivi.',
    benefits_text: '• Riduce la frequenza delle compulsioni\n• Aumenta la tolleranza all\'ansia\n• Sviluppa strategie di coping alternative\n• Migliora il senso di controllo\n• Riduce l\'interferenza del DOC nella vita quotidiana',
    objective_text: 'Gestire e ridurre i comportamenti compulsivi',
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
    name: 'Contrasta l\'ossessione',
    intro_text: 'Questo esercizio ti insegna a riconoscere e gestire i pensieri ossessivi attraverso tecniche cognitive e di mindfulness. Imparerai a osservare i pensieri senza esserne sopraffatto.',
    benefits_text: '• Riduce l\'intensità dei pensieri ossessivi\n• Migliora la capacità di distacco dai pensieri\n• Sviluppa strategie cognitive efficaci\n• Aumenta la consapevolezza metacognitiva\n• Riduce l\'ansia associata alle ossessioni',
    objective_text: 'Gestire e ridurre l\'impatto dei pensieri ossessivi',
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
    name: 'Gratitudine del mattino',
    intro_text: 'Inizia la giornata con un atteggiamento positivo attraverso la pratica della gratitudine. Questo esercizio ti aiuta a focalizzarti sugli aspetti positivi della vita, migliorando l\'umore e la prospettiva generale.',
    benefits_text: '• Migliora l\'umore e l\'energia mattutina\n• Riduce pensieri negativi e ansia\n• Aumenta la motivazione per la giornata\n• Sviluppa una prospettiva più positiva\n• Migliora le relazioni e la gratitudine interpersonale',
    objective_text: 'Coltivare gratitudine e positività per iniziare bene la giornata',
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
    name: 'Gratitudine della sera',
    intro_text: 'Concludi la giornata con un atteggiamento positivo attraverso la pratica della gratitudine. Questo esercizio ti aiuta a riflettere sugli aspetti positivi della giornata, migliorando l\'umore e favorendo un sonno tranquillo.',
    benefits_text: '• Migliora l\'umore serale\n• Riduce i pensieri negativi prima di dormire\n• Aumenta la soddisfazione per la giornata\n• Sviluppa una prospettiva positiva\n• Favorisce un sonno più riposante',
    objective_text: 'Riflettere sulla gratitudine e positività serale',
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
    name: 'Scrittura terapeutica',
    intro_text: 'La scrittura terapeutica è uno strumento potente per elaborare pensieri ed emozioni. Attraverso la scrittura libera, potrai esplorare i tuoi sentimenti, chiarire i pensieri e trovare nuove prospettive sui problemi.',
    benefits_text: '• Chiarisce pensieri ed emozioni\n• Riduce lo stress e l\'ansia\n• Migliora l\'autoconsapevolezza\n• Facilita l\'elaborazione emotiva\n• Sviluppa nuove prospettive',
    objective_text: 'Elaborare pensieri ed emozioni attraverso la scrittura',
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
    name: 'Respirazione consapevole',
    intro_text: 'La respirazione consapevole è una tecnica fondamentale di mindfulness che ti aiuta a calmare la mente e ridurre l\'ansia. Attraverso l\'attenzione al respiro, svilupperai maggiore consapevolezza del momento presente e imparerai a gestire lo stress in modo naturale.',
    benefits_text: '• Riduce ansia e stress immediatamente\n• Migliora la concentrazione e la chiarezza mentale\n• Attiva il sistema nervoso parasimpatico\n• Favorisce il rilassamento profondo\n• Sviluppa la consapevolezza del momento presente\n• Migliora la qualità del sonno',
    objective_text: 'Calmare la mente e ridurre l\'ansia attraverso il respiro',
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
  },
  {
    name: 'Meditazione guidata',
    intro_text: 'Una sessione di meditazione profonda per rilassare mente e corpo attraverso la visualizzazione di una luce dorata che si espande in tutto il corpo, favorendo calma e connessione interiore.',
    benefits_text: '• Riduce stress e tensioni profonde\n• Favorisce il rilassamento completo\n• Migliora la connessione mente-corpo\n• Sviluppa la gratitudine e la pace interiore\n• Aumenta la consapevolezza del momento presente',
    objective_text: 'Raggiungere uno stato di calma profonda e connessione con il proprio centro autentico',
    duration: 12,
    image: './assets/exercises/meditazione-guidata.png',
    steps: [
      {
        id: 'introduzione',
        type: 'default',
        title: 'Introduzione alla meditazione',
        content: [
          'Trova una posizione comoda, seduto o sdraiato',
          'Chiudi dolcemente gli occhi',
          'Inizia a respirare lentamente e profondamente',
          'Permetti al tuo corpo di rilassarsi completamente',
          'Lascia andare ogni tensione e preoccupazione'
        ]
      },
      {
        id: 'meditazione-audio',
        type: 'withaudio',
        title: 'Meditazione con luce dorata',
        content: [
          'Segui la voce guida per la meditazione completa',
          'Visualizza una luce dorata nel centro del petto',
          'Lascia che la luce si espanda in tutto il corpo',
          'Resta in connessione con la sensazione di pace',
          'Concludi con gratitudine per questo momento'
        ],
        audioFile: './assets/audio/meditation-guided.mp3',
        duration: 600
      }
    ],
    category: 'mindfulness',
    difficulty: 'easy'
  }
];

async function batchExercises() {
  console.log('🚀 Starting batch exercises upload...');
  
  try {
    // 1. Delete existing (clean slate) - using a filter that matches all UUIDs
    console.log('🗑️ Cleaning existing exercises...');
    const { error: deleteError } = await supabase
      .from('exercises')
      .delete()
      .neq('name', '___impossible_name___'); // This will delete everything
    
    if (deleteError) {
      console.warn('⚠️ Warning during delete:', deleteError.message);
    } else {
      console.log('✅ Existing exercises cleaned');
    }
    
    // 2. Insert new batch
    console.log(`📝 Inserting ${exercises.length} exercises...`);
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercises)
      .select();
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Successfully inserted ${data.length} exercises!`);
    
    // 3. Final Verification
    const { data: finalCheck } = await supabase.from('exercises').select('name');
    console.log('\n📊 Summary:');
    finalCheck?.forEach((ex: any, i: number) => console.log(`   ${i + 1}. ${ex.name}`));
    console.log(`\n🎉 Total: ${finalCheck?.length || 0} exercises in database.`);

  } catch (error) {
    console.error('💥 Error during batch:', error);
    process.exit(1);
  }
}

batchExercises();
