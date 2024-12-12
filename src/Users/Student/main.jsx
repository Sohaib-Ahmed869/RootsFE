import React from 'react';
import { LineChart, Line, BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Star } from 'lucide-react';
// Student Data
const STUDENT = {
  id: "ST001",
  name: "John Doe",
  class: "5-A",
  rollNumber: "2024-001",
  totalMeritPoints: 85,
  totalDemerits: 8,
  netPoints: 77
};
const NotificationBadge = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-4 shadow-md mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Star 
            className="w-8 h-8 text-yellow-500 animate-spin-slow" 
            fill="#f59e0b"
          />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>
        <div>
          <p className="text-amber-800 font-semibold text-lg">
            Congratulations! 🎉
          </p>
          <p className="text-amber-700">
            You've been awarded 3 new merit points
          </p>
        </div>
      </div>
      <div className="bg-yellow-500 text-white font-bold text-xl h-12 w-12 rounded-full flex items-center justify-center animate-bounce">
        +3
      </div>
    </div>
  );
};

// Merit Points History
const MERIT_HISTORY = [
  { month: "Jan", merits: 15, demerits: 2, net: 13 },
  { month: "Feb", merits: 18, demerits: 1, net: 17 },
  { month: "Mar", merits: 20, demerits: 3, net: 17 },
  { month: "Apr", merits: 22, demerits: 1, net: 21 },
  { month: "May", merits: 10, demerits: 1, net: 9 }
];

// Detailed Records
const MERIT_RECORDS = [
  {
    id: 1,
    date: "2024-03-15",
    type: "merit",
    points: 5,
    category: "Helping Others",
    description: "Assisted new students with school orientation",
    issuedBy: "Mr. Anderson"
  },
  {
    id: 2,
    date: "2024-03-10",
    type: "violation",
    points: -2,
    category: "Class Discipline",
    description: "Disruptive behavior during class",
    issuedBy: "Mrs. Roberts"
  },
  {
    id: 3,
    date: "2024-03-05",
    type: "merit",
    points: 3,
    category: "School Spirit",
    description: "Volunteered for school event organization",
    issuedBy: "Ms. Thompson"
  },
  {
    id: 4,
    date: "2024-02-28",
    type: "merit",
    points: 4,
    category: "Leadership",
    description: "Led class project effectively",
    issuedBy: "Mr. Wilson"
  }
];

// Merit Categories Distribution
const MERIT_CATEGORIES = [
  { category: "Helping Others", points: 25 },
  { category: "Leadership", points: 20 },
  { category: "School Spirit", points: 15 },
  { category: "Class Discipline", points: 25 }
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const StudentMeritDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Student Info */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {STUDENT.name}
          </h1>
          <p className="text-gray-600">
            Class {STUDENT.class} | Roll No: {STUDENT.rollNumber}
          </p>
        </div>

        {/* Notification */}
        <NotificationBadge />

        {/* Merit Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-sm text-gray-600">Total Merit Points</h3>
            <p className="text-2xl font-bold text-green-600">+{STUDENT.totalMeritPoints}</p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600">Total Demerits</h3>
            <p className="text-2xl font-bold text-red-600">-{STUDENT.totalDemerits}</p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600">Net Points</h3>
            <p className="text-2xl font-bold text-indigo-600">{STUDENT.netPoints}</p>
          </Card>
        </div>

        {/* Merit Points Progress Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Monthly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MERIT_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="merits" stroke="#16a34a" name="Merit Points" strokeWidth={2} />
                <Line type="monotone" dataKey="demerits" stroke="#dc2626" name="Demerits" strokeWidth={2} />
                <Line type="monotone" dataKey="net" stroke="#4f46e5" name="Net Points" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Points by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MERIT_CATEGORIES}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="points" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed Records */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Issued By</th>
                  <th className="px-4 py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {MERIT_RECORDS.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                        record.type === 'merit' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type === 'merit' ? 'Merit' : 'Violation'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{record.category}</td>
                    <td className="px-4 py-3">{record.description}</td>
                    <td className="px-4 py-3">{record.issuedBy}</td>
                    <td className={`px-4 py-3 text-right font-bold ${
                      record.type === 'merit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.points > 0 ? '+' : ''}{record.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentMeritDashboard;