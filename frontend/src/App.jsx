import React from 'react'
import Logo from './assets/logo.png'
import Header from './component/header';
import DashboardPage from './pages/DashboardPage';
import CampaignPage from './pages/CampaignPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/campaigns" element={<CampaignPage />} />
      </Routes>
    </div>
  )
}

export default App