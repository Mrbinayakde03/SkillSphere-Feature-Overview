import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Users, TrendingUp, Award, Activity } from 'lucide-react';
import { mockEvents, mockUsers } from '../../data/mockData';

export function AdminDashboardPage() {
  const totalEvents = mockEvents.length;
  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const totalOrganizers = mockUsers.filter(u => u.role === 'organizer').length;
  const totalParticipations = mockEvents.reduce((sum, e) => sum + e.currentParticipants, 0);

  const categoryData = Object.entries(
    mockEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#14B8A6'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-green-600 font-medium">+12%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalEvents}</div>
          <div className="text-gray-600 text-sm">Total Events</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-green-600 font-medium">+8%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalStudents}</div>
          <div className="text-gray-600 text-sm">Active Students</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-green-600" />
            <span className="text-xs text-green-600 font-medium">+24%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalParticipations}</div>
          <div className="text-gray-600 text-sm">Total Participations</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <span className="text-xs text-green-600 font-medium">+5%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">87%</div>
          <div className="text-gray-600 text-sm">Avg Capacity</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-pink-600" />
            <span className="text-xs text-green-600 font-medium">+18%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalOrganizers}</div>
          <div className="text-gray-600 text-sm">Event Organizers</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Events by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { month: 'Jan', users: 100 },
                { month: 'Feb', users: 150 },
                { month: 'Mar', users: 220 },
                { month: 'Apr', users: 280 },
                { month: 'May', users: 350 },
                { month: 'Jun', users: 420 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
