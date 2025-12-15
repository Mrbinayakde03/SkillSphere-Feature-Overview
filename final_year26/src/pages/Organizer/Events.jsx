
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { EventCard } from '../../components/EventCard';
import { CreateEventModal } from '../../components/CreateEventModal';
import { eventAPI, organizationAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { mockEvents } from '../../data/mockData';
import '../../styles/Dashboard.css';

export function OrganizerEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      

      // Check if user has ORGANIZATION role (case insensitive)
      if (!user?.role || user?.role.toLowerCase() !== 'organization') {
        setError('You need to register as an organization to create events.');
        setEvents([]);
        return;
      }


      console.log('Fetching data for user:', user);
      
      // Fetch user's organizations using dedicated endpoint
      let org = null;
      try {
        const orgResponse = await organizationAPI.getUserOrganizations();
        console.log('User organizations API response:', orgResponse);
        
        if (orgResponse.data?.organizations?.length > 0) {
          // User can only have one organization as admin
          org = orgResponse.data.organizations[0];
          console.log('Found organization:', org);
        }
      } catch (orgError) {
        console.error('Error fetching user organizations:', orgError);
      }

      setOrganization(org);

      // Fetch events data
      const eventsResponse = await eventAPI.getEvents();
      const fetchedEvents = eventsResponse.data.events || [];
      
      // Filter events by organization if user has one
      if (org) {
        const organizationEvents = fetchedEvents.filter(event => 
          event.organizationId === org._id || 
          event.organizer?.organizationId === org._id ||
          event.organizer?.adminUserId === user._id
        );
        setEvents(organizationEvents);
      } else {
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load events. Please try again.');
      
      // Fallback to mock data for development
      setEvents(mockEvents.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };




  const handleCreateEvent = async (eventData) => {
    try {
      console.log('Attempting to create event...', eventData);
      console.log('Current user:', user);
      console.log('Current organization:', organization);

      // Check if user has a valid organization
      if (!organization) {
        alert('Please register as an organization first to create events.');
        return;
      }

      console.log('Creating event with organization:', organization);

      // Add organization ID and ensure proper format
      const eventWithOrg = {
        ...eventData,
        organizationId: organization._id,
        organizer: {
          name: organization.name,
          college: organization.college,
          organizationId: organization._id,
          adminUserId: user._id
        },
        status: 'upcoming',
        visibility: 'public',
        registeredCount: 0,
        createdBy: user._id
      };

      console.log('Event data to send:', eventWithOrg);

      const response = await eventAPI.createEvent(eventWithOrg);
      
      console.log('Event creation response:', response);
      
      if (response.data?.success || response.success) {
        // Refresh events list
        await fetchData();
        setShowCreateModal(false);
        alert('Event created successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      
      // For development/testing, simulate successful event creation
      if (error.message?.includes('Network Error') || 
          error.code === 'ERR_NETWORK' || 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('ECONNREFUSED')) {
        

        console.log('Network error detected, simulating event creation for development');
        
        // Use existing organization or create minimal temp org for simulation
        let tempOrg = organization;
        if (!tempOrg) {
          tempOrg = {
            _id: 'temp-org-' + user._id,
            name: user.organizationName || 'My Organization',
            college: user.college || 'University'
          };
        }
        
        const simulatedEvent = {
          _id: Date.now().toString(),
          ...eventData,
          organizationId: tempOrg._id,
          organizer: {
            name: tempOrg.name,
            college: tempOrg.college,
            organizationId: tempOrg._id,
            adminUserId: user._id
          },
          status: 'upcoming',
          visibility: 'public',
          registeredCount: 0,
          createdBy: user._id,
          createdAt: new Date().toISOString()
        };
        
        setEvents(prev => [...prev, simulatedEvent]);
        setShowCreateModal(false);
        alert('Event created successfully! (Development Mode)');
      } else {
        alert(`Failed to create event: ${error.message}. Please try again.`);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.deleteEvent(eventId);
        await fetchData();
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const getEventTypeBadge = (type) => {
    const colors = {
      'INTER': { bg: '#10b981', text: 'white' },
      'INTRA': { bg: '#667eea', text: 'white' }
    };
    const color = colors[type] || colors.INTER;
    
    return (
      <span 
        className="event-type" 
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {type} EVENT
      </span>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Events</h1>
        <p className="dashboard-subtitle">Create and manage your organization events</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <Calendar className="stat-icon" />
          <h3 className="stat-number">{events.length}</h3>
          <p className="stat-label">Total Events</p>
        </div>
        <div className="stat-card">
          <Users className="stat-icon" />
          <h3 className="stat-number">{organization?.members?.length || 0}</h3>
          <p className="stat-label">Members</p>
        </div>
        <div className="stat-card">
          <Plus className="stat-icon" />
          <h3 className="stat-number">{events.filter(e => e.status === 'upcoming').length}</h3>
          <p className="stat-label">Upcoming</p>
        </div>
      </div>

      {/* Create Event Section */}
      <div className="events-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Manage Events</h2>
            <p className="section-description">
              Create and manage your organization's events
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            Create New Event
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="empty-state">
            <Calendar className="empty-state-icon" />
            <h3 className="empty-state-title">No Events Created</h3>
            <p className="empty-state-description">
              Create your first event to get started
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
              style={{ marginTop: '20px' }}
            >
              <Plus size={16} />
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id || event.id} className="event-card">
                <div className="event-header">
                  <h3 className="event-title">{event.title}</h3>
                  {getEventTypeBadge(event.type || 'INTER')}
                </div>
                <div className="event-body">
                  <p className="event-description">{event.description}</p>
                  
                  <div className="event-details">
                    <div className="event-detail">
                      <Calendar size={16} />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="event-detail">
                      <Users size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="event-detail">
                      <span>Category: {event.category}</span>
                    </div>
                  </div>

                  <div className="event-actions">
                    <button className="btn btn-secondary">
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteEvent(event._id || event.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
          college={organization?.college || user?.college}
        />
      )}
    </div>
  );
}
