import React, { useState } from 'react';
import AuthLayout from './auth/AuthLayout';
import WelcomePage from './auth/WelcomePage';
import LoginPage from './auth/LoginPage';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState<'welcome' | 'login'>('welcome');

  return (
    <AuthLayout>
      {step === 'welcome' ? (
        <WelcomePage onStart={() => setStep('login')} />
      ) : (
        <LoginPage 
          onBack={() => setStep('welcome')} 
          onLoginSuccess={onComplete} 
        />
      )}
    </AuthLayout>
  );
}
