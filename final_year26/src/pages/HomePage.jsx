
import React, { useState, useEffect } from 'react';
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
import { eventAPI } from '../services/api';
import { EventCard } from '../components/EventCard';


const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      
      const response = await eventAPI.getEvents(params);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <EventCard 
                      event={event} 
                      onRegister={() => handleRegister(event._id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Calendar className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search criteria' : 'No events available in this category'}
                </p>
              </div>
            )}


          </div>
        </section>
      </div>
    </UserLayout>
  );
};

export default HomePage;
