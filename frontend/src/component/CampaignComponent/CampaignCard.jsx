import React from 'react';
import { Clock, Users, Zap, Target, Award } from 'lucide-react';

const CampaignCard = ({ campaign, onClick }) => {
  const progress = (campaign.amountCollected / campaign.amountNeeded) * 100;
  const timeStatus = getTimeStatus(campaign.endDate, campaign.status);
  const remainingAmount = campaign.amountNeeded - campaign.amountCollected;

  function getTimeStatus(endDate, status) {
    if (status === 'finished') return 'Completed';
    const daysLeft = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Ended';
  }

  return (
    <div 
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-[#c1ff72]/50 transition-all group cursor-pointer hover:shadow-[0_0_20px_rgba(193,255,114,0.1)]"
      onClick={onClick}
    >
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
              {campaign.pitch}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">${campaign.amountCollected.toLocaleString()} raised</span>
            <span className="text-gray-400">
              {remainingAmount > 0 ? `${remainingAmount.toLocaleString()} to go` : "Goal completed!"}
            </span>
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
              {campaign.contributors?.length || 0} supporters
            </span>

          </div>
        </div>

        

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
};

export default CampaignCard;