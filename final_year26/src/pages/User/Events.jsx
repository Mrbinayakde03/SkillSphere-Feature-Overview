import { EventCard } from '../../components/EventCard';
import { mockEvents } from '../../data/mockData';

export function UserEventsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Explore Events</h1>
        <p className="text-gray-600">Discover and register for events</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map(event => (
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
