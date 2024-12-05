import React, { useState } from "react";
import { Search, Plus, UserPlus } from "lucide-react";

// Dummy data expanded to include more student details
const ALL_STUDENTS = {
  "10-A": [
    {
      id: 1,
      rollNo: "101",
      name: "John Doe",
      class: "10-A",
      meritPoints: 85,
      demerits: 2,
      attendance: "95%",
      rank: 5,
      lastUpdated: "2024-03-15",
    },
    {
      id: 2,
      rollNo: "102",
      name: "Jane Smith",
      class: "10-A",
      meritPoints: 90,
      demerits: 0,
      attendance: "98%",
      rank: 2,
      lastUpdated: "2024-03-15",
    },
    {
      id: 3,
      rollNo: "103",
      name: "Mike Johnson",
      class: "10-A",
      meritPoints: 75,
      demerits: 3,
      attendance: "92%",
      rank: 8,
      lastUpdated: "2024-03-14",
    },
  ],
  "10-B": [
    {
      id: 4,
      rollNo: "201",
      name: "Sarah Williams",
      class: "10-B",
      meritPoints: 88,
      demerits: 1,
      attendance: "96%",
      rank: 3,
      lastUpdated: "2024-03-15",
    },
    {
      id: 5,
      rollNo: "202",
      name: "Tom Brown",
      class: "10-B",
      meritPoints: 92,
      demerits: 0,
      attendance: "99%",
      rank: 1,
      lastUpdated: "2024-03-15",
    },
  ],
  "9-A": [
    {
      id: 6,
      rollNo: "301",
      name: "Emily Davis",
      class: "9-A",
      meritPoints: 82,
      demerits: 2,
      attendance: "94%",
      rank: 4,
      lastUpdated: "2024-03-14",
    },
    {
      id: 7,
      rollNo: "302",
      name: "David Wilson",
      class: "9-A",
      meritPoints: 78,
      demerits: 1,
      attendance: "93%",
      rank: 6,
      lastUpdated: "2024-03-14",
    },
  ],
};

