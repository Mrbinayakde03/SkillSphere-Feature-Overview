import { useState } from 'react';
import { mockEvents } from '../data/mockData';
import { Calendar, MapPin, Clock, Download, Bell } from 'lucide-react';

export function MyEvents({ registeredEventIds, onUnregister }) {
  const [addedToCalendar, setAddedToCalendar] = useState([]);

  const registeredEvents = mockEvents.filter(event => 
    registeredEventIds.includes(event.id)
  );

  const handleAddToCalendar = (eventId) => {
    // Simulate Google Calendar integration
    const event = registeredEvents.find(e => e.id === eventId);
    if (event) {
      // In real implementation, this would use Google Calendar API
      setAddedToCalendar([...addedToCalendar, eventId]);
      
      // Show notification
      alert(`✓ "${event.title}" has been added to your Google Calendar!\n\nYou'll receive a notification before the event.`);
    }
  };

  if (registeredEvents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Yet</h3>
        <p className="text-gray-600 mb-6">
          You haven't registered for any events. Explore recommended events to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Registered Events</h2>
            <p className="text-gray-600">
              You're registered for {registeredEvents.length} {registeredEvents.length === 1 ? 'event' : 'events'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{registeredEvents.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {registeredEvents.map(event => {
          const isInCalendar = addedToCalendar.includes(event.id);
          
          return (
            <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                      {isInCalendar && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Bell className="w-4 h-4" />
                          <span>In Calendar</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Time</div>
                      <div className="font-medium text-gray-900">{event.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="font-medium text-gray-900 line-clamp-1">
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!isInCalendar ? (
                    <button
                      onClick={() => handleAddToCalendar(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-text-primary rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Add to Google Calendar</span>
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                      <Bell className="w-4 h-4" />
                      <span>Calendar Reminder Set</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onUnregister(event.id)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Unregister
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
