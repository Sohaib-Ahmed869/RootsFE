import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Lock,
  UserPlus,
  Users,
  X,
  Download,
  Upload,
  AlertCircle,
  Check,
  EyeOff,
  Filter,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { AuthService } from "../../../services/authService";
import { BranchService } from "../../../services/branchService";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import ParentService from "../../../services/parentService";

const SuperAdminStudents = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classes, setClasses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignParentModal, setShowAssignParentModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form states
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    rollNumber: "",
    password: "",
    dateOfBirth: "",
    branch_id: "",
    class: "",
    cnic: "",
    address: "",
    contactNumber: "",
    age: "",
  });

  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    cnic: "",
    children: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState("");

  const itemsPerPage = 10;

  // Fetch initial data
  useEffect(() => {
    // First, modify your fetchData function to correctly process classes:
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsResponse, parentsResponse, branchesResponse] =
          await Promise.all([
            AuthService.getStudents(),
            AuthService.getAllUsers("parent"),
            BranchService.getAllBranches(),
          ]);

        setStudents(studentsResponse.data);
        setParents(parentsResponse.data);

        // Store raw branches data
        const branchesData = branchesResponse.data.branches || [];
        setBranches(branchesData);

        // Create a mapping of branch IDs to their classes
        const classesData = {};

        // Fetch classes for each branch
        for (const branch of branchesData) {
          try {
            const classesResponse = await BranchService.getBranchClasses(
              branch._id
            );
            if (classesResponse.data && classesResponse.data.data) {
              classesData[branch._id] = classesResponse.data.data.map(
                (cls) => cls.name
              );
            }
          } catch (error) {
            console.error(
              `Error fetching classes for branch ${branch._id}:`,
              error
            );
          }
        }

        console.log("Processed classes data:", classesData);
        setClasses(classesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load student data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper function to get all classes for a branch
  const getClassesForBranch = (branchId) => {
    if (!branchId || !classes) return [];

    // Check if classes has the branch ID as a key
    if (classes[branchId]) {
      return classes[branchId];
    }

    // If not found by branch ID, log the issue
    console.log("Classes not found for branch ID:", branchId);
    console.log("Available classes keys:", Object.keys(classes));

    return [];
  };
  // Helper function to get branch name by ID
  const getBranchName = (branchId) => {
    console.log("Branches:", branchId);
    if (!branchId) return "Unknown Branch";

    // If branches is an array
    if (Array.isArray(branches)) {
      const branch = branches.find((b) => b._id === branchId);
      return branch ? branch.name : "Unknown Branch";
    }

    // If branches has a branches property (from API response)
    if (branches.branches && Array.isArray(branches.branches)) {
      const branch = branches.branches.find((b) => b._id === branchId);
      return branch ? branch.name : "Unknown Branch";
    }

    return "Unknown Branch";
  };
  // Filter students based on search, branch, and class
  const getFilteredStudents = () => {
    if (!students) return [];

    // Flatten the students object if it's not already an array
    let allStudents = Array.isArray(students)
      ? students
      : Object.values(students).flat();

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      allStudents = allStudents.filter(
        (student) =>
          student.name?.toLowerCase().includes(query) ||
          student.rollNumber?.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query)
      );
    }

    // Apply branch filter
    if (selectedBranch) {
      allStudents = allStudents.filter(
        (student) => student.branch_id === selectedBranch
      );
    }

    // Apply class filter
    if (selectedClass) {
      allStudents = allStudents.filter(
        (student) =>
          student.classId === selectedClass || student.class === selectedClass
      );
    }

    return allStudents;
  };

  // Add this to your state declarations
  const [classNameToId, setClassNameToId] = useState({});

  // When fetching classes, store a mapping of both name->ID and ID->name
  const fetchClassesForBranch = async (branchId) => {
    if (!branchId) return;

    try {
      const response = await BranchService.getBranchClasses(branchId);
      if (response.data && response.data.data) {
        // Create arrays of class names for the UI
        const classNames = response.data.data.map((cls) => cls.name);

        // Also create a mapping of class name to class ID for later use
        const classNameToId = {};
        response.data.data.forEach((cls) => {
          classNameToId[cls.name] = cls.id;
        });

        // Update the classes state
        setClasses((prevClasses) => ({
          ...prevClasses,
          [branchId]: classNames,
        }));

        // Also store the name to ID mapping
        setClassNameToId((prevMapping) => ({
          ...prevMapping,
          [branchId]: classNameToId,
        }));
      }
    } catch (error) {
      console.error(`Error fetching classes for branch ${branchId}:`, error);
    }
  };
  // Handle student operations
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Get the selected class name from the form
      const selectedClassName = newStudent.class;

      // Get the branch ID
      const branchId = newStudent.branch_id;

      // First create the student with basic info
      const registerResponse = await AuthService.registerStudent(
        newStudent.name,
        newStudent.email,
        newStudent.password,
        newStudent.rollNumber,
        newStudent.dateOfBirth,
        newStudent.grade || "",
        newStudent.branch_id,
        newStudent.cnic,
        newStudent.address,
        newStudent.contactNumber,
        newStudent.age || 0,
        selectedClassName // This can be just the class name as before
      );

      // If student creation was successful, assign them to the class
      if (registerResponse && registerResponse.data) {
        try {
          // Get the newly created student's ID
          // We need to fetch the student details to get their ID
          const studentsResponse = await AuthService.getStudents();
          const newlyCreatedStudent = studentsResponse.data
            .flat()
            .find((student) => student.email === newStudent.email);

          if (newlyCreatedStudent && newlyCreatedStudent.id) {
            // Call the addStudentsToClass API
            await BranchService.addStudentsToClass(selectedClassName, [
              newlyCreatedStudent.id,
            ]);
            console.log(
              `Student assigned to class ${selectedClassName} successfully`
            );
          } else {
            console.warn("Could not find newly created student or missing ID");
          }
        } catch (classAssignmentError) {
          console.error(
            "Error assigning student to class:",
            classAssignmentError
          );
          // We won't fail the whole operation just because class assignment failed
        }
      }

      // Refresh students list
      const response = await AuthService.getStudents();
      setStudents(response.data);

      // Reset form and close modal
      setNewStudent({
        name: "",
        email: "",
        rollNumber: "",
        password: "",
        dateOfBirth: "",
        branch_id: "",
        class: "",
        cnic: "",
        address: "",
        contactNumber: "",
        age: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding student:", err);
      console.error("Request payload:", {
        ...newStudent,
        class: newStudent.class,
      });
      if (err.response) {
        console.error("Server response:", err.response.data);
      }
      setError("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedData = {
        name: newStudent.name,
        email: newStudent.email,
        rollNumber: newStudent.rollNumber,
        cnic: newStudent.cnic,
        address: newStudent.address,
        contactNumber: newStudent.contactNumber,
        dateOfBirth: newStudent.dateOfBirth,
      };

      // Only include password if it was changed
      if (newStudent.password) {
        updatedData.password = newStudent.password;
      }

      await AuthService.updateUser("student", selectedStudent.id, updatedData);

      // If class was changed, update class
      if (selectedStudent.classId !== newStudent.class) {
        await BranchService.changeStudentClass(
          selectedStudent.id,
          newStudent.class
        );
      }

      // Refresh students
      const response = await AuthService.getStudents();
      setStudents(response.data);

      setShowEditModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error updating student:", err);
      setError("Failed to update student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      setLoading(true);
      await AuthService.deleteUser("student", selectedStudent.id);

      // Refresh students
      const response = await AuthService.getStudents();
      setStudents(response.data);

      setShowDeleteModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error deleting student:", err);
      setError("Failed to delete student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPassword || resetPassword.trim() === "") {
      setError("Password cannot be empty");
      return;
    }

    try {
      setLoading(true);

      // Try direct update first
      try {
        await AuthService.updateUser("student", selectedStudent.id, {
          password: resetPassword,
        });
      } catch (directUpdateError) {
        // If direct update fails, try the dedicated password reset endpoint
        await AuthService.updatePassword(resetPassword, selectedStudent.id);
      }

      // Show success message
      setError(null);
      alert("Password reset successfully");

      setShowResetPasswordModal(false);
      setSelectedStudent(null);
      setResetPassword("");
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignParent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const parentId = e.target.parentId.value;

      // Call the API to assign parent
      await ParentService.assignParentToStudent(parentId, selectedStudent.id);

      // Refresh students and parents
      const [studentsResponse, parentsResponse] = await Promise.all([
        AuthService.getStudents(),
        AuthService.getAllUsers("parent"),
      ]);

      setStudents(studentsResponse.data);
      setParents(parentsResponse.data);

      setShowAssignParentModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error assigning parent:", err);
      setError("Failed to assign parent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddParent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Get selected student IDs
      const children = newParent.children;

      // Register parent
      await AuthService.registerParent(
        newParent.name,
        newParent.email,
        newParent.password,
        children,
        newParent.cnic,
        "Address not provided",
        newParent.contactNumber
      );

      // Refresh students and parents
      const [studentsResponse, parentsResponse] = await Promise.all([
        AuthService.getStudents(),
        AuthService.getAllUsers("parent"),
      ]);

      setStudents(studentsResponse.data);
      setParents(parentsResponse.data);

      // Reset form and close modal
      setNewParent({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        cnic: "",
        children: [],
      });

      setShowAddParentModal(false);
    } catch (err) {
      console.error("Error adding parent:", err);
      setError("Failed to add parent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // Read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first sheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process and register students
        for (const row of jsonData) {
          try {
            // Create a student object from the row
            const student = {
              name: row.Name || row.name,
              email: row.Email || row.email,
              rollNumber:
                row.RollNumber || row["Roll Number"] || row.rollNumber,
              password: "student123", // Default password
              dateOfBirth:
                row.DateOfBirth ||
                row["Date of Birth"] ||
                new Date().toISOString().split("T")[0],
              branch_id: selectedBranch,
              class: row.Class || row.class,
              address: row.Address || row.address || "",
              contactNumber:
                row.Contact || row.contactNumber || row["Contact Number"] || "",
              cnic: row.CNIC || row.cnic || "",
            };

            // Register the student
            await AuthService.registerStudent(
              student.name,
              student.email,
              student.password,
              student.rollNumber,
              student.dateOfBirth,
              "",
              student.branch_id,
              student.cnic,
              student.address,
              student.contactNumber,
              0,
              student.class
            );
          } catch (err) {
            console.error("Error registering student from Excel:", err);
          }
        }

        // Refresh students list
        const response = await AuthService.getStudents();
        setStudents(response.data);

        setShowUploadModal(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error processing file:", err);
      setError(
        "Failed to process file. Please check the format and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (students) console.log("Students data:", students);
    if (branches) console.log("Branches data:", branches);
    if (classes) console.log("Classes data:", classes);
  }, [students, branches, classes]);

  // Export students to CSV
  const exportStudentsToCSV = () => {
    const studentsToExport = getFilteredStudents().map((student) => ({
      Name: student.name,
      Email: student.email,
      "Roll Number": student.rollNumber,
      Class: student.class,
      Branch: getBranchName(student.branch_id),
      "Merit Points": student.meritPoints || 0,
      "Date of Birth": student.dateOfBirth,
      CNIC: student.cnic,
      Address: student.address,
      "Contact Number": student.contactNumber,
    }));

    const csv = Papa.unparse(studentsToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  if (loading && !students) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000] mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading student data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !students) {
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

  const filteredStudents = getFilteredStudents();
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Student Management
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Upload size={16} className="mr-2" />
              Upload Excel
            </button>
            <button
              onClick={() => setShowAddParentModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus size={16} className="mr-2" />
              Add Parent
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Students
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, roll number, email..."
                  className="input input-bordered w-full px-4 py-2 pl-10 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setSelectedClass("");
                }}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={!selectedBranch}
              >
                <option value="">All Classes</option>
                {selectedBranch &&
                  getClassesForBranch(selectedBranch).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={exportStudentsToCSV}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Download size={16} className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Roll No</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Branch</th>
                  <th className="px-4 py-2 text-center">Merit Points</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="px-4 py-3">{student.rollNumber}</td>
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3">{student.email}</td>
                    <td className="px-4 py-3">
                      {typeof student.class === "object"
                        ? student.class?.name
                        : student.class}
                    </td>
                    <td className="px-4 py-3">
                      {getBranchName(student.branch_id)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="badge badge-success">
                        {student.meritPoints || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          student.blocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {student.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDetailsModal(true);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="View Details"
                        >
                          <Eye size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setNewStudent({
                              name: student.name,
                              email: student.email,
                              rollNumber: student.rollNumber,
                              password: "",
                              dateOfBirth: student.dateOfBirth
                                ? new Date(student.dateOfBirth)
                                    .toISOString()
                                    .split("T")[0]
                                : "",
                              branch_id: student.branch_id,
                              class:
                                student.classId ||
                                (typeof student.class === "object"
                                  ? student.class?._id
                                  : student.class),
                              cnic: student.cnic,
                              address: student.address,
                              contactNumber: student.contactNumber,
                            });
                            setShowEditModal(true);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="Edit Student"
                        >
                          <Edit size={18} className="text-amber-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowResetPasswordModal(true);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="Reset Password"
                        >
                          <Lock size={18} className="text-indigo-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowAssignParentModal(true);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="Assign Parent"
                        >
                          <Users size={18} className="text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="Delete Student"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty state */}
            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No students found matching your criteria.
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredStudents.length > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={Math.ceil(filteredStudents.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Add New Student</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddStudent}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
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
                      name="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={newStudent.rollNumber}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          rollNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={newStudent.password}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <select
                      name="branch_id"
                      value={newStudent.branch_id}
                      onChange={(e) => {
                        const selectedBranchId = e.target.value;
                        setNewStudent({
                          ...newStudent,
                          branch_id: selectedBranchId,
                          class: "",
                        });
                        // Explicitly fetch classes when branch is selected
                        fetchClassesForBranch(selectedBranchId);
                      }}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <select
                      name="class"
                      value={newStudent.class}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, class: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                      disabled={!newStudent.branch_id}
                    >
                      <option value="">Select Class</option>
                      {newStudent.branch_id &&
                        getClassesForBranch(newStudent.branch_id).map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={newStudent.dateOfBirth}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNIC
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={newStudent.cnic}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, cnic: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={newStudent.contactNumber}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          contactNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={newStudent.address}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    rows="2"
                  ></textarea>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#9d0a10]"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Edit Student</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditStudent}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
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
                      name="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={newStudent.rollNumber}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          rollNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password (leave blank to keep current)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={newStudent.password}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <select
                      name="branch_id"
                      value={newStudent.branch_id}
                      onChange={(e) => {
                        setNewStudent({
                          ...newStudent,
                          branch_id: e.target.value,
                          class: "",
                        });
                      }}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                      disabled
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Branch cannot be changed directly.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={newStudent.dateOfBirth}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNIC
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={newStudent.cnic}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, cnic: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={newStudent.contactNumber}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          contactNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={newStudent.address}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    rows="2"
                  ></textarea>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedStudent(null);
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

      {/* Delete Student Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle size={24} className="mr-2" />
                <h3 className="text-lg font-bold">Delete Student</h3>
              </div>

              <p className="mb-4">
                Are you sure you want to delete student{" "}
                <span className="font-semibold">{selectedStudent.name}</span>?
                This action cannot be undone and will remove all associated
                data.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Reset Password</h3>
                <button
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setSelectedStudent(null);
                    setResetPassword("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mb-4">
                Reset password for student{" "}
                <span className="font-semibold">{selectedStudent.name}</span>
              </p>

              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPasswordModal(false);
                      setSelectedStudent(null);
                      setResetPassword("");
                    }}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#9d0a10]"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Parent Modal */}
      {showAssignParentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Assign Parent</h3>
                <button
                  onClick={() => {
                    setShowAssignParentModal(false);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mb-4">
                Assign a parent to{" "}
                <span className="font-semibold">{selectedStudent.name}</span>
              </p>

              <form onSubmit={handleAssignParent}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Parent
                  </label>
                  <select
                    name="parentId"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select a parent</option>
                    {parents.map((parent) => (
                      <option key={parent._id} value={parent._id}>
                        {parent.name} ({parent.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignParentModal(false);
                      setShowAddParentModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add New Parent
                  </button>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignParentModal(false);
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#9d0a10]"
                  >
                    Assign Parent
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Parent Modal */}
      {showAddParentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Add New Parent</h3>
                <button
                  onClick={() => setShowAddParentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddParent}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newParent.name}
                      onChange={(e) =>
                        setNewParent({ ...newParent, name: e.target.value })
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
                      name="email"
                      value={newParent.email}
                      onChange={(e) =>
                        setNewParent({ ...newParent, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={newParent.password}
                        onChange={(e) =>
                          setNewParent({
                            ...newParent,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={newParent.contactNumber}
                      onChange={(e) =>
                        setNewParent({
                          ...newParent,
                          contactNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNIC
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={newParent.cnic}
                      onChange={(e) =>
                        setNewParent({ ...newParent, cnic: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Children
                  </label>
                  <select
                    multiple
                    name="children"
                    value={newParent.children}
                    onChange={(e) => {
                      const options = Array.from(e.target.options);
                      const selectedValues = options
                        .filter((option) => option.selected)
                        .map((option) => option.value);
                      setNewParent({ ...newParent, children: selectedValues });
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    size="5"
                  >
                    {getFilteredStudents().map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.rollNumber})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple students
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddParentModal(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#9d0a10]"
                  >
                    Add Parent
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload Excel Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Upload Students Excel</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Upload an Excel file with student data. The file should
                  include columns for Name, Email, Roll Number, etc.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Branch for New Students
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex flex-col items-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Click to upload Excel file
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Excel File Format:
                </h4>
                <ul className="list-disc text-xs text-gray-600 pl-5 space-y-1">
                  <li>Required columns: Name, Email, Roll Number</li>
                  <li>
                    Optional: Date of Birth, Class, CNIC, Contact Number,
                    Address
                  </li>
                  <li>First row should be column headers</li>
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Student Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold">
                      {selectedStudent.name}
                    </h4>
                    <p className="text-gray-600">
                      Roll Number: {selectedStudent.rollNumber}
                    </p>
                    <p className="text-gray-600">
                      Status:
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                          selectedStudent.blocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedStudent.blocked ? "Blocked" : "Active"}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Personal Information
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Date of Birth</p>
                        <p>
                          {new Date(
                            selectedStudent.dateOfBirth
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">CNIC</p>
                        <p>{selectedStudent.cnic || "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contact Number</p>
                        <p>{selectedStudent.contactNumber || "—"}</p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-gray-500">Address</p>
                      <p>{selectedStudent.address || "—"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Academic Information
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Class</p>
                        <p>
                          {typeof selectedStudent.class === "object"
                            ? selectedStudent.class?.name
                            : selectedStudent.class}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Branch</p>
                        <p>{getBranchName(selectedStudent.branch_id)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Merit Points</p>
                        <p className="text-green-600 font-medium">
                          {selectedStudent.meritPoints || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Demerits</p>
                        <p className="text-red-600 font-medium">
                          {selectedStudent.demerits || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Contact Information
                    </h5>
                    <div className="text-sm">
                      <p className="text-gray-500">Email</p>
                      <p>{selectedStudent.email}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Parent Information
                    </h5>
                    {selectedStudent.parent ? (
                      <div className="text-sm">
                        <p>Parent already assigned</p>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p className="text-amber-600 text-sm">
                          No parent assigned
                        </p>
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            setShowAssignParentModal(true);
                          }}
                          className="ml-2 text-blue-600 text-sm hover:text-blue-800"
                        >
                          Assign Parent
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedStudent(student);
                      setNewStudent({
                        name: selectedStudent.name,
                        email: selectedStudent.email,
                        rollNumber: selectedStudent.rollNumber,
                        password: "",
                        dateOfBirth: selectedStudent.dateOfBirth
                          ? new Date(selectedStudent.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                          : "",
                        branch_id: selectedStudent.branch_id,
                        class:
                          selectedStudent.classId ||
                          (typeof selectedStudent.class === "object"
                            ? selectedStudent.class?._id
                            : selectedStudent.class),
                        cnic: selectedStudent.cnic,
                        address: selectedStudent.address,
                        contactNumber: selectedStudent.contactNumber,
                      });
                      setShowEditModal(true);
                    }}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg flex items-center"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedStudent(selectedStudent);
                      setShowResetPasswordModal(true);
                    }}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg flex items-center"
                  >
                    <Lock size={16} className="mr-1" /> Reset Password
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast for Success/Error */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-700 hover:text-red-900"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminStudents;
