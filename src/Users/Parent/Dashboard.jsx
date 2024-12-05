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
} from "recharts";
import AttendanceTab from "./AttendanceTab";
import OverviewTab from "./OverviewTab";
import FeesTab from "./FeesTab";
import HomeworkTab from "./HomeworkTab";
import AcademicsTab from "./AcademicsTab";
import image from "../../assets/image.png";
import { BiLogOut } from "react-icons/bi";
// Dummy Children Data
const CHILDREN = [
  {
    id: 1,
    name: "John Doe",
    class: "10-A",
    rollNo: "2024-001",
    image: image,
  },
  {
    id: 2,
    name: "Jane Doe",
    class: "8-B",
    rollNo: "2024-045",
    image: image,
  },
  {
    id: 3,
    name: "Jim Doe",
    class: "6-A",
    rollNo: "2024-089",
    image: image,
  },
];

// Performance Data for each child
const PERFORMANCE_DATA = {
  1: {
    attendance: 95,
    meritPoints: 85,
    demerits: 2,
    pendingFees: 5000,
    pendingHomework: 2,
    lastExamScore: 92,
  },
  2: {
    attendance: 98,
    meritPoints: 90,
    demerits: 0,
    pendingFees: 0,
    pendingHomework: 1,
    lastExamScore: 88,
  },
  3: {
    attendance: 92,
    meritPoints: 78,
    demerits: 1,
    pendingFees: 2500,
    pendingHomework: 3,
    lastExamScore: 85,
  },
};

// Basic Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

// Child Selector Component
const ChildSelector = ({
  selectedChild,
  setSelectedChild,
  viewMode,
  setViewMode,
}) => (
  <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-md">
    <div className="flex items-center gap-2">
      <span className="text-gray-700">View:</span>
      <select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value)}
        className="border rounded p-2"
      >
        <option value="consolidated">Consolidated View</option>
        <option value="individual">Individual View</option>
      </select>
    </div>

    {viewMode === "individual" && (
      <div className="flex items-center gap-2">
        <span className="text-gray-700">Select Child:</span>
        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(Number(e.target.value))}
          className="border rounded p-2"
        >
          {CHILDREN.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name} - Class {child.class}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
);

// Quick Stats Component
const QuickStats = ({ childId, consolidated = false }) => {
  const stats = consolidated
    ? CHILDREN.map((child) => PERFORMANCE_DATA[child.id])
    : [PERFORMANCE_DATA[childId]];

  // Calculate averages for consolidated view
  const calculateAverage = (key) => {
    const sum = stats.reduce((acc, curr) => acc + curr[key], 0);
    return (sum / stats.length).toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card className="p-4">
        <h3 className="text-sm text-gray-600">Attendance</h3>
        <p className="text-2xl font-bold">
          {consolidated ? calculateAverage("attendance") : stats[0].attendance}%
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm text-gray-600">Merit Points</h3>
        <p className="text-2xl font-bold text-green-600">
          {consolidated
            ? calculateAverage("meritPoints")
            : stats[0].meritPoints}
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm text-gray-600">Demerits</h3>
        <p className="text-2xl font-bold text-red-600">
          {consolidated
            ? stats.reduce((acc, curr) => acc + curr.demerits, 0)
            : stats[0].demerits}
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm text-gray-600">Pending Fees</h3>
        <p className="text-2xl font-bold">
          ₹
          {consolidated
            ? stats.reduce((acc, curr) => acc + curr.pendingFees, 0)
            : stats[0].pendingFees}
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm text-gray-600">Pending Homework</h3>
        <p className="text-2xl font-bold">
          {consolidated
            ? stats.reduce((acc, curr) => acc + curr.pendingHomework, 0)
            : stats[0].pendingHomework}
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm text-gray-600">Last Exam</h3>
        <p className="text-2xl font-bold">
          {consolidated
            ? calculateAverage("lastExamScore")
            : stats[0].lastExamScore}
          %
        </p>
      </Card>
    </div>
  );
};

// Child Profile Card Component
const ChildProfileCard = ({ child }) => (
  <Card className="p-4 flex items-center gap-4">
    <img
      src={child.image}
      alt={child.name}
      className="rounded-full h-20 w-20"
    />
    <div>
      <h3 className="font-semibold">{child.name}</h3>
      <p className="text-sm text-gray-600">
        Class {child.class} | Roll No: {child.rollNo}
      </p>
    </div>
    <div className="ml-auto">
      <button className="text-[#800000] hover:text-[#600000]">
        View Details
      </button>
    </div>
  </Card>
);

// Parent Dashboard
const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0].id);
  const [viewMode, setViewMode] = useState("consolidated");
  const [activeTab, setActiveTab] = useState("overview");

  const onClickLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Parent Dashboard
      </h1>
      <div className="w-full flex justify-end">
        {/* Logout Button */}
        <button
          onClick={onClickLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <BiLogOut />
          <span>Logout</span>
        </button>
      </div>
      {/* Child Selector */}
      <ChildSelector
        selectedChild={selectedChild}
        setSelectedChild={setSelectedChild}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Quick Stats */}
      <QuickStats
        childId={selectedChild}
        consolidated={viewMode === "consolidated"}
      />

      {/* Navigation Tabs */}
      <div className="mb-6 border-b">
        <nav className="-mb-px flex space-x-8">
          {["overview", "academics", "attendance", "fees", "homework"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-[#800000] text-[#800000]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {viewMode === "consolidated" ? (
          // Consolidated View
          <div className="space-y-4">
            {CHILDREN.map((child) => (
              <ChildProfileCard key={child.id} child={child} />
            ))}
          </div>
        ) : (
          // Individual Child View - Dynamic Tab Content
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {CHILDREN.find((c) => c.id === selectedChild)?.name}'s{" "}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            {/* Dynamic Tab Content */}
            {activeTab === "overview" && (
              <OverviewTab viewMode={viewMode} selectedChild={selectedChild} />
            )}
            {activeTab === "academics" && (
              <AcademicsTab viewMode={viewMode} selectedChild={selectedChild} />
            )}
            {activeTab === "attendance" && (
              <AttendanceTab
                viewMode={viewMode}
                selectedChild={selectedChild}
              />
            )}
            {activeTab === "fees" && (
              <FeesTab viewMode={viewMode} selectedChild={selectedChild} />
            )}
            {activeTab === "homework" && (
              <HomeworkTab childId={selectedChild} />
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
