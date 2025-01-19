import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserCircleIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    pending: 0,
    fixed: 0,
    todayReports: 0
  });

  // Fetch reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const reportData = [];
        let statsData = {
          total: 0,
          high: 0,
          medium: 0,
          low: 0,
          pending: 0,
          fixed: 0,
          todayReports: 0
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          reportData.push(data);
          
          // Update stats
          statsData.total++;
          statsData[data.severity.toLowerCase()]++;
          statsData[data.status]++;

          // Count today's reports
          if (data.timestamp?.toDate() >= today) {
            statsData.todayReports++;
          }
        });

        setReports(reportData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || report.severity.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' || 
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = async (reportId, newStatus) => {
    try {
      // Update in Firestore
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: newStatus
      });
      
      // Update local state
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus }
          : report
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: newStatus === 'fixed' ? prev.pending - 1 : prev.pending + 1,
        fixed: newStatus === 'fixed' ? prev.fixed + 1 : prev.fixed - 1
      }));

      // Show success feedback (optional)
      const message = newStatus === 'fixed' ? 'Marked as fixed!' : 'Marked as pending!';
      alert(message); // You might want to use a better notification system

    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <ChartBarIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reports</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.total}</h3>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <span className="text-green-600 font-medium">+{stats.todayReports}</span> new today
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                <ExclamationTriangleIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">High Severity</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.high}</h3>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-100 h-2 rounded-full">
                <div 
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(stats.high / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-50 text-red-600">
                <ClockIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.pending}</h3>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-100 h-2 rounded-full">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Fixed</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.fixed}</h3>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-100 h-2 rounded-full">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.fixed / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {['all', 'high', 'medium', 'low'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div 
              key={report.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="relative">
                <img 
                  src={report.imageData} 
                  alt="Pothole" 
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                  report.severity === 'High' ? 'bg-red-100 text-red-800' :
                  report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {report.severity} Severity
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-500">
                    <UserCircleIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">ID: {report.userId.slice(0, 8)}...</span>
                  </div>

                  <div className="flex items-center text-gray-500">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">{report.location || 'Location pending'}</span>
                  </div>

                  <div className="flex items-center text-gray-500">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      {report.timestamp?.toDate().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      report.status === 'fixed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>

                    <button
                      onClick={() => updateStatus(report.id, report.status === 'fixed' ? 'pending' : 'fixed')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        report.status === 'fixed'
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      Mark as {report.status === 'fixed' ? 'Pending' : 'Fixed'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No pothole reports match your current filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 