import React, { useState, useEffect } from 'react';
import { Calendar, Users, Star, Search, UserPlus, Check, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { eventAPI, organizationAPI } from '../../services/api';
import '../../styles/Dashboard.css';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inter-events');
  const [events, setEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchInterEvents(),
        fetchOrganizations()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterEvents = async () => {
    try {
      const response = await eventAPI.getEvents({ type: 'inter' });
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await organizationAPI.getOrganizations({ search: searchQuery });
      setOrganizations(response.data.organizations || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const response = await organizationAPI.getOrganizations({ search: query });
      setOrganizations(response.data.organizations || []);
    } catch (error) {
      console.error('Error searching organizations:', error);
    }
  };

  const handleJoinRequest = async (orgId) => {
    try {
      setJoinLoading(prev => ({ ...prev, [orgId]: true }));
      await organizationAPI.requestToJoin(orgId);
      await fetchOrganizations(); // Refresh to show updated status
    } catch (error) {
      console.error('Error joining organization:', error);
      alert('Failed to send join request');
    } finally {
      setJoinLoading(prev => ({ ...prev, [orgId]: false }));
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      await eventAPI.registerForEvent(eventId);
      alert('Successfully registered for event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event');
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
        <h1 className="dashboard-title">Welcome, {user?.name}!</h1>
        <p className="dashboard-subtitle">
          Explore events and join organizations to enhance your learning journey
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="event-filters">
        <button
          className={`filter-btn ${activeTab === 'inter-events' ? 'active' : ''}`}
          onClick={() => setActiveTab('inter-events')}
        >
          <Calendar className="filter-icon" />
          Inter Events (Public)
        </button>
        <button
          className={`filter-btn ${activeTab === 'organizations' ? 'active' : ''}`}
          onClick={() => setActiveTab('organizations')}
        >
          <Users className="filter-icon" />
          Organizations
        </button>
      </div>

      {/* Inter Events Tab */}
      {activeTab === 'inter-events' && (
        <div className="events-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Public Events (Inter)</h2>
              <p className="section-description">
                These events are visible to everyone and open for registration
              </p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="empty-state">
              <Calendar className="empty-state-icon" />
              <h3 className="empty-state-title">No Events Available</h3>
              <p className="empty-state-description">
                Check back later for new inter events
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
                        <Clock size={16} />
                        <span>{event.time}</span>
                      </div>
                      <div className="event-detail">
                        <Users size={16} />
                        <span>{event.location}</span>
                      </div>
                      <div className="event-detail">
                        <Star size={16} />
                        <span>{event.category}</span>
                      </div>
                    </div>

                    <div className="event-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRegisterEvent(event._id)}
                      >
                        Register for Event
                      </button>
                      <button className="btn btn-secondary">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Organizations Tab */}
      {activeTab === 'organizations' && (
        <div className="org-search-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Join Organizations</h2>
              <p className="section-description">
                Search and join organizations to access intra events
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="search-container">
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} 
              />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
                style={{ paddingLeft: '50px' }}
              />
            </div>
          </div>

          {organizations.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-state-icon" />
              <h3 className="empty-state-title">No Organizations Found</h3>
              <p className="empty-state-description">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            <div className="organizations-grid">
              {organizations.map((org) => (
                <div key={org._id} className="organization-card">
                  <div className="org-header">
                    <div className="org-logo">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="org-info">
                      <h3>{org.name}</h3>
                      <p className="org-type">{org.type}</p>
                    </div>
                  </div>

                  <p className="org-description">{org.description}</p>

                  <div className="org-stats">
                    <span>👥 {org.members?.length || 0} members</span>
                    <span>📅 {org.stats?.totalEvents || 0} events</span>
                  </div>

                  <div className="event-actions">
                    {org.joinStatus === 'pending' ? (
                      <div className="join-status pending">
                        <Clock size={16} />
                        Request Pending
                      </div>
                    ) : org.joinStatus === 'accepted' ? (
                      <div className="join-status accepted">
                        <Check size={16} />
                        Member
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleJoinRequest(org._id)}
                        disabled={joinLoading[org._id]}
                      >
                        {joinLoading[org._id] ? (
                          <>
                            <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} />
                            Join Organization
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
