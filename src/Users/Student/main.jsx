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
import { AuthService } from "../../../services/authService";
import { Star } from "lucide-react";
import { MeritService } from "../../../services/meritService";
// Student Data
const STUDENT = {
  id: "ST001",
  name: "John Doe",
  class: "5-A",
  rollNumber: "2024-001",
  totalMeritPoints: 85,
  totalDemerits: 8,
  netPoints: 77,
};
const NotificationBadge = ({ points }) => {
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
            You've been awarded {points} merit points
          </p>
        </div>
      </div>
      <div className="bg-yellow-500 text-white font-bold text-xl h-12 w-12 rounded-full flex items-center justify-center animate-bounce">
        +{points}
      </div>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const StudentMeritDashboard = () => {
  const [data, setData] = React.useState(null);
  const [latestPoint, setLatestPoint] = React.useState(null);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await AuthService.getStudentDash();
      setData(res.data);
    };
    fetchData();
  }, []);
  React.useEffect(() => {
    MeritService.getLatestMerits().then((res) => {
      setLatestPoint(res.data);
    });
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Student Info */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {data && data.student.name}
          </h1>
          <p className="text-gray-600">
            Class {data && data.student.class} | Roll No:{" "}
            {data && data.student.rollNumber}
          </p>
        </div>

        {/* Notification */}
        {latestPoint && latestPoint.points > 0 && (
          <NotificationBadge points={latestPoint.points} />
        )}

        {/* Merit Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-sm text-gray-600">Total Merit Points</h3>
            <p className="text-2xl font-bold text-green-600">
              +{data && data.student.totalMeritPoints}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600">Total Demerits</h3>
            <p className="text-2xl font-bold text-red-600">
              -{data && data.student.totalDemerits}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600">Net Points</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {data && data.student.netPoints}
            </p>
          </Card>
        </div>

        {/* Merit Points Progress Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Monthly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data && data.meritHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="merits"
                  stroke="#16a34a"
                  name="Merit Points"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="demerits"
                  stroke="#dc2626"
                  name="Demerits"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#4f46e5"
                  name="Net Points"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Points by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data && data.meritCategories}>
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

                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Issued By</th>
                  <th className="px-4 py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.meritRecords.map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="px-4 py-3">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
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

                      <td className="px-4 py-3">{record.description}</td>
                      <td className="px-4 py-3">{record.issuedBy}</td>
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
        </Card>
      </div>
    </div>
  );
};

export default StudentMeritDashboard;
