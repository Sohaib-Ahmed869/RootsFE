import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Dummy data for charts
const monthlyData = [
  { name: 'Jan', users: 4000, revenue: 2400 },
  { name: 'Feb', users: 3000, revenue: 1398 },
  { name: 'Mar', users: 2000, revenue: 9800 },
  { name: 'Apr', users: 2780, revenue: 3908 },
  { name: 'May', users: 1890, revenue: 4800 },
  { name: 'Jun', users: 2390, revenue: 3800 },
];

const branchPerformance = [
  { name: 'Branch 1', value: 400 },
  { name: 'Branch 2', value: 300 },
  { name: 'Branch 3', value: 300 },
  { name: 'Branch 4', value: 200 },
  { name: 'Branch 5', value: 100 },
];

const COLORS = ['#800000', '#A52A2A', '#B22222', '#8B0000', '#980000'];

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="border-b border-gray-200 p-6">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-black">
    {children}
  </h2>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Pagination Controls Component
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div className="flex flex-1 justify-between sm:hidden">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center rounded px-4 py-2 text-sm font-semibold 
          ${currentPage === 1 
            ? 'bg-gray-100 text-gray-400' 
            : 'bg-white text-[#800000] hover:bg-gray-50'}`}
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center rounded px-4 py-2 text-sm font-semibold 
          ${currentPage === totalPages 
            ? 'bg-gray-100 text-gray-400' 
            : 'bg-white text-[#800000] hover:bg-gray-50'}`}
      >
        Next
      </button>
    </div>
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
              ${currentPage === 1 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <span className="sr-only">First</span>
            ««
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
              ${currentPage === 1 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <span className="sr-only">Previous</span>
            «
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                ${currentPage === index + 1
                  ? 'z-10 bg-[#800000] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
              ${currentPage === totalPages ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <span className="sr-only">Next</span>
            »
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
              ${currentPage === totalPages ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <span className="sr-only">Last</span>
            »»
          </button>
        </nav>
      </div>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <Card>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-black mt-2">{value}</h3>
        </div>
        {icon && <div className="text-[#800000]">{icon}</div>}
      </div>
    </CardContent>
  </Card>
);

// Revenue Chart Component
const RevenueChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Monthly Revenue</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#800000" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Users Chart Component
const UsersChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>User Growth</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#A52A2A" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Branch Performance Chart Component
const BranchPerformance = () => (
  <Card>
    <CardHeader>
      <CardTitle>Branch Performance</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={branchPerformance}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {branchPerformance.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Admin Table Component with Pagination
const AdminTable = ({ admins }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(admins.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = admins.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-black">Name</th>
                <th className="text-left p-4 font-semibold text-black">Email</th>
                <th className="text-left p-4 font-semibold text-black">Branch</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((admin, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-4">{admin.adminName}</td>
                  <td className="p-4">{admin.adminEmail}</td>
                  <td className="p-4">{admin.adminBranch}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [admins] = useState([
    {
      adminName: "Admin 1",
      adminEmail: "admin1@roots.com",
      adminBranch: "Branch 1",
    },
    {
      adminName: "Admin 2",
      adminEmail: "admin2@roots.com",
      adminBranch: "Branch 2",
    },
    {
      adminName: "Admin 3",
      adminEmail: "admin3@roots.com",
      adminBranch: "Branch 3",
    },
    {
      adminName: "Admin 4",
      adminEmail: "admin4@roots.com",
      adminBranch: "Branch 4",
    },
    {
      adminName: "Admin 5",
      adminEmail: "admin5@roots.com",
      adminBranch: "Branch 5",
    },
    {
      adminName: "Admin 6",
      adminEmail: "admin6@roots.com",
      adminBranch: "Branch 1",
    },
    {
      adminName: "Admin 7",
      adminEmail: "admin7@roots.com",
      adminBranch: "Branch 2",
    },
    {
      adminName: "Admin 8",
      adminEmail: "admin8@roots.com",
      adminBranch: "Branch 3",
    },
    {
      adminName: "Admin 9",
      adminEmail: "admin9@roots.com",
      adminBranch: "Branch 4",
    },
    {
      adminName: "Admin 10",
      adminEmail: "admin10@roots.com",
      adminBranch: "Branch 5",
    },
  ]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-black mb-8">Super Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value="1,234" />
        <StatCard title="Total Revenue" value="50,234/-" />
        <StatCard title="Active Branches" value="5" />
        <StatCard title="Total Admins" value={admins.length} />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart />
        <UsersChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BranchPerformance />
        <AdminTable admins={admins} />
      </div>
    </div>
  );
};

export default Dashboard;