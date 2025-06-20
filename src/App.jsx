import React, { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import RegistrationScreen from './components/RegistrationScreen'
import EndScreen from './components/EndScreen'
import Terms from './components/terms'

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const goToRegister = () => {
    setCurrentScreen('register');
  };

  const goToEnd = () => {
    setCurrentScreen('end');
  };

  const goToSplash = () => {
    setCurrentScreen('splash');
  };

  const goToTerms = () => {
    setCurrentScreen('terms');
  };

  const goBackToRegister = () => {
    setCurrentScreen('register');
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={goToRegister} />;
  }

  if (currentScreen === 'register') {
    return <RegistrationScreen onComplete={goToEnd} onTerms={goToTerms} />;
  }

  if (currentScreen === 'end') {
    return <EndScreen onRetry={goToSplash} />;
  }

  if (currentScreen === 'terms') {
    return <Terms onBack={goBackToRegister} />;
  }

  return <SplashScreen onComplete={goToRegister} />;
}

export default App