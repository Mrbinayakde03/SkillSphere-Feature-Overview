import { useState } from 'react';
import { User } from '../App';
import { mockEvents } from '../data/mockData';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { AIRecommendations } from './AIRecommendations';
import { ResumeParser } from './ResumeParser';
import { MyEvents } from './MyEvents';
import { Header } from './Header';
import { Sparkles, Calendar, Upload, LayoutGrid } from 'lucide-react';

export function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('recommended');
  const [filters, setFilters] = useState({
    category: 'All',
    search: '',
    skills: []
  });
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [userSkills, setUserSkills] = useState(user.skills || []);

  const filteredEvents = mockEvents.filter(event => {
    const matchesCategory = filters.category === 'All' || event.category === filters.category;
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSkills = filters.skills.length === 0 || 
                         filters.skills.some(skill => event.skills.includes(skill));
    
    return matchesCategory && matchesSearch && matchesSkills;
  });

  const handleRegister = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  const handleSkillsExtracted = (skills) => {
    setUserSkills([...new Set([...userSkills, ...skills])]);
  };

  const tabs = [
    { id: 'recommended', label: 'AI Recommendations', icon: Sparkles },
    { id: 'discover', label: 'Discover Events', icon: LayoutGrid },
    { id: 'my-events', label: 'My Events', icon: Calendar },
    { id: 'resume', label: 'Upload Resume', icon: Upload }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Profile Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
              <p className="text-blue-100 mb-4">{user.college} • {user.year}</p>
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 5).map(skill => (
                  <span key={skill} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                {userSkills.length > 5 && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    +{userSkills.length - 5} more
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{registeredEvents.length}</div>
              <div className="text-blue-100">Events Registered</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-white shadow-lg text-blue-600'
                  : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'recommended' && (
          <AIRecommendations 
            userSkills={userSkills}
            registeredEvents={registeredEvents}
            onRegister={handleRegister}
          />
        )}

        {activeTab === 'discover' && (
          <div>
            <EventFilters filters={filters} onFilterChange={setFilters} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={registeredEvents.includes(event.id)}
                  onRegister={handleRegister}
                />
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No events found matching your criteria
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-events' && (
          <MyEvents 
            registeredEventIds={registeredEvents}
            onUnregister={handleRegister}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeParser 
            currentSkills={userSkills}
            onSkillsExtracted={handleSkillsExtracted}
          />
        )}
      </div>
    </div>
  );
}
