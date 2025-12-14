

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';

import { UserLayout } from '../layouts/UserLayout';
import { mockEvents } from '../data/mockData';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  // Filter events based on search and category
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Competition', 'Career Fair', 'Networking'];

  const handleRegister = (eventId) => {
    console.log('Registering for event:', eventId);
    // Here you would implement the registration logic
  };


  return (
    <UserLayout>
      <div className="homepage-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <motion.div 
              className="hero-text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title">
                Discover Amazing{' '}
                <span className="hero-title-gradient">
                  Events
                </span>
              </h1>
              <p className="hero-description">
                Join workshops, hackathons, and networking events to enhance your skills and connect with peers.
              </p>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div 
              className="search-filter-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Search Bar */}
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search events, skills, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Category Filter */}
              <div className="filter-container">
                <Filter className="filter-icon" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Events Grid Section */}
        <section className="events-section">
          <div className="events-container">
            <motion.div 
              className="events-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="events-title">
                Available Events ({filteredEvents.length})
              </h2>
              <p className="events-subtitle">
                Click on any event to learn more and register
              </p>
            </motion.div>

            {/* Events Grid */}
            <div className="events-grid">
              {filteredEvents.map((event, index) => (
                <motion.div 
                  key={event.id}
                  className="event-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Event Header */}
                  <div className="event-header">
                    <div className="event-meta-top">
                      <span className="event-category">
                        {event.category}
                      </span>
                      <span className="event-participants">
                        {event.currentParticipants}/{event.maxParticipants} participants
                      </span>
                    </div>
                    
                    <h3 className="event-title">
                      {event.title}
                    </h3>
                    
                    <p className="event-description">
                      {event.description}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="event-details">
                    <div className="event-detail-item">
                      <Calendar className="event-detail-icon" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <Clock className="event-detail-icon" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="event-detail-item">
                      <MapPin className="event-detail-icon" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="event-detail-item">
                      <Users className="event-detail-icon" />
                      <span>{event.organizer}</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="event-tags">
                    <div className="event-tags-container">
                      {event.skills.slice(0, 3).map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="event-tag"
                        >
                          {skill}
                        </span>
                      ))}
                      {event.skills.length > 3 && (
                        <span className="event-tag">
                          +{event.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Registration Button */}
                  <div className="event-actions">
                    <motion.button 
                      onClick={() => handleRegister(event.id)}
                      className="register-button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Register for Event
                      <ArrowRight className="register-icon" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Events Found */}
            {filteredEvents.length === 0 && (
              <motion.div 
                className="no-events-found"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="no-events-icon">
                  <Search className="no-events-search-icon" />
                </div>
                <h3 className="no-events-title">No events found</h3>
                <p className="no-events-description">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </UserLayout>
  );
};

export default HomePage;
