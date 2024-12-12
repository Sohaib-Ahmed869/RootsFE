import React, { useState } from "react";
import { AuthService } from "../../../services/authService";

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
    paymentMethod: "Online Transfer",
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
    paymentMethod: "Credit Card",
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
    paymentMethod: null,
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
    paymentMethod: "Cash",
  },
];

// Generic Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

// Password Update Screen
const PasswordUpdate = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    AuthService.updatePassword(newPassword);
    // Simulated success
    setSuccess("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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

// Main Component
const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState("settings");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-[#800000] text-[#800000]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Password Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto">
        {activeTab === "fees" ? <FeesManagement /> : <PasswordUpdate />}
      </div>
    </div>
  );
};

export default StudentPortal;
