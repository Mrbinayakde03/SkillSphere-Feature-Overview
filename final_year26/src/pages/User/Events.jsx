
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Filter, Search, MapPin, Clock } from 'lucide-react';
import { EventCard } from '../../components/EventCard';
import { EventFilters } from '../../components/EventFilters';
import { eventAPI } from '../../services/api';
import { mockEvents } from '../../data/mockData';
import '../../styles/Dashboard.css';

export function UserEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await eventAPI.getEvents();
      const fetchedEvents = response.data.events || [];
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Showing sample events.');
      
      // Fallback to mock data
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterForEvent = async (eventId) => {
    try {
      await eventAPI.registerForEvent(eventId);
      alert('Successfully registered for the event!');
      
      // Update events list to show registered status
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, isRegistered: true, registeredCount: (event.registeredCount || 0) + 1 }
            : event
        )
      );
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event. Please try again.');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    const matchesDate = !selectedDate || new Date(event.date) >= new Date(selectedDate);
    
    return matchesSearch && matchesCategory && matchesDate;
  });

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
        <h1 className="dashboard-title">Explore Events</h1>
        <p className="dashboard-subtitle">Discover and register for amazing events</p>
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
          <h3 className="stat-number">{events.filter(e => e.isRegistered).length}</h3>
          <p className="stat-label">Registered</p>
        </div>
        <div className="stat-card">
          <Clock className="stat-icon" />
          <h3 className="stat-number">{events.filter(e => new Date(e.date) > new Date()).length}</h3>
          <p className="stat-label">Upcoming</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="events-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Available Events</h2>
            <p className="section-description">
              Browse and register for events that interest you
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search events, locations, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="event-filters-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Categories</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Competition">Competition</option>
                  <option value="Career Fair">Career Fair</option>
                  <option value="Networking">Networking</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="filter-input"
                />
              </div>
              
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedDate('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

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

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Calendar className="empty-state-icon" />
            <h3 className="empty-state-title">No Events Found</h3>
            <p className="empty-state-description">
              {searchTerm || selectedCategory !== 'All' || selectedDate
                ? 'Try adjusting your search or filters'
                : 'No events available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div key={event._id || event.id} className="event-card">
                <div className="event-header">
                  <h3 className="event-title">{event.title}</h3>
                  <span className="event-category">{event.category}</span>
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
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="event-detail">
                      <Users size={16} />
                      <span>{event.registeredCount || 0} registered</span>
                    </div>
                  </div>

                  <div className="event-actions">
                    {event.isRegistered ? (
                      <button className="btn btn-success" disabled>
                        <Users size={16} />
                        Registered
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRegisterForEvent(event._id || event.id)}
                      >
                        <Calendar size={16} />
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