const StudentsAdmin = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New student form state
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNo: "",
    class: "",
    email: "",
    phoneNumber: "",
    address: "",
    parentName: "",
    parentPhone: "",
    dateOfBirth: "",
    gender: "",
  });

  // Get all students in a flat array
  const getAllStudents = () => {
    return Object.values(ALL_STUDENTS).flat();
  };

  // Filter students based on class and search query
  const getFilteredStudents = () => {
    let students =
      selectedClass === "all"
        ? getAllStudents()
        : ALL_STUDENTS[selectedClass] || [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      students = students.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.rollNo.toLowerCase().includes(query)
      );
    }

    // Sort students
    return [...students].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕";
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to add the student
    console.log("Adding new student:", newStudent);

    // Reset form and close modal
    setNewStudent({
      name: "",
      rollNo: "",
      class: "",
      email: "",
      phoneNumber: "",
      address: "",
      parentName: "",
      parentPhone: "",
      dateOfBirth: "",
      gender: "",
    });
    setShowAddModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add these new state variables at the top with other useState declarations
  const [showChangeClassModal, setShowChangeClassModal] = useState(false);
  const [studentToUpdate, setStudentToUpdate] = useState(null);

  // Add these new functions before the return statement

  const handleResetPoints = (student) => {
    if (
      confirm(
        "Are you sure you want to reset merit/demerit points for this student?"
      )
    ) {
      // Here you would typically make an API call to reset points
      console.log("Resetting points for student:", student);

      // For demo purposes, updating the state directly
      const updatedStudents = { ...ALL_STUDENTS };
      const studentClass = student.class;
      const studentIndex = updatedStudents[studentClass].findIndex(
        (s) => s.id === student.id
      );

      if (studentIndex !== -1) {
        updatedStudents[studentClass][studentIndex] = {
          ...student,
          meritPoints: 0,
          demerits: 0,
        };
        // Update your state management here
        console.log("Points reset successfully");
      }
    }
  };

  const handleChangeClass = (e) => {
    e.preventDefault();
    if (!studentToUpdate) return;

    // Here you would typically make an API call to update the class
    console.log(
      "Changing class for student:",
      studentToUpdate.name,
      "to:",
      e.target.class.value
    );

    setShowChangeClassModal(false);
    setStudentToUpdate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Student Management Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and monitor all students across classes
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Student
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Filter
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="all">All Classes</option>
                {Object.keys(ALL_STUDENTS).map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Students
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or roll number..."
                  className="input input-bordered w-full pr-10"
                />
                <Search
                  className="absolute right-3 top-3 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("rollNo")}
                  className="cursor-pointer"
                >
                  Roll No {getSortIcon("rollNo")}
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="cursor-pointer"
                >
                  Name {getSortIcon("name")}
                </th>
                <th
                  onClick={() => handleSort("class")}
                  className="cursor-pointer"
                >
                  Class {getSortIcon("class")}
                </th>
                <th
                  onClick={() => handleSort("meritPoints")}
                  className="cursor-pointer"
                >
                  Merit Points {getSortIcon("meritPoints")}
                </th>
                <th
                  onClick={() => handleSort("demerits")}
                  className="cursor-pointer"
                >
                  Demerits {getSortIcon("demerits")}
                </th>
                <th
                  onClick={() => handleSort("rank")}
                  className="cursor-pointer"
                >
                  Rank {getSortIcon("rank")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredStudents().map((student) => (
                <tr key={student.id}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>
                    <span className="badge badge-success">
                      {student.meritPoints}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-error">
                      {student.demerits}
                    </span>
                  </td>
                  <td>{student.rank}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowDetailsModal(true);
                        }}
                        className="btn btn-sm bg-[#800000] text-white hover:bg-[#600000]"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleResetPoints(student)}
                        className="btn btn-sm bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        Reset Points
                      </button>
                      <button
                        onClick={() => {
                          setStudentToUpdate(student);
                          setShowChangeClassModal(true);
                        }}
                        className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Change Class
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showChangeClassModal && studentToUpdate && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                Change Class for {studentToUpdate.name}
              </h3>
              <form onSubmit={handleChangeClass} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">
                      Current Class: {studentToUpdate.class}
                    </span>
                  </label>
                  <label className="label">
                    <span className="label-text">New Class</span>
                  </label>
                  <select
                    name="class"
                    className="select select-bordered w-full"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select New Class
                    </option>
                    {Object.keys(ALL_STUDENTS)
                      .filter(
                        (className) => className !== studentToUpdate.class
                      )
                      .map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowChangeClassModal(false);
                      setStudentToUpdate(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    Change Class
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div>
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newStudent.name}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Roll Number</span>
                    </label>
                    <input
                      type="text"
                      name="rollNo"
                      value={newStudent.rollNo}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Class</span>
                    </label>
                    <select
                      name="class"
                      value={newStudent.class}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select Class</option>
                      {Object.keys(ALL_STUDENTS).map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Date of Birth</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={newStudent.dateOfBirth}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Gender</span>
                    </label>
                    <select
                      name="gender"
                      value={newStudent.gender}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={newStudent.phoneNumber}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <textarea
                      name="address"
                      value={newStudent.address}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full"
                      rows="2"
                      required
                    />
                  </div>

                  {/* Parent Information */}
                  <div>
                    <label className="label">
                      <span className="label-text">Parent/Guardian Name</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={newStudent.parentName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Parent/Guardian Phone</span>
                    </label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={newStudent.parentPhone}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Student Details Modal */}
        {showDetailsModal && selectedStudent && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-xl mb-4">Student Details</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <p>{selectedStudent.name}</p>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Roll Number</span>
                    </label>
                    <p>{selectedStudent.rollNo}</p>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Class</span>
                    </label>
                    <p>{selectedStudent.class}</p>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Merit Points</span>
                    </label>
                    <p>{selectedStudent.meritPoints}</p>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Demerits</span>
                    </label>
                    <p>{selectedStudent.demerits}</p>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Attendance</span>
                    </label>
                    <p>{selectedStudent.attendance}</p>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Rank</span>
                    </label>
                    <p>{selectedStudent.rank}</p>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Last Updated</span>
                    </label>
                    <p>{selectedStudent.lastUpdated}</p>
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default StudentsAdmin;
