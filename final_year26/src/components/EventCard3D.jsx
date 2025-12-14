
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react';

// 3D Event Card Component with CSS 3D Effects
export function EventCard3D({ event, isRegistered = false, onRegister, matchScore = null }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleRegister = () => {
    if (!isRegistered && onRegister) {
      onRegister(event);
    }
  };

  const cardVariants = {
    initial: { 
      rotateX: 0, 
      rotateY: 0,
      scale: 1,
      y: 0
    },
    hover: { 
      rotateX: 5, 
      rotateY: 5,
      scale: 1.02,
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className="event-card-3d relative transform-3d skyglow"
      style={{ perspective: '1000px' }}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 3D Visual Element */}
      <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-bg-secondary to-bg-tertiary skyglow-border">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-cyan rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* 3D Card Surface */}
        <motion.div
          className="absolute inset-4 bg-bg-glass border border-border-primary rounded-lg backdrop-blur-sm"
          animate={{
            boxShadow: isHovered 
              ? '0 0 30px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)'
              : '0 0 10px rgba(0, 255, 255, 0.1)'
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-4 left-4 w-3 h-3 bg-neon-cyan rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-4 right-4 w-2 h-2 bg-neon-purple rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        
        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Event Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              event.type === 'inter' 
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                : 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
            }`}>
              {event.type?.toUpperCase() || 'EVENT'}
            </span>
          </div>
          
          {/* Match Score */}
          {matchScore && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium text-text-primary">{matchScore}%</span>
              </div>
            </div>
          )}
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Calendar className="w-8 h-8 text-text-primary skyglow-text" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-1 line-clamp-2 skyglow-text">
            {event.title}
          </h3>
          <p className="text-sm text-text-accent font-medium skyglow-text">
            {event.organization || 'SkillSphere'}
          </p>
        </div>

        {/* Meta Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Calendar className="w-4 h-4 text-neon-cyan" />
            <span className="skyglow-text">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Clock className="w-4 h-4 text-neon-purple" />
            <span className="skyglow-text">{event.time || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <MapPin className="w-4 h-4 text-neon-green" />
            <span className="skyglow-text">{event.location || 'Virtual'}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Users className="w-4 h-4 text-neon-pink" />
            <span className="skyglow-text">{event.attendees || 0} attendees</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm line-clamp-3 skyglow-text">
          {event.description}
        </p>

        {/* Tags */}
        {event.tags && (
          <div className="flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-bg-secondary border skyglow-border rounded-lg text-xs skyglow-text"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-bg-secondary border skyglow-border rounded-lg text-xs skyglow-text">
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleRegister();
          }}
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            isRegistered
              ? 'bg-neon-green/20 text-neon-green border border-neon-green/30 cursor-default'
              : 'bg-gradient-to-r from-neon-cyan to-neon-purple text-text-primary hover:shadow-lg'
          }`}
          variants={buttonVariants}
          whileHover={!isRegistered ? "hover" : {}}
          whileTap={!isRegistered ? "tap" : {}}
          disabled={isRegistered}
        >
          {isRegistered ? (
            <span className="flex items-center justify-center gap-2 skyglow-text">
              <Star className="w-4 h-4 fill-current" />
              Registered
            </span>
          ) : (
            'Register Now'
          )}
        </motion.button>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 opacity-0 pointer-events-none"
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Enhanced 2D Event Card (fallback for devices without 3D support)
export function EventCard({ event, isRegistered = false, onRegister, matchScore = null }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleRegister = () => {
    if (!isRegistered && onRegister) {
      onRegister(event);
    }
  };

  return (
    <motion.div
      className="event-card skyglow"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -8, 
        rotateX: 5, 
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
    >
      {/* Event Type Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          event.type === 'inter' 
            ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
            : 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
        }`}>
          {event.type?.toUpperCase() || 'EVENT'}
        </span>
        
        {matchScore && (
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium text-text-primary">{matchScore}%</span>
            </div>
        )}
      </div>

      {/* Event Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-text-primary mb-2 skyglow-text">
          {event.title}
        </h3>
        <p className="text-neon-cyan text-sm font-medium skyglow-text">
          {event.organization || 'SkillSphere'}
        </p>
      </div>

      {/* Event Meta */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <Calendar className="w-4 h-4 text-neon-cyan" />
          <span className="skyglow-text">{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <Clock className="w-4 h-4 text-neon-purple" />
          <span className="skyglow-text">{event.time || 'TBD'}</span>
        </div>
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <MapPin className="w-4 h-4 text-neon-green" />
          <span className="skyglow-text">{event.location || 'Virtual'}</span>
        </div>
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <Users className="w-4 h-4 text-neon-pink" />
          <span className="skyglow-text">{event.attendees || 0} attendees</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-6 line-clamp-3 skyglow-text">
        {event.description}
      </p>

      {/* Tags */}
      {event.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-bg-secondary border skyglow-border rounded-lg text-xs skyglow-text"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-1 bg-bg-secondary border skyglow-border rounded-lg text-xs skyglow-text">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Button */}
      <motion.button
        onClick={handleRegister}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          isRegistered
            ? 'bg-neon-green/20 text-neon-green border border-neon-green/30 cursor-default'
            : 'bg-gradient-to-r from-neon-cyan to-neon-purple text-text-primary hover:shadow-lg hover:shadow-neon-cyan/25'
        }`}
        whileHover={!isRegistered ? { scale: 1.02 } : {}}
        whileTap={!isRegistered ? { scale: 0.98 } : {}}
        disabled={isRegistered}
      >
        {isRegistered ? (
          <span className="flex items-center justify-center gap-2 skyglow-text">
            <Star className="w-4 h-4 fill-current" />
            Registered
          </span>
        ) : (
          'Register Now'
        )}
      </motion.button>

      {/* Hover Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 opacity-0 pointer-events-none"
        animate={{ 
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
