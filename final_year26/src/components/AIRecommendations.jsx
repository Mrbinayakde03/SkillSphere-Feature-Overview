import { useMemo } from 'react';
import { mockEvents } from '../data/mockData';
import { EventCard } from './EventCard';
import { Sparkles, TrendingUp } from 'lucide-react';

export function AIRecommendations({ userSkills, registeredEvents, onRegister }) {
  const recommendedEvents = useMemo(() => {
    // AI recommendation algorithm - calculate match score based on skills
    const eventsWithScores = mockEvents.map(event => {
      let score = 0;
      
      // Skill matching (highest weight)
      const skillMatches = event.skills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      score += skillMatches.length * 30;
      
      // Bonus for events with available spots
      const spotsLeft = event.maxParticipants - event.currentParticipants;
      if (spotsLeft > 10) score += 10;
      
      // Bonus for upcoming events
      const daysUntilEvent = Math.floor(
        (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilEvent > 0 && daysUntilEvent < 30) score += 15;
      
      // Bonus for workshop and seminar categories (learning opportunities)
      if (event.category === 'Workshop' || event.category === 'Seminar') score += 10;
      
      // Cap score at 100%
      const matchScore = Math.min(Math.round(score), 100);
      
      return { ...event, matchScore };
    });
    
    // Sort by match score and filter out low scores
    return eventsWithScores
      .filter(event => event.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }, [userSkills]);

  if (userSkills.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center">
        <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Get Personalized Recommendations
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Upload your resume or add skills to your profile to receive AI-powered event recommendations tailored just for you!
        </p>
        <button
          onClick={() => {}}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-text-primary rounded-lg hover:shadow-lg transition-shadow"
        >
          Add Skills to Get Started
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              AI-Powered Recommendations
              <TrendingUp className="w-5 h-5 text-green-600" />
            </h3>
            <p className="text-gray-700 mb-3">
              Based on your skills: {userSkills.slice(0, 3).join(', ')}
              {userSkills.length > 3 && ` and ${userSkills.length - 3} more`}
            </p>
            <p className="text-sm text-gray-600">
              We've analyzed {mockEvents.length} events and found {recommendedEvents.length} perfect matches for your profile. Match scores are calculated using AI algorithms that consider your skills, interests, and event characteristics.
            </p>
          </div>
        </div>
      </div>

      {recommendedEvents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={registeredEvents.includes(event.id)}
              onRegister={onRegister}
              matchScore={event.matchScore}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No high-match recommendations found at the moment.</p>
          <p className="text-sm">Try exploring all events or updating your skills!</p>
        </div>
      )}
    </div>
  );
}
