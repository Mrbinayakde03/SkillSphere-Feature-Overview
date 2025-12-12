import { EventCard } from '../../components/EventCard';
import { mockEvents } from '../../data/mockData';
import { Sparkles } from 'lucide-react';

export function UserRecommendedPage() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">AI-Powered Recommendations</h3>
            <p className="text-sm text-gray-700">
              Based on your skills and interests, here are the best-matched events for you.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.slice(0, 9).map((event, idx) => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={false}
            onRegister={() => {}}
            matchScore={95 - idx * 5}
          />
        ))}
      </div>
    </div>
  );
}
