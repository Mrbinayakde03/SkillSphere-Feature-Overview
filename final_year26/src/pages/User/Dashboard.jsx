import { EventCard } from '../../components/EventCard';
import { mockEvents } from '../../data/mockData';

export function UserDashboardPage() {
  const userSkills = ['Python', 'Web Development', 'AI/ML'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here are your personalized recommendations</p>
      </div>

      {/* User Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">5</div>
          <div className="text-gray-600 text-sm">Events Registered</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">3</div>
          <div className="text-gray-600 text-sm">Organizations</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">8</div>
          <div className="text-gray-600 text-sm">Skills</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">92%</div>
          <div className="text-gray-600 text-sm">Profile Complete</div>
        </div>
      </div>

      {/* Recommended Events */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.slice(0, 6).map(event => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={false}
              onRegister={() => {}}
              matchScore={85}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
