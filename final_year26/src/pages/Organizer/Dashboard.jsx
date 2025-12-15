import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  MapPin,
  Edit,
  Trash2,
  Check,
  X,
  Plus,
  Eye,
  Settings
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

export function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    interEvents: 0,
    intraEvents: 0,
    pendingRequests: 0,
    totalMembers: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch events created by the current user
      const eventsResponse = await eventAPI.getEvents({ 
        organizer: user?.id,
        limit: 50 
      });
      
      const organizerEvents = eventsResponse.data.events;
      setEvents(organizerEvents);
      
      // Fetch pending membership requests for user's organization
      const requestsResponse = await organizationAPI.getPendingRequests();
      if (requestsResponse.data?.requests) {
        setPendingRequests(requestsResponse.data.requests);
      }
      
      // Calculate stats
      const interEvents = organizerEvents.filter(event => event.type === 'INTER');
      const intraEvents = organizerEvents.filter(event => event.type === 'INTRA');
      
      setStats({
        totalEvents: organizerEvents.length,
        interEvents: interEvents.length,
        intraEvents: intraEvents.length,
        pendingRequests: pendingRequests.length,
        totalMembers: user?.joinedOrganizations?.length || 0
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await eventAPI.createEvent(eventData);
      if (response.success) {
        setEvents(prev => [response.data.event, ...prev]);
        setStats(prev => ({
          ...prev,
          totalEvents: prev.totalEvents + 1,
          [eventData.type === 'INTER' ? 'interEvents' : 'intraEvents']: 
            prev[eventData.type === 'INTER' ? 'interEvents' : 'intraEvents'] + 1
        }));
        setShowEventForm(false);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleUpdateEvent = async (eventId, eventData) => {
    try {
      const response = await eventAPI.updateEvent(eventId, eventData);
      if (response.success) {
        setEvents(prev => prev.map(event => 
          event._id === eventId ? response.data.event : event
        ));
        setShowEventForm(false);
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventAPI.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event._id !== eventId));
      setStats(prev => ({
        ...prev,
        totalEvents: prev.totalEvents - 1
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleRequestResponse = async (requestId, status) => {
    try {
      await organizationAPI.respondToJoinRequest(requestId, status);
      
      // Remove from pending requests
      const updatedRequests = pendingRequests.filter(req => req._id !== requestId);
      setPendingRequests(updatedRequests);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests - 1
      }));
      
      if (status === 'ACCEPTED') {
        setStats(prev => ({
          ...prev,
          totalMembers: prev.totalMembers + 1
        }));
      }
      
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Failed to process request. Please try again.');
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

  const openCreateForm = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
          {user?.organizationName || 'Organization'} Dashboard
        </motion.h1>
        <motion.p 
          className="page-subtitle"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Manage your organization's events and members
        </motion.p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
        variants={itemVariants}
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inter Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interEvents}</p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Intra Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.intraEvents}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMembers}</p>
            </div>
            <Target className="h-8 w-8 text-pink-600" />
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
            onClick={() => setActiveTab('events')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'events'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Calendar className="inline-block w-4 h-4 mr-2" />
            Event Management
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users className="inline-block w-4 h-4 mr-2" />
            Membership Requests
          </button>
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={itemVariants}>
        {/* Event Management Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Events
              </h2>
              <button
                onClick={openCreateForm}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </button>
            </div>

            {events.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => (
                  <div key={event._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditForm(event)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
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
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.type === 'INTER' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {event.type}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {event.currentParticipants || 0} participants
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events created</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create your first event to get started.
                </p>
                <div className="mt-6">
                  <button
                    onClick={openCreateForm}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Membership Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Membership Requests
            </h2>

            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {request.user?.name || 'Unknown User'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {request.user?.email}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          Requested on {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleRequestResponse(request._id, 'ACCEPTED')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestResponse(request._id, 'REJECTED')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending requests</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  All membership requests have been processed.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <EventForm
              event={editingEvent}
              onSubmit={editingEvent ? 
                (data) => handleUpdateEvent(editingEvent._id, data) : 
                handleCreateEvent
              }
              onCancel={() => {
                setShowEventForm(false);
                setEditingEvent(null);
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Event Form Component
function EventForm({ event, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    location: event?.location || '',
    type: event?.type || 'INTER',
    maxParticipants: event?.maxParticipants || 100,
    registrationDeadline: event?.registrationDeadline ? 
      new Date(event.registrationDeadline).toISOString().slice(0, 16) : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Event Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date & Time
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="INTER">INTER (Public)</option>
            <option value="INTRA">INTRA (Private)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Participants
          </label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Registration Deadline
          </label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
        >
          {event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
