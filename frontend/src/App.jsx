import React from 'react'
import DashboardPage from './pages/DashboardPage';
import CampaignListPage from './pages/CampaignListPage';
import CampaignDetailsPage from './pages/CampaignDetailPage';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/campaigns" element={<CampaignListPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App