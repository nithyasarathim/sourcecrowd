import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle, Plus, Zap, X, Globe, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/header';
import CampaignCard from '../component/CampaignComponent/CampaignCard';

const CampaignListPage = () => {
  const [filter, setFilter] = useState('active');
  const [campaignsData, setCampaignsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const userId="12345";

  const [formData, setFormData] = useState({
    name: '',
    pitch: '',
    description: '',
    moneyUsage: '',
    amountNeeded: '',
    website: '',
    endDate: '',
    categories: [],
    status: 'draft'
  });

  const categoriesOptions = [
    'environment',
    'education',
    'health',
    'technology',
    'art',
    'community'
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:9000/campaign/all');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const processedData = data.map(campaign => ({
          id: campaign._id || Math.floor(Math.random() * 10000).toString(),
          name: campaign.name || 'Unnamed Campaign',
          pitch: campaign.pitch || 'Support this important initiative',
          description: campaign.description || 'No description available.',
          moneyUsage: campaign.moneyUsage || 'Funds usage details not specified.',
          amountNeeded: campaign.amountNeeded || 0,
          amountCollected: campaign.amountCollected || 0,
          contributors: campaign.contributions || [],
          website: campaign.website || '',
          status: campaign.status || 'draft',
          endDate: campaign.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          categories: campaign.categories || [],
          creator: campaign.creator
        }));

        const currentDate = new Date();
        const actualStatus = processedData.map(campaign => {
          const endDate = new Date(campaign.endDate);
          const isExpired = endDate < currentDate;
          const isFullyFunded = campaign.amountCollected >= campaign.amountNeeded;
          return isExpired || isFullyFunded ? 'finished' : 
            (campaign.status === 'draft') ? 'draft' : 'active';
        });
        processedData.forEach((campaign, index) => {
          campaign.status = actualStatus[index];
        }
        );
        
        setCampaignsData(processedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const currentDate = new Date();

  const filteredCampaigns = campaignsData.filter(campaign => {
    const endDate = new Date(campaign.endDate);
    const isExpired = endDate < currentDate;
    const isFullyFunded = campaign.amountCollected >= campaign.amountNeeded;
    
    // Determine actual status (override DB status if needed)
    const actualStatus = 
      isExpired || isFullyFunded ? 'finished' : 
      (campaign.status === 'draft') ? 'draft' : 'active';
  
    if (filter === 'active') {
      return actualStatus === 'active';
    } else if (filter === 'finished') {
      return actualStatus === 'finished';
    }
    return true; // Show all if no filter
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
  };

  const handleCardClick = (campaignId) => {
    const selectedCampaign = campaignsData.find(campaign => campaign.id === campaignId);
    if (selectedCampaign) {
      navigate(`/campaigns/${selectedCampaign.id}`, {
        state: { campaign: selectedCampaign }
      });
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      name: '',
      pitch: '',
      description: '',
      moneyUsage: '',
      amountNeeded: '',
      website: '',
      endDate: '',
      categories: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare the data exactly as backend expects
      const campaignData = {
        name: formData.name,
        pitch: formData.pitch,
        description: formData.description,
        moneyUsage: formData.moneyUsage,
        amountNeeded: Number(formData.amountNeeded),
        website: formData.website,
        endDate: new Date(formData.endDate).toISOString(),
        categories: formData.categories,
        creator: userId // Make sure this is a valid user ID
      };
  
      console.log('Submitting campaign data:', campaignData); // Debug log
  
      const response = await fetch('http://localhost:9000/campaign/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend validation error:', errorData); // Debug log
        throw new Error(errorData.message || 'Failed to create campaign');
      }
  
      const result = await response.json();
      const newCampaign = result.campaign;
  
      // Update local state with the new campaign
      setCampaignsData(prev => [...prev, {
        ...newCampaign,
        id: newCampaign._id,
        amountCollected: 0,
        contributors: []
      }]);
  
      // Reset form and close modal
      setShowCreateModal(false);
      setFormData({
        name: '',
        pitch: '',
        description: '',
        moneyUsage: '',
        amountNeeded: '',
        website: '',
        endDate: '',
        categories: []
      });
      setError(null);
      
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.message || 'Failed to create campaign. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-green-100">
        <Header />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
          <div className="flex flex-col justify-center items-center h-96">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className=""></div>
              </div>
              <Zap className="w-8 h-8 text-[#c1ff72] animate-pulse" />
            </div>
            <p className="mt-8 text-[#c1ff72] text-lg animate-pulse">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-green-100">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#c1ff72]">Support Our Campaigns</h1>
          <p className="text-gray-400 max-w-2xl">
            Join our community in funding innovative projects that make a difference.
          </p>
        </div>

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
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-[#c1ff72] text-black text-sm font-medium rounded-lg hover:bg-green-300 transition-all flex items-center hover:shadow-[0_0_10px_rgba(193,255,114,0.5)]"
          >
            <Plus size={16} className="mr-2" />
            Create Campaign
          </button>
        </div>

        {filteredCampaigns.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map(campaign => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                onClick={() => handleCardClick(campaign.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">No {filter} campaigns found.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-start justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-gray-900 rounded-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto border border-gray-700 shadow-2xl my-8">
      {/* Modal Header */}
      <div className="sticky top-0 bg-gray-900 z-10 border-b border-gray-800 p-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#c1ff72]">Create New Campaign</h2>
        <button 
          onClick={() => setShowCreateModal(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={28} className="hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[#c1ff72] border-b border-gray-800 pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <span>Campaign Name</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-5 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white transition-all"
                  required
                  placeholder="Give your campaign a name"
                />
                {formData.name && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#c1ff72]" />
                )}
              </div>
            </div>

            {/* Funding Goal */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <span>Funding Goal ($)</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  name="amountNeeded"
                  value={formData.amountNeeded}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl pl-10 pr-5 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
                  min="100"
                  required
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          {/* Pitch */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              <span>Short Pitch</span>
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="pitch"
                value={formData.pitch}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-5 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white transition-all"
                required
                maxLength={200}
                placeholder="One compelling sentence about your campaign"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-gray-900/80 px-2 py-1 rounded">
                {formData.pitch.length}/200
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[#c1ff72] border-b border-gray-800 pb-2">Campaign Details</h3>
          
          {/* Detailed Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              <span>Detailed Description</span>
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-5 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white min-h-[150px]"
                required
                maxLength={2000}
                placeholder="Tell your story in detail..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-gray-900/80 px-2 py-1 rounded">
                {formData.description.length}/2000
              </div>
            </div>
          </div>

          {/* Money Usage */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              <span>How the money will be used</span>
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <textarea
                name="moneyUsage"
                value={formData.moneyUsage}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-5 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white min-h-[150px]"
                required
                maxLength={1000}
                placeholder="Break down how funds will be allocated..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-gray-900/80 px-2 py-1 rounded">
                {formData.moneyUsage.length}/1000
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[#c1ff72] border-b border-gray-800 pb-2">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Website */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Website (Optional)</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl pl-12 pr-5 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
                  placeholder="https://yourproject.com"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <span>End Date</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl pl-12 pr-5 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white [&::-webkit-calendar-picker-indicator]:invert"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Categories</label>
            <div className="flex flex-wrap gap-3">
              {categoriesOptions.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center transition-all ${
                    formData.categories.includes(category)
                      ? 'bg-[#c1ff72] text-black shadow-md'
                      : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-[#c1ff72]/50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="sticky bottom-0 bg-gray-900 py-4 border-t border-gray-800 flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="px-6 py-3 border-2 border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#c1ff72] text-black rounded-xl font-bold hover:bg-green-300 hover:shadow-lg transition-all flex items-center"
            disabled={!formData.name || !formData.pitch || !formData.description || !formData.moneyUsage || !formData.amountNeeded || !formData.endDate}
          >
            <Plus className="mr-2" size={18} />
            Launch Campaign
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default CampaignListPage;