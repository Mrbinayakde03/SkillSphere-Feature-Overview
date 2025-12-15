import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Target, 
  TrendingUp, 
  Star,
  Brain,
  Award,
  BookOpen,
  Eye,
  UserPlus,
  Clock,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { eventAPI } from '../../services/api';
import { organizationAPI } from '../../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

export function UserDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inter-events');
  const [interEvents, setInterEvents] = useState([]);
  const [intraEvents, setIntraEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningOrganization, setJoiningOrganization] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch inter events (public events)
      const interResponse = await eventAPI.getInterEvents();
      if (interResponse.data?.events) {
        setInterEvents(interResponse.data.events);
      }

      // Fetch organizations
      const orgResponse = await organizationAPI.getOrganizations();
      if (orgResponse.data?.organizations) {
        setOrganizations(orgResponse.data.organizations);
      }

      // Fetch intra events for organizations user is a member of
      const intraResponse = await eventAPI.getIntraEvents();
      if (intraResponse.data?.events) {
        setIntraEvents(intraResponse.data.events);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (organizationId) => {
    try {
      setJoiningOrganization(organizationId);
      await organizationAPI.sendJoinRequest(organizationId);
      alert('Join request sent successfully!');
      // Update the organization status in the list
      setOrganizations(prev => prev.map(org => 
        org._id === organizationId 
          ? { ...org, joinRequestStatus: 'PENDING' }
          : org
      ));
    } catch (error) {
      console.error('Error sending join request:', error);
      alert('Failed to send join request. Please try again.');
    } finally {
      setJoiningOrganization(null);
    }
  };

  const handleEventRegistration = async (event) => {
    try {
      await eventAPI.registerForEvent(event._id);
      alert(`Successfully registered for ${event.title}`);
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div 
        className="page-header"
        variants={itemVariants}
      >
        <motion.h1 
          className="page-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome back, {user?.name}! 👋
        </motion.h1>
        <motion.p 
          className="page-subtitle"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Discover events and organizations that match your interests
        </motion.p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inter Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{interEvents.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Intra Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{intraEvents.length}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Organizations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{organizations.length}</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Orgs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.joinedOrganizations?.length || 0}
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div 
        className="border-b border-gray-200 dark:border-gray-700"
        variants={itemVariants}
      >
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('inter-events')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inter-events'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Eye className="inline-block w-4 h-4 mr-2" />
            Public Events (Inter)
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'organizations'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <UserPlus className="inline-block w-4 h-4 mr-2" />
            Organizations
          </button>
          <button
            onClick={() => setActiveTab('intra-events')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'intra-events'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users className="inline-block w-4 h-4 mr-2" />
            My Organization Events (Intra)
          </button>
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={itemVariants}>
        {/* Inter Events Tab */}
        {activeTab === 'inter-events' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Public Events from All Organizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interEvents.length > 0 ? (
                interEvents.map((event) => (
                  <div key={event._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(event.date)} at {formatTime(event.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4 mr-2" />
                          {event.organizer?.name || 'Organization Event'}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {event.type}
                        </span>
                        <button
                          onClick={() => handleEventRegistration(event)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No inter events</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    There are no public events available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Available Organizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.length > 0 ? (
                organizations.map((org) => {
                  const isMember = user?.joinedOrganizations?.includes(org._id);
                  const hasPendingRequest = org.joinRequestStatus === 'PENDING';
                  
                  return (
                    <div key={org._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {org.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          {org.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-2" />
                            {org.members?.length || 0} members
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Target className="w-4 h-4 mr-2" />
                            {org.type}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          {isMember ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Member
                            </span>
                          ) : hasPendingRequest ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          ) : (
                            <button
                              onClick={() => handleJoinRequest(org._id)}
                              disabled={joiningOrganization === org._id}
                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                            >
                              {joiningOrganization === org._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              ) : (
                                <UserPlus className="w-4 h-4 mr-2" />
                              )}
                              Join Organization
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No organizations</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    There are no organizations available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Intra Events Tab */}
        {activeTab === 'intra-events' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Private Events from Your Organizations
            </h2>
            {user?.joinedOrganizations?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No organization memberships</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Join an organization to access private (intra) events.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intraEvents.length > 0 ? (
                  intraEvents.map((event) => (
                    <div key={event._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(event.date)} at {formatTime(event.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-2" />
                            {event.organization?.name}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {event.type}
                          </span>
                          <button
                            onClick={() => handleEventRegistration(event)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No intra events</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      There are no private events available for your organizations.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
