import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Image,
  Animated,
  Easing,
  FlatList,
  Platform,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Pause, Stop as PhosphorStop, MusicNotesMinus, MusicNotesPlus, ArrowLeft, X } from 'phosphor-react-native';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';
import Svg, { Circle, Path, G, ClipPath, Defs, Rect, Mask, LinearGradient, Stop, SvgXml, RadialGradient } from 'react-native-svg';
import { Exercise, ExerciseStep, ExerciseProgress } from '../types/Exercise';
import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';
import WorkoutService from '../services/WorkoutService';
import { useAuth } from '../contexts/AuthContext';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
  onBack: () => void;
  onClose: () => void;
  onComplete: () => void;
  onNavigateToDiary?: () => void;
}

const { width, height } = Dimensions.get('window');

const FaceSad = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill={selected ? "#FFEBEB" : "#F8F7FF"}/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill={selected ? "#FF6B6B" : "#B8B8FF"}/>
    <Path d="M21.5 46C21.5 46 25 40 32.5 40C40 40 43.5 46 43.5 46" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M22 25.1992C23 25.1992 24.5 26.5 24.5 28" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M43 25.1992C42 25.1992 40.5 26.5 40.5 28" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceNeutral = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill={selected ? "#FFFBEB" : "#F8F7FF"}/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill={selected ? "#FFD93D" : "#B8B8FF"}/>
    <Path d="M21 44H44" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M20 27H26" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M39 27H45" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceHappy = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5777 31.9983C62.5777 48.6108 49.1105 62.0779 32.4979 62.0779C15.8852 62.0779 2.41797 48.6108 2.41797 31.9983C2.41797 15.3857 15.8852 1.91846 32.4979 1.91846C49.1105 1.91846 62.5777 15.3857 62.5777 31.9983Z" fill={selected ? "#EEF9EF" : "#F8F7FF"}/>
    <Path d="M32.4987 63.9974C14.8253 63.9974 0.5 49.6721 0.5 31.9987C0.5 14.3253 14.8253 0 32.4987 0C50.1721 0 64.4974 14.3253 64.4974 31.9987C64.4974 49.6721 50.1721 63.9974 32.4987 63.9974ZM32.4987 3.83771C16.9403 3.83771 4.33771 16.4403 4.33771 31.9987C4.33771 47.5571 16.9403 60.1597 32.4987 60.1597C48.057 60.1597 60.6596 47.5571 60.6596 31.9987C60.6596 16.4403 48.057 3.83771 32.4987 3.83771Z" fill={selected ? "#6BCF7F" : "#B8B8FF"}/>
    <Path d="M21.5 40C21.5 40 25 46 32.5 46C40 46 43.5 40 43.5 40" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M20 28C20 28 22 25 25 25C28 25 30 28 30 28" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M35 28C35 28 37 25 40 25C43 25 45 28 45 28" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const getMoodComponent = (mood: 'sad' | 'neutral' | 'happy', selected: boolean) => {
  switch (mood) {
    case 'sad':
      return <FaceSad selected={selected} />;
    case 'neutral':
      return <FaceNeutral selected={selected} />;
    case 'happy':
      return <FaceHappy selected={selected} />;
    default:
      return <FaceHappy selected={selected} />;
  }
};

const getMoodColor = (mood: 'sad' | 'neutral' | 'happy') => {
  switch (mood) {
    case 'sad':
      return '#FF6B6B';
    case 'neutral':
      return '#FFD93D';
    case 'happy':
      return '#6BCF7F';
    default:
      return '#E8E8E8';
  }
};

