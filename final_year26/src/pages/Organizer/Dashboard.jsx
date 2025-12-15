import React, { useState, useEffect } from 'react';
import { Calendar, Users, Plus, Edit, Trash2, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { eventAPI, organizationAPI } from '../../services/api';
import '../../styles/Dashboard.css';

export const OrganizerDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    type: 'INTER',
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOrganizationEvents(),
        fetchOrganizationData(),
        fetchPendingRequests()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationEvents = async () => {
    try {
      const response = await eventAPI.getEvents();
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchOrganizationData = async () => {
    try {
      const response = await organizationAPI.getOrganizations();
      const org = response.data.organizations?.find(o => o.adminUserId === user?._id);
      setOrganization(org);
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await organizationAPI.getOrganizations();
      const requests = response.data.organizations
        ?.filter(org => org.adminUserId === user?._id)
        .flatMap(org => org.pendingRequests || []) || [];
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      if (!organization) {
        alert('Please create an organization first');
        return;
      }

      await eventAPI.createEvent({
        ...formData,
        organizationId: organization._id
      });
      
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'Workshop',
        type: 'INTER',
        date: '',
        time: '',
        location: ''
      });
      
      await fetchOrganizationEvents();
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.deleteEvent(eventId);
        await fetchOrganizationEvents();
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleManageRequest = async (userId, action) => {
    try {
      await organizationAPI.manageMemberRequest(organization._id, userId, action);
      await fetchPendingRequests();
      alert(`Request ${action}ed successfully!`);
    } catch (error) {
      console.error('Error managing request:', error);
      alert('Failed to manage request');
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
        <h1 className="dashboard-title">Organization Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage your organization events and member requests
        </p>
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
          <BarChart3 className="stat-icon" />
          <h3 className="stat-number">{pendingRequests.length}</h3>
          <p className="stat-label">Pending Requests</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="event-filters">
        <button
          className={`filter-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 className="filter-icon" />
          Overview
        </button>
        <button
          className={`filter-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar className="filter-icon" />
          Events
        </button>
        <button
          className={`filter-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <Users className="filter-icon" />
          Members
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="events-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Organization Overview</h2>
              <p className="section-description">
                Quick overview of your organization activities
              </p>
            </div>
          </div>

          {organization ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Organization Details</h3>
                <p><strong>Name:</strong> {organization.name}</p>
                <p><strong>Type:</strong> {organization.type}</p>
                <p><strong>Description:</strong> {organization.description}</p>
                <p><strong>Members:</strong> {organization.members?.length || 0}</p>
                <p><strong>Events Created:</strong> {events.length}</p>
              </div>

              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Quick Actions</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                  style={{ marginRight: '10px' }}
                >
                  <Plus size={16} />
                  Create Event
                </button>

                <button className="btn btn-secondary">
                  <Settings size={16} />
                  Organization Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Settings className="empty-state-icon" />
              <h3 className="empty-state-title">No Organization Found</h3>
              <p className="empty-state-description">
                Create an organization to start managing events
              </p>
            </div>
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
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

          {events.length === 0 ? (
            <div className="empty-state">
              <Calendar className="empty-state-icon" />
              <h3 className="empty-state-title">No Events Created</h3>
              <p className="empty-state-description">
                Create your first event to get started
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    {getEventTypeBadge(event.type)}
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
                        onClick={() => handleDeleteEvent(event._id)}
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
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="events-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Membership Requests</h2>
              <p className="section-description">
                Review and manage membership requests
              </p>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-state-icon" />
              <h3 className="empty-state-title">No Pending Requests</h3>
              <p className="empty-state-description">
                All membership requests have been processed
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {pendingRequests.map((request) => (
                <div key={request._id} style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>User Request</h4>
                    <p style={{ margin: '0', color: '#64748b' }}>
                      Requested on: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <button
                      className="btn btn-success"
                      onClick={() => handleManageRequest(request.userId, 'ACCEPTED')}
                      style={{ marginRight: '10px' }}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleManageRequest(request.userId, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0' }}>Create New Event</h2>
            
            <form onSubmit={handleCreateEvent}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="search-input"
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="search-input"
                  rows="4"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="search-input"
                    required
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Competition">Competition</option>
                    <option value="Career Fair">Career Fair</option>
                    <option value="Networking">Networking</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Event Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="search-input"
                    required
                  >
                    <option value="INTER">INTER (Public - Visible to everyone)</option>
                    <option value="INTRA">INTRA (Private - Members only)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="search-input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="search-input"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="search-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
