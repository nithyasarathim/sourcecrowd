import React from 'react';
import { Zap, Globe, Users } from 'lucide-react';

const CampaignDetails = ({ campaign }) => {
  const contributions = campaign.contributions || [];
  
  const sortedContributors = [...contributions].sort((a, b) => b.amount - a.amount);

  return (
    <div className="max-w-2xl my-10 mx-auto">
      <div className="flex items-start mb-10">
        <div className="bg-gray-800 p-3 rounded-lg mr-4 flex-shrink-0">
          <Zap size={24} className="text-[#c1ff72]" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#c1ff72] mb-3">
            {campaign.name}
          </h2>
          <p className="text-xl text-gray-300 italic mb-4">
            "{campaign.pitch}"
          </p>
          {campaign.website && (
            <div className="flex items-center bg-gray-800/50 rounded-lg p-3 w-fit">
              <Globe size={16} className="text-[#c1ff72] mr-2" />
              <a 
                href={campaign.website.startsWith('http') ? campaign.website : `https://${campaign.website}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#c1ff72] hover:underline break-all"
              >
                {campaign.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800/50 p-6 rounded-lg mb-10 border border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full ${
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
            <div className="text-xl font-medium">${campaign.amountCollected.toLocaleString()}</div>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">TARGET</div>
            <div className="text-xl font-medium">${campaign.amountNeeded.toLocaleString()}</div>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">SUPPORTERS</div>
            <div className="text-xl font-medium">{contributions.length}</div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-bold text-[#c1ff72] mb-5">About This Project</h3>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-lg leading-relaxed">
            {campaign.description}
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-bold text-[#c1ff72] mb-5">How We'll Use the Money</h3>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="space-y-4">
            {campaign.moneyUsage.split('.').filter(item => item.trim()).map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-3 h-3 bg-[#c1ff72] rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <p className="text-gray-300 text-lg">{item.trim()}.</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sortedContributors.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-[#c1ff72] mb-5">Top Contributors</h3>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              {sortedContributors.slice(0, 10).map((contributor, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700/50 px-4 py-3 rounded-lg border border-gray-600">
                  <div className="flex items-center">
                    <Users size={16} className="text-[#c1ff72] mr-3" />
                    <span className="text-gray-300">{contributor.contributorName || 'Anonymous'}</span>
                  </div>
                  <span className="text-[#c1ff72] font-medium">
                    ${contributor.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              {sortedContributors.length > 10 && (
                <div className="text-center text-gray-400">
                  + {sortedContributors.length - 10} more supporters
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;