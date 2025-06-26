// import React, { useState } from 'react'
// import SplashScreen from './components/SplashScreen'
// import RegistrationScreen from './components/RegistrationScreen'
// import EndScreen from './components/EndScreen'
// import Terms from './components/terms'

// function App() {
//   const [currentScreen, setCurrentScreen] = useState('splash');

//   const goToRegister = () => {
//     setCurrentScreen('register');
//   };

//   const goToEnd = () => {
//     setCurrentScreen('end');
//   };

//   const goToSplash = () => {
//     setCurrentScreen('splash');
//   };

//   const goToTerms = () => {
//     setCurrentScreen('terms');
//   };

//   const goBackToRegister = () => {
//     setCurrentScreen('register');
//   };

//   if (currentScreen === 'splash') {
//     return <SplashScreen onComplete={goToRegister} />;
//   }

//   if (currentScreen === 'register') {
//     return <RegistrationScreen onComplete={goToEnd} onTerms={goToTerms} />;
//   }

//   if (currentScreen === 'end') {
//     return <EndScreen onRetry={goToSplash} />;
//   }

//   if (currentScreen === 'terms') {
//     return <Terms onBack={goBackToRegister} />;
//   }

//   return <SplashScreen onComplete={goToRegister} />;
// }

// export default App
import React, { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import RegistrationScreen from './components/RegistrationScreen'
import EndScreen from './components/EndScreen'
import Terms from './components/terms'
import CapturePage from './components/CapturePage'

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userData, setUserData] = useState(null);

  // Check if we're on the capture route
  useEffect(() => {
    if (window.location.pathname === '/capture') {
      setCurrentScreen('capture');
    }
  }, []);

  const goToRegister = () => {
    setCurrentScreen('register');
  };

  const goToCamera = (data) => {
    setUserData(data);
    setCurrentScreen('camera');
  };

  const goToEnd = (data) => {
    setUserData(data);
    setCurrentScreen('end');
  };

  const goToSplash = () => {
    setCurrentScreen('splash');
    setUserData(null);
  };

  const goToTerms = () => {
    setCurrentScreen('terms');
  };

  const goBackToRegister = () => {
    setCurrentScreen('register');
  };

  const goToCapture = () => {
    setCurrentScreen('capture');
  };

  // Handle standalone capture page
  if (currentScreen === 'capture') {
    return <CapturePage />;
  }

  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={goToRegister} onCameraTest={goToCapture} />;
  }

  if (currentScreen === 'register') {
    return <RegistrationScreen onComplete={goToCamera} onTerms={goToTerms} />;
  }

  if (currentScreen === 'camera') {
    return <CameraTest onCapture={goToEnd} userdata={userData} />;
  }

  if (currentScreen === 'end') {
    return <EndScreen onRetry={goToSplash} userData={userData} />;
  }

  if (currentScreen === 'terms') {
    return <Terms onBack={goBackToRegister} />;
  }

  return <SplashScreen onComplete={goToRegister} />;
}

export default App