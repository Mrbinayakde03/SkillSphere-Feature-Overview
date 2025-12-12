import { EventCard } from '../../components/EventCard';
import { mockEvents } from '../../data/mockData';

export function OrganizerEventsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600">Create and manage your organization events</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow">
          + Create Event
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.slice(0, 6).map(event => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={false}
            onRegister={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
