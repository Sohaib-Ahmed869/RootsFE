import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Dummy Student Data
const STUDENT = {
  id: 1,
  name: "John Doe",
  class: "10-A",
  rollNumber: "2024-001",
  meritPoints: 85,
  demerits: 2,
};

// Academic Performance Data
const MARKS_DATA = [
  { subject: "Mathematics", test1: 85, test2: 92, midterm: 88, final: 90 },
  { subject: "Science", test1: 78, test2: 88, midterm: 82, final: 85 },
  { subject: "English", test1: 90, test2: 87, midterm: 92, final: 88 },
  { subject: "History", test1: 88, test2: 85, midterm: 90, final: 87 },
  { subject: "Computer", test1: 95, test2: 92, midterm: 94, final: 96 },
];

// Merit Points History
const MERIT_HISTORY = [
  { month: "Jan", points: 65 },
  { month: "Feb", points: 70 },
  { month: "Mar", points: 75 },
  { month: "Apr", points: 78 },
  { month: "May", points: 82 },
  { month: "Jun", points: 85 },
];

// Violations History
const VIOLATIONS = [
  { date: "2024-02-15", type: "Late Arrival", demerits: 1 },
  { date: "2024-03-10", type: "Incomplete Homework", demerits: 1 },
];

// Fees Status
const FEES_STATUS = [
  { month: "January", status: "Paid", amount: 5000, dueDate: "2024-01-05" },
  { month: "February", status: "Paid", amount: 5000, dueDate: "2024-02-05" },
  { month: "March", status: "Paid", amount: 5000, dueDate: "2024-03-05" },
  { month: "April", status: "Pending", amount: 5000, dueDate: "2024-04-05" },
];

// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);

// Student Overview Component
const StudentOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="text-black">
      <h3 className="text-lg font-medium mb-2">Merit Points</h3>
      <p className="text-3xl font-bold">{STUDENT.meritPoints}</p>
    </Card>

    <Card className="text-black">
      <h3 className="text-lg font-medium mb-2">Demerits</h3>
      <p className="text-3xl font-bold">{STUDENT.demerits}</p>
    </Card>

    <Card>
      <h3 className="text-lg font-medium mb-2">Class Rank</h3>
      <p className="text-3xl font-bold">5/30</p>
    </Card>
  </div>
);

// Merit Points Chart
const MeritChart = () => (
  <Card>
    <h3 className="text-lg font-medium mb-4">Merit Points Progress</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={MERIT_HISTORY}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="points"
          stroke="#800000"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

// Academic Performance Chart
const AcademicChart = () => (
  <Card>
    <h3 className="text-lg font-medium mb-4">Academic Performance</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={MARKS_DATA}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="test1" fill="#800000" name="Test 1" />
        <Bar dataKey="test2" fill="#A52A2A" name="Test 2" />
        <Bar dataKey="midterm" fill="#8B0000" name="Midterm" />
        <Bar dataKey="final" fill="#B22222" name="Final" />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

// Violations Table
const ViolationsTable = () => (
  <Card>
    <h3 className="text-lg font-medium mb-4">Recent Violations</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Violation</th>
            <th className="text-left py-2">Demerits</th>
          </tr>
        </thead>
        <tbody>
          {VIOLATIONS.map((violation, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{violation.date}</td>
              <td className="py-2">{violation.type}</td>
              <td className="py-2">{violation.demerits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

// Fees Table
const FeesTable = () => (
  <Card>
    <h3 className="text-lg font-medium mb-4">Fees Status</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Month</th>
            <th className="text-left py-2">Amount</th>
            <th className="text-left py-2">Due Date</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {FEES_STATUS.map((fee, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{fee.month}</td>
              <td className="py-2">₹{fee.amount}</td>
              <td className="py-2">{fee.dueDate}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    fee.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {fee.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

// Main Dashboard Component
const Main = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    {/* Student Info Header */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome, {STUDENT.name}
      </h1>
      <p className="text-gray-600">
        Class {STUDENT.class} | Roll No: {STUDENT.rollNumber}
      </p>
    </div>

    {/* Overview Cards */}
    <div className="mb-8">
      <StudentOverview />
    </div>

    {/* Academic Performance */}
    <div className="mb-8">
      <AcademicChart />
    </div>

    {/* Merit Points Chart */}
    <div className="mb-8">
      <MeritChart />
    </div>
    {/* Violations and Fees Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ViolationsTable />
      <FeesTable />
    </div>
  </div>
);

export default Main;
