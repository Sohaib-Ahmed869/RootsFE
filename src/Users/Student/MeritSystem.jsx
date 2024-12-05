import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dummy Data
const POINTS_HISTORY = [
  {
    id: 1,
    date: "2024-03-15",
    type: "Merit",
    points: 5,
    reason: "First in Mathematics Quiz",
    awardedBy: "Mr. Anderson",
    category: "Academic",
  },
  {
    id: 2,
    date: "2024-03-12",
    type: "Demerit",
    points: -2,
    reason: "Late to Class",
    awardedBy: "Mrs. Smith",
    category: "Discipline",
  },
  {
    id: 3,
    date: "2024-03-10",
    type: "Merit",
    points: 3,
    reason: "Helping organize school event",
    awardedBy: "Mr. Wilson",
    category: "Extra Curricular",
  },
  {
    id: 4,
    date: "2024-03-05",
    type: "Merit",
    points: 4,
    reason: "Winner - Science Project",
    awardedBy: "Ms. Davis",
    category: "Academic",
  },
  {
    id: 5,
    date: "2024-03-01",
    type: "Demerit",
    points: -1,
    reason: "Incomplete Homework",
    awardedBy: "Mr. Anderson",
    category: "Academic",
  },
];

const TREND_DATA = [
  { month: 'Jan', points: 65 },
  { month: 'Feb', points: 70 },
  { month: 'Mar', points: 75 },
];

const CATEGORIES = ["All", "Academic", "Discipline", "Extra Curricular"];
const POINT_TYPES = ["All", "Merit", "Demerit"];

// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);

const MeritSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // Calculate totals
  const totalMerits = POINTS_HISTORY
    .filter(item => item.type === "Merit")
    .reduce((sum, item) => sum + item.points, 0);

  const totalDemerits = Math.abs(POINTS_HISTORY
    .filter(item => item.type === "Demerit")
    .reduce((sum, item) => sum + item.points, 0));

  const netPoints = totalMerits - totalDemerits;

  // Filter points history
  const filteredHistory = POINTS_HISTORY.filter(item => {
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    const typeMatch = selectedType === "All" || item.type === selectedType;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-green-50">
          <h3 className="text-lg font-medium text-green-800 mb-2">Total Merit Points</h3>
          <p className="text-3xl font-bold text-green-600">+{totalMerits}</p>
        </Card>
        
        <Card className="bg-red-50">
          <h3 className="text-lg font-medium text-red-800 mb-2">Total Demerits</h3>
          <p className="text-3xl font-bold text-red-600">-{totalDemerits}</p>
        </Card>
        
        <Card className={netPoints >= 0 ? "bg-blue-50" : "bg-orange-50"}>
          <h3 className={`text-lg font-medium ${netPoints >= 0 ? "text-blue-800" : "text-orange-800"} mb-2`}>
            Net Points
          </h3>
          <p className={`text-3xl font-bold ${netPoints >= 0 ? "text-blue-600" : "text-orange-600"}`}>
            {netPoints}
          </p>
        </Card>
      </div>

      {/* Points Trend */}
      <Card className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Points Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={TREND_DATA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="points" stroke="#800000" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Points History */}
      <Card>
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-800">Points History</h3>
          
          <div className="flex gap-4 mt-4 sm:mt-0">
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded p-2"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded p-2"
              >
                {POINT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Points</th>
                <th className="text-left py-3 px-4">Reason</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Awarded By</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      item.type === 'Merit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={item.type === 'Merit' ? 'text-green-600' : 'text-red-600'}>
                      {item.type === 'Merit' ? '+' : ''}{item.points}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.reason}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-sm bg-gray-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.awardedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MeritSystem;