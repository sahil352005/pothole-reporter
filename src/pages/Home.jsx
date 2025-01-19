import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CameraIcon, 
  GiftIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const successStories = [
    {
      location: "Main Street, Downtown",
      before: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60",
      after: "https://images.unsplash.com/photo-1621198777376-d776b8673929?w=600&auto=format&fit=crop&q=60",
      daysToFix: 3,
      reportedBy: "Anish Nakhale.",
      location: "Cincinnati, Downtown",
      photographer: "Matt Hoffman"
    },
    {
      location: "Park Avenue",
      before: "https://images.unsplash.com/photo-1578862973944-aa3e267d5ed6?w=600&auto=format&fit=crop&q=60",
      after: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=60",
      daysToFix: 5,
      reportedBy: "Shivam Pachpute."
    }
  ];

  const RewardModal = () => (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${showRewardModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all duration-500">
        {/* Close button */}
        <button 
          onClick={() => setShowRewardModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Gift Box Animation */}
        <div className={`gift-box ${showRewardModal ? 'open' : ''}`}>
          <div className="box">
            <div className="lid">
              <div className="bow"></div>
            </div>
            <div className="box-body"></div>
          </div>
          <div className="prize">🏆</div>
        </div>

        <h3 className="text-2xl font-bold text-center mt-6 mb-4">
          Exciting Rewards Await!
        </h3>
        <div className="space-y-4 text-center">
          <p className="text-gray-600">
            Earn points for each verified pothole report:
          </p>
          <ul className="space-y-2 text-left ml-6">
            <li>🎯 50 points per verified report</li>
            <li>⭐ Bonus points for detailed photos</li>
            <li>🎁 Redeem points for amazing rewards</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const CameraModal = () => (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${showCameraModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all duration-500">
        <button 
          onClick={() => setShowCameraModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="camera-interface">
          <div className="camera-lens"></div>
          <div className="camera-options grid grid-cols-3 gap-4 mt-8">
            <button className="camera-option">
              <div className="option-icon">
                <PhotoIcon className="h-8 w-8" />
              </div>
              <span>Upload Photo</span>
            </button>
            <button className="camera-option">
              <div className="option-icon">
                <VideoCameraIcon className="h-8 w-8" />
              </div>
              <span>Record Video</span>
            </button>
            <button className="camera-option">
              <div className="option-icon">
                <ComputerDesktopIcon className="h-8 w-8" />
              </div>
              <span>Use Webcam</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <h3 className="text-xl font-semibold mb-4">Report a Pothole</h3>
          <p className="text-gray-600">
            Choose how you want to capture the pothole:
          </p>
        </div>
      </div>
    </div>
  );

  const ProgressModal = () => (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${showProgressModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all duration-500">
        <button 
          onClick={() => setShowProgressModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h3 className="text-2xl font-bold text-center mb-8">Track Your Reports</h3>

        <div className="progress-tracker">
          <div className="progress-step completed">
            <div className="step-icon">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
            <div className="step-content">
              <h4 className="font-semibold">Report Submitted</h4>
              <p className="text-sm text-gray-600">Your report has been received</p>
            </div>
          </div>

          <div className="progress-step active">
            <div className="step-icon">
              <ClockIcon className="h-8 w-8" />
            </div>
            <div className="step-content">
              <h4 className="font-semibold">Under Review</h4>
              <p className="text-sm text-gray-600">City officials are assessing</p>
            </div>
          </div>

          <div className="progress-step">
            <div className="step-icon">
              <WrenchIcon className="h-8 w-8" />
            </div>
            <div className="step-content">
              <h4 className="font-semibold">Repair Scheduled</h4>
              <p className="text-sm text-gray-600">Work crew assigned</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-800">Overall Progress</span>
            <span className="text-sm font-medium text-blue-800">65%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Background Image */}
      <div className="relative bg-blue-600 text-white">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop')`
          }}
        ></div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 py-32">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
              Help Make Your City's Roads Better
            </h1>
            <p className="text-xl mb-8 drop-shadow-md">
              Report potholes, earn rewards, and contribute to safer streets for everyone.
            </p>
            <Link
              to="/report"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Report a Pothole
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Easy Reporting Card */}
          <div 
            onClick={() => setShowCameraModal(true)}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <CameraIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Reporting</h3>
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&auto=format&fit=crop&q=60" 
                alt="Report pothole" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600">
                Simply take a photo, mark the location, and submit your report in seconds.
              </p>
            </div>
          </div>
          
          {/* Rewards Card */}
          <div 
            onClick={() => setShowRewardModal(true)}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <GiftIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Rewards</h3>
              <img 
                src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&auto=format&fit=crop&q=60" 
                alt="Rewards" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600">
                Get points for each verified pothole report and redeem them for exciting rewards.
              </p>
            </div>
          </div>
          
          {/* Track Progress Card */}
          <div 
            onClick={() => setShowProgressModal(true)}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=60" 
                alt="Track progress" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600">
                Monitor repair status and see how your reports are making a difference.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{story.location}</h3>
                  
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Before Image */}
                    <div className="flex-1">
                      <div className="relative">
                        <img 
                          src={story.before} 
                          alt="Before repair" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                          Before
                        </div>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex items-center justify-center">
                      <ArrowRightIcon className="h-6 w-6 text-blue-500 transform rotate-90 md:rotate-0" />
                    </div>

                    {/* After Image */}
                    <div className="flex-1">
                      <div className="relative">
                        <img 
                          src={story.after} 
                          alt="After repair" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          After
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      Reported by: <span className="font-medium">{story.reportedBy}</span>
                    </div>
                    <div>
                      Fixed in: <span className="font-medium">{story.daysToFix} days</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/success-stories"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              View More Success Stories
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold mb-2">1,234</h4>
              <p className="text-gray-400">Potholes Reported</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">856</h4>
              <p className="text-gray-400">Potholes Fixed</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">5,678</h4>
              <p className="text-gray-400">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RewardModal />
      <CameraModal />
      <ProgressModal />
    </div>
  );
};

export default Home; 