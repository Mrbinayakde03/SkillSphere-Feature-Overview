export function OrganizerDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Organization Dashboard</h1>
        <p className="text-gray-600">Manage your organization and events</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">12</div>
          <div className="text-gray-600 text-sm">Active Members</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">5</div>
          <div className="text-gray-600 text-sm">Upcoming Events</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">3</div>
          <div className="text-gray-600 text-sm">Pending Approvals</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-900">87%</div>
          <div className="text-gray-600 text-sm">Avg Attendance</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Activities</h3>
        <div className="text-center py-8 text-gray-600">
          Coming soon...
        </div>
      </div>
    </div>
  );
}
