
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
  BookOpen
} from 'lucide-react';
import { EventCard, EventCard3D } from '../../components/EventCard3D';
import { eventAPI } from '../../services/api';

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

const stats = [
  {
    icon: Calendar,
    label: 'Events Registered',
    value: '5',
    change: '+2 this month',
    trend: 'up',
    color: 'neon-cyan'
  },
  {
    icon: Users,
    label: 'Organizations',
    value: '3',
    change: '+1 this week',
    trend: 'up',
    color: 'neon-purple'
  },
  {
    icon: Brain,
    label: 'Skills Extracted',
    value: '12',
    change: '+3 from resume',
    trend: 'up',
    color: 'neon-green'
  },
  {
    icon: Award,
    label: 'Profile Complete',
    value: '92%',
    change: '8% to complete',
    trend: 'up',
    color: 'neon-pink'
  }
];

export function UserDashboardPage() {
  const userSkills = ['Python', 'Web Development', 'AI/ML', 'React', 'Node.js', 'Data Science'];
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventAPI.getEvents({ limit: 6 });
        if (response.data && response.data.events) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (event) => {
    try {
      await eventAPI.registerForEvent(event._id);
      alert(`Successfully registered for ${event.title}`);
      // Optionally, update the event's state to reflect registration
      setEvents(prevEvents => prevEvents.map(e => 
        e._id === event._id ? { ...e, isRegistered: true } : e
      ));
    } catch (error) {
      console.error('Error registering for event:', error);
      alert(`Failed to register for ${event.title}. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
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
          Welcome back! 👋
        </motion.h1>
        <motion.p 
          className="page-subtitle"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Here are your personalized event recommendations and skill insights
        </motion.p>
      </motion.div>

      {/* User Stats Grid */}
      <motion.div 
        className="dashboard-grid"
        variants={itemVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="dashboard-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">{stat.label}</h3>
              <stat.icon className={`dashboard-card-icon text-${stat.color}`} />
            </div>
            <div className="dashboard-card-value">{stat.value}</div>
            <div className={`dashboard-card-trend trend-${stat.trend}`}>
              <TrendingUp className="w-4 h-4" />
              <span>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Skills Section */}
      <motion.section variants={itemVariants}>
        <div className="section-header mb-6">
          <div>
            <h2 className="section-title">Your Skills & Expertise</h2>
            <p className="section-description">
              AI-extracted skills from your profile and resume
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="w-5 h-5 text-neon-cyan" />
            <span className="text-sm font-medium text-text-primary">AI Powered</span>
          </motion.div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {userSkills.map((skill, index) => (
            <motion.span
              key={skill}
              className="px-4 py-2 bg-bg-glass border border-border-primary rounded-xl text-sm font-medium text-text-primary hover:border-neon-cyan/50 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* Recommended Events */}
      <motion.section variants={itemVariants}>
        <div className="section-header mb-6">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Star className="w-6 h-6 text-neon-cyan" />
              Recommended for You
            </h2>
            <p className="section-description">
              Events tailored to your skills and interests
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-xs font-medium text-neon-cyan"
            animate={{ 
              boxShadow: [
                '0 0 10px rgba(0, 255, 255, 0.2)',
                '0 0 20px rgba(0, 255, 255, 0.4)',
                '0 0 10px rgba(0, 255, 255, 0.2)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Target className="w-3 h-3" />
            <span>AI Matched</span>
          </motion.div>
        </div>
        
        <div className="events-grid">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EventCard
                event={event}
                isRegistered={event.isRegistered}
                onRegister={handleRegister}
                matchScore={Math.floor(Math.random() * 30) + 70} // Random score 70-100
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        className="mt-12 p-6 bg-gradient-to-br from-bg-glass to-bg-secondary border border-border-primary rounded-2xl"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Ready to discover more?
            </h3>
            <p className="text-text-secondary">
              Explore all events or update your profile for better recommendations
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-4 h-4" />
              Browse All Events
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-4 h-4" />
              Update Profile
            </motion.button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
