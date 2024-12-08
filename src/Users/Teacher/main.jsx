import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LogOut } from 'lucide-react';
import Navbar from '../Parent/Navbar';

// Sample data structure for merit points management
const CLASS_MERIT_DATA = {
  "10-A": {
    totalMerits: 45,
    totalViolations: 12,
    monthlyStats: [
      { month: "Jan", merits: 12, violations: 3 },
      { month: "Feb", merits: 15, violations: 4 },
      { month: "Mar", merits: 18, violations: 5 }
    ],
    meritsByType: [
      { type: "Academic Excellence", count: 20 },
      { type: "Good Behavior", count: 15 },
      { type: "Helping Others", count: 8 },
      { type: "Extra-curricular", count: 2 }
    ],
    violationsByType: [
      { type: "Disruptive Behavior", count: 5 },
      { type: "Late Submission", count: 4 },
      { type: "Attendance", count: 3 }
    ],
    recentRecords: [
      {
        id: 1,
        studentName: "John Smith",
        type: "merit",
        category: "Academic Excellence",
        points: 5,
        date: "2024-03-15",
        comment: "Outstanding performance in Mathematics quiz"
      },
      {
        id: 2,
        studentName: "Sarah Johnson",
        type: "violation",
        category: "Disruptive Behavior",
        points: -2,
        date: "2024-03-14",
        comment: "Talking during class test"
      },
      {
        id: 3,
        studentName: "Mike Wilson",
        type: "merit",
        category: "Helping Others",
        points: 3,
        date: "2024-03-13",
        comment: "Helped new student with class materials"
      }
    ]
  },
  "10-B": {
    totalMerits: 38,
    totalViolations: 15,
    monthlyStats: [
      { month: "Jan", merits: 10, violations: 4 },
      { month: "Feb", merits: 13, violations: 6 },
      { month: "Mar", merits: 15, violations: 5 }
    ],
    meritsByType: [
      { type: "Academic Excellence", count: 18 },
      { type: "Good Behavior", count: 12 },
      { type: "Helping Others", count: 6 },
      { type: "Extra-curricular", count: 2 }
    ],
    violationsByType: [
      { type: "Disruptive Behavior", count: 6 },
      { type: "Late Submission", count: 5 },
      { type: "Attendance", count: 4 }
    ],
    recentRecords: [
      {
        id: 4,
        studentName: "Emily Brown",
        type: "merit",
        category: "Academic Excellence",
        points: 4,
        date: "2024-03-15",
        comment: "Perfect score in Science test"
      },
      {
        id: 5,
        studentName: "Tom Davis",
        type: "merit",
        category: "Good Behavior",
        points: 3,
        date: "2024-03-14",
        comment: "Helped maintain class discipline"
      }
    ]
  }
};

const handleLogout = () => {
  // Add logout logic here
  navigate("/");
};


const COLORS = ['#88141C', '#C53030', '#DC2626', '#EF4444', '#F87171'];
const VIOLATION_COLORS = ['#88141C', '#C53030', '#DC2626'];

const TeacherMeritDashboard = () => {
  const [selectedClass, setSelectedClass] = useState("10-A");
  const stats = CLASS_MERIT_DATA[selectedClass];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Total Merit Points Awarded</h3>
            <p className="text-2xl font-bold text-green-600">+{stats.totalMerits}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Total Violations Recorded</h3>
            <p className="text-2xl font-bold text-red-600">-{stats.totalViolations}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Net Class Points</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {stats.totalMerits - stats.totalViolations}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="merits" stroke="#4f46e5" name="Merits" strokeWidth={2} />
                <Line type="monotone" dataKey="violations" stroke="#dc2626" name="Violations" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution by Type */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Merit Points Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.meritsByType.map((entry) => ({ name: entry.type, count: entry.count }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#88141C"
                  paddingAngle={5}
                  dataKey="count"
                >
                  {stats.meritsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Comment</th>
                  <th className="px-4 py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentRecords.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{record.studentName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        record.type === 'merit' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type === 'merit' ? 'Merit' : 'Violation'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{record.category}</td>
                    <td className="px-4 py-3">{record.comment}</td>
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
        </div>
      </div>
    </div>
  );
};

export default TeacherMeritDashboard;