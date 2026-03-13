import React, { useState } from 'react';
import { View } from 'react-native';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import Step8 from './Step8';
import Step9 from './Step9';
import Step10 from './Step10';
import Step11 from './Step11';
import LoadingScreen from './LoadingScreen';

interface OnboardingFlowProps {
  onComplete: (userData: OnboardingData) => void;
}

export interface OnboardingData {
  knowsOCD: boolean;
  hasTherapist: boolean;
  age: number;
  gender: 'Maschio' | 'Femmina' | 'Altro';
  fragilityDuration: string;
  fragilityLevel: number;
  dailyImpact: number;
  wantsOCDTest: boolean;
  currentMood: 'sad' | 'neutral' | 'happy';
  completedAt: string;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [showLoading, setShowLoading] = useState(false);

  const handleStepNext = (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...onboardingData, ...stepData };
    setOnboardingData(updatedData);
    
    if (currentStep === 11) {
      // Mostra loading prima di completare
      setShowLoading(true);
      setTimeout(() => {
        const completeData = {
          ...updatedData,
          completedAt: new Date().toISOString()
        } as OnboardingData;
        onComplete(completeData);
      }, 2000);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (showLoading) {
    return <LoadingScreen />;
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={() => handleStepNext({})} />;
      case 2:
        return <Step2 onNext={(knowsOCD: boolean) => handleStepNext({ knowsOCD })} onBack={handleStepBack} />;
      case 3:
        return <Step3 onNext={(hasTherapist: boolean) => handleStepNext({ hasTherapist })} onBack={handleStepBack} />;
      case 4:
        return <Step4 onNext={() => handleStepNext({})} onBack={handleStepBack} />;
      case 5:
        return <Step5 onNext={(age: number) => handleStepNext({ age })} onBack={handleStepBack} />;
      case 6:
        return <Step6 onNext={(gender: 'Maschio' | 'Femmina' | 'Altro') => handleStepNext({ gender })} onBack={handleStepBack} />;
      case 7:
        return <Step7 onNext={(fragilityDuration: string) => handleStepNext({ fragilityDuration })} onBack={handleStepBack} />;
      case 8:
        return <Step8 onNext={(fragilityLevel: number) => handleStepNext({ fragilityLevel })} onBack={handleStepBack} />;
      case 9:
        return <Step9 onNext={(dailyImpact: number) => handleStepNext({ dailyImpact })} onBack={handleStepBack} />;
      case 10:
        return <Step10 onNext={(wantsOCDTest: boolean) => handleStepNext({ wantsOCDTest })} onBack={handleStepBack} />;
      case 11:
        return <Step11 onNext={(currentMood: 'sad' | 'neutral' | 'happy') => handleStepNext({ currentMood })} onBack={handleStepBack} />;
      default:
        return <Step1 onNext={() => handleStepNext({})} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <View style={{ flex: 1, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        {renderCurrentStep()}
      </View>
    </View>
  );
}