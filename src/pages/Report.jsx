import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  CameraIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Report = () => {
  const { currentUser } = useAuth();
  const [captureMode, setCaptureMode] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState(null);
  const [location, setLocation] = useState('');
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  // Handle webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const photo = canvas.toDataURL('image/jpeg');
      setPreview(photo);
      stopWebcam();
    }
  };

  // Basic image validation function
  const validateImage = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }

    return true;
  };

  // Modified file handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError(''); // Clear any previous errors

    if (file) {
      try {
        validateImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setError(error.message);
        e.target.value = ''; // Reset file input
      }
    }
  };

  // Analyze pothole severity
  const analyzeSeverity = async (imageUrl) => {
    // Mock severity analysis - Replace with actual API call to your ML model
    const mockSeverities = ['Low', 'Medium', 'High'];
    return mockSeverities[Math.floor(Math.random() * mockSeverities.length)];
  };

  // Modified submit handler
  const handleSubmit = async () => {
    if (!preview) return;
    if (!location.trim()) {
      setError('Please enter the location');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Analyze severity (mock)
      const detectedSeverity = await analyzeSeverity(preview);
      setSeverity(detectedSeverity);

      // Save report to Firestore
      await addDoc(collection(db, 'reports'), {
        userId: currentUser.uid,
        imageData: preview,
        severity: detectedSeverity,
        status: 'pending',
        location: location.trim(),
        timestamp: serverTimestamp()
      });

      // Reset form
      setPreview(null);
      setCaptureMode(null);
      setLocation('');
    } catch (error) {
      setError(error.message);
      console.error("Error submitting report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add this in the JSX where you want to show errors
  const ErrorMessage = () => error ? (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      <p className="text-sm">{error}</p>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}
      ></div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold">Report a Pothole</h2>
            <p className="mt-2 opacity-90">Help improve your community by reporting road damage</p>
          </div>

          <div className="p-8">
            {/* Add Error Message */}
            <ErrorMessage />

            {/* Capture modes */}
            {!captureMode && !preview && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => {
                    setCaptureMode('camera');
                    startWebcam();
                  }}
                  className="flex flex-col items-center p-6 border-2 border-dashed rounded-xl hover:border-blue-500 hover:text-blue-500 transition-colors group"
                >
                  <div className="p-4 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <CameraIcon className="h-8 w-8" />
                  </div>
                  <span className="mt-4 font-medium">Use Webcam</span>
                  <p className="mt-2 text-sm text-gray-500">Take a photo directly using your device camera</p>
                </button>

                <button
                  onClick={() => {
                    setCaptureMode('upload');
                    fileInputRef.current?.click();
                  }}
                  className="flex flex-col items-center p-6 border-2 border-dashed rounded-xl hover:border-blue-500 hover:text-blue-500 transition-colors group"
                >
                  <div className="p-4 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <PhotoIcon className="h-8 w-8" />
                  </div>
                  <span className="mt-4 font-medium">Upload Photo</span>
                  <p className="mt-2 text-sm text-gray-500">Choose an existing photo from your device</p>
                </button>

                <button
                  onClick={() => setCaptureMode('video')}
                  className="flex flex-col items-center p-6 border-2 border-dashed rounded-xl hover:border-blue-500 hover:text-blue-500 transition-colors group"
                >
                  <div className="p-4 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <VideoCameraIcon className="h-8 w-8" />
                  </div>
                  <span className="mt-4 font-medium">Record Video</span>
                  <p className="mt-2 text-sm text-gray-500">Record a short video of the pothole</p>
                </button>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />

            {/* Webcam view */}
            {captureMode === 'camera' && !preview && (
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full rounded-xl"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={capturePhoto}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <CameraIcon className="h-5 w-5" />
                    Capture Photo
                  </button>
                </div>
              </div>
            )}

            {/* Preview and Form */}
            {preview && (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-xl shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setCaptureMode(null);
                      setSeverity(null);
                    }}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Location Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location Details
                  </label>
                  <div className="relative">
                    <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter the location or street name"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                {!loading && !severity && (
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    Submit Report
                  </button>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Analyzing pothole severity...</p>
              </div>
            )}

            {/* Severity Result */}
            {severity && (
              <div className={`mt-6 p-6 rounded-xl ${
                severity === 'High' ? 'bg-red-50 border border-red-100' :
                severity === 'Medium' ? 'bg-yellow-50 border border-yellow-100' :
                'bg-green-50 border border-green-100'
              }`}>
                <h3 className="text-lg font-semibold mb-2">Analysis Complete</h3>
                <p className={`text-sm ${
                  severity === 'High' ? 'text-red-700' :
                  severity === 'Medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  Severity Level: <span className="font-medium">{severity}</span>
                </p>
                <p className="mt-2 text-gray-600 text-sm">
                  {severity === 'High' ? 'This requires immediate attention.' :
                   severity === 'Medium' ? 'This should be addressed soon.' :
                   'This will be monitored.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report; 