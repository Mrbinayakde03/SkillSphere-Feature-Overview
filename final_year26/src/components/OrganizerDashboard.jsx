import { useState } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { mockEvents } from '../data/mockData';
import { Plus, Calendar, Users, TrendingUp, Edit, Trash2, Filter } from 'lucide-react';
import { CreateEventModal } from './CreateEventModal';

export function OrganizerDashboard({ user, onLogout }) {
  const [events, setEvents] = useState(mockEvents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const organizerEvents = events.filter(event => event.college === user.college);
  
  const filteredEvents = organizerEvents.filter(event => {
    if (filterStatus === 'all') return true;
    return event.status === filterStatus;
  });

  const stats = {
    totalEvents: organizerEvents.length,
    upcomingEvents: organizerEvents.filter(e => e.status === 'upcoming').length,
    totalParticipants: organizerEvents.reduce((sum, e) => sum + e.currentParticipants, 0),
    avgAttendance: Math.round(
      (organizerEvents.reduce((sum, e) => sum + (e.currentParticipants / e.maxParticipants * 100), 0) / 
      organizerEvents.length) || 0
    )
  };

  const handleCreateEvent = (newEvent) => {
    const event = {
      ...newEvent,
      id: String(events.length + 1),
      currentParticipants: 0,
    };
    setEvents([event, ...events]);
    setShowCreateModal(false);
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
            <p className="text-gray-600">Create, track, and manage your college events</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalEvents}</span>
            </div>
            <div className="text-gray-600">Total Events</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</span>
            </div>
            <div className="text-gray-600">Upcoming Events</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</span>
            </div>
            <div className="text-gray-600">Total Participants</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.avgAttendance}%</span>
            </div>
            <div className="text-gray-600">Avg Attendance</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="flex gap-2">
              {['all', 'upcoming', 'ongoing', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    filterStatus === status
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all' 
                  ? 'Get started by creating your first event'
                  : `No ${filterStatus} events found`
                }
              </p>
              {filterStatus === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  Create Your First Event
                </button>
              )}
            </div>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {event.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                          event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Date & Time</div>
                      <div className="font-medium text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span className="text-gray-600 text-sm ml-1">at {event.time}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Location</div>
                      <div className="font-medium text-gray-900 line-clamp-1">{event.location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Participants</div>
                      <div className="font-medium text-gray-900">
                        {event.currentParticipants} / {event.maxParticipants}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Attendance Rate</div>
                      <div className="font-medium text-gray-900">
                        {Math.round((event.currentParticipants / event.maxParticipants) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {event.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {event.skills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{event.skills.length - 4}
                        </span>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
          college={user.college || ''}
        />
      )}
    </div>
  );
}
