import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1 
    }
  }
};

const socialIconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1, 
    rotate: 5,
    transition: { duration: 0.2 }
  }
};

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: { 
    opacity: 1, 
    scale: 1.2,
    transition: { duration: 0.3 }
  }
};

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com',
    label: 'GitHub',
    color: 'hover:text-gray-400'
  },
  {
    icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter',
    color: 'hover:text-blue-400'
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    color: 'hover:text-blue-600'
  },
  {
    icon: Mail,
    href: 'mailto:contact@skillsphere.com',
    label: 'Email',
    color: 'hover:text-neon-cyan'
  }
];

export function Footer() {
  return (
    <motion.footer 
      className="footer mt-auto"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="footer-content">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center space-y-6">
          {/* Logo and Tagline */}
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center text-text-primary font-bold text-lg shadow-lg"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(0, 255, 255, 0.3)',
                    '0 0 30px rgba(139, 92, 246, 0.3)',
                    '0 0 20px rgba(0, 255, 255, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                SS
              </motion.div>
              <h3 className="text-xl font-bold text-gradient">
                SkillSphere
              </h3>
            </div>
            <p className="text-text-secondary text-sm max-w-md">
              Connecting minds, skills, and opportunities in the digital age. 
              Join our community of learners, organizers, and innovators.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="social-links"
            variants={footerVariants}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                className={`social-link ${social.color}`}
                variants={socialIconVariants}
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full opacity-0"
                  variants={glowVariants}
                  initial="initial"
                  whileHover="hover"
                />
                
                {/* Icon */}
                <social.icon className="social-icon w-5 h-5 relative z-10" />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div 
            className="w-full h-px bg-gradient-to-r from-transparent via-border-primary to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Copyright and Made with Love */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between w-full text-center sm:text-left"
            variants={footerVariants}
          >
            <p className="text-text-tertiary text-sm">
              © 2024 SkillSphere. All rights reserved.
            </p>
            
            <motion.div 
              className="flex items-center gap-2 text-text-tertiary text-sm mt-2 sm:mt-0"
              whileHover={{ scale: 1.05 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ['#ef4444', '#ec4899', '#ef4444']
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
              <span>for the community</span>
            </motion.div>
          </motion.div>

          {/* Additional Links */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary"
            variants={footerVariants}
          >
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Support', href: '/support' },
              { label: 'Documentation', href: '/docs' }
            ].map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="hover:text-neon-cyan transition-colors duration-200"
                whileHover={{ y: -2 }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.footer>
  );
}
