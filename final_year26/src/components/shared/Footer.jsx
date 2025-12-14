import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import '../../styles/Footer.css';

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

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com',
    label: 'GitHub'
  },
  {
    icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter'
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com',
    label: 'LinkedIn'
  },
  {
    icon: Mail,
    href: 'mailto:contact@skillsphere.com',
    label: 'Email'
  }
];

export function Footer() {
  return (
    <motion.footer 
      className="footer"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="footer-content">
        {/* Floating Particles */}
        <div className="footer-particles">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="footer-particle"
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

        <div className="footer-logo-section">
          <motion.div 
            className="footer-logo-container"
            whileHover={{ scale: 1.02 }}
          >
            <div className="footer-logo">
              SS
            </div>
            <h3 className="footer-logo-text">
              SkillSphere
            </h3>
          </motion.div>
          <p className="footer-description">
            Connecting minds, skills, and opportunities in the digital age. 
            Join our community of learners, organizers, and innovators.
          </p>
        </div>

        {/* Social Links */}
        <motion.div 
          className="footer-social-section"
          variants={footerVariants}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              className="social-link"
              variants={socialIconVariants}
              initial="initial"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              aria-label={social.label}
            >
              <social.icon className="social-icon" />
            </motion.a>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div 
          className="footer-divider"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Copyright and Made with Love */}
        <motion.div 
          className="footer-bottom"
          variants={footerVariants}
        >
          <p className="footer-copyright">
            © 2024 SkillSphere. All rights reserved.
          </p>
          
          <div className="footer-made-with">
            <span>Made with</span>
            <Heart className="footer-heart" />
            <span>for the community</span>
          </div>
        </motion.div>

        {/* Additional Links */}
        <motion.div 
          className="footer-links"
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
              className="footer-link"
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
    </motion.footer>
  );
}
