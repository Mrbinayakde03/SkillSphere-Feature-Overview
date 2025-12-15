
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { eventAPI } from '../../services/api';
import { CreateEventModal } from '../../components/CreateEventModal';
import { EventCard } from '../../components/EventCard';
import { Plus, Calendar, Users, TrendingUp, Clock } from 'lucide-react';

export function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalParticipants: 0,
    avgAttendance: 0
  });

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  const fetchOrganizerEvents = async () => {
    try {
      setLoading(true);
      // Get events created by the current user
      const response = await eventAPI.getEvents({ 
        organizer: user?.id,
        limit: 10 
      });
      
      const organizerEvents = response.data.events;
      setEvents(organizerEvents);
      
      // Calculate stats
      const upcomingEvents = organizerEvents.filter(event => 
        new Date(event.date) > new Date() && event.status !== 'cancelled'
      );
      
      const totalParticipants = organizerEvents.reduce((sum, event) => 
        sum + (event.currentParticipants || 0), 0
      );
      
      setStats({
        totalEvents: organizerEvents.length,
        upcomingEvents: upcomingEvents.length,
        totalParticipants,
        avgAttendance: 85 // Placeholder for now
      });
      
    } catch (error) {
      console.error('Error fetching events:', error);
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
          upcomingEvents: prev.upcomingEvents + 1
        }));
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.organizationName || 'Organization'} Dashboard
          </h1>
          <p className="text-gray-600">Manage your events and organization</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalEvents}</div>
              <div className="text-gray-600 text-sm">Total Events</div>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</div>
              <div className="text-gray-600 text-sm">Upcoming Events</div>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</div>
              <div className="text-gray-600 text-sm">Total Participants</div>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgAttendance}%</div>
              <div className="text-gray-600 text-sm">Avg Attendance</div>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Your Events</h3>
          <span className="text-sm text-gray-500">{events.length} events</span>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h4>
            <p className="text-gray-600 mb-6">Create your first event to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} showActions={true} />
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
          college={user?.college || user?.organizationName}
        />
      )}
    </div>
  );
}
