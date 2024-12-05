import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);


// Dummy Attendance Data
const ATTENDANCE_DATA = {
  1: {
    // Child ID
    monthly: [
      { month: "Jan", present: 22, absent: 1, late: 1, total: 24 },
      { month: "Feb", present: 20, absent: 2, late: 0, total: 22 },
      { month: "Mar", present: 23, absent: 0, late: 2, total: 25 },
    ],
    daily: [
      {
        date: "2024-03-01",
        status: "Present",
        timeIn: "7:45 AM",
        timeOut: "2:30 PM",
      },
      {
        date: "2024-03-02",
        status: "Late",
        timeIn: "8:15 AM",
        timeOut: "2:30 PM",
        reason: "Traffic",
      },
      {
        date: "2024-03-03",
        status: "Present",
        timeIn: "7:50 AM",
        timeOut: "2:30 PM",
      },
      { date: "2024-03-04", status: "Absent", reason: "Sick Leave" },
      {
        date: "2024-03-05",
        status: "Present",
        timeIn: "7:55 AM",
        timeOut: "2:30 PM",
      },
    ],
  },
  2: {
    monthly: [
      { month: "Jan", present: 23, absent: 1, late: 0, total: 24 },
      { month: "Feb", present: 21, absent: 1, late: 0, total: 22 },
      { month: "Mar", present: 24, absent: 1, late: 0, total: 25 },
    ],
    daily: [
      {
        date: "2024-03-01",
        status: "Present",
        timeIn: "7:40 AM",
        timeOut: "2:30 PM",
      },
      {
        date: "2024-03-02",
        status: "Present",
        timeIn: "7:45 AM",
        timeOut: "2:30 PM",
      },
      {
        date: "2024-03-03",
        status: "Present",
        timeIn: "7:50 AM",
        timeOut: "2:30 PM",
      },
      { date: "2024-03-04", status: "Absent", reason: "Family Function" },
      {
        date: "2024-03-05",
        status: "Present",
        timeIn: "7:45 AM",
        timeOut: "2:30 PM",
      },
    ],
  },
};

// Monthly Attendance Chart
const MonthlyAttendanceChart = ({ data }) => (
  <Card className="mb-6">
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Monthly Attendance Overview
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" fill="#10B981" name="Present" />
          <Bar dataKey="absent" fill="#EF4444" name="Absent" />
          <Bar dataKey="late" fill="#F59E0B" name="Late" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

// Daily Attendance Table
const DailyAttendanceTable = ({ data }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Daily Attendance Log</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Time In</th>
                <th className="text-left py-3 px-4">Time Out</th>
                <th className="text-left py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3 px-4">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{record.timeIn || "-"}</td>
                  <td className="py-3 px-4">{record.timeOut || "-"}</td>
                  <td className="py-3 px-4">{record.reason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

// Consolidated Attendance View
const ConsolidatedAttendanceView = ({ children }) => {
  // Transform data for consolidated view
  const consolidatedMonthly = CHILDREN.map((child) => ({
    name: child.name,
    class: child.class,
    attendance: ATTENDANCE_DATA[child.id].monthly,
  }));

  return (
    <div className="space-y-6">
      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CHILDREN.map((child) => {
          const monthlyData = ATTENDANCE_DATA[child.id].monthly;
          const lastMonth = monthlyData[monthlyData.length - 1];
          const attendancePercentage = (
            (lastMonth.present / lastMonth.total) *
            100
          ).toFixed(1);

          return (
            <Card key={child.id} className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src={child.image}
                  alt={child.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{child.name}</h3>
                  <p className="text-sm text-gray-600">Class {child.class}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold">{attendancePercentage}%</p>
                <p className="text-sm text-gray-600">This Month's Attendance</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Comparative Monthly Chart */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Comparative Attendance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {consolidatedMonthly.map((child, index) => (
              <Line
                key={child.name}
                type="monotone"
                data={child.attendance}
                dataKey="present"
                name={`${child.name} (${child.class})`}
                stroke={`hsl(${index * 120}, 70%, 40%)`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

// Individual Child Attendance View
const IndividualAttendanceView = ({ childId }) => {
  const childData = ATTENDANCE_DATA[childId];

  return (
    <div className="space-y-6">
      {/* Attendance Summary Card */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-sm text-gray-600">This Month</h3>
            <p className="text-2xl font-bold">95%</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Present Days</h3>
            <p className="text-2xl font-bold text-green-600">23</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Absent Days</h3>
            <p className="text-2xl font-bold text-red-600">1</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Late Arrivals</h3>
            <p className="text-2xl font-bold text-yellow-600">2</p>
          </div>
        </div>
      </Card>

      {/* Monthly Chart */}
      <MonthlyAttendanceChart data={childData.monthly} />

      {/* Daily Log */}
      <DailyAttendanceTable data={childData.daily} />
    </div>
  );
};

// Main Attendance Tab Component
const AttendanceTab = ({ viewMode, selectedChild }) => {
  return viewMode === "consolidated" ? (
    <ConsolidatedAttendanceView />
  ) : (
    <IndividualAttendanceView childId={selectedChild} />
  );
};

export default AttendanceTab;
