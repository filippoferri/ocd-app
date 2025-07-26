import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import AuthService from '../../services/AuthService';

interface ActivationFlowProps {
  onClose: () => void;
  onComplete: () => void;
}

interface ActivationData {
  date: string;
  time: string;
  symptoms: string[];
  intensity: string;
  description: string;
}

export default function ActivationFlow({ onClose, onComplete }: ActivationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activationData, setActivationData] = useState<Partial<ActivationData>>({});

  const handleStep1Next = (data: { date: string; time: string; symptoms: string[] }) => {
    setActivationData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (intensity: string) => {
    setActivationData(prev => ({ ...prev, intensity }));
    setCurrentStep(3);
  };

  const handleStep3Next = (description: string) => {
    setActivationData(prev => ({ ...prev, description }));
    setCurrentStep(4);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
  };

  const handleFinish = async () => {
    try {
      // Salva l'attività tramite AuthService
      if (activationData.date && activationData.time && activationData.symptoms && activationData.intensity && activationData.description) {
        // Converti la data dal formato "1 gennaio 2024" al formato "2024-01-01"
        const convertDateToISO = (dateStr: string): string => {
          const months = {
            'gennaio': '01', 'febbraio': '02', 'marzo': '03', 'aprile': '04',
            'maggio': '05', 'giugno': '06', 'luglio': '07', 'agosto': '08',
            'settembre': '09', 'ottobre': '10', 'novembre': '11', 'dicembre': '12'
          };
          const parts = dateStr.split(' ');
          const day = parts[0].padStart(2, '0');
          const month = months[parts[1].toLowerCase() as keyof typeof months];
          const year = parts[2];
          return `${year}-${month}-${day}`;
        };
        
        await AuthService.addActivity({
          id: Date.now().toString(),
          date: convertDateToISO(activationData.date),
          time: activationData.time,
          type: 'compulsione', // Puoi modificare questo in base al tipo di attività
          symptom: activationData.symptoms[0] || 'unknown',
          intensity: activationData.intensity,
          description: activationData.description,
        });
        console.log('Attività salvata con successo');
        onComplete();
      } else {
        Alert.alert('Errore', 'Dati incompleti per salvare l\'attività');
      }
    } catch (error) {
      Alert.alert('Errore', 'Impossibile salvare l\'attività');
      console.error('Errore nel salvataggio:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={handleStep1Next} onClose={onClose} />;
      case 2:
        return <Step2 onNext={handleStep2Next} onBack={handleStep2Back} />;
      case 3:
        return <Step3 onNext={handleStep3Next} onBack={handleStep3Back} />;
      case 4:
        return (
          <Step4 
            onFinish={handleFinish} 
            activationData={activationData as ActivationData}
          />
        );
      default:
        return <Step1 onNext={handleStep1Next} onClose={onClose} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderCurrentStep()}
    </View>
  );
}