import React, { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import RegistrationScreen from "./components/RegistrationScreen";
import SnapARExperience from "./components/SnapARExperience";
import EndScreen from "./components/EndScreen";
import Terms from "./components/terms";

function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [userData, setUserData] = useState(null);

  // Your Snap AR credentials - REPLACE WITH YOUR ACTUAL VALUES
  const SNAP_API_TOKEN =
    "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUwMjUxNDQ5LCJzdWIiOiJmZDFmZDkyMi01NWI1LTQ3ZTQtOTlmOS1kMjQ1YzIyNzZjZWZ-UFJPRFVDVElPTn4wYTBiZDg4OC0zYzJkLTQ2NTQtOWJhZS04NWNkZjIwZGZkM2MifQ.DXp0F3LA8ZqxuB0UH4TCaQT2iMbCsc9xrT8xbuoYOJg";
  const LENS_GROUP_ID = "b2aafdd8-cb11-4817-9df9-835b36d9d5a7";

  const goToRegister = () => {
    setCurrentScreen("register");
  };

  const goToSnapAR = (data) => {
    setUserData(data);
    setCurrentScreen("snapar");
  };

  const goToEnd = (data) => {
    setUserData(data);
    setCurrentScreen("end");
  };

  // 🔄 Retry function - Goes back to splash screen
  const handleRetry = () => {
    console.log("🔄 Retry clicked - going back to splash screen");

    // Clear localStorage to ensure fresh start
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    // Reset app state
    setCurrentScreen("splash");
    setUserData(null);
  };

  const goToTerms = () => {
    setCurrentScreen("terms");
  };

  const goBackToRegister = () => {
    setCurrentScreen("register");
  };

  if (currentScreen === "splash") {
    return <SplashScreen onComplete={goToRegister} />;
  }

  if (currentScreen === "register") {
    return <RegistrationScreen onComplete={goToSnapAR} onTerms={goToTerms} />;
  }

  if (currentScreen === "snapar") {
    return (
      <SnapARExperience
        onComplete={goToEnd}
        userData={userData}
        lensGroupId={LENS_GROUP_ID}
        apiToken={SNAP_API_TOKEN}
      />
    );
  }

  if (currentScreen === "end") {
    return (
      <EndScreen
        onRetry={handleRetry}  // 🔄 Retry goes to splash screen
        userData={userData}
      />
    );
  }

  if (currentScreen === "terms") {
    return <Terms onBack={goBackToRegister} />;
  }

  return <SplashScreen onComplete={goToRegister} />;
}

export default App;