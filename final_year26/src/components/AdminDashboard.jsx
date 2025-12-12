import { useState } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { mockEvents, mockUsers } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Calendar, TrendingUp, Award, Activity, Filter } from 'lucide-react';

export function AdminDashboard({ user, onLogout }) {
  const [timeRange, setTimeRange] = useState('month');

  // Calculate statistics
  const totalEvents = mockEvents.length;
  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const totalOrganizers = mockUsers.filter(u => u.role === 'organizer').length;
  const totalParticipations = mockEvents.reduce((sum, e) => sum + e.currentParticipants, 0);
  const avgEventCapacity = Math.round(
    (mockEvents.reduce((sum, e) => sum + (e.currentParticipants / e.maxParticipants * 100), 0) / totalEvents) || 0
  );

  // Events by category
  const categoryData = Object.entries(
    mockEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Events by status
  const statusData = Object.entries(
    mockEvents.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value: value }));

  // Participation trend (mock data)
  const trendData = [
    { month: 'Jan', participants: 450 },
    { month: 'Feb', participants: 520 },
    { month: 'Mar', participants: 610 },
    { month: 'Apr', participants: 580 },
    { month: 'May', participants: 720 },
    { month: 'Jun', participants: 850 }
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#14B8A6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Platform overview and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="text-xs text-green-600 font-medium">+12%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalEvents}</div>
            <div className="text-gray-600 text-sm">Total Events</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-xs text-green-600 font-medium">+8%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalStudents}</div>
            <div className="text-gray-600 text-sm">Active Students</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+24%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalParticipations}</div>
            <div className="text-gray-600 text-sm">Total Participations</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <span className="text-xs text-green-600 font-medium">+5%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{avgEventCapacity}%</div>
            <div className="text-gray-600 text-sm">Avg Capacity</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-pink-600" />
              <span className="text-xs text-green-600 font-medium">+18%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalOrganizers}</div>
            <div className="text-gray-600 text-sm">Event Organizers</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Events by Category */}
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

          {/* Event Status Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">Event Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Participation Trend */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Participation Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="participants" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Event</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Participants</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockEvents.slice(0, 5).map((event, index) => (
                  <tr key={event.id} className={index !== 4 ? 'border-b border-gray-100' : ''}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600">{event.organizer}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {event.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {event.currentParticipants} / {event.maxParticipants}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm capitalize ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
