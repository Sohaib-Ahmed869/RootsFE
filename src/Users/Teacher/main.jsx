import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Dummy Statistics Data
const CLASS_STATS = {
  "10-A": {
    totalStudents: 30,
    averageAttendance: 92,
    averageScore: 85,
    submissionRate: 88,
    meritsAwarded: 45,
    demeritsAwarded: 12,
    pendingHomework: 5,
    averageMarks: [
      { month: "Jan", marks: 82 },
      { month: "Feb", marks: 85 },
      { month: "Mar", marks: 88 },
      { month: "Apr", marks: 84 },
    ],
    subjectPerformance: [
      { subject: "Mathematics", score: 85 },
      { subject: "Science", score: 82 },
      { subject: "English", score: 88 },
      { subject: "History", score: 78 },
    ],
    homeworkCompletion: [
      { status: "Submitted", value: 85 },
      { status: "Late", value: 10 },
      { status: "Pending", value: 5 },
    ],
    recentActivities: [
      {
        date: "2024-03-15",
        activity: "Test conducted",
        details: "Chapter 5 Assessment",
      },
      {
        date: "2024-03-14",
        activity: "Assignment",
        details: "Math homework assigned",
      },
      {
        date: "2024-03-13",
        activity: "Merit Points",
        details: "Awarded to 3 students",
      },
    ],
    topPerformers: [
      { name: "John Doe", score: 95 },
      { name: "Jane Smith", score: 92 },
      { name: "Mike Johnson", score: 90 },
    ],
    needsAttention: [
      { name: "Alex Brown", issue: "Low attendance" },
      { name: "Sarah Wilson", issue: "Missing assignments" },
    ],
  },
  "10-B": {
    totalStudents: 28,
    averageAttendance: 88,
    averageScore: 82,
    submissionRate: 85,
    meritsAwarded: 38,
    demeritsAwarded: 15,
    pendingHomework: 8,
    averageMarks: [
      { month: "Jan", marks: 78 },
      { month: "Feb", marks: 82 },
      { month: "Mar", marks: 85 },
      { month: "Apr", marks: 82 },
    ],
    subjectPerformance: [
      { subject: "Mathematics", score: 80 },
      { subject: "Science", score: 85 },
      { subject: "English", score: 82 },
      { subject: "History", score: 81 },
    ],
    homeworkCompletion: [
      { status: "Submitted", value: 80 },
      { status: "Late", value: 12 },
      { status: "Pending", value: 8 },
    ],
    recentActivities: [
      {
        date: "2024-03-15",
        activity: "Quiz",
        details: "Science Quiz Conducted",
      },
      {
        date: "2024-03-14",
        activity: "Project",
        details: "Group project assignments",
      },
      {
        date: "2024-03-12",
        activity: "Demerits",
        details: "Issued for late submissions",
      },
    ],
    topPerformers: [
      { name: "Emily Davis", score: 92 },
      { name: "Tom Wilson", score: 90 },
      { name: "Lisa Anderson", score: 88 },
    ],
    needsAttention: [
      { name: "Peter Parker", issue: "Declining performance" },
      { name: "Mary Jane", issue: "Frequent absences" },
      { name: "Harry Osborn", issue: "Late submissions" },
    ],
  },
};

const COLORS = ["#800000", "#A52A2A", "#B22222", "#8B0000"];

const TeacherDashboard = () => {
  const [selectedClass, setSelectedClass] = useState("10-A");
  const stats = CLASS_STATS[selectedClass];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Teacher Dashboard
          </h1>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="select select-bordered w-48"
          >
            <option value="10-A">Class 10-A</option>
            <option value="10-B">Class 10-B</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Total Students</h3>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Average Attendance</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.averageAttendance}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Average Score</h3>
            <p className="text-2xl font-bold text-[#800000]">
              {stats.averageScore}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Submission Rate</h3>
            <p className="text-2xl font-bold text-blue-600">
              {stats.submissionRate}%
            </p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.averageMarks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="marks"
                  stroke="#800000"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#800000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Homework Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Homework Completion</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.homeworkCompletion}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {stats.homeworkCompletion.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {stats.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 border-b pb-3"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#800000]" />
                  <div>
                    <p className="font-medium">{activity.activity}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
            <div className="space-y-3">
              {stats.topPerformers.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#800000]">
                      #{index + 1}
                    </span>
                    <span>{student.name}</span>
                  </div>
                  <span className="badge badge-success">{student.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Needs Attention</h3>
            <div className="space-y-3">
              {stats.needsAttention.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <span>{student.name}</span>
                  <span className="badge badge-error">{student.issue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
