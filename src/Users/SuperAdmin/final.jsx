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
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Users,
  School,
  UserPlus,
  Award,
  Menu,
  X,
} from "lucide-react";
import { BranchService } from "../../../services/branchService";
import { AuthService } from "../../../services/authService";
import { MeritService } from "../../../services/meritService";
import Papa from "papaparse";

const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#0d9488"];

const SuperAdminDashboard = () => {
  // State management
  const [branches, setBranches] = useState([]);
  const [branchAdmins, setBranchAdmins] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modal states
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showEditBranchModal, setShowEditBranchModal] = useState(false);
  const [showDeleteBranchModal, setShowDeleteBranchModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState(null);
  const [branchToDelete, setBranchToDelete] = useState(null);

  // Form states
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    contactNumber: "",
    email: "",
    capacity: "",
  });

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    cnic: "",
    branch_id: "",
    address: "",
    contactNumber: "",
  });

  const itemsPerPage = 10;

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [branchesResponse, adminsResponse] = await Promise.all([
          BranchService.getAllBranches(),
          AuthService.getAllUsers("branchadmin"),
        ]);

        setBranches(branchesResponse.data);
        setBranchAdmins(adminsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handlers for branch operations
  const handleAddBranch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await BranchService.createBranch(
        newBranch.name,
        newBranch.address,
        newBranch.contactNumber,
        newBranch.email,
        newBranch.capacity
      );

      // Refresh branches
      const response = await BranchService.getAllBranches();
      setBranches(response.data);

      // Reset form and close modal
      setNewBranch({
        name: "",
        address: "",
        contactNumber: "",
        email: "",
        capacity: "",
      });
      setShowAddBranchModal(false);
    } catch (err) {
      console.error("Error adding branch:", err);
      setError("Failed to add branch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBranch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await BranchService.updateBranch(branchToEdit._id, newBranch);

      // Refresh branches
      const response = await BranchService.getAllBranches();
      setBranches(response.data);

      // Reset form and close modal
      setShowEditBranchModal(false);
      setBranchToEdit(null);
    } catch (err) {
      console.error("Error updating branch:", err);
      setError("Failed to update branch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBranch = async () => {
    try {
      setLoading(true);
      await BranchService.deleteBranch(branchToDelete._id);

      // Refresh branches
      const response = await BranchService.getAllBranches();
      setBranches(response.data);

      // Close modal
      setShowDeleteBranchModal(false);
      setBranchToDelete(null);

      // Reset selected branch if it was deleted
      if (selectedBranch && selectedBranch._id === branchToDelete._id) {
        setSelectedBranch(null);
      }
    } catch (err) {
      console.error("Error deleting branch:", err);
      setError("Failed to delete branch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for adding admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await AuthService.registerBranchAdmin(
        newAdmin.name,
        newAdmin.email,
        newAdmin.password,
        newAdmin.cnic,
        newAdmin.branch_id,
        newAdmin.address,
        newAdmin.contactNumber
      );

      // Refresh admins
      const response = await AuthService.getAllUsers("branchadmin");
      setBranchAdmins(response.data);

      // Reset form and close modal
      setNewAdmin({
        name: "",
        email: "",
        password: "",
        cnic: "",
        branch_id: "",
        address: "",
        contactNumber: "",
      });
      setShowAddAdminModal(false);
    } catch (err) {
      console.error("Error adding admin:", err);
      setError("Failed to add admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Export data to CSV
  const exportToCSV = (data, filename) => {
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

  // Helper functions
  const getBranchById = (id) => {
    return branches.branches?.find((branch) => branch._id === id);
  };

  const getBranchAdminByBranchId = (branchId) => {
    return branchAdmins.find((admin) => admin.branch_id === branchId);
  };

  const getFilteredBranches = () => {
    if (!branches.branches || !searchQuery) return branches.branches || [];

    return branches.branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Pagination component
  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t mt-4">
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
        {totalPages <= 5 ? (
          [...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1 ? "bg-[#800000] text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))
        ) : (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === 1 ? "bg-[#800000] text-white" : ""
              }`}
            >
              1
            </button>
            {currentPage > 3 && <span className="px-2">...</span>}

            {[...Array(3)].map((_, i) => {
              const pageNum = currentPage > 2 ? currentPage - 1 + i : i + 2;
              if (pageNum > 1 && pageNum < totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === pageNum ? "bg-[#800000] text-white" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            {currentPage < totalPages - 2 && <span className="px-2">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === totalPages ? "bg-[#800000] text-white" : ""
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
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

  // Show loading state
  if (loading && !branches.branches) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000] mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !branches.branches) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#800000] text-white rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white text-black fixed h-full transition-all duration-300 ease-in-out z-20 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#9d0a10]">
          <h1 className={`text-xl font-bold ${sidebarOpen ? "" : "hidden"}`}>
            SuperAdmin
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-[#9d0a10]"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="mt-6">
          <div
            className={`flex items-center px-4 py-3 hover:bg-[#9d0a10] cursor-pointer ${
              !selectedBranch && selectedTab === "overview"
                ? "bg-[#9d0a10]"
                : ""
            }`}
            onClick={() => {
              setSelectedBranch(null);
              setSelectedTab("overview");
            }}
          >
            <School size={20} />
            {sidebarOpen && <span className="ml-3">System Overview</span>}
          </div>

          <div
            className={`flex items-center px-4 py-3 hover:bg-[#9d0a10] cursor-pointer ${
              selectedTab === "branches" ? "bg-[#9d0a10]" : ""
            }`}
            onClick={() => {
              setSelectedTab("branches");
            }}
          >
            <School size={20} />
            {sidebarOpen && <span className="ml-3">Branch Management</span>}
          </div>

          <div
            className={`flex items-center px-4 py-3 hover:bg-[#9d0a10] cursor-pointer ${
              selectedTab === "admins" ? "bg-[#9d0a10]" : ""
            }`}
            onClick={() => {
              setSelectedTab("admins");
            }}
          >
            <UserPlus size={20} />
            {sidebarOpen && <span className="ml-3">Admin Management</span>}
          </div>

          {/* <div
            className={`flex items-center px-4 py-3 hover:bg-[#9d0a10] cursor-pointer ${
              selectedTab === "stats" ? "bg-[#9d0a10]" : ""
            }`}
            onClick={() => {
              setSelectedTab("stats");
            }}
          >
            <Award size={20} />
            {sidebarOpen && <span className="ml-3">Merit Statistics</span>}
          </div> */}

          {sidebarOpen && (
            <div className="px-4 py-2 mt-4 text-sm text-gray-900">
              <div className="font-semibold mb-2">Branches</div>
              <div className="max-h-64 overflow-y-auto">
                {branches.branches?.map((branch) => (
                  <div
                    key={branch._id}
                    className={`pl-4 py-2 cursor-pointer hover:bg-[#9d0a10] rounded truncate ${
                      selectedBranch && selectedBranch._id === branch._id
                        ? "bg-[#9d0a10]"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setSelectedTab("overview");
                    }}
                  >
                    {branch.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 w-full border-t border-[#9d0a10] p-4">
          <button
            className="flex items-center text-white hover:text-gray-300"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 flex-1 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6">
          {/* Overview Dashboard - No branch selected */}
          {!selectedBranch && selectedTab === "overview" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  System Overview
                </h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAddBranchModal(true)}
                    className="flex items-center px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#9d0a10]"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Branch
                  </button>
                  <button
                    onClick={() => setShowAddAdminModal(true)}
                    className="flex items-center px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#9d0a10]"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Add Admin
                  </button>
                </div>
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                  <div className="rounded-full p-3 bg-blue-100 mr-4">
                    <School size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">Total Branches</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {branches.branches?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                  <div className="rounded-full p-3 bg-green-100 mr-4">
                    <UserPlus size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">Total Admins</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {branchAdmins.length || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                  <div className="rounded-full p-3 bg-purple-100 mr-4">
                    <Users size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">Total Students</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {branches.overallStats?.totalStudents || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                  <div className="rounded-full p-3 bg-amber-100 mr-4">
                    <Award size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">
                      Total Merit Points
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      +{branches.overallStats?.totalMerits || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Branch List */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    All Branches
                  </h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search branches..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2 border rounded-lg pl-10 w-64"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Branch Name</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-center">Students</th>
                        <th className="px-4 py-2 text-center">Teachers</th>
                        <th className="px-4 py-2 text-center">Merit Points</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredBranches()
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((branch) => (
                          <tr key={branch._id} className="border-b">
                            <td className="px-4 py-3 font-medium">
                              {branch.name}
                            </td>
                            <td className="px-4 py-3">{branch.address}</td>
                            <td className="px-4 py-3 text-center">
                              {branch.students?.length || 0}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {branch.teachers?.length || 0}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-green-600 font-medium">
                                +{branch.totalMerits || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedBranch(branch);
                                    setSelectedTab("overview");
                                  }}
                                  className="p-1 hover:text-blue-600"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    setBranchToEdit(branch);
                                    setNewBranch({
                                      name: branch.name,
                                      address: branch.address,
                                      contactNumber: branch.contactNumber,
                                      email: branch.email,
                                      capacity: branch.capacity,
                                    });
                                    setShowEditBranchModal(true);
                                  }}
                                  className="p-1 hover:text-amber-600"
                                  title="Edit Branch"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    setBranchToDelete(branch);
                                    setShowDeleteBranchModal(true);
                                  }}
                                  className="p-1 hover:text-red-600"
                                  title="Delete Branch"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={
                      Math.ceil(getFilteredBranches().length / itemsPerPage) ||
                      1
                    }
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </>
          )}

          {/* Branch Management Tab */}
          {selectedTab === "branches" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Branch Management
                </h1>
                <button
                  onClick={() => setShowAddBranchModal(true)}
                  className="flex items-center px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#9d0a10]"
                >
                  <Plus size={16} className="mr-2" />
                  Add Branch
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    All Branches
                  </h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search branches..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2 border rounded-lg pl-10 w-64"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Branch Name</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-left">Contact</th>
                        <th className="px-4 py-2 text-center">Capacity</th>
                        <th className="px-4 py-2 text-center">Admin</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredBranches()
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((branch) => {
                          const admin = getBranchAdminByBranchId(branch._id);

                          return (
                            <tr key={branch._id} className="border-b">
                              <td className="px-4 py-3 font-medium">
                                {branch.name}
                              </td>
                              <td className="px-4 py-3">{branch.address}</td>
                              <td className="px-4 py-3">
                                <div>{branch.contactNumber}</div>
                                <div className="text-sm text-gray-500">
                                  {branch.email}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {branch.capacity}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {admin ? (
                                  <div>
                                    <div>{admin.name}</div>
                                    <div className="text-sm text-gray-500">
                                      {admin.email}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-amber-500">
                                    No Admin
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => {
                                      setBranchToEdit(branch);
                                      setNewBranch({
                                        name: branch.name,
                                        address: branch.address,
                                        contactNumber: branch.contactNumber,
                                        email: branch.email,
                                        capacity: branch.capacity,
                                      });
                                      setShowEditBranchModal(true);
                                    }}
                                    className="p-1 hover:text-amber-600"
                                    title="Edit Branch"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setBranchToDelete(branch);
                                      setShowDeleteBranchModal(true);
                                    }}
                                    className="p-1 hover:text-red-600"
                                    title="Delete Branch"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={
                      Math.ceil(getFilteredBranches().length / itemsPerPage) ||
                      1
                    }
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </>
          )}

          {/* Admin Management Tab */}
          {selectedTab === "admins" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Admin Management
                </h1>
                <button
                  onClick={() => setShowAddAdminModal(true)}
                  className="flex items-center px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#9d0a10]"
                >
                  <UserPlus size={16} className="mr-2" />
                  Add Admin
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Branch Administrators
                  </h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search admins..."
                      className="px-4 py-2 border rounded-lg pl-10 w-64"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Admin Name</th>
                        <th className="px-4 py-2 text-left">Contact Info</th>
                        <th className="px-4 py-2 text-left">CNIC</th>
                        <th className="px-4 py-2 text-left">Branch</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchAdmins
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((admin) => {
                          const branch = getBranchById(admin.branch_id);

                          return (
                            <tr key={admin._id} className="border-b">
                              <td className="px-4 py-3 font-medium">
                                {admin.name}
                              </td>
                              <td className="px-4 py-3">
                                <div>{admin.email}</div>
                                <div className="text-sm text-gray-500">
                                  {admin.contactNumber}
                                </div>
                              </td>
                              <td className="px-4 py-3">{admin.cnic}</td>
                              <td className="px-4 py-3">
                                {branch ? branch.name : "Not Assigned"}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    admin.blocked
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {admin.blocked ? "Blocked" : "Active"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    className="p-1 hover:text-amber-600"
                                    title="Edit Admin"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    className="p-1 hover:text-red-600"
                                    title="Delete Admin"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={
                      Math.ceil(branchAdmins.length / itemsPerPage) || 1
                    }
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </>
          )}

          {/* Merit Statistics Tab */}
          {selectedTab === "stats" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  System-wide Merit Statistics
                </h1>
                <div className="flex gap-4">
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">
                    <Download size={16} className="mr-2" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm text-gray-600">Total Merit Points</h3>
                  <p className="text-2xl font-bold text-green-600">
                    +{branches.overallStats?.totalMerits || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm text-gray-600">Total Violations</h3>
                  <p className="text-2xl font-bold text-red-600">
                    -{branches.overallStats?.totalViolations || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm text-gray-600">Net Points</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {(branches.overallStats?.totalMerits || 0) -
                      (branches.overallStats?.totalViolations || 0)}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm text-gray-600">
                    Average Points per Student
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {branches.overallStats?.totalStudents
                      ? (
                          ((branches.overallStats?.totalMerits || 0) -
                            (branches.overallStats?.totalViolations || 0)) /
                          branches.overallStats.totalStudents
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Merit Points by Branch */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Merit Points by Branch
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={
                          branches.branches?.map((branch) => ({
                            name: branch.name,
                            merits: branch.totalMerits || 0,
                            violations: branch.totalViolations || 0,
                          })) || []
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="merits" name="Merits" fill="#16a34a" />
                        <Bar
                          dataKey="violations"
                          name="Violations"
                          fill="#dc2626"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Performing Branches */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Top Performing Branches
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={
                            branches.branches?.map((branch) => ({
                              name: branch.name,
                              value: branch.totalMerits || 0,
                            })) || []
                          }
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                        >
                          {branches.branches?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            `${value} Merit Points`,
                            props.payload.name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    System-wide Monthly Trend
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jan", merits: 550, violations: 85 },
                          { month: "Feb", merits: 620, violations: 92 },
                          { month: "Mar", merits: 720, violations: 102 },
                          { month: "Apr", merits: 830, violations: 110 },
                          { month: "May", merits: 920, violations: 125 },
                          { month: "Jun", merits: 980, violations: 140 },
                        ]}
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
                </div>

                {/* Top Students Across System */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Top Students Across System
                  </h3>
                  <div className="overflow-y-auto h-80">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white">
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Rank</th>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Branch</th>
                          <th className="px-4 py-2 text-left">Class</th>
                          <th className="px-4 py-2 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            id: 1,
                            name: "John Smith",
                            branch: "North Campus",
                            class: "10-A",
                            points: 95,
                          },
                          {
                            id: 2,
                            name: "Emma Davis",
                            branch: "South Campus",
                            class: "9-B",
                            points: 88,
                          },
                          {
                            id: 3,
                            name: "Michael Brown",
                            branch: "West Campus",
                            class: "10-B",
                            points: 85,
                          },
                          {
                            id: 4,
                            name: "Sarah Wilson",
                            branch: "North Campus",
                            class: "9-A",
                            points: 82,
                          },
                          {
                            id: 5,
                            name: "James Johnson",
                            branch: "North Campus",
                            class: "8-A",
                            points: 80,
                          },
                          {
                            id: 6,
                            name: "Alex Turner",
                            branch: "South Campus",
                            class: "10-C",
                            points: 78,
                          },
                          {
                            id: 7,
                            name: "Emily White",
                            branch: "South Campus",
                            class: "9-D",
                            points: 77,
                          },
                          {
                            id: 8,
                            name: "David Lee",
                            branch: "West Campus",
                            class: "10-E",
                            points: 75,
                          },
                          {
                            id: 9,
                            name: "Olivia Martinez",
                            branch: "West Campus",
                            class: "9-E",
                            points: 74,
                          },
                          {
                            id: 10,
                            name: "William Chen",
                            branch: "North Campus",
                            class: "11-A",
                            points: 73,
                          },
                        ].map((student, index) => (
                          <tr key={student.id} className="border-b">
                            <td className="px-4 py-3 font-semibold">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3">{student.name}</td>
                            <td className="px-4 py-3">{student.branch}</td>
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
              </div>
            </>
          )}

          {/* Branch Specific View */}
          {selectedBranch && selectedTab === "overview" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedBranch.name}
                  </h1>
                  <p className="text-gray-600">{selectedBranch.address}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setBranchToEdit(selectedBranch);
                      setNewBranch({
                        name: selectedBranch.name,
                        address: selectedBranch.address,
                        contactNumber: selectedBranch.contactNumber,
                        email: selectedBranch.email,
                        capacity: selectedBranch.capacity,
                      });
                      setShowEditBranchModal(true);
                    }}
                    className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg flex items-center"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setBranchToDelete(selectedBranch);
                      setShowDeleteBranchModal(true);
                    }}
                    className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                  <button
                    onClick={() => setSelectedBranch(null)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg"
                  >
                    Back to Overview
                  </button>
                </div>
              </div>

              {/* Branch Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm text-gray-600">Students</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedBranch.students?.length || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm text-gray-600">Teachers</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedBranch.teachers?.length || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm text-gray-600">Merit Points</h3>
                  <p className="text-2xl font-bold text-green-600">
                    +{selectedBranch.totalMerits || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm text-gray-600">Violations</h3>
                  <p className="text-2xl font-bold text-red-600">
                    -{selectedBranch.totalViolations || 0}
                  </p>
                </div>
              </div>

              {/* Branch Admin */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Branch Administrator
                </h3>

                {getBranchAdminByBranchId(selectedBranch._id) ? (
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <Users size={32} className="text-gray-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">
                        {getBranchAdminByBranchId(selectedBranch._id).name}
                      </h4>
                      <p className="text-gray-600">
                        {getBranchAdminByBranchId(selectedBranch._id).email}
                      </p>
                      <p className="text-gray-600">
                        {
                          getBranchAdminByBranchId(selectedBranch._id)
                            .contactNumber
                        }
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        CNIC:{" "}
                        {getBranchAdminByBranchId(selectedBranch._id).cnic}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <AlertCircle size={20} className="text-amber-500 mr-2" />
                    <span>No administrator assigned to this branch</span>
                    <button
                      onClick={() => {
                        setNewAdmin((prev) => ({
                          ...prev,
                          branch_id: selectedBranch._id,
                        }));
                        setShowAddAdminModal(true);
                      }}
                      className="ml-4 px-3 py-1 bg-[#800000] text-white rounded-lg text-sm"
                    >
                      Assign Admin
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Classes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Classes</h3>
                  <div className="overflow-y-auto max-h-64">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white">
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Class</th>
                          <th className="px-4 py-2 text-right">Students</th>
                          <th className="px-4 py-2 text-right">Merits</th>
                          <th className="px-4 py-2 text-right">Violations</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedBranch.classPerformance || []).map((cls) => (
                          <tr key={cls.class} className="border-b">
                            <td className="px-4 py-2 font-medium">
                              {cls.class}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {cls.totalStudents || 0}
                            </td>
                            <td className="px-4 py-2 text-right text-green-600">
                              {cls.merits || 0}
                            </td>
                            <td className="px-4 py-2 text-right text-red-600">
                              {cls.violations || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Students */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Students</h3>
                  <div className="overflow-y-auto max-h-64">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white">
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Rank</th>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Class</th>
                          <th className="px-4 py-2 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedBranch.topStudents || []).map(
                          (student, index) => (
                            <tr key={student.id} className="border-b">
                              <td className="px-4 py-2 font-semibold">
                                {index + 1}
                              </td>
                              <td className="px-4 py-2">{student.name}</td>
                              <td className="px-4 py-2">{student.class}</td>
                              <td className="px-4 py-2 text-right font-bold text-green-600">
                                {student.points}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Monthly Merit Points Trend
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedBranch.monthlyTrend || []}>
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
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">
                    <Download size={16} className="mr-1" />
                    Export
                  </button>
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
                        <th className="px-4 py-2 text-left">Awarded By</th>
                        <th className="px-4 py-2 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedBranch.recentActivity || []).map((activity) => (
                        <tr key={activity.id} className="border-b">
                          <td className="px-4 py-2">
                            {new Date(activity.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">{activity.student}</td>
                          <td className="px-4 py-2">{activity.class}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                activity.type === "merit"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {activity.type === "merit"
                                ? "Merit"
                                : "Violation"}
                            </span>
                          </td>
                          <td className="px-4 py-2">{activity.reason}</td>
                          <td className="px-4 py-2">
                            {activity.teacher || activity.admin}
                          </td>
                          <td
                            className={`px-4 py-2 text-right font-bold ${
                              activity.type === "merit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {activity.type === "merit" ? "+" : "-"}
                            {Math.abs(activity.points)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Add Branch Modal */}
          {showAddBranchModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Add New Branch</h3>
                  <form onSubmit={handleAddBranch}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Branch Name
                        </label>
                        <input
                          type="text"
                          value={newBranch.name}
                          onChange={(e) =>
                            setNewBranch({ ...newBranch, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          value={newBranch.address}
                          onChange={(e) =>
                            setNewBranch({
                              ...newBranch,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          rows="2"
                          required
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number
                          </label>
                          <input
                            type="text"
                            value={newBranch.contactNumber}
                            onChange={(e) =>
                              setNewBranch({
                                ...newBranch,
                                contactNumber: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Capacity
                          </label>
                          <input
                            type="number"
                            value={newBranch.capacity}
                            onChange={(e) =>
                              setNewBranch({
                                ...newBranch,
                                capacity: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={newBranch.email}
                          onChange={(e) =>
                            setNewBranch({
                              ...newBranch,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddBranchModal(false)}
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#9d0a10]"
                      >
                        Add Branch
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Branch Modal */}
          {showEditBranchModal && branchToEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Edit Branch</h3>
                  <form onSubmit={handleEditBranch}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Branch Name
                        </label>
                        <input
                          type="text"
                          value={newBranch.name}
                          onChange={(e) =>
                            setNewBranch({ ...newBranch, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          value={newBranch.address}
                          onChange={(e) =>
                            setNewBranch({
                              ...newBranch,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          rows="2"
                          required
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number
                          </label>
                          <input
                            type="text"
                            value={newBranch.contactNumber}
                            onChange={(e) =>
                              setNewBranch({
                                ...newBranch,
                                contactNumber: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Capacity
                          </label>
                          <input
                            type="number"
                            value={newBranch.capacity}
                            onChange={(e) =>
                              setNewBranch({
                                ...newBranch,
                                capacity: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={newBranch.email}
                          onChange={(e) =>
                            setNewBranch({
                              ...newBranch,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditBranchModal(false);
                          setBranchToEdit(null);
                        }}
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#9d0a10]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Delete Branch Confirmation Modal */}
          {showDeleteBranchModal && branchToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Delete Branch</h3>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete the branch "
                    {branchToDelete.name}"? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteBranchModal(false);
                        setBranchToDelete(null);
                      }}
                      className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteBranch}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Admin Modal */}
          {showAddAdminModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">
                    Add Branch Administrator
                  </h3>
                  <form onSubmit={handleAddAdmin}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newAdmin.name}
                          onChange={(e) =>
                            setNewAdmin({ ...newAdmin, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) =>
                            setNewAdmin({ ...newAdmin, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) =>
                            setNewAdmin({
                              ...newAdmin,
                              password: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CNIC
                          </label>
                          <input
                            type="text"
                            value={newAdmin.cnic}
                            onChange={(e) =>
                              setNewAdmin({ ...newAdmin, cnic: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number
                          </label>
                          <input
                            type="text"
                            value={newAdmin.contactNumber}
                            onChange={(e) =>
                              setNewAdmin({
                                ...newAdmin,
                                contactNumber: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          value={newAdmin.address}
                          onChange={(e) =>
                            setNewAdmin({
                              ...newAdmin,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          rows="2"
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign to Branch
                        </label>
                        <select
                          value={newAdmin.branch_id}
                          onChange={(e) =>
                            setNewAdmin({
                              ...newAdmin,
                              branch_id: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        >
                          <option value="">Select Branch</option>
                          {branches.branches?.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddAdminModal(false)}
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#9d0a10]"
                      >
                        Add Administrator
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
