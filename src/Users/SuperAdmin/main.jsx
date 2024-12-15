import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { LogOut, Search, Download, Filter, ChevronDown } from "lucide-react";
import { BranchService } from "../../../services/branchService";
// Sample data structure
import Papa from "papaparse";
const SUPER_ADMIN_DATA = {
  branches: [
    {
      id: 1,
      name: "North Campus",
      location: "Central Islamabad",
      totalStudents: 1200,
      rating: 4.5,
    },
    {
      id: 2,
      name: "South Campus",
      location: "South ISB",
      totalStudents: 950,
      rating: 4.3,
    },
    {
      id: 3,
      name: "West Campus",
      location: "West ISB",
      totalStudents: 850,
      rating: 4.4,
    },
  ],
  branchData: {
    1: {
      classes: ["10-A", "10-B", "9-A", "9-B", "8-A", "8-B"],
      teachers: [
        {
          id: 1,
          name: "Mr. Anderson",
          subject: "Mathematics",
          meritsAwarded: 85,
          violations: 10,
          class: "10-A",
        },
        {
          id: 2,
          name: "Mrs. Wilson",
          subject: "English",
          meritsAwarded: 75,
          violations: 8,
          class: "10-B",
        },
        {
          id: 3,
          name: "Ms. Thompson",
          subject: "Science",
          meritsAwarded: 92,
          violations: 12,
          class: "9-A",
        },
        {
          id: 4,
          name: "Mr. Roberts",
          subject: "History",
          meritsAwarded: 68,
          violations: 5,
          class: "9-B",
        },
        {
          id: 5,
          name: "Mrs. Davis",
          subject: "Physics",
          meritsAwarded: 78,
          violations: 7,
          class: "8-A",
        },
      ],
      stats: {
        totalMerits: 1250,
        totalViolations: 132,
        activeStudents: 450,
        teacherCount: 28,
      },
      monthlyTrend: [
        { month: "Jan", merits: 180, violations: 20 },
        { month: "Feb", merits: 220, violations: 25 },
        { month: "Mar", merits: 250, violations: 22 },
        { month: "Apr", merits: 280, violations: 30 },
        { month: "May", merits: 320, violations: 35 },
      ],
      classPerformance: [
        {
          class: "10-A",
          merits: 280,
          violations: 25,
          totalStudents: 45,
          averagePoints: 5.6,
        },
        {
          class: "10-B",
          merits: 265,
          violations: 30,
          totalStudents: 42,
          averagePoints: 5.2,
        },
        {
          class: "9-A",
          merits: 245,
          violations: 22,
          totalStudents: 44,
          averagePoints: 5.0,
        },
        {
          class: "9-B",
          merits: 230,
          violations: 28,
          totalStudents: 43,
          averagePoints: 4.8,
        },
        {
          class: "8-A",
          merits: 120,
          violations: 15,
          totalStudents: 45,
          averagePoints: 2.3,
        },
        {
          class: "8-B",
          merits: 110,
          violations: 12,
          totalStudents: 41,
          averagePoints: 2.4,
        },
      ],
      topStudents: [
        {
          id: 1,
          name: "John Smith",
          class: "10-A",
          points: 95,
          merits: 98,
          violations: 3,
        },
        {
          id: 2,
          name: "Emma Davis",
          class: "9-B",
          points: 88,
          merits: 90,
          violations: 2,
        },
        {
          id: 3,
          name: "Michael Brown",
          class: "10-B",
          points: 85,
          merits: 87,
          violations: 2,
        },
        {
          id: 4,
          name: "Sarah Wilson",
          class: "9-A",
          points: 82,
          merits: 85,
          violations: 3,
        },
        {
          id: 5,
          name: "James Johnson",
          class: "8-A",
          points: 80,
          merits: 82,
          violations: 2,
        },
      ],
      recentActivity: [
        {
          id: 1,
          date: "2024-03-15",
          student: "John Smith",
          class: "10-A",
          type: "merit",
          points: 5,
          reason: "Outstanding leadership in school event",
          teacher: "Mr. Anderson",
        },
        {
          id: 2,
          date: "2024-03-14",
          student: "Emma Davis",
          class: "9-B",
          type: "violation",
          points: -2,
          reason: "Disruptive behavior in class",
          teacher: "Mrs. Wilson",
        },
        {
          id: 3,
          date: "2024-03-14",
          student: "Michael Brown",
          class: "10-B",
          type: "merit",
          points: 3,
          reason: "Helping new students",
          teacher: "Ms. Thompson",
        },
      ],
    },
    2: {
      classes: ["10-C", "10-D", "9-C", "9-D", "8-C", "8-D"],
      teachers: [
        {
          id: 6,
          name: "Mr. White",
          subject: "Mathematics",
          meritsAwarded: 95,
          violations: 8,
          class: "10-C",
        },
        {
          id: 7,
          name: "Mrs. Brown",
          subject: "English",
          meritsAwarded: 82,
          violations: 6,
          class: "10-D",
        },
        {
          id: 8,
          name: "Mr. Taylor",
          subject: "Science",
          meritsAwarded: 88,
          violations: 10,
          class: "9-C",
        },
        {
          id: 9,
          name: "Ms. Clark",
          subject: "History",
          meritsAwarded: 72,
          violations: 4,
          class: "9-D",
        },
        {
          id: 10,
          name: "Mr. Lee",
          subject: "Physics",
          meritsAwarded: 85,
          violations: 9,
          class: "8-C",
        },
      ],
      stats: {
        totalMerits: 1180,
        totalViolations: 124,
        activeStudents: 380,
        teacherCount: 25,
      },
      monthlyTrend: [
        { month: "Jan", merits: 170, violations: 18 },
        { month: "Feb", merits: 210, violations: 22 },
        { month: "Mar", merits: 240, violations: 25 },
        { month: "Apr", merits: 260, violations: 28 },
        { month: "May", merits: 300, violations: 31 },
      ],
      classPerformance: [
        {
          class: "10-C",
          merits: 270,
          violations: 22,
          totalStudents: 42,
          averagePoints: 5.9,
        },
        {
          class: "10-D",
          merits: 255,
          violations: 28,
          totalStudents: 40,
          averagePoints: 5.4,
        },
        {
          class: "9-C",
          merits: 235,
          violations: 20,
          totalStudents: 41,
          averagePoints: 5.2,
        },
        {
          class: "9-D",
          merits: 220,
          violations: 25,
          totalStudents: 39,
          averagePoints: 5.0,
        },
        {
          class: "8-C",
          merits: 110,
          violations: 17,
          totalStudents: 43,
          averagePoints: 2.2,
        },
        {
          class: "8-D",
          merits: 90,
          violations: 12,
          totalStudents: 40,
          averagePoints: 2.0,
        },
      ],
      topStudents: [
        {
          id: 6,
          name: "Alex Turner",
          class: "10-C",
          points: 92,
          merits: 95,
          violations: 3,
        },
        {
          id: 7,
          name: "Emily White",
          class: "9-D",
          points: 87,
          merits: 89,
          violations: 2,
        },
        {
          id: 8,
          name: "David Lee",
          class: "10-D",
          points: 84,
          merits: 86,
          violations: 2,
        },
        {
          id: 9,
          name: "Sophie Chen",
          class: "9-C",
          points: 81,
          merits: 83,
          violations: 2,
        },
        {
          id: 10,
          name: "Ryan Park",
          class: "8-C",
          points: 78,
          merits: 80,
          violations: 2,
        },
      ],
      recentActivity: [
        {
          id: 4,
          date: "2024-03-15",
          student: "Alex Turner",
          class: "10-C",
          type: "merit",
          points: 4,
          reason: "Excellence in mathematics competition",
          teacher: "Mr. White",
        },
        {
          id: 5,
          date: "2024-03-14",
          student: "Emily White",
          class: "9-D",
          type: "merit",
          points: 3,
          reason: "Outstanding presentation",
          teacher: "Ms. Clark",
        },
      ],
    },
    3: {
      classes: ["10-E", "10-F", "9-E", "9-F", "8-E", "8-F"],
      teachers: [
        {
          id: 11,
          name: "Mr. Harris",
          subject: "Mathematics",
          meritsAwarded: 90,
          violations: 7,
          class: "10-E",
        },
        {
          id: 12,
          name: "Mrs. Garcia",
          subject: "English",
          meritsAwarded: 78,
          violations: 5,
          class: "10-F",
        },
        {
          id: 13,
          name: "Ms. Martinez",
          subject: "Science",
          meritsAwarded: 85,
          violations: 9,
          class: "9-E",
        },
        {
          id: 14,
          name: "Mr. Johnson",
          subject: "History",
          meritsAwarded: 70,
          violations: 6,
          class: "9-F",
        },
        {
          id: 15,
          name: "Mrs. Kim",
          subject: "Physics",
          meritsAwarded: 82,
          violations: 8,
          class: "8-E",
        },
      ],
      stats: {
        totalMerits: 1050,
        totalViolations: 118,
        activeStudents: 320,
        teacherCount: 22,
      },
      monthlyTrend: [
        { month: "Jan", merits: 160, violations: 15 },
        { month: "Feb", merits: 200, violations: 20 },
        { month: "Mar", merits: 230, violations: 23 },
        { month: "Apr", merits: 250, violations: 28 },
        { month: "May", merits: 210, violations: 32 },
      ],
      classPerformance: [
        {
          class: "10-E",
          merits: 250,
          violations: 20,
          totalStudents: 40,
          averagePoints: 5.8,
        },
        {
          class: "10-F",
          merits: 240,
          violations: 25,
          totalStudents: 38,
          averagePoints: 5.3,
        },
        {
          class: "9-E",
          merits: 220,
          violations: 18,
          totalStudents: 39,
          averagePoints: 5.2,
        },
        {
          class: "9-F",
          merits: 200,
          violations: 22,
          totalStudents: 37,
          averagePoints: 4.8,
        },
        {
          class: "8-E",
          merits: 80,
          violations: 18,
          totalStudents: 41,
          averagePoints: 1.5,
        },
        {
          class: "8-F",
          merits: 60,
          violations: 15,
          totalStudents: 38,
          averagePoints: 1.2,
        },
      ],
      topStudents: [
        {
          id: 11,
          name: "Daniel Kim",
          class: "10-E",
          points: 90,
          merits: 92,
          violations: 2,
        },
        {
          id: 12,
          name: "Isabella Garcia",
          class: "9-F",
          points: 86,
          merits: 88,
          violations: 2,
        },
        {
          id: 13,
          name: "Lucas Wong",
          class: "10-F",
          points: 83,
          merits: 85,
          violations: 2,
        },
        {
          id: 14,
          name: "Olivia Martinez",
          class: "9-E",
          points: 80,
          merits: 82,
          violations: 2,
        },
        {
          id: 15,
          name: "William Chen",
          class: "8-E",
          points: 75,
          merits: 77,
          violations: 2,
        },
      ],
      recentActivity: [
        {
          id: 6,
          date: "2024-03-15",
          student: "Daniel Kim",
          class: "10-E",
          type: "merit",
          points: 4,
          reason: "Science project excellence",
          teacher: "Ms. Martinez",
        },
        {
          id: 7,
          date: "2024-03-14",
          student: "Isabella Garcia",
          class: "9-F",
          type: "violation",
          points: -2,
          reason: "Late submission",
          teacher: "Mr. Johnson",
        },
      ],
    },
  },
};
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between px-4 py-3 border-t">
    <div>
      <p className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 border rounded-md ${
            currentPage === i + 1 ? "bg-primary text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedClass, setSelectedClass] = useState("all");
  const [currentView, setCurrentView] = useState("overview"); // overview, classes, teachers, students
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    const fetchBranches = async () => {
      const response = await BranchService.getAllBranches();
      //const data = await response.json();
      console.log(response);
      setBranches(response.data);
    };
    fetchBranches();
  }, []);
  useEffect(() => {
    console.log("Here");
    console.log(branches);
    console.log(selectedBranch);
  }, [selectedBranch]);

  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRecentActivity = () => {
    const data = branches.branchData[selectedBranch].recentActivity.map(
      (activity) => ({
        Date: activity.date,
        Student: activity.student,
        Class: '1-F',
        Type: activity.type,
        Points: activity.points,
        Reason: activity.reason,
        Teacher: activity.teacher,
      })
    );
    exportCSV(data, "recent_activity.csv");
  };

  const handleExportCSV = () => {
    if (currentView === "teachers") {
      const data = branches.branchData[selectedBranch].teachers.map(
        (teacher) => ({
          Name: teacher.name,
          Subject: teacher.subject,
          "Merits Awarded": teacher.meritsAwarded,
          Violations: teacher.violations,
        })
      );
      exportCSV(data, "teachers.csv");
    } else if (currentView === "students") {
      const data = branches.branchData[selectedBranch].topStudents.map(
        (student, index) => ({
          Rank: index + 1,
          Name: student.name,
          Class: student.class,
          "Merit Points": student.points,
          Violations: 0, // Assuming violations are not provided in the data
          "Net Points": student.points,
        })
      );
      exportCSV(data, "students.csv");
    } else if (currentView === "classes") {
      const data = branches.branchData[selectedBranch].classPerformance.map(
        (classData) => ({
          Class: classData.class,
          "Total Students": 30, // Assuming a fixed number of students
          "Merit Points": classData.merits,
          Violations: classData.violations,
          "Net Points": classData.merits - classData.violations,
          "Average Points": (
            (classData.merits - classData.violations) /
            30
          ).toFixed(1),
        })
      );
      exportCSV(data, "classes.csv");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold text-gray-800">
                Super Admin Dashboard
              </span>
            </div>

            {/* Global Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedBranch}
                onChange={(e) => {
                  console.log("changing");
                  console.log(e.target.value);
                  setSelectedBranch(e.target.value);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Branches</option>
                {branches.branches &&
                  branches.branches.map((branch) => (
                    <option
                      key={branch.id}
                      value={branches.branches.indexOf(branch)}
                    >
                      {branch.name}
                    </option>
                  ))}
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Time</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* View Selection Tabs */}
        <div className="mb-6 border-b">
          <nav className="-mb-px flex space-x-8">
            {["overview", "classes", "teachers", "students"].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentView === view
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Branch Overview - Shown when no branch is selected */}
        {!selectedBranch && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {branches &&
              branches.branches &&
              branches.branches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedBranch(branch.id)}
                >
                  <h3 className="text-lg font-semibold">{branch.name}</h3>
                  <p className="text-gray-600">{branch.address}</p>
                  <p className="mt-2">Students: {branch.students.length}</p>
                  <div className="mt-4 text-primary">
                    Click to view details →
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Branch Specific View */}
        {selectedBranch && (
          <>
            {/* Branch Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm text-gray-600">Total Merit Points</h3>
                <p className="text-2xl font-bold text-green-600">
                  +{branches.branchData[selectedBranch].stats.totalMerits}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm text-gray-600">Total Violations</h3>
                <p className="text-2xl font-bold text-red-600">
                  -{branches.branchData[selectedBranch].stats.totalViolations}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm text-gray-600">Active Students</h3>
                <p className="text-2xl font-bold text-primary">
                  {branches.branchData[selectedBranch].stats.activeStudents}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm text-gray-600">Teachers</h3>
                <p className="text-2xl font-bold text-primary">
                  {branches.branchData[selectedBranch].stats.teacherCount}
                </p>
              </div>
            </div>

            {/* Content based on selected view */}
            {currentView === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Merit Points Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={branches.branchData[selectedBranch].monthlyTrend}
                    >
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
                      />
                      <Line
                        type="monotone"
                        dataKey="violations"
                        stroke="#dc2626"
                        name="Violations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Class Performance */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Class Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={
                        branches.branchData[selectedBranch].classPerformance
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="merits" fill="#16a34a" name="Merits" />
                      <Bar
                        dataKey="violations"
                        fill="#dc2626"
                        name="Violations"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Teachers View */}
            {currentView === "teachers" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Teachers</h3>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary"
                    onClick={handleExportCSV}
                  >
                    Download Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Subject</th>
                        <th className="px-4 py-2 text-right">Merits Awarded</th>
                        <th className="px-4 py-2 text-right">Violations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.branchData[selectedBranch].teachers.map(
                        (teacher) => (
                          <tr key={teacher.id} className="border-b">
                            <td className="px-4 py-3">{teacher.name}</td>
                            <td className="px-4 py-3">{teacher.subject}</td>
                            <td className="px-4 py-3 text-right text-green-600">
                              {teacher.meritsAwarded}
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                              {teacher.violations}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      branches.branchData[selectedBranch].teachers.length /
                        itemsPerPage
                    )}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" onClick={exportRecentActivity}>
                    Export CSV
                  </button>
                </div>
              </div>
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
                    {branches.branchData[selectedBranch].recentActivity.map(
                      (record) => (
                        <tr key={record.id} className="border-b">
                          <td className="px-4 py-3">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">{record.student}</td>
                          <td className="px-4 py-3">1-F</td>
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
                          <td className="px-4 py-3">
                            {record.teacher ? record.teacher : record.admin}
                          </td>
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
                      )
                    )}
                  </tbody>
                </table>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil(
                    branches.branchData[selectedBranch].recentActivity.length /
                      itemsPerPage
                  )}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>

            {/* Students View */}
            {currentView === "students" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Student Rankings</h3>
                  <div className="flex space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search students..."
                        className="px-4 py-2 border rounded-lg pl-10"
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary flex items-center gap-2"
                      onClick={handleExportCSV}
                    >
                      <Download size={20} />
                      Export List
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Rank</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Class</th>
                        <th className="px-4 py-2 text-right">Merit Points</th>
                        <th className="px-4 py-2 text-right">Violations</th>
                        <th className="px-4 py-2 text-right">Net Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.branchData[selectedBranch].topStudents.map(
                        (student, index) => (
                          <tr key={student.id} className="border-b">
                            <td className="px-4 py-3 font-semibold">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3">{student.name}</td>
                            <td className="px-4 py-3">1-F</td>
                            <td className="px-4 py-3 text-right text-green-600">
                              {student.points}
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                              0
                            </td>
                            <td className="px-4 py-3 text-right font-bold">
                              {student.points}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      branches.branchData[selectedBranch].topStudents.length /
                        itemsPerPage
                    )}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}

            {/* Classes View */}
            {currentView === "classes" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Class Performance</h3>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary flex items-center gap-2">
                    <Download size={20} />
                    Download Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Class</th>
                        <th className="px-4 py-2 text-right">Total Students</th>
                        <th className="px-4 py-2 text-right">Merit Points</th>
                        <th className="px-4 py-2 text-right">Violations</th>
                        <th className="px-4 py-2 text-right">Net Points</th>
                        <th className="px-4 py-2 text-right">Average Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.branchData[selectedBranch].classPerformance.map(
                        (classData) => (
                          <tr key={classData.class} className="border-b">
                            <td className="px-4 py-3">{classData.class}</td>
                            <td className="px-4 py-3 text-right">30</td>
                            <td className="px-4 py-3 text-right text-green-600">
                              {classData.merits}
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                              {classData.violations}
                            </td>
                            <td className="px-4 py-3 text-right font-bold">
                              {classData.merits - classData.violations}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {(
                                (classData.merits - classData.violations) /
                                30
                              ).toFixed(1)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
