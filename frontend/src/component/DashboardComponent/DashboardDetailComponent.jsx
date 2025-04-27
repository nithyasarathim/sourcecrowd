import React from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

const DashboardDetailComponent = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/campaigns');
  };

  return (
    <div className="bg-black min-h-screen text-green-100 p-8 space-y-12">

      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#c1ff72]">Welcome to SourceCrowd</h1>
        <p className="text-green-200 max-w-xl">
          SourceCrowd helps ideas grow. Start your journey, support a dream, and be part of something bigger.
        </p>
        <button 
          onClick={handleExplore}
          className="mt-4 px-6 py-3 bg-[#c1ff72] hover:bg-green-400 text-black font-semibold rounded-lg transition"
        >
          Explore Campaigns
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg mb-2">Active Campaigns</h2>
          <h1 className="text-3xl font-bold text-[#c1ff72]">
            <CountUp end={24} duration={2} />
          </h1>
        </div>

        <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg mb-2">Finished Campaigns</h2>
          <h1 className="text-3xl font-bold text-[#c1ff72]">
            <CountUp end={56} duration={2.5} />
          </h1>
        </div>

        <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg mb-2">Total Raised</h2>
          <h1 className="text-3xl font-bold text-[#c1ff72]">
            $<CountUp end={780000} duration={3} separator="," />
          </h1>
        </div>

        <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg mb-2">Total Backers</h2>
          <h1 className="text-3xl font-bold text-[#c1ff72]">
            <CountUp end={1200} duration={2.8} separator="," />
          </h1>
        </div>
      </div>

      <hr className="border-[#c1ff72]" />

      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-3xl font-bold text-[#c1ff72]">Inside SourceCrowd</h2>
        <p className="text-green-200 max-w-2xl">
        SourceCrowd connects bright ideas with passionate supporters. Help dreams turn into reality and be part of a community that believes in the power of collaboration. Whether you're an innovator or a supporter, your journey starts here.
        </p>
      </div>

    </div>
  );
};

export default DashboardDetailComponent;