const imageMap: { [key: string]: any } = {
  './assets/exercises/body-scan.png': require('../assets/exercises/body-scan.png'),
  './assets/exercises/contrasta-compulsione.png': require('../assets/exercises/contrasta-compulsione.png'),
  './assets/exercises/contrasta-ossessione.png': require('../assets/exercises/contrasta-ossessione.png'),
  './assets/exercises/gratitudine-mattino.png': require('../assets/exercises/gratitudine-mattino.png'),
  './assets/exercises/scrittura.png': require('../assets/exercises/scrittura.png'),
  './assets/exercises/respirazione-consapevole.png': require('../assets/exercises/respirazione-consapevole.png'),
};
const getExerciseImagePNG = (imagePath: string) => {
  return imageMap[imagePath] || require('../assets/exercises/body-scan.png');
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface BreathingScreenProps {
  onClose: () => void;
  onComplete: () => void;
  onAbort: () => void;
  initialIsPlaying: boolean;
}

const BreathingScreen: React.FC<BreathingScreenProps> = ({
  onClose,
  onComplete,
  onAbort,
  initialIsPlaying,
}) => {
  const insets = useSafeAreaInsets();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [phaseText, setPhaseText] = useState("INSPIRA");
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [audioFadingOut, setAudioFadingOut] = useState(false);
  
  const textFadeAnim = useRef(new Animated.Value(1)).current;
  const currentPhaseRef = useRef("INSPIRA");
  
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const audioRef = useRef<Audio.Sound | null>(null);

  const timeElapsed = useRef(0);
  const CIRCLE_RADIUS = width * 0.35; // Responsive circle size
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
  
  const animRadius = useRef(new Animated.Value(CIRCLE_RADIUS * 0.2)).current;
  const animStroke = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    const loadAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/breathing-guide.mp3')
        );
        if (!isMounted) {
          sound.unloadAsync();
          return;
        }
        audioRef.current = sound;
        if (isPlaying && musicEnabled) {
          await sound.playAsync();
        }
      } catch (e) {
        console.error("Error loading breathing audio", e);
      }
    };
    loadAudio();

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.unloadAsync();
      }
    };
  }, []);

  // Early audio fade-out logic (starts at last 5 seconds)
  useEffect(() => {
    let fadeOutInterval: NodeJS.Timeout;
    if (timeLeft <= 5 && timeLeft > 0 && !audioFadingOut && musicEnabled && audioRef.current) {
      setAudioFadingOut(true);
      let vol = 1.0;
      fadeOutInterval = setInterval(async () => {
        vol -= 0.05; // 20 steps down to 0
        if (vol <= 0) {
          vol = 0;
          clearInterval(fadeOutInterval);
        }
        if (audioRef.current) {
          try {
            await audioRef.current.setVolumeAsync(vol);
          } catch (e) {
            // Ignore if audio is manually stopped/unmounted
          }
        }
      }, 250); // 20 steps * 250ms = 5000ms (5 seconds)
    }

    return () => {
      if (fadeOutInterval) clearInterval(fadeOutInterval);
    };
  }, [timeLeft, audioFadingOut, musicEnabled]);

  // Visual auto-completion fade-out logic
  useEffect(() => {
    if (timeLeft <= 0 && !isFinishing) {
      setIsFinishing(true);
      
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        onComplete();
      }, 3000); // 3 seconds visual fade
    }
  }, [timeLeft, isFinishing]);

  useEffect(() => {
    let frameId: number;
    let lastTime = Date.now();
    let localElapsed = timeElapsed.current;

    const updatePhase = (newPhase: string) => {
      if (currentPhaseRef.current !== newPhase) {
        currentPhaseRef.current = newPhase;
        Animated.sequence([
          Animated.timing(textFadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          Animated.timing(textFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();
        setTimeout(() => setPhaseText(newPhase), 150);
      }
    };

    const tick = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      
      localElapsed += delta;
      timeElapsed.current = localElapsed;
      
      const secondsLeft = Math.max(0, 180 - Math.floor(localElapsed / 1000));
      setTimeLeft(secondsLeft);
      
      const cycleTime = localElapsed % 16000;
      
      if (cycleTime < 5000) {
         updatePhase("INSPIRA");
         const progress = cycleTime / 5000;
         const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
         animRadius.setValue(CIRCLE_RADIUS * eased);
         animStroke.setValue(0);
      } else if (cycleTime < 8000) {
         updatePhase("MANTIENI IL RESPIRO");
         const progress = (cycleTime - 5000) / 3000;
         const pulse = Math.sin(progress * Math.PI * 4) * 0.015;
         animRadius.setValue(CIRCLE_RADIUS * (1 + pulse));
         animStroke.setValue(progress);
      } else if (cycleTime < 13000) {
         updatePhase("ESPIRA");
         const progress = (cycleTime - 8000) / 5000;
         const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
         animRadius.setValue(CIRCLE_RADIUS * (1 - eased));
         animStroke.setValue(0);
      } else {
         updatePhase("MANTIENI IL RESPIRO");
         const progress = (cycleTime - 13000) / 3000;
         animRadius.setValue(0);
         animStroke.setValue(progress);
      }
      
      frameId = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      lastTime = Date.now();
      frameId = requestAnimationFrame(tick);
      if (musicEnabled && audioRef.current) {
        audioRef.current.playAsync();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pauseAsync();
      }
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isPlaying, musicEnabled, onComplete, audioRef]);

  const toggleMusic = async () => {
    const nextState = !musicEnabled;
    setMusicEnabled(nextState);
    if (!nextState && audioRef.current) {
      await audioRef.current.pauseAsync();
    } else if (nextState && audioRef.current && isPlaying) {
      await audioRef.current.playAsync();
    }
  };

  const handleStop = async () => {
    if (audioRef.current) {
      await audioRef.current.stopAsync();
    }
    onComplete();
  };

  const handleCloseRequest = () => {
    setShowExitMenu(true);
  };

  const strokeDashoffset = animStroke.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_CIRCUMFERENCE, 0]
  });

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  const svgSize = CIRCLE_RADIUS * 2 + 30;

  return (
    <View style={breathingStyles.container}>
      <Animated.View style={{ flex: 1, opacity: contentOpacity }} pointerEvents={isFinishing ? 'none' : 'auto'}>
        <View style={[breathingStyles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={onClose} style={breathingStyles.headerIcon}>
          <ArrowLeft color="white" size={28} weight="regular" />
        </TouchableOpacity>
        <Text style={breathingStyles.timeText}>{timeStr}</Text>
        <TouchableOpacity onPress={handleCloseRequest} style={breathingStyles.headerIcon}>
          <X color="white" size={28} weight="regular" />
        </TouchableOpacity>
      </View>
      
      <View style={breathingStyles.animationContainer}>
        <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          <Defs>
            <LinearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.8" />
            </LinearGradient>
          </Defs>
          <Circle 
            cx={svgSize/2} 
            cy={svgSize/2} 
            r={CIRCLE_RADIUS} 
            fill="none" 
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={2}
          />
          <AnimatedCircle 
            cx={svgSize/2} 
            cy={svgSize/2} 
            r={animRadius} 
            fill="url(#circleGrad)" 
          />
          <AnimatedCircle
            cx={svgSize/2} 
            cy={svgSize/2} 
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${svgSize/2} ${svgSize/2})`}
          />
        </Svg>
        <Animated.Text style={[breathingStyles.phaseText, { opacity: textFadeAnim }]}>{phaseText}</Animated.Text>
      </View>
      
      <View style={[breathingStyles.controlsContainer, { paddingBottom: Math.max(40, insets.bottom + 20) }]}>
        <TouchableOpacity onPress={toggleMusic} style={breathingStyles.secondaryBtn}>
          {musicEnabled ? <MusicNotesMinus color="white" size={24} weight="fill" /> : <MusicNotesPlus color="white" size={24} weight="fill" />}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)} style={breathingStyles.playBtn}>
          {isPlaying ? <Pause color="#8B7CF6" size={36} weight="fill" /> : <Play color="#8B7CF6" size={36} weight="fill" />}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleStop} style={breathingStyles.secondaryBtn}>
          <PhosphorStop color="white" size={24} weight="fill" />
        </TouchableOpacity>
      </View>
      </Animated.View>

      <Modal visible={showExitMenu} transparent animationType="fade">
        <View style={breathingStyles.modalOverlay}>
          <View style={breathingStyles.actionSheet}>
            <View style={breathingStyles.actionSheetGroup}>
              <TouchableOpacity style={breathingStyles.actionButtonDestructive} onPress={async () => {
                 setShowExitMenu(false);
                 if (audioRef.current) await audioRef.current.stopAsync();
                 onAbort();
              }}>
                 <Text style={breathingStyles.actionTextDestructive}>Abbandona</Text>
              </TouchableOpacity>
              <View style={breathingStyles.actionSeparator} />
              <TouchableOpacity style={breathingStyles.actionButton} onPress={() => {
                 setShowExitMenu(false);
                 handleStop();
              }}>
                 <Text style={breathingStyles.actionText}>Salva</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[breathingStyles.actionSheetGroup, breathingStyles.actionButton, { marginTop: 8 }]} onPress={() => setShowExitMenu(false)}>
               <Text style={breathingStyles.actionTextBold}>Cancella</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const breathingStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#8B7CF6',
    zIndex: 1000,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingTop removed from here, handled dynamically
  },
  headerIcon: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    margin: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  actionSheetGroup: {
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
  },
  actionButton: {
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  actionButtonDestructive: {
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  actionText: {
    fontSize: 20,
    color: '#007AFF', // iOS blue
  },
  actionTextBold: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  actionTextDestructive: {
    fontSize: 20,
    color: '#FF3B30', // iOS red
  },
  actionSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
  },
  timeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 40,
    letterSpacing: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  secondaryBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});


// ─── Body Scan Screen ──────────────────────────────────────────────────────

interface BodyScanScreenProps {
  onClose: () => void;
  onComplete: () => void;
  onAbort: () => void;
  initialIsPlaying: boolean;
}

// Body zone guide data
const BODY_SCAN_ZONES = [
  { start: 0.00, end: 0.125, label: 'Testa', guide: 'Porta l\'attenzione sulla sommità della testa.\nOsserva ogni sensazione senza giudizio.' },
  { start: 0.125, end: 0.25, label: 'Viso e collo', guide: 'Osserva la fronte, gli occhi, le guance.\nRilascia ogni tensione nel collo.' },
  { start: 0.25, end: 0.375, label: 'Spalle e braccia', guide: 'Rilassa le spalle, lasciale cadere dolcemente.\nSenti le braccia diventare pesanti e calde.' },
  { start: 0.375, end: 0.50, label: 'Petto', guide: 'Senti il ritmo del respiro nel petto.\nOsserva il movimento naturale del torace.' },
  { start: 0.50, end: 0.625, label: 'Addome', guide: 'Porta la consapevolezza all\'addome.\nOsserva come si espande e si contrae.' },
  { start: 0.625, end: 0.75, label: 'Zona lombare', guide: 'Osserva la zona lombare e i fianchi.\nLascia andare ogni tensione accumulata.' },
  { start: 0.75, end: 0.875, label: 'Gambe', guide: 'Scorri lungo le cosce e le ginocchia.\nOsserva il peso delle gambe.' },
  { start: 0.875, end: 1.00, label: 'Piedi', guide: 'Porta l\'attenzione fino alla punta dei piedi.\nSenti il contatto con il suolo.' },
];

const getBodyZone = (progress: number) => {
  const zone = BODY_SCAN_ZONES.find(z => progress >= z.start && progress < z.end);
  return zone || BODY_SCAN_ZONES[BODY_SCAN_ZONES.length - 1];
};

const BodyScanScreen: React.FC<BodyScanScreenProps> = ({ onClose, onComplete, onAbort, initialIsPlaying }) => {
  const insets = useSafeAreaInsets();
  const TOTAL_SECONDS = 480; // 8 minutes
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [guideText, setGuideText] = useState(BODY_SCAN_ZONES[0].guide);
  const [zoneLabel, setZoneLabel] = useState(BODY_SCAN_ZONES[0].label);
  
  const scannerY = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;
  const glowScale = useRef(new Animated.Value(0.9)).current;
  const textFadeAnim = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  
  const timeElapsed = useRef(0);
  const currentZoneRef = useRef('Testa');
  const audioRef = useRef<Audio.Sound | null>(null);

  const headerHeight = 120;
  const footerHeight = 160;
  const availableHeight = height - headerHeight - footerHeight;
  const BODY_IMAGE_WIDTH = width * 0.75;
  const BODY_IMAGE_HEIGHT = Math.min(availableHeight * 0.85, BODY_IMAGE_WIDTH * 2.1);
  const GLOW_SIZE = 120;

  // Caricamento Audio
  useEffect(() => {
    let isMounted = true;
    const loadAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/body-scan.mp3'),
          { isLooping: true, volume: 1.0 }
        );
        if (!isMounted) { sound.unloadAsync(); return; }
        audioRef.current = sound;
        if (isPlaying && musicEnabled) await sound.playAsync();
      } catch (e) {
        console.error('Error loading body-scan audio', e);
      }
    };
    loadAudio();
    return () => {
      isMounted = false;
      if (audioRef.current) audioRef.current.unloadAsync();
    };
  }, []);

  // Controllo riproduzione audio
  useEffect(() => {
    const syncAudio = async () => {
      if (!audioRef.current) return;
      try {
        if (isPlaying && musicEnabled) {
          await audioRef.current.playAsync();
        } else {
          await audioRef.current.pauseAsync();
        }
      } catch (e) {
        console.error('Error syncing body-scan audio', e);
      }
    };
    syncAudio();
  }, [isPlaying, musicEnabled]);

  // Pulsazione morbida del bagliore
  useEffect(() => {
    if (isPlaying) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(glowPulse, {
              toValue: 0.7, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
            }),
            Animated.timing(glowScale, {
              toValue: 1.15, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(glowPulse, {
              toValue: 0.3, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
            }),
            Animated.timing(glowScale, {
              toValue: 0.85, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
            }),
          ]),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      glowPulse.stopAnimation();
      glowScale.stopAnimation();
    }
  }, [isPlaying]);

  // Timer e discesa del bagliore
  useEffect(() => {
    let lastTime = Date.now();
    let frameId: number;

    const tick = () => {
      if (!isPlaying || isFinishing) return;

      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      timeElapsed.current += delta;

      const secondsLeft = Math.max(0, TOTAL_SECONDS - Math.floor(timeElapsed.current / 1000));
      setTimeLeft(secondsLeft);

      const progress = Math.min(1, timeElapsed.current / (TOTAL_SECONDS * 1000));
      scannerY.setValue(progress);

      // Aggiorna testo guida con fade
      const zone = getBodyZone(progress);
      if (zone.label !== currentZoneRef.current) {
        currentZoneRef.current = zone.label;
        Animated.timing(textFadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
          setGuideText(zone.guide);
          setZoneLabel(zone.label);
          Animated.timing(textFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        });
      }

      // Fade out audio negli ultimi 5 secondi
      if (secondsLeft <= 5 && musicEnabled && audioRef.current) {
        const volume = Math.max(0, secondsLeft / 5);
        audioRef.current.setVolumeAsync(volume);
      }

      // Fine esercizio
      if (timeElapsed.current >= TOTAL_SECONDS * 1000) {
        setIsFinishing(true);
        Animated.timing(contentOpacity, {
          toValue: 0, duration: 2000, useNativeDriver: true,
        }).start(() => onComplete());
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      lastTime = Date.now();
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isPlaying, isFinishing, musicEnabled]);

  const toggleMusic = async () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    if (!next && audioRef.current) await audioRef.current.pauseAsync();
    else if (next && audioRef.current && isPlaying) await audioRef.current.playAsync();
  };

  const handleStop = async () => {
    if (audioRef.current) await audioRef.current.stopAsync();
    onComplete();
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <View style={bodyScanStyles.container}>
      <Animated.View style={{ flex: 1, opacity: contentOpacity }} pointerEvents={isFinishing ? 'none' : 'auto'}>
        {/* Header */}
        <View style={[bodyScanStyles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={onClose} style={bodyScanStyles.headerIcon}>
            <ArrowLeft color="white" size={28} weight="regular" />
          </TouchableOpacity>
          <Text style={bodyScanStyles.timeText}>{timeStr}</Text>
          <TouchableOpacity onPress={() => setShowExitMenu(true)} style={bodyScanStyles.headerIcon}>
            <X color="white" size={28} weight="regular" />
          </TouchableOpacity>
        </View>

        {/* Body + Glow */}
        <View style={bodyScanStyles.bodyContainer}>
          <View style={[bodyScanStyles.bodyWrapper, { width: width, height: BODY_IMAGE_HEIGHT }]}>
            {/* Immagine del Corpo */}
            <Image 
              source={require('../assets/exercises/body.png')} 
              style={{ width: BODY_IMAGE_WIDTH, height: BODY_IMAGE_HEIGHT, resizeMode: 'contain' }} 
            />

            {/* Bagliore morbido pulsante */}
            <Animated.View 
              style={[
                bodyScanStyles.glowContainer,
                {
                  transform: [
                    {
                      translateY: scannerY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [BODY_IMAGE_HEIGHT * 0.02, BODY_IMAGE_HEIGHT * 0.92]
                      })
                    },
                    { scale: glowScale },
                  ],
                  opacity: glowPulse,
                }
              ]}
            >
              <View style={[bodyScanStyles.glowOuter, { width: GLOW_SIZE * 1.6, height: GLOW_SIZE * 1.6, borderRadius: GLOW_SIZE * 0.8 }]} />
              <View style={[bodyScanStyles.glowMiddle, { width: GLOW_SIZE, height: GLOW_SIZE, borderRadius: GLOW_SIZE / 2 }]} />
              <View style={[bodyScanStyles.glowInner, { width: GLOW_SIZE * 0.5, height: GLOW_SIZE * 0.5, borderRadius: GLOW_SIZE * 0.25 }]} />
            </Animated.View>
          </View>
        </View>

        {/* Testo guida */}
        <Animated.View style={[bodyScanStyles.guideContainer, { opacity: textFadeAnim }]}>
          <Text style={bodyScanStyles.zoneLabelText}>{zoneLabel}</Text>
          <Text style={bodyScanStyles.guideText}>{guideText}</Text>
        </Animated.View>

        {/* Controls */}
        <View style={[bodyScanStyles.controlsContainer, { paddingBottom: Math.max(40, insets.bottom + 20) }]}>
          <TouchableOpacity onPress={toggleMusic} style={bodyScanStyles.secondaryBtn}>
            {musicEnabled
              ? <MusicNotesMinus color="white" size={24} weight="fill" />
              : <MusicNotesPlus color="white" size={24} weight="fill" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)} style={bodyScanStyles.playBtn}>
            {isPlaying
              ? <Pause color="#8B7CF6" size={36} weight="fill" />
              : <Play color="#8B7CF6" size={36} weight="fill" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleStop} style={bodyScanStyles.secondaryBtn}>
            <PhosphorStop color="white" size={24} weight="fill" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Exit Modal */}
      <Modal visible={showExitMenu} transparent animationType="fade">
        <View style={breathingStyles.modalOverlay}>
          <View style={breathingStyles.actionSheet}>
            <View style={breathingStyles.actionSheetGroup}>
              <TouchableOpacity style={breathingStyles.actionButtonDestructive} onPress={async () => {
                setShowExitMenu(false);
                if (audioRef.current) await audioRef.current.stopAsync();
                onAbort();
              }}>
                <Text style={breathingStyles.actionTextDestructive}>Abbandona</Text>
              </TouchableOpacity>
              <View style={breathingStyles.actionSeparator} />
              <TouchableOpacity style={breathingStyles.actionButton} onPress={() => { setShowExitMenu(false); handleStop(); }}>
                <Text style={breathingStyles.actionText}>Salva</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[breathingStyles.actionSheetGroup, breathingStyles.actionButton, { marginTop: 8 }]} onPress={() => setShowExitMenu(false)}>
              <Text style={breathingStyles.actionTextBold}>Cancella</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const bodyScanStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#8B7CF6',
    zIndex: 1000,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  headerIcon: { padding: 8 },
  timeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bodyWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowOuter: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  glowMiddle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  glowInner: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  guideContainer: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 90,
  },
  zoneLabelText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  guideText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ─── ExerciseDetailScreen ───────────────────────────────────────────────────

const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  exercise,
  onBack,
  onClose,
  onComplete,
  onNavigateToDiary,
}) => {
  const insets = useSafeAreaInsets();
  const { currentUser, setCurrentMood } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [stepResponses, setStepResponses] = useState<{ [stepId: string]: string }>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);
  const audioRef = useRef<Audio.Sound | null>(null);
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const [showBodyScanAnimation, setShowBodyScanAnimation] = useState(false);
  const breathingScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleStartExercise = () => {
    setIsStarted(true);
    // Use scrollToOffset for reliable cross-platform navigation
    flatListRef.current?.scrollToOffset({ offset: width, animated: true });
  };

  const handleNextStep = async () => {
    if (audioRef.current) {
      await audioRef.current.pauseAsync();
      setIsPlaying(false);
      await audioRef.current.unloadAsync();
      audioRef.current = null;
    }
    // Removed unconditional close of Breathing Animation to handle single-slide scenarios.
    
    if (exercise.id === 'respirazione-consapevole' && currentStep === 1) {
      setShowBreathingAnimation(true);
      setIsPlaying(true);
      return;
    }

    if (exercise.id === 'body-scan' && currentStep === 1) {
      setShowBodyScanAnimation(true);
      setIsPlaying(true);
      return;
    }
    
    if (currentStep < exercise.steps.length) {
      flatListRef.current?.scrollToOffset({ offset: width * (currentStep + 1), animated: true });
    } else {
      handleCompleteExercise();
    }
  };

  const handlePreviousStep = async () => {
    if (audioRef.current) {
      await audioRef.current.pauseAsync();
      setIsPlaying(false);
      await audioRef.current.unloadAsync();
      audioRef.current = null;
    }
    setShowBreathingAnimation(false);
    setShowBodyScanAnimation(false);
    
    if (currentStep > 0) {
      flatListRef.current?.scrollToOffset({ offset: width * (currentStep - 1), animated: true });
    }
  };

  const handleStepResponse = (stepId: string, response: string) => {
    setStepResponses(prev => ({
      ...prev,
      [stepId]: response,
    }));
  };

  const handleSkip = async (seconds: number) => {
    if (audioRef.current) {
      try {
        const status = await audioRef.current.getStatusAsync();
        if (status.isLoaded) {
          const currentPosition = status.positionMillis || 0;
          const duration = status.durationMillis || 0;
          const newTime = Math.max(0, Math.min(
            currentPosition + (seconds * 1000),
            duration
          ));
          await audioRef.current.setPositionAsync(newTime);
        }
      } catch (error) {
        console.error('Errore nel skip audio:', error);
      }
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!audioRef.current) {
        // Carica l'audio per lo step corrente - usiamo currentStep-1 se Intro è indici 0
        const stepIndex = currentStep - 1;
        if (stepIndex < 0) return; // Non c'è audio nell'intro
        
        const currentStepData = exercise.steps[stepIndex];
        if (currentStepData.audioFile) {
          const audioMap = {
            './assets/audio/breathing-guide.mp3': require('../assets/audio/breathing-guide.mp3'),
            './assets/audio/body-scan.mp3': require('../assets/audio/body-scan.mp3'),
            './assets/audio/meditation-step2-practice.mp3': require('../assets/audio/meditation-step2-practice.mp3'),
            './assets/audio/meditation-guided.mp3': require('../assets/audio/meditation-guided.mp3'),
          };
          const audioPath = audioMap[currentStepData.audioFile as keyof typeof audioMap];
          if (!audioPath) {
            console.error('Audio file not found in map:', currentStepData.audioFile);
            return;
          }
          
          const { sound } = await Audio.Sound.createAsync(audioPath);
          audioRef.current = sound;
          
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              if (status.durationMillis) setAudioDuration(status.durationMillis);
              if (status.positionMillis !== undefined) setAudioProgress(status.positionMillis);
              if (status.didJustFinish) {
                setIsPlaying(false);
                setShowBreathingAnimation(false);
              }
            }
          });
        }
      }
      
      if (audioRef.current) {
        if (isPlaying) {
          await audioRef.current.pauseAsync();
          setIsPlaying(false);
          if (exercise.id === 'respirazione-consapevole') {
            setShowBreathingAnimation(false);
          }
        } else {
          await audioRef.current.playAsync();
          setIsPlaying(true);
          const stepIndex = currentStep - 1;
          if (exercise.id === 'respirazione-consapevole' && stepIndex >= 0 && exercise.steps[stepIndex].audioFile) {
            setShowBreathingAnimation(true);
          }
        }
      }
    } catch (error) {
      console.error('Errore nella riproduzione audio:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync();
        audioRef.current = null;
      }
    };
  }, []);

  const renderAudioPlayer = () => {
    const progressPercentage = audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0;
    const circumference = 2 * Math.PI * 28;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
    
    return (
      <View style={styles.audioPlayerContainerCard}>
        <TouchableOpacity style={styles.skipButtonCard} onPress={() => handleSkip(-15)}>
          <Ionicons name="play-back" size={20} color="#8B7CF6" />
        </TouchableOpacity>
        
        <View style={styles.playButtonContainerCard}>
          <Svg width="56" height="56" style={styles.progressCircle}>
            <Circle
              cx="28"
              cy="28"
              r="26"
              stroke="rgba(139, 124, 246, 0.1)"
              strokeWidth="2"
              fill="none"
            />
            <Circle
              cx="28"
              cy="28"
              r="26"
              stroke="#8B7CF6"
              strokeWidth="2"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
            />
          </Svg>
          <TouchableOpacity style={styles.playButtonCard} onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#8B7CF6" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.skipButtonCard} onPress={() => handleSkip(15)}>
          <Ionicons name="play-forward" size={20} color="#8B7CF6" />
        </TouchableOpacity>
      </View>
    );
  };


  const handleCompleteExercise = async () => {
    // Stop audio and animation if active
    if (audioRef.current) {
      try { await audioRef.current.stopAsync(); } catch (e) {}
      setIsPlaying(false);
    }

    setIsCompleting(true);

    // Save in background — success screen shows regardless
    try {
      const userText = Object.values(stepResponses)
        .filter((t) => t && t.trim().length > 0)
        .join('\n\n');

      const notes = userText 
        ? `Esercizio completato con successo.\n\n${userText}`
        : `Esercizio completato con successo.`;

      await WorkoutService.completeExercise(exercise, notes);
      
      const progress: ExerciseProgress = {
        exerciseId: exercise.id,
        userId: currentUser?.id || 'guest',
        completedAt: new Date(),
        stepResponses,
      };
      await ExerciseServiceAdapter.saveExerciseProgress(progress);
    } catch (error) {
      console.error('❌ [ExerciseDetail] Errore salvataggio (non bloccante):', error);
    }

    // ALWAYS show success screen
    setIsCompleting(false);
    setShowBreathingAnimation(false);
    setShowBodyScanAnimation(false);
    setShowSuccessScreen(true);
  };

  const renderNavigationDots = () => {
    if (currentStep === 0) return null;
    
    let totalDots = exercise.steps.length;
    if (exercise.id === 'respirazione-consapevole' || exercise.id === 'body-scan') totalDots += 1;
    
    return (
      <View style={styles.headerNavigationDots}>
        {Array.from({ length: totalDots }).map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.headerDot,
              index === currentStep - 1 ? styles.headerActiveDot : styles.headerInactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderIntroductionItem = () => (
    <View style={[styles.introSlideContainer, listHeight > 0 && { height: listHeight }]}>
      <ScrollView 
        style={styles.introContentScroll} 
        contentContainerStyle={styles.introScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.introDurationText}>{exercise.duration} minuti</Text>
        <Text style={styles.introTitleText}>{exercise.name}</Text>
        
        <Text style={styles.introDescriptionText}>{exercise.introText}</Text>
        
        <View style={styles.introSection}>
          <Text style={styles.introSectionTitle}>Perché</Text>
          <View style={styles.introBenefitsContainer}>
            {exercise.benefitsText.split('\n').map((benefit, index) => (
              <View key={index} style={styles.introBenefitRow}>
                <Text style={styles.introBenefitBullet}>•</Text>
                <Text style={styles.introBenefitText}>{benefit.replace(/^[•-]\s*/, '')}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.introActionFooter, { paddingBottom: Math.max(24, insets.bottom + 10) }]}>
        <TouchableOpacity style={styles.introStartButton} onPress={handleStartExercise}>
          <Text style={styles.introStartButtonText}>INIZIA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStepItem = (step: ExerciseStep) => (
    <View style={[styles.slideItem, listHeight > 0 && { height: listHeight }]}>
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitleWhite}>{step.title}</Text>
        </View>
        
        <View style={styles.contentCard}>
          {(step.type === 'default' || step.type === 'withaudio') && step.content && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {step.content.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listBulletPurple} />
                  <Text style={styles.listTextCard}>{item}</Text>
                </View>
              ))}
              {step.audioFile ? renderAudioPlayer() : null}
            </ScrollView>
          )}
          
          {step.type === 'withtextarea' && (
            <View style={styles.textAreaContainer}>
              {step.placeholder && (
                <Text style={styles.inputLabelCard}>{step.placeholder}</Text>
              )}
              <TextInput
                style={styles.textAreaCard}
                value={stepResponses[step.id] || ''}
                onChangeText={(text) => handleStepResponse(step.id, text)}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={[styles.fixedHeader, { paddingTop: insets.top + 15, paddingBottom: 15 }]}>
      <View style={styles.headerIconButton}>
        {currentStep > 0 && (
          <TouchableOpacity 
            onPress={handlePreviousStep}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      
      {renderNavigationDots()}
      
      <TouchableOpacity style={styles.headerIconButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
  const renderSuccessScreen = () => (
    <View style={styles.successContainer}>
      <View style={styles.successHeader}>
        {/* rimosso X qui */}
      </View>
      <View style={styles.successContent}>
        <Image 
          source={require('../assets/exercises/success.png')} 
          style={styles.successImage}
          resizeMode="contain"
        />
        <Text style={styles.successTitle}>Ottimo lavoro!</Text>
        <Text style={styles.successSubtitle}>
          Hai completato l'esercizio con successo. Ogni passo conta nel tuo percorso.
        </Text>

        <Text style={styles.successQuestion}>Come ti senti adesso?</Text>
        
        <View style={styles.moodContainer}>
          {(['sad', 'neutral', 'happy'] as const).map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                selectedMood === mood && { backgroundColor: getMoodColor(mood) + '20' }
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              {getMoodComponent(mood, selectedMood === mood)}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.successButtonContainer}>
        <TouchableOpacity 
          style={styles.diaryButton} 
          onPress={() => {
            if (selectedMood) {
              setCurrentMood(selectedMood);
            }
            onComplete();
          }}
        >
          <Text style={styles.diaryButtonText}>Torna alla Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const [listHeight, setListHeight] = useState<number>(0);

  if (showSuccessScreen) return renderSuccessScreen();

  const allSlides = [{ id: 'intro', slideType: 'intro' as const }, ...exercise.steps.map(s => ({ ...s, slideType: 'step' as const }))];

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        ref={flatListRef}
        onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={allSlides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScroll={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          if (newIndex !== currentStep) {
            setCurrentStep(newIndex);
          }
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          if (item.slideType === 'intro') return renderIntroductionItem();
          return renderStepItem(item as ExerciseStep);
        }}
      />
      
      {currentStep > 0 && (
        <View style={[styles.fixedFooter, { bottom: Math.max(34, insets.bottom + 10) }]}>
          <TouchableOpacity 
            style={styles.orangeCircleButton}
            onPress={handleNextStep}
          >
            <Ionicons 
              name={
                ((exercise.id === 'respirazione-consapevole' || exercise.id === 'body-scan') && currentStep === 1) 
                ? 'arrow-forward' 
                : (currentStep === allSlides.length - 1 ? "checkmark" : "arrow-forward")
              } 
              size={30} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      )}

      {showBreathingAnimation && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 100, elevation: 10 }]}>
          <BreathingScreen 
            onAbort={onClose} 
            onClose={() => setShowBreathingAnimation(false)} 
            onComplete={handleCompleteExercise} 
            initialIsPlaying={isPlaying} 
          />
        </View>
      )}

      {showBodyScanAnimation && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 100, elevation: 10 }]}>
          <BodyScanScreen
            onAbort={onClose}
            onClose={() => setShowBodyScanAnimation(false)}
            onComplete={handleCompleteExercise}
            initialIsPlaying={isPlaying}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edebff',
  },
  fixedHeader: {
    backgroundColor: '#8B7CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // paddingTop and height removed from here, handled dynamically
  },
  headerNavigationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  headerActiveDot: {
    backgroundColor: 'white',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerInactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerIconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideItem: {
    width: width,
    height: '100%',
  },
  introContainer: {
    flex: 1,
    backgroundColor: '#8B7CF6',
  },
  introContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },
  introContent: {
    alignItems: 'center',
  },
  durationTextWhite: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  exerciseTitleWhite: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  introTextWhite: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitleWhite: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  benefitsList: {
    width: '100%',
  },
  benefitItemWhite: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  // Intro v3 Styles
  introSlideContainer: {
    width: width,
    height: '100%',
    backgroundColor: '#F8F7FF',
    justifyContent: 'space-between',
  },
  introContentScroll: {
    flex: 1,
  },
  introScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  introDurationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'left',
  },
  introTitleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D0644',
    marginBottom: 24,
    textAlign: 'left',
  },
  introDescriptionText: {
    fontSize: 17,
    color: '#444',
    lineHeight: 26,
    marginBottom: 32,
    textAlign: 'left',
  },
  introSection: {
    marginBottom: 24,
  },
  introSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    textAlign: 'left',
  },
  introBenefitsContainer: {
    marginTop: 8,
  },
  introBenefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  introBenefitBullet: {
    fontSize: 18,
    color: '#666',
    marginRight: 10,
    lineHeight: 24,
  },
  introBenefitText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    flex: 1,
  },
  introActionFooter: {
    backgroundColor: 'white',
    padding: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    width: '100%',
  },
  introStartButton: {
    backgroundColor: '#FF9500',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introStartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#8B7CF6',
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  stepTitleWhite: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: 'transparent',
    flex: 0.8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  listBulletPurple: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginTop: 10,
    marginRight: 12,
  },
  listTextCard: {
    fontSize: 18,
    color: 'white',
    lineHeight: 28,
    flex: 1,
  },
  textAreaContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  inputLabelCard: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  textAreaCard: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  orangeCircleButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  audioPlayerContainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  playButtonContainerCard: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  playButtonCard: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonCard: {
    padding: 8,
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  successHeader: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  successContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  successImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  successQuestion: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  moodButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  successButtonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  diaryButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  diaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fullScreenAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#8B7CF6',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeAnimationButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1001,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'white',
  },
  breathingControls: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  largePlayButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    position: 'absolute',
  },
});

export default ExerciseDetailScreen;