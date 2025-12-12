import { Users, Clock, CheckCircle } from 'lucide-react';

export function OrganizerMembersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Member Requests</h1>
        <p className="text-gray-600">Approve or decline membership requests</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">24</div>
          <div className="text-gray-600 text-sm">Active Members</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">5</div>
          <div className="text-gray-600 text-sm">Pending Requests</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">3</div>
          <div className="text-gray-600 text-sm">Pending Docs</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Pending Requests</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">User Name {i}</h4>
                  <p className="text-sm text-gray-600">user{i}@university.edu</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
