import { Calendar, Clock, MapPin, Users, CheckCircle2, Award } from 'lucide-react';


export function EventCard({ event, isRegistered, onRegister, matchScore, showActions = false }) {
  // Handle MongoDB _id vs id
  const eventId = event._id || event.id;
  const spotsLeft = (event.maxParticipants || 0) - (event.currentParticipants || 0);
  const percentFull = event.maxParticipants > 0 ? ((event.currentParticipants || 0) / event.maxParticipants) * 100 : 0;

  const getCategoryColor = (category) => {
    const colors = {
      'Workshop': 'bg-blue-100 text-blue-700',
      'Hackathon': 'bg-purple-100 text-purple-700',
      'Seminar': 'bg-green-100 text-green-700',
      'Competition': 'bg-orange-100 text-orange-700',
      'Career Fair': 'bg-pink-100 text-pink-700',
      'Networking': 'bg-teal-100 text-teal-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
      {matchScore && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-text-primary px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">AI Match Score</span>
          </div>
          <span className="font-bold">{matchScore}%</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          {isRegistered && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Registered</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {event.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.skills.slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {skill}
              </span>
            ))}
            {event.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                +{event.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{event.currentParticipants} / {event.maxParticipants}</span>
            </div>
            <span className={`text-sm font-medium ${spotsLeft < 10 ? 'text-orange-600' : 'text-gray-600'}`}>
              {spotsLeft} spots left
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                percentFull > 90 ? 'bg-orange-500' : 'bg-blue-500'
              }`}
              style={{ width: `${percentFull}%` }}
            />
          </div>
        </div>


        <button
          onClick={() => onRegister(eventId)}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            isRegistered
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
          }`}
        >
          {showActions ? 'Manage' : (isRegistered ? 'Unregister' : 'Register Now')}
        </button>
      </div>
    </div>
  );
}
