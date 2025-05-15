  import React from 'react';

  const MobileContributionButton = ({ 
    contributionAmount, 
    contributorName, 
    setContributorName,
    handleContribute 
  }) => {
    return (
      <div className="max-w-md mx-auto space-y-3">
        <input
          type="text"
          value={contributorName}
          onChange={(e) => setContributorName(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#c1ff72] focus:outline-none text-white text-sm"
          placeholder="Your name"
        />
        <button
          onClick={handleContribute}
          disabled={!contributionAmount || contributionAmount <= 0 || !contributorName.trim()}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            contributionAmount > 0 && contributorName.trim()
              ? 'bg-[#c1ff72] text-black hover:bg-green-300 hover:shadow-[0_0_10px_rgba(193,255,114,0.5)]'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Contribute ${contributionAmount.toLocaleString()}
        </button>
      </div>
    );
  };

  export default MobileContributionButton;