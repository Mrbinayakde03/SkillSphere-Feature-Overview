import { Plus, Calendar, Users } from 'lucide-react';

export function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage and monitor platform users</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Name</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Email</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Role</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">John Doe</td>
              <td className="px-6 py-4 text-sm text-gray-600">john@university.edu</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Student</span>
              </td>
              <td className="px-6 py-4 text-sm">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button className="text-blue-600 hover:text-blue-700">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
