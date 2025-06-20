import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'
import RegistrationScreen from './components/RegistrationScreen'
import EndScreen from './components/EndScreen'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/register" element={<RegistrationScreen />} />
        <Route path="/end" element={<EndScreen />} />
      </Routes>
    </Router>
  )
}

export default App