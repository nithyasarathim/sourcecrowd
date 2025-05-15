import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Zap, Globe, Users, Calendar, Award, CreditCard } from 'lucide-react';
import Header from '../component/header';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [contributorName, setContributorName] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [contributorEmail, setContributorEmail] = useState(user?.email || '');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:9000/campaign/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const processedData = {
          id: data._id || id,
          name: data.name || 'Unnamed Campaign',
          pitch: data.pitch || 'Support this important initiative',
          description: data.description || 'No description available.',
          moneyUsage: data.moneyUsage || 'Funds usage details not specified.',
          amountNeeded: data.amountNeeded || 0,
          amountCollected: data.amountCollected || 
            (data.contributions ? data.contributions.reduce((sum, c) => sum + (c.amount || 0), 0) : 0),
          contributions: data.contributions || [],
          website: data.website || '',
          status: data.status || 'active',
          endDate: data.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          categories: data.categories || [],
          email: data.email || '',
        };
        
        setCampaign(processedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch campaign:', err);
        setError('Failed to load campaign details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, navigate]);

  const calculatePercentageAmount = (percentage) => {
    if (!campaign) return 0;
    const remainingAmount = campaign.amountNeeded - campaign.amountCollected;
    return Math.round((remainingAmount * percentage) / 100);
  };

  const validateCardDetails = () => {
    const errors = {};
    
    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{13,16}$/)) {
      errors.number = 'Enter a valid 13-16 digit card number';
    }
    
    if (!cardDetails.name.trim()) {
      errors.name = 'Cardholder name is required';
    }
    
    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      errors.expiry = 'Enter valid expiry (MM/YY)';
    }
    
    if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
      errors.cvv = 'Enter valid 3 or 4 digit CVV';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formatted = '';
      for (let i = 0; i < v.length; i++) {
        if (i % 4 === 0 && i > 0) formatted += ' ';
        formatted += v[i];
      }
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    if (name === 'expiry') {
      const v = value.replace(/[^0-9]/g, '');
      let formatted = v;
      if (v.length >= 3) {
        formatted = `${v.substring(0, 2)}/${v.substring(2)}`;
      }
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const processPayment = async () => {
    const { isValid, errors } = validateCardDetails();
    if (!isValid) {
      setError('Please fix card errors before submitting');
      return;
    }

    setPaymentProcessing(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await handleContribute();
      setShowPaymentModal(false);
      setCardDetails({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
      });
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleContribute = async () => {
    if (!campaign || contributionAmount <= 0 || !contributorName.trim()) return;

    try {
      const response = await fetch(`http://localhost:9000/campaign/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: contributionAmount,
          contributorName: contributorName.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit contribution');
      }

      const updatedCampaign = await response.json();
      setCampaign(prev => ({
        ...prev,
        amountCollected: updatedCampaign.amountCollected,
        contributions: updatedCampaign.contributions || prev.contributions
      }));
      setContributionAmount(0);
      setContributorName('');
    } catch (err) {
      console.error('Error submitting contribution:', err);
      setError('Failed to submit contribution. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-green-100">
        <Header />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
          <div className="flex flex-col justify-center items-center h-96">
            <Zap className="w-8 h-8 text-[#c1ff72] animate-pulse" />
            <p className="mt-8 text-[#c1ff72] text-lg animate-pulse">Loading campaign details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="bg-black min-h-screen text-green-100">
        <Header />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6">
            Campaign not found
          </div>
        </div>
      </div>
    );
  }

  const contributions = campaign.contributions || [];
  const sortedContributors = [...contributions].sort((a, b) => b.amount - a.amount);
  const topContributors = sortedContributors.slice(0, 3);
  console.log(campaign);

  return (
    <div className="bg-black min-h-screen text-green-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate('/campaigns')}
          className="flex items-center text-gray-400 hover:text-white mb-6 text-sm"
        >
          <X size={16} className="mr-2" />
          Back to campaigns
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="max-w-2xl my-10 mx-auto">
              <div className="flex items-start mb-10">
                <div className="bg-gray-800 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Zap size={20} className="text-[#c1ff72]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#c1ff72] mb-3">
                    {campaign.name}
                  </h2>
                  <p className="text-lg text-gray-300 italic mb-4">
                    "{campaign.pitch}"
                  </p>
                  <div className='flex justify-between items-center'>
                  <p className='text-sm text-[#c1ff72]'>{campaign.email}</p>
                  {campaign.website && (
                    <div className="flex items-center bg-gray-800/50 rounded-lg p-3 w-fit">
                      <Globe size={14} className="text-[#c1ff72] mr-2" />
                      <a 
                        href={campaign.website.startsWith('http') ? campaign.website : `https://${campaign.website}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#c1ff72] hover:underline break-all text-sm"
                      >
                        {campaign.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg mb-10 border border-gray-700">
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full ${
                      (campaign.amountCollected / campaign.amountNeeded) * 100 >= 100 
                        ? 'bg-purple-500' 
                        : 'bg-[#c1ff72]'
                    }`} 
                    style={{ width: `${Math.min(
                      (campaign.amountCollected / campaign.amountNeeded) * 100, 
                      100
                    )}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">RAISED</div>
                    <div className="text-lg font-medium">${campaign.amountCollected.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">TARGET</div>
                    <div className="text-lg font-medium">${campaign.amountNeeded.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">SUPPORTERS</div>
                    <div className="text-lg font-medium">{contributions.length}</div>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#c1ff72] mb-4">About This Project</h3>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#c1ff72] mb-4">How We'll Use the Money</h3>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="space-y-3">
                    {campaign.moneyUsage.split('.').filter(item => item.trim()).map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-[#c1ff72] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <p className="text-gray-300 text-sm">{item.trim()}.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {sortedContributors.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-[#c1ff72] mb-4">Top Contributors</h3>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="space-y-3">
                      {sortedContributors.slice(0, 10).map((contributor, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600">
                          <div className="flex items-center">
                            <Users size={14} className="text-[#c1ff72] mr-2" />
                            <span className="text-gray-300 text-sm">{contributor.contributorName || 'Anonymous'}</span>
                          </div>
                          <span className="text-[#c1ff72] font-medium text-sm">
                            ${contributor.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {sortedContributors.length > 10 && (
                        <div className="text-center text-gray-400 text-sm">
                          + {sortedContributors.length - 10} more supporters
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="flex-col top-0 max-w-xl pt-6">
              <h3 className="text-xl font-bold text-[#c1ff72] mb-6">Contribute</h3>
              
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6">
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-sm">Contribute percentage of remaining amount:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 5, 10, 25, 50, 100].map(percent => {
                      const amount = calculatePercentageAmount(percent);
                      return (
                        <button
                          key={percent}
                          onClick={() => setContributionAmount(amount)}
                          className={`py-2 px-3 rounded-lg text-sm border transition-all ${
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

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Or enter custom amount:</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={contributionAmount || ''}
                      onChange={(e) => setContributionAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2 focus:border-[#c1ff72] focus:outline-none text-white text-sm"
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Name:</label>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:border-[#c1ff72] focus:outline-none text-white text-sm"
                    placeholder="Enter your name"
                  />
                </div>

                <button
                  onClick={() => {
                    if (contributionAmount > 0 && contributorName.trim()) {
                      setShowPaymentModal(true);
                    }
                  }}
                  disabled={!contributionAmount || contributionAmount <= 0 || !contributorName.trim()}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                    contributionAmount > 0 && contributorName.trim()
                      ? 'bg-[#c1ff72] text-black hover:bg-green-300 hover:shadow-[0_0_10px_rgba(193,255,114,0.5)]'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Contribute ${contributionAmount.toLocaleString()}
                </button>
              </div>

              {campaign.website && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6">
                  <div className="flex items-center mb-3">
                    <Globe size={16} className="text-[#c1ff72] mr-2" />
                    <h4 className="text-sm font-medium">Website</h4>
                  </div>
                  <a 
                    href={campaign.website.startsWith('http') ? campaign.website : `https://${campaign.website}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#c1ff72] hover:underline break-all text-xs"
                  >
                    {campaign.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {topContributors.length > 0 && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6">
                  <div className="flex items-center mb-3">
                    <Award size={16} className="text-[#c1ff72] mr-2" />
                    <h4 className="text-sm font-medium">Top Supporters</h4>
                  </div>
                  <div className="space-y-3">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                            index === 0 ? 'bg-yellow-500/20' : 
                            index === 1 ? 'bg-gray-600' : 
                            'bg-purple-500/20'
                          }`}>
                            <span className={`${
                              index === 0 ? 'text-yellow-400' : 
                              index === 1 ? 'text-gray-300' : 
                              'text-purple-400'
                            } font-medium text-xs`}>
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-gray-300 text-sm">{contributor.contributorName || 'Anonymous'}</span>
                        </div>
                        <span className="text-[#c1ff72] font-medium text-sm">
                          ${(contributor.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    campaign.status === 'active' ? 'bg-[#c1ff72]' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {campaign.status === 'active' ? 'Active' : 'Completed'} Campaign
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="text-[#c1ff72] mr-2" />
                  <div>
                    <div className="text-xs text-gray-400">End Date</div>
                    <div className="text-sm">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {campaign.status === 'active' && (
                  <div className="mt-2 text-xs text-gray-400">
                    {Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)) > 0 
                      ? `${Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining`
                      : "Campaign ended"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#c1ff72]">Payment Details</h2>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleCardInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm mt-2">
                      {error}
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={processPayment}
                      disabled={paymentProcessing}
                      className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
                        paymentProcessing
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-[#c1ff72] text-black hover:bg-green-300'
                      }`}
                    >
                      {paymentProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2" size={18} />
                          Pay ${contributionAmount.toLocaleString()}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Contribution Button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3">
          <div className="max-w-md mx-auto space-y-2">
            <input
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:border-[#c1ff72] focus:outline-none text-white text-sm"
              placeholder="Your name"
            />
            <button
              onClick={() => {
                if (contributionAmount > 0 && contributorName.trim()) {
                  setShowPaymentModal(true);
                }
              }}
              disabled={!contributionAmount || contributionAmount <= 0 || !contributorName.trim()}
              className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${
                contributionAmount > 0 && contributorName.trim()
                  ? 'bg-[#c1ff72] text-black hover:bg-green-300 hover:shadow-[0_0_8px_rgba(193,255,114,0.3)]'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Contribute ${contributionAmount.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;