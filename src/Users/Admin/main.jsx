import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Dummy Data
const CLASSES = [
  "Class 10-A",
  "Class 10-B",
  "Class 9-A",
  "Class 9-B",
  "Class 8-A",
  "Class 8-B",
];

const STUDENTS = [
  {
    id: 1,
    name: "John Doe",
    class: "Class 10-A",
    meritPoints: 150,
    demerits: 2,
  },
  {
    id: 2,
    name: "Jane Smith",
    class: "Class 10-A",
    meritPoints: 145,
    demerits: 0,
  },
  {
    id: 3,
    name: "Mike Johnson",
    class: "Class 9-A",
    meritPoints: 160,
    demerits: 1,
  },
  {
    id: 4,
    name: "Sarah Williams",
    class: "Class 9-B",
    meritPoints: 155,
    demerits: 0,
  },
  {
    id: 5,
    name: "Alex Brown",
    class: "Class 8-A",
    meritPoints: 170,
    demerits: 0,
  },
  {
    id: 6,
    name: "Emily Davis",
    class: "Class 8-B",
    meritPoints: 140,
    demerits: 3,
  },
  {
    id: 7,
    name: "Tom Wilson",
    class: "Class 10-B",
    meritPoints: 165,
    demerits: 1,
  },
  {
    id: 8,
    name: "Lisa Anderson",
    class: "Class 9-A",
    meritPoints: 158,
    demerits: 0,
  },
];

const TEACHERS = [
  { id: 1, name: "Mr. Anderson", class: "Class 10-A", subject: "Mathematics" },
  { id: 2, name: "Mrs. Smith", class: "Class 10-B", subject: "English" },
  { id: 3, name: "Mr. Johnson", class: "Class 9-A", subject: "Science" },
  { id: 4, name: "Ms. Davis", class: "Class 9-B", subject: "History" },
  { id: 5, name: "Mr. Wilson", class: "Class 8-A", subject: "Physics" },
  { id: 6, name: "Mrs. Brown", class: "Class 8-B", subject: "Chemistry" },
];

const VIOLATIONS = [
  { id: 1, type: "Late Arrival", count: 45, demerits: 1 },
  { id: 2, type: "Uniform Violation", count: 32, demerits: 2 },
  { id: 3, type: "Homework Incomplete", count: 28, demerits: 1 },
  { id: 4, type: "Disruptive Behavior", count: 15, demerits: 3 },
  { id: 5, type: "Unauthorized Device", count: 12, demerits: 2 },
];

const FEES_DATA = [
  { month: "Jan", collected: 95000, pending: 5000 },
  { month: "Feb", collected: 92000, pending: 8000 },
  { month: "Mar", collected: 97000, pending: 3000 },
  { month: "Apr", collected: 90000, pending: 10000 },
  { month: "May", collected: 94000, pending: 6000 },
  { month: "Jun", collected: 96000, pending: 4000 },
];

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="border-b border-gray-200 p-6">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-black">{children}</h2>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Top Achievers Component with Class Filter
const TopAchievers = () => {
  const [selectedClass, setSelectedClass] = useState("all");

  const filteredStudents = STUDENTS.filter((student) =>
    selectedClass === "all" ? true : student.class === selectedClass
  )
    .sort((a, b) => b.meritPoints - a.meritPoints)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Top Achievers</CardTitle>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Classes</option>
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Class</th>
              <th className="text-left p-2">Merit Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.class}</td>
                <td className="p-2">{student.meritPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

// Violations Chart Component
const ViolationsChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Top Violations</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={VIOLATIONS}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#800000" name="Occurrences" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Fees Collection Chart
const FeesCollectionChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Fees Collection Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={FEES_DATA}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="collected"
            stroke="#800000"
            name="Collected"
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#ff0000"
            name="Pending"
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Class Distribution Pie Chart
const ClassDistribution = () => {
  const classData = CLASSES.map((cls) => ({
    name: cls,
    value: STUDENTS.filter((student) => student.class === cls).length,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students per Class</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={classData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {classData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${index * 45}, 70%, 50%)`}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  // Calculate KPI values
  const totalStudents = STUDENTS.length;
  const totalTeachers = TEACHERS.length;
  const totalViolations = VIOLATIONS.reduce((sum, v) => sum + v.count, 0);
  const feesCollection = FEES_DATA.reduce((sum, f) => sum + f.collected, 0);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-black mb-8">
        Branch Admin Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent>
            <p className="text-gray-600 text-sm">Total Students</p>
            <h3 className="text-2xl font-bold mt-2">{totalStudents}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-sm">Total Teachers</p>
            <h3 className="text-2xl font-bold mt-2">{totalTeachers}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-sm">Total Violations</p>
            <h3 className="text-2xl font-bold mt-2">{totalViolations}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-sm">Fees Collected</p>
            <h3 className="text-2xl font-bold mt-2">
              {feesCollection.toLocaleString()}/-
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TopAchievers />
        <ViolationsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FeesCollectionChart />
        <ClassDistribution />
      </div>
    </div>
  );
};

export default Dashboard;
