import React, { useState } from 'react';

// Dummy Data for Fees
const FEES_DATA = [
  {
    id: "FEE001",
    month: "January 2024",
    amount: 5000,
    status: "Paid",
    dueDate: "2024-01-05",
    paidDate: "2024-01-03",
    type: "Tuition Fee",
    receiptNo: "RCP001",
    paymentMethod: "Online Transfer"
  },
  {
    id: "FEE002",
    month: "February 2024",
    amount: 5000,
    status: "Paid",
    dueDate: "2024-02-05",
    paidDate: "2024-02-04",
    type: "Tuition Fee",
    receiptNo: "RCP002",
    paymentMethod: "Credit Card"
  },
  {
    id: "FEE003",
    month: "March 2024",
    amount: 5000,
    status: "Pending",
    dueDate: "2024-03-05",
    paidDate: null,
    type: "Tuition Fee",
    receiptNo: null,
    paymentMethod: null
  },
  {
    id: "FEE004",
    month: "Term 1 Books",
    amount: 2000,
    status: "Paid",
    dueDate: "2024-01-10",
    paidDate: "2024-01-10",
    type: "Books Fee",
    receiptNo: "RCP003",
    paymentMethod: "Cash"
  }
];

// Generic Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Password Update Screen
const PasswordUpdate = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Simulated success
    setSuccess('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Update Password</h2>
      
      <form onSubmit={handlePasswordUpdate}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm p-2 bg-green-50 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#800000] text-white py-2 px-4 rounded hover:bg-[#600000] transition-colors"
          >
            Update Password
          </button>
        </div>
      </form>
    </Card>
  );
};

// Fees Management Screen
const FeesManagement = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedType, setSelectedType] = useState('All');

  const downloadReceipt = (feeId) => {
    // Simulate receipt download
    console.log(`Downloading receipt for fee ID: ${feeId}`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm text-gray-600">Total Fees (2024)</h3>
            <p className="text-2xl font-bold">PKR17,000</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Paid Amount</h3>
            <p className="text-2xl font-bold text-green-600">PKR12,000</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Pending Amount</h3>
            <p className="text-2xl font-bold text-red-600">PKR5,000</p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded p-2"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded p-2"
            >
              <option value="All">All Types</option>
              <option value="Tuition">Tuition Fee</option>
              <option value="Books">Books Fee</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Fees Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Month/Description</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Due Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {FEES_DATA.map((fee) => (
                <tr key={fee.id} className="border-t">
                  <td className="py-3 px-4">{fee.month}</td>
                  <td className="py-3 px-4">{fee.type}</td>
                  <td className="py-3 px-4">PKR{fee.amount}</td>
                  <td className="py-3 px-4">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      fee.status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {fee.status === 'Paid' && (
                      <button
                        onClick={() => downloadReceipt(fee.id)}
                        className="text-[#800000] hover:text-[#600000] flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Main Component
const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('fees');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fees'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fees & Payments
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Password Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto">
        {activeTab === 'fees' ? <FeesManagement /> : <PasswordUpdate />}
      </div>
    </div>
  );
};

export default StudentPortal;