import React from 'react';
import '../styles/About.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <h1>About SkillSphere</h1>
        <p>
          SkillSphere is a role-based event discovery and participation platform
          that connects students, institutions, and organizations through
          skill-driven opportunities.
        </p>
      </section>

      {/* PLATFORM OVERVIEW */}
      <section className="about-section">
        <h2>How SkillSphere Works</h2>
        <p>
          Our platform bridges the gap between talent and opportunity by
          enabling institutions to host events and students to discover
          opportunities that match their skills and career goals.
        </p>
      </section>

      {/* ROLES */}
      <section className="about-section grid">
        <div className="about-card">
          <h3>Admin</h3>
          <p>
            Platform administrators manage users, approve organizations,
            verify documents, and ensure the integrity of the entire system.
          </p>
        </div>

        <div className="about-card">
          <h3>Organizer</h3>
          <p>
            Universities, schools, and clubs create organizations, manage
            members, and host inter and intra events through a dedicated
            dashboard.
          </p>
        </div>

        <div className="about-card">
          <h3>User / Student</h3>
          <p>
            Students create profiles, upload resumes, showcase skills, and
            register for events tailored to their qualifications.
          </p>
        </div>
      </section>

      {/* INTER VS INTRA */}
      <section className="about-section">
        <h2>Inter & Intra Events</h2>
        <ul>
          <li>
            <strong>Inter Events:</strong> Public events visible to everyone.
            Any eligible user can register.
          </li>
          <li>
            <strong>Intra Events:</strong> Private events visible only to
            verified members of an organization.
          </li>
        </ul>
      </section>

      {/* ML FEATURE */}
      <section className="about-section highlight">
        <h2>AI-Powered Recommendations</h2>
        <p>
          Our intelligent system analyzes user resumes and skills to recommend
          the most relevant events, helping students focus on opportunities
          that truly matter.
        </p>
      </section>
    </div>
  );
}
