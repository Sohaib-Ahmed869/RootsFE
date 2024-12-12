import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { LogOut, Search } from "lucide-react";
import { BranchService } from "../../../services/branchService";

const MERIT_DATA = {
  overallStats: {
    totalMerits: 1250,
    totalViolations: 132,
    activeStudents: 450,
    teacherParticipation: 28,
  },
  classWiseStats: [
    { class: "10-A", merits: 280, violations: 25, netPoints: 255 },
    { class: "10-B", merits: 265, violations: 30, netPoints: 235 },
    { class: "9-A", merits: 245, violations: 22, netPoints: 223 },
    { class: "9-B", merits: 230, violations: 28, netPoints: 202 },
    { class: "8-A", merits: 120, violations: 15, netPoints: 105 },
    { class: "8-B", merits: 110, violations: 12, netPoints: 98 },
  ],
  trendData: [
    { month: "Jan", merits: 180, violations: 20 },
    { month: "Feb", merits: 220, violations: 25 },
    { month: "Mar", merits: 250, violations: 22 },
    { month: "Apr", merits: 310, violations: 35 },
    { month: "May", merits: 290, violations: 30 },
  ],
  topStudents: [
    {
      id: 1,
      name: "John Smith",
      class: "10-A",
      points: 95,
      teacher: "Mr. Anderson",
    },
    {
      id: 2,
      name: "Emma Davis",
      class: "9-B",
      points: 88,
      teacher: "Mrs. Wilson",
    },
    {
      id: 3,
      name: "Michael Brown",
      class: "10-B",
      points: 85,
      teacher: "Ms. Thompson",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      class: "9-A",
      points: 82,
      teacher: "Mr. Roberts",
    },
    {
      id: 5,
      name: "James Johnson",
      class: "8-A",
      points: 80,
      teacher: "Ms. Davis",
    },
  ],
  recentRecords: [
    {
      id: 1,
      student: "John Smith",
      class: "10-A",
      type: "merit",
      points: 5,
      reason: "Outstanding leadership in school event",
      teacher: "Mr. Anderson",
      date: "2024-03-15",
    },
    {
      id: 2,
      student: "Emma Davis",
      class: "9-B",
      type: "violation",
      points: -2,
      reason: "Disruptive behavior in class",
      teacher: "Mrs. Wilson",
      date: "2024-03-14",
    },
    {
      id: 3,
      student: "Michael Brown",
      class: "10-B",
      type: "merit",
      points: 3,
      reason: "Helping new students",
      teacher: "Ms. Thompson",
      date: "2024-03-14",
    },
    {
      id: 4,
      student: "Sarah Wilson",
      class: "9-A",
      type: "merit",
      points: 4,
      reason: "Academic excellence",
      teacher: "Mr. Roberts",
      date: "2024-03-13",
    },
    {
      id: 5,
      student: "James Johnson",
      class: "8-A",
      type: "violation",
      points: -1,
      reason: "Late submission",
      teacher: "Ms. Davis",
      date: "2024-03-13",
    },
  ],
  teacherStats: [
    { name: "Mr. Anderson", meritsAwarded: 85, violations: 10, class: "10-A" },
    { name: "Mrs. Wilson", meritsAwarded: 75, violations: 8, class: "9-B" },
    { name: "Ms. Thompson", meritsAwarded: 90, violations: 12, class: "10-B" },
    { name: "Mr. Roberts", meritsAwarded: 65, violations: 5, class: "9-A" },
    { name: "Ms. Davis", meritsAwarded: 70, violations: 7, class: "8-A" },
  ],
  violationTypes: [
    { type: "Disruptive Behavior", count: 45, totalPoints: 90 },
    { type: "Late Submission", count: 35, totalPoints: 35 },
    { type: "Attendance", count: 28, totalPoints: 28 },
    { type: "Uniform Violation", count: 24, totalPoints: 24 },
  ],
};

const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#0d9488"];

const BranchAdminDashboard = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [data,setdata]=useState(MERIT_DATA)

  useEffect(() => {
    BranchService.getMeritStats().then((res) => {
      console.log(res.data)
      setdata(res.data)
    })

    
  },[])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Total Merit Points</h3>
            <p className="text-2xl font-bold text-green-600">
              +{data&& data.overallStats.totalMerits}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Total Violations</h3>
            <p className="text-2xl font-bold text-red-600">
              -{data&& data.overallStats.totalViolations}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Active Students</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {data&& data.overallStats.activeStudents}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600">Teacher Participation</h3>
            <p className="text-2xl font-bold text-blue-600">
              {data&& data.overallStats.teacherParticipation}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Classes</option>
              {data&& data.classWiseStats.map((stat) => (
                <option key={stat.class} value={stat.class}>
                  {stat.class}
                </option>
              ))}
            </select>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Trend Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Merit Points Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data&& data.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="merits"
                  stroke="#16a34a"
                  name="Merits"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="violations"
                  stroke="#dc2626"
                  name="Violations"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Class-wise Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Class-wise Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data&& data.classWiseStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="merits" fill="#16a34a" name="Merits" />
                <Bar dataKey="violations" fill="#dc2626" name="Violations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Records and Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Performers Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Student</th>
                    <th className="px-4 py-2 text-left">Class</th>
                    <th className="px-4 py-2 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {data&& data.topStudents.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.class}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">
                        {student.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Teacher Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Teacher</th>
                    <th className="px-4 py-2 text-right">Merits</th>
                    <th className="px-4 py-2 text-right">Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {data&& data.teacherStats.map((teacher, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{teacher.name}</td>
                      <td className="px-4 py-3 text-right text-green-600">
                        {teacher.meritsAwarded}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600">
                        {teacher.violations}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Teacher</th>
                  <th className="px-4 py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {data&& data.recentRecords.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="px-4 py-3">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{record.student}</td>
                    <td className="px-4 py-3">{record.class}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm ${
                          record.type === "merit"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.type === "merit" ? "Merit" : "Violation"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{record.reason}</td>
                    <td className="px-4 py-3">{record.teacher}</td>
                    <td
                      className={`px-4 py-3 text-right font-bold ${
                        record.type === "merit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {record.points > 0 ? "+" : ""}
                      {record.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Violation Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Violation Types Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Violation Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data&& data.violationTypes.map((v) => ({
                    name: v.type,
                    count: v.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data&& data.violationTypes.map((entry, index) => (
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

          {/* Violation Summary Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Violation Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Violation Type</th>
                    <th className="px-4 py-2 text-right">Occurrences</th>
                    <th className="px-4 py-2 text-right">Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {data&& data.violationTypes.map((violation, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{violation.type}</td>
                      <td className="px-4 py-3 text-right">
                        {violation.count}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600">
                        -{violation.totalPoints}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-gray-50">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right">
                      {data&& data.violationTypes.reduce(
                        (sum, v) => sum + v.count,
                        0
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600">
                      -
                      {data&& data.violationTypes.reduce(
                        (sum, v) => sum + v.totalPoints,
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mt-6 flex justify-end space-x-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Download Report
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Print Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchAdminDashboard;
