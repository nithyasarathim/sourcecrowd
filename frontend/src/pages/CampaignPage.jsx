import React, { useState } from 'react';
import { Clock, Plus, Flame, CheckCircle, X, Zap, Users, Target, Award } from 'lucide-react';
import Header from '../component/header';

const CampaignPage = () => {
  const [filter, setFilter] = useState('active');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [campaignsData, setCampaignsData] = useState([
    {
        id: 1,
        name: 'Project A',
        description: 'Innovative tech for a better tomorrow.',
        amountNeeded: 50000,
        amountCollected: 20000,
        contributors: 150,
        status: 'active',
        endDate: '2023-12-31'
    }
  ]);

  const filteredCampaigns = campaignsData.filter(campaign => campaign.status === filter);

  const handleCardClick = (campaign) => {
    setSelectedCampaign(campaign);
    setContributionAmount(0);
  };

  const calculatePercentageAmount = (percentage) => {
    if (!selectedCampaign) return 0;
    const remainingAmount = selectedCampaign.amountNeeded - selectedCampaign.amountCollected;
    return Math.round((remainingAmount * percentage) / 100);
  };

  const handleContribute = () => {
    if (!selectedCampaign || contributionAmount <= 0) return;

    setCampaignsData(prevData =>
      prevData.map(campaign =>
        campaign.id === selectedCampaign.id
          ? {
              ...campaign,
              amountCollected: campaign.amountCollected + contributionAmount,
              contributors: campaign.contributors + 1
            }
          : campaign
      )
    );

    setSelectedCampaign(null);
    setContributionAmount(0);
  };

  // Calculate days remaining or status
  const getTimeStatus = (endDate, status) => {
    if (status === 'finished') return 'Completed';
    const daysLeft = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Ended';
  };

  return (
    <div className="bg-black min-h-screen text-green-100">
      <Header />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#c1ff72]">Support Our Campaigns</h1>
          <p className="text-gray-400 max-w-2xl">
            Join our community in funding innovative projects that make a difference.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex space-x-2 bg-gray-900 p-1 rounded-xl">
            <button
              onClick={() => setFilter('active')}
              className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${
                filter === 'active' 
                  ? 'bg-[#c1ff72] text-black shadow-[0_0_10px_rgba(193,255,114,0.5)]' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Flame size={16} className="mr-2" />
              Active Campaigns
            </button>
            <button
              onClick={() => setFilter('finished')}
              className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${
                filter === 'finished' 
                  ? 'bg-[#c1ff72] text-black shadow-[0_0_10px_rgba(193,255,114,0.5)]' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <CheckCircle size={16} className="mr-2" />
              Finished Campaigns
            </button>
          </div>
          <button
            className="px-5 py-2.5 bg-[#c1ff72] text-black text-sm font-medium rounded-lg hover:bg-green-300 transition-all flex items-center hover:shadow-[0_0_10px_rgba(193,255,114,0.5)]"
          >
            <Plus size={16} className="mr-2" />
            Create Campaign
          </button>
        </div>

        {/* Campaigns Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map(campaign => {
            const progress = (campaign.amountCollected / campaign.amountNeeded) * 100;
            const timeStatus = getTimeStatus(campaign.endDate, campaign.status);
            const remainingAmount = campaign.amountNeeded - campaign.amountCollected;

            return (
              <div 
                key={campaign.id} 
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-[#c1ff72]/50 transition-all group cursor-pointer hover:shadow-[0_0_20px_rgba(193,255,114,0.1)]"
                onClick={() => handleCardClick(campaign)}
              >
                {/* Card Header with Status */}
                <div className={`p-4 border-b ${
                  campaign.status === 'active' 
                    ? 'border-[#c1ff72]/30 bg-[#c1ff72]/10' 
                    : 'border-purple-500/30 bg-purple-500/10'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-[#c1ff72] text-black' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {campaign.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock size={14} className="mr-1" />
                      {timeStatus}
                    </div>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="bg-gray-800 p-3 rounded-lg mr-4">
                      <Zap size={24} className="text-[#c1ff72]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#c1ff72] transition-colors">
                        {campaign.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {campaign.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">${campaign.amountCollected.toLocaleString()} raised</span>
                      <span className="text-gray-400">${remainingAmount.toLocaleString()} to go</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          progress >= 100 ? 'bg-purple-500' : 'bg-[#c1ff72]'
                        }`} 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">{Math.round(progress)}% funded</span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <Users size={12} className="mr-1" />
                        {campaign.contributors} supporters
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-800 p-2 rounded-lg flex items-center">
                      <Target size={14} className="mr-2 text-[#c1ff72]" />
                      <div>
                        <div className="text-gray-400">Goal</div>
                        <div className="font-medium">${campaign.amountNeeded.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded-lg flex items-center">
                      <Award size={14} className="mr-2 text-[#c1ff72]" />
                      <div>
                        <div className="text-gray-400">Status</div>
                        <div className="font-medium">{timeStatus}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contribution Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setSelectedCampaign(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex items-start mb-4">
              <div className="bg-gray-800 p-3 rounded-lg mr-4">
                <Zap size={24} className="text-[#c1ff72]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#c1ff72]">
                  {selectedCampaign.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedCampaign.description}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Raised: ${selectedCampaign.amountCollected.toLocaleString()}</span>
                <span>Goal: ${selectedCampaign.amountNeeded.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2">
                <div 
                  className={`h-2.5 rounded-full ${
                    (selectedCampaign.amountCollected / selectedCampaign.amountNeeded) * 100 >= 100 
                      ? 'bg-purple-500' 
                      : 'bg-[#c1ff72]'
                  }`} 
                  style={{ width: `${Math.min(
                    (selectedCampaign.amountCollected / selectedCampaign.amountNeeded) * 100, 
                    100
                  )}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{Math.round((selectedCampaign.amountCollected / selectedCampaign.amountNeeded) * 100)}% funded</span>
                <span>${(selectedCampaign.amountNeeded - selectedCampaign.amountCollected).toLocaleString()} still needed</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3 text-sm">Contribute a percentage of remaining amount:</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 5, 10, 25, 50, 100].map(percent => {
                  const amount = calculatePercentageAmount(percent);
                  return (
                    <button
                      key={percent}
                      onClick={() => setContributionAmount(amount)}
                      className={`py-2 px-2 rounded-lg text-sm border transition-all ${
                        contributionAmount === amount
                          ? 'border-[#c1ff72] bg-[#c1ff72]/10 text-[#c1ff72]'
                          : 'border-gray-700 hover:border-[#c1ff72]/50 text-gray-300'
                      }`}
                    >
                      {percent}%
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Or enter custom amount:</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={contributionAmount || ''}
                  onChange={(e) => setContributionAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2.5 focus:border-[#c1ff72] focus:outline-none text-white"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>

            <button
              onClick={handleContribute}
              disabled={!contributionAmount || contributionAmount <= 0}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                contributionAmount > 0
                  ? 'bg-[#c1ff72] text-black hover:bg-green-300 hover:shadow-[0_0_10px_rgba(193,255,114,0.5)]'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Contribute ${contributionAmount.toLocaleString()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPage;