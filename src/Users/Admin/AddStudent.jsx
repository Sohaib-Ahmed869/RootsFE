// import React, { useEffect, useState } from "react";
// import { Search, Plus, UserPlus } from "lucide-react";
// import { AuthService } from "../../../services/authService";
// import { BranchService } from "../../../services/branchService";

// // Dummy data expanded to include more student details
// const ALL_STUDENTS = {
//   "10-A": [
//     {
//       id: 1,
//       rollNo: "101",
//       name: "John Doe",
//       class: "10-A",
//       meritPoints: 85,
//       demerits: 2,
//       attendance: "95%",
//       rank: 5,
//       lastUpdated: "2024-03-15",
//     },
//     {
//       id: 2,
//       rollNo: "102",
//       name: "Jane Smith",
//       class: "10-A",
//       meritPoints: 90,
//       demerits: 0,
//       attendance: "98%",
//       rank: 2,
//       lastUpdated: "2024-03-15",
//     },
//     {
//       id: 3,
//       rollNo: "103",
//       name: "Mike Johnson",
//       class: "10-A",
//       meritPoints: 75,
//       demerits: 3,
//       attendance: "92%",
//       rank: 8,
//       lastUpdated: "2024-03-14",
//     },
//   ],
//   "10-B": [
//     {
//       id: 4,
//       rollNo: "201",
//       name: "Sarah Williams",
//       class: "10-B",
//       meritPoints: 88,
//       demerits: 1,
//       attendance: "96%",
//       rank: 3,
//       lastUpdated: "2024-03-15",
//     },
//     {
//       id: 5,
//       rollNo: "202",
//       name: "Tom Brown",
//       class: "10-B",
//       meritPoints: 92,
//       demerits: 0,
//       attendance: "99%",
//       rank: 1,
//       lastUpdated: "2024-03-15",
//     },
//   ],
//   "9-A": [
//     {
//       id: 6,
//       rollNo: "301",
//       name: "Emily Davis",
//       class: "9-A",
//       meritPoints: 82,
//       demerits: 2,
//       attendance: "94%",
//       rank: 4,
//       lastUpdated: "2024-03-14",
//     },
//     {
//       id: 7,
//       rollNo: "302",
//       name: "David Wilson",
//       class: "9-A",
//       meritPoints: 78,
//       demerits: 1,
//       attendance: "93%",
//       rank: 6,
//       lastUpdated: "2024-03-14",
//     },
//   ],
// };

// const StudentsAdmin = () => {
//   const [selectedClass, setSelectedClass] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "name",
//     direction: "asc",
//   });
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [data, setData] = useState([]);
//   const [branchId, setBranchId] = useState(null);

//   // New student form state
//   const [newStudent, setNewStudent] = useState({
//     name: "",
//     rollNo: "",
//     class: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//     parentName: "",
//     parentPhone: "",
//     dateOfBirth: "",
//     gender: "",
//   });

//   // Get all students in a flat array
//   const getAllStudents = () => {
//     return Object.values(data).flat();
//   };
//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await AuthService.getStudents();
//       setData(response.data);
//       AuthService.getAdminBranch().then((response) => {
//         setBranchId(response.data._id);
//       });
//     };
//     fetchData();
//   }, []);

//   // Filter students based on class and search query
//   const getFilteredStudents = () => {
//     let students =
//       selectedClass === "all" ? getAllStudents() : data[selectedClass] || [];

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       students = students.filter(
//         (student) =>
//           student.name.toLowerCase().includes(query) ||
//           student.rollNo.toLowerCase().includes(query)
//       );
//     }

//     // Sort students
//     return [...students].sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "asc" ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "asc" ? 1 : -1;
//       }
//       return 0;
//     });
//   };

//   const handleSort = (key) => {
//     setSortConfig({
//       key,
//       direction:
//         sortConfig.key === key && sortConfig.direction === "asc"
//           ? "desc"
//           : "asc",
//     });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key === key) {
//       return sortConfig.direction === "asc" ? "↑" : "↓";
//     }
//     return "↕";
//   };

//   const handleAddStudent = (e) => {
//     e.preventDefault();

//     AuthService.registerStudent(
//       newStudent.name,
//       newStudent.email,
//       "default",
//       newStudent.rollNo,
//       newStudent.dateOfBirth,
//       newStudent.class,
//       branchId,
//       newStudent.cnic,
//       newStudent.address,
//       newStudent.phoneNumber,
//       0,
//       newStudent.class
//     )
//       .then((response) => {
//         console.log(response);
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     // Here you would typically make an API call to add the student

//     // Reset form and close modal
//     setNewStudent({
//       name: "",
//       rollNo: "",
//       class: "",
//       email: "",
//       phoneNumber: "",
//       address: "",
//       parentName: "",
//       parentPhone: "",
//       dateOfBirth: "",
//       gender: "",
//     });
//     setShowAddModal(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewStudent((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Add these new state variables at the top with other useState declarations
//   const [showChangeClassModal, setShowChangeClassModal] = useState(false);
//   const [studentToUpdate, setStudentToUpdate] = useState(null);

//   // Add these new functions before the return statement

//   const handleResetPoints = (student) => {
//     if (
//       confirm(
//         "Are you sure you want to reset merit/demerit points for this student?"
//       )
//     ) {
//       // Here you would typically make an API call to reset points
//       console.log("Resetting points for student:", student);

//       // For demo purposes, updating the state directly
//       const updatedStudents = { ...data };
//       const studentClass = student.class;
//       const studentIndex = updatedStudents[studentClass].findIndex(
//         (s) => s.id === student.id
//       );

//       if (studentIndex !== -1) {
//         updatedStudents[studentClass][studentIndex] = {
//           ...student,
//           meritPoints: 0,
//           demerits: 0,
//         };
//         // Update your state management here
//         console.log("Points reset successfully");
//       }
//     }
//   };

//   const handleChangeClass = (e) => {
//     e.preventDefault();
//     if (!studentToUpdate) return;

//     // Here you would typically make an API call to update the class
//     console.log(
//       "Changing class for student:",
//       studentToUpdate.id,
//       "to:",
//       e.target.class.value
//     );
//     BranchService.changeStudentClass(studentToUpdate.id, e.target.class.value)
//       .then((response) => {
//         console.log(response);
//         alert("Class changed successfully");
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     setShowChangeClassModal(false);
//     setStudentToUpdate(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">
//               Student Management Dashboard
//             </h1>
//             <p className="text-gray-600">
//               Manage and monitor all students across classes
//             </p>
//           </div>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
//           >
//             <UserPlus className="w-4 h-4 mr-2" />
//             Add New Student
//           </button>
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="flex flex-col md:flex-row gap-4 items-end">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Class Filter
//               </label>
//               <select
//                 value={selectedClass}
//                 onChange={(e) => setSelectedClass(e.target.value)}
//                 className="select select-bordered w-full max-w-xs"
//               >
//                 <option value="all">All Classes</option>
//                 {Object.keys(data).map((className) => (
//                   <option key={className} value={className}>
//                     {className}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Search Students
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search by name or roll number..."
//                   className="input input-bordered w-full pr-10"
//                 />
//                 <Search
//                   className="absolute right-3 top-3 text-gray-400"
//                   size={20}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Students Table */}
//         <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
//           <table className="table w-full">
//             <thead>
//               <tr>
//                 <th
//                   onClick={() => handleSort("rollNo")}
//                   className="cursor-pointer"
//                 >
//                   Roll No {getSortIcon("rollNo")}
//                 </th>
//                 <th
//                   onClick={() => handleSort("name")}
//                   className="cursor-pointer"
//                 >
//                   Name {getSortIcon("name")}
//                 </th>
//                 <th
//                   onClick={() => handleSort("class")}
//                   className="cursor-pointer"
//                 >
//                   Class {getSortIcon("class")}
//                 </th>
//                 <th
//                   onClick={() => handleSort("meritPoints")}
//                   className="cursor-pointer"
//                 >
//                   Merit Points {getSortIcon("meritPoints")}
//                 </th>
//                 <th
//                   onClick={() => handleSort("demerits")}
//                   className="cursor-pointer"
//                 >
//                   Demerits {getSortIcon("demerits")}
//                 </th>

//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getFilteredStudents().map((student) => (
//                 <tr key={student.id}>
//                   <td>{student.rollNo}</td>
//                   <td>{student.name}</td>
//                   <td>{student.class}</td>
// <td>
//   <span className="badge badge-success">
//     {student.meritPoints}
//   </span>
// </td>
// <td>
//   <span className="badge badge-error">
//     {student.demerits}
//   </span>
// </td>

//                   <td>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           setSelectedStudent(student);
//                           setShowDetailsModal(true);
//                         }}
//                         className="btn btn-sm bg-[#800000] text-white hover:bg-[#600000]"
//                       >
//                         View Details
//                       </button>

//                       <button
//                         onClick={() => {
//                           setStudentToUpdate(student);
//                           setShowChangeClassModal(true);
//                         }}
//                         className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                       >
//                         Change Class
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {showChangeClassModal && studentToUpdate && (
//           <dialog open className="modal">
//             <div className="modal-box">
//               <h3 className="font-bold text-lg mb-4">
//                 Change Class for {studentToUpdate.name}
//               </h3>
//               <form onSubmit={handleChangeClass} className="space-y-4">
//                 <div>
//                   <label className="label">
//                     <span className="label-text">
//                       Current Class: {studentToUpdate.class}
//                     </span>
//                   </label>
//                   <label className="label">
//                     <span className="label-text">New Class</span>
//                   </label>
//                   <select
//                     name="class"
//                     className="select select-bordered w-full"
//                     required
//                     defaultValue=""
//                   >
//                     <option value="" disabled>
//                       Select New Class
//                     </option>
//                     {Object.keys(data)
//                       .filter(
//                         (className) => className !== studentToUpdate.class
//                       )
//                       .map((className) => (
//                         <option key={className} value={className}>
//                           {className}
//                         </option>
//                       ))}
//                   </select>
//                 </div>

//                 <div className="modal-action">
//                   <button
//                     type="button"
//                     className="btn btn-ghost"
//                     onClick={() => {
//                       setShowChangeClassModal(false);
//                       setStudentToUpdate(null);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
//                   >
//                     Change Class
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </dialog>
//         )}

//         {/* Add Student Modal */}
//         {showAddModal && (
//           <dialog open className="modal">
//             <div className="modal-box w-11/12 max-w-3xl">
//               <h3 className="font-bold text-lg mb-4">Add New Student</h3>
//               <form onSubmit={handleAddStudent} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Personal Information */}
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Full Name</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={newStudent.name}
//                       onChange={handleInputChange}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Roll Number</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="rollNo"
//                       value={newStudent.rollNo}
//                       onChange={handleInputChange}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Class</span>
//                     </label>
//                     <select
//                       name="class"
//                       value={newStudent.class}
//                       onChange={handleInputChange}
//                       className="select select-bordered w-full"
//                       required
//                     >
//                       <option value="">Select Class</option>
//                       {Object.keys(data).map((className) => (
//                         <option key={className} value={className}>
//                           {className}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Date of Birth</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="dateOfBirth"
//                       value={newStudent.dateOfBirth}
//                       onChange={handleInputChange}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">CNIC</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="cnic"
//                       value={newStudent.cnic}
//                       onChange={handleInputChange}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Email</span>
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={newStudent.email}
//                       onChange={handleInputChange}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Phone Number</span>
//                     </label>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={newStudent.phoneNumber}
//                       onChange={handleInputChange}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="label">
//                       <span className="label-text">Address</span>
//                     </label>
//                     <textarea
//                       name="address"
//                       value={newStudent.address}
//                       onChange={handleInputChange}
//                       className="textarea textarea-bordered w-full"
//                       rows="2"
//                       required
//                     />
//                   </div>

//                   {/* Parent Information */}
//                 </div>

//                 <div className="modal-action">
//                   <button
//                     type="button"
//                     className="btn btn-ghost"
//                     onClick={() => setShowAddModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
//                   >
//                     Add Student
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </dialog>
//         )}

//         {/* Student Details Modal */}
//         {showDetailsModal && selectedStudent && (
//           <dialog open className="modal">
//             <div className="modal-box">
//               <h3 className="font-bold text-xl mb-4">Student Details</h3>

//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Full Name</span>
//                     </label>
//                     <p>{selectedStudent.name}</p>
//                   </div>
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Roll Number</span>
//                     </label>
//                     <p>{selectedStudent.rollNo}</p>
//                   </div>
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Class</span>
//                     </label>
//                     <p>{selectedStudent.class}</p>
//                   </div>
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Merit Points</span>
//                     </label>
//                     <p>{selectedStudent.meritPoints}</p>
//                   </div>
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Demerits</span>
//                     </label>
//                     <p>{selectedStudent.demerits}</p>
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Rank</span>
//                     </label>
//                     <p>{selectedStudent.rank}</p>
//                   </div>
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Last Updated</span>
//                     </label>
//                     <p>{selectedStudent.lastUpdated}</p>
//                   </div>
//                 </div>

//                 <div className="modal-action">
//                   <button
//                     className="btn btn-ghost"
//                     onClick={() => setShowDetailsModal(false)}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </dialog>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentsAdmin;

import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  UserPlus,
  Edit,
  Trash2,
  Ban,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Loader,
  AlertCircle
} from 'lucide-react'
import { AuthService } from '../../../services/authService'
import { BranchService } from '../../../services/branchService'

const StudentsAdmin = () => {
  const [selectedClass, setSelectedClass] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  })
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showChangeClassModal, setShowChangeClassModal] = useState(false)
  const [studentToUpdate, setStudentToUpdate] = useState(null)
  const [data, setData] = useState([])
  const [branchId, setBranchId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allStudents, setAllStudents] = useState([])

  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNumber: '',
    class: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [studentsResponse, branchResponse] = await Promise.all([
          AuthService.getStudents(),
          AuthService.getAdminBranch()
        ])
        setData(studentsResponse.data)
        setBranchId(branchResponse.data._id)
        setError(null)
      } catch (err) {
        setError('Failed to fetch data. Please try again later.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getAllStudents = () => {
    return Array.isArray(data) ? data : Object.values(data).flat()
  }

  const getFilteredStudents = () => {
    let students =
      selectedClass === 'all' ? getAllStudents() : data[selectedClass] || []

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      students = students.filter(
        student =>
          student.name?.toLowerCase().includes(query) ||
          student.rollNumber?.toLowerCase().includes(query)
      )
    }

    return [...students].sort((a, b) => {
      const aValue = a[sortConfig.key] || ''
      const bValue = b[sortConfig.key] || ''

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const handleSort = key => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
    })
  }

  const getSortIcon = key => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓'
    }
    return '↕'
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditClick = student => {
    console.log('Edit student:', student)
    setSelectedStudent(student)
    setNewStudent({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      phoneNumber: student.contactNumber,
      address: student.address,
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split('T')[0]
        : '',
      cnic: student.cnic
    })
    setIsEditing(true)
    setShowAddModal(true)
  }

  const handleDeleteClick = student => {
    setSelectedStudent(student)
    setShowDeleteModal(true)
  }

  const handleBlockClick = student => {
    setSelectedStudent(student)
    setShowBlockModal(true)
  }

  const handleDelete = async () => {
    try {
      await AuthService.deleteUser('student', selectedStudent.id)
      const response = await AuthService.getStudents()
      setData(response.data)
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student. Please try again.')
    }
  }

  const handleBlock = async () => {
    try {
      if (selectedStudent.blocked) {
        await AuthService.updateUser('student', selectedStudent.id, {
          blocked: false
        })
      } else {
        await AuthService.updateUser('student', selectedStudent.id, {
          blocked: true
        })
      }
      const response = await AuthService.getStudents()
      setData(response.data)
      setShowBlockModal(false)
    } catch (error) {
      console.error('Error blocking/unblocking student:', error)
      alert('Failed to update student status. Please try again.')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      if (isEditing) {
        await AuthService.updateUser('student', selectedStudent.id, {
          ...newStudent,
          rollNumber: newStudent.rollNumber,
          contactNumber: newStudent.phoneNumber
        })
      } else {
        await AuthService.registerStudent(
          newStudent.name,
          newStudent.email,
          newStudent.password || 'default',
          newStudent.rollNumber,
          newStudent.dateOfBirth,
          newStudent.class,
          branchId,
          newStudent.cnic,
          newStudent.address,
          newStudent.phoneNumber,
          0,
          newStudent.class
        )
      }

      const response = await AuthService.getStudents()
      setData(response.data)
      handleCloseModal()
    } catch (error) {
      console.error('Error saving student:', error)
      alert('Failed to save student. Please try again.')
    }
  }

  const handleChangeClass = async e => {
    e.preventDefault()
    if (!studentToUpdate) return

    try {
      await BranchService.changeStudentClass(
        studentToUpdate.id,
        e.target.class.value
      )
      const response = await AuthService.getStudents()
      setData(response.data)
      setShowChangeClassModal(false)
      setStudentToUpdate(null)
      alert('Class changed successfully')
    } catch (error) {
      console.error('Error changing class:', error)
      alert('Failed to change class. Please try again.')
    }
  }

  const handleCloseModal = () => {
    setNewStudent({
      name: '',
      email: '',
      password: '',
      rollNumber: '',
      class: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: '',
      cnic: ''
    })
    setShowAddModal(false)
    setIsEditing(false)
    setSelectedStudent(null)
    setShowPassword(false)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader className='w-6 h-6 animate-spin' />
          <span>Loading students...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 p-6 flex items-center justify-center'>
        <div className='text-red-500 flex items-center gap-2'>
          <AlertCircle className='w-6 h-6' />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8 flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800 mb-2'>
              Student Management Dashboard
            </h1>
            <p className='text-gray-600'>
              Manage and monitor all students across classes
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className='btn btn-primary bg-[#800000] hover:bg-[#600000] text-white'
          >
            <UserPlus className='w-4 h-4 mr-2' />
            Add New Student
          </button>
        </div>

        {/* Filters and Search */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex flex-col md:flex-row gap-4 items-end'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Class Filter
              </label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className='select select-bordered w-full max-w-xs'
              >
                <option value='all'>All Classes</option>
                {Object.keys(data).map(className => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Search Students
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Search by name or roll number...'
                  className='input input-bordered w-full pr-10'
                />
                <Search
                  className='absolute right-3 top-3 text-gray-400'
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className='bg-white rounded-lg shadow-md p-6 overflow-x-auto'>
          <table className='table w-full'>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort('rollNumber')}
                  className='cursor-pointer'
                >
                  Roll No {getSortIcon('rollNumber')}
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className='cursor-pointer'
                >
                  Name {getSortIcon('name')}
                </th>
                <th
                  onClick={() => handleSort('class')}
                  className='cursor-pointer'
                >
                  Class {getSortIcon('class')}
                </th>
                <th
                  onClick={() => handleSort('curr_merit_points')}
                  className='cursor-pointer'
                >
                  Merit Points {getSortIcon('curr_merit_points')}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredStudents().map(student => (
                <tr key={student.id}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>
                    <span className='badge badge-success'>
                      {student.meritPoints}
                    </span>
                  </td>
                  <td>
                    <span className='badge badge-error'>
                      {student.demerits}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        student.blocked ? 'badge-error' : 'badge-success'
                      }`}
                    >
                      {student.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEditClick(student)}
                        className='btn btn-sm btn-ghost'
                      >
                        <Edit className='w-4 h-4 text-blue-500' />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(student)}
                        className='btn btn-sm btn-ghost'
                      >
                        <Trash2 className='w-4 h-4 text-red-500' />
                      </button>
                      <button
                        onClick={() => handleBlockClick(student)}
                        className='btn btn-sm btn-ghost'
                      >
                        <Ban
                          className={`w-4 h-4 ${
                            student.blocked
                              ? 'text-green-500'
                              : 'text-orange-500'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setStudentToUpdate(student)
                          setShowChangeClassModal(true)
                        }}
                        className='btn btn-sm bg-blue-600 text-white hover:bg-blue-700'
                      >
                        Change Class
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student)
                          setShowDetailsModal(true)
                        }}
                        className='btn btn-sm bg-[#800000] text-white hover:bg-[#600000]'
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Student Modal */}
        {showAddModal && (
          <dialog open className='modal'>
            <div className='modal-box w-11/12 max-w-3xl'>
              <h3 className='font-bold text-lg mb-4'>
                {isEditing ? 'Edit Student' : 'Add New Student'}
              </h3>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={newStudent.name}
                      onChange={handleInputChange}
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>Roll Number</span>
                    </label>
                    <input
                      type='text'
                      name='rollNumber'
                      value={newStudent.rollNumber}
                      onChange={handleInputChange}
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={newStudent.email}
                      onChange={handleInputChange}
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  {!isEditing && (
                    <div>
                      <div>
                        <label className='label'>
                          <span className='label-text'>Class</span>
                        </label>
                        <select
                          name='class'
                          value={newStudent.class}
                          onChange={handleInputChange}
                          className='select select-bordered w-full'
                          required
                        >
                          <option value=''>Select Class</option>
                          {Object.keys(data).map(className => (
                            <option key={className} value={className}>
                              {className}
                            </option>
                          ))}
                        </select>
                      </div>
                      <label className='label'>
                        <span className='label-text'>Password</span>
                      </label>
                      <div className='relative'>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name='password'
                          value={newStudent.password}
                          onChange={handleInputChange}
                          className='input input-bordered w-full pr-10'
                          placeholder={
                            isEditing
                              ? 'Leave blank to keep current'
                              : 'Required for new student'
                          }
                          required={!isEditing}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-3 top-3 text-gray-400'
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className='label'>
                      <span className='label-text'>Date of Birth</span>
                    </label>
                    <input
                      type='date'
                      name='dateOfBirth'
                      value={newStudent.dateOfBirth}
                      onChange={handleInputChange}
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>Phone Number</span>
                    </label>
                    <input
                      type='tel'
                      name='phoneNumber'
                      value={newStudent.phoneNumber}
                      onChange={handleInputChange}
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='label'>
                      <span className='label-text'>Address</span>
                    </label>
                    <textarea
                      name='address'
                      value={newStudent.address}
                      onChange={handleInputChange}
                      className='textarea textarea-bordered w-full'
                      rows='3'
                      required
                    />
                  </div>
                </div>

                <div className='modal-action'>
                  <button
                    type='button'
                    className='btn btn-ghost'
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary bg-[#800000] hover:bg-[#600000] text-white'
                  >
                    {isEditing ? 'Save Changes' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <dialog open className='modal'>
            <div className='modal-box'>
              <h3 className='font-bold text-lg'>Confirm Delete</h3>
              <p className='py-4'>
                Are you sure you want to delete student {selectedStudent?.name}?
                This action cannot be undone.
              </p>
              <div className='modal-action'>
                <button
                  className='btn btn-ghost'
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className='btn btn-error' onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* Block/Unblock Confirmation Modal */}
        {showBlockModal && (
          <dialog open className='modal'>
            <div className='modal-box'>
              <h3 className='font-bold text-lg'>
                Confirm {selectedStudent?.blocked ? 'Unblock' : 'Block'}
              </h3>
              <p className='py-4'>
                Are you sure you want to{' '}
                {selectedStudent?.blocked ? 'unblock' : 'block'} student{' '}
                {selectedStudent?.name}?
              </p>
              <div className='modal-action'>
                <button
                  className='btn btn-ghost'
                  onClick={() => setShowBlockModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`btn ${
                    selectedStudent?.blocked ? 'btn-success' : 'btn-warning'
                  }`}
                  onClick={handleBlock}
                >
                  {selectedStudent?.blocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* Change Class Modal */}
        {showChangeClassModal && studentToUpdate && (
          <dialog open className='modal'>
            <div className='modal-box'>
              <h3 className='font-bold text-lg mb-4'>
                Change Class for {studentToUpdate.name}
              </h3>
              <form onSubmit={handleChangeClass} className='space-y-4'>
                <div>
                  <label className='label'>
                    <span className='label-text'>
                      Current Class: {studentToUpdate.class}
                    </span>
                  </label>
                  <label className='label'>
                    <span className='label-text'>New Class</span>
                  </label>
                  <select
                    name='class'
                    className='select select-bordered w-full'
                    required
                    defaultValue=''
                  >
                    <option value='' disabled>
                      Select New Class
                    </option>
                    {Object.keys(data)
                      .filter(className => className !== studentToUpdate.class)
                      .map(className => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                  </select>
                </div>

                <div className='modal-action'>
                  <button
                    type='button'
                    className='btn btn-ghost'
                    onClick={() => {
                      setShowChangeClassModal(false)
                      setStudentToUpdate(null)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary bg-[#800000] hover:bg-[#600000] text-white'
                  >
                    Change Class
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Student Details Modal */}
        {showDetailsModal && selectedStudent && (
          <dialog open className='modal'>
            <div className='modal-box'>
              <h3 className='font-bold text-xl mb-4'>Student Details</h3>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <p>{selectedStudent.name}</p>
                  </div>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Roll Number</span>
                    </label>
                    <p>{selectedStudent.rollNumber}</p>
                  </div>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Class</span>
                    </label>
                    <p>{selectedStudent.class}</p>
                  </div>
                  <div>
                    <label className='label'>
                      
                      <span className='label-text'>Merit Points</span>
                    </label>
                    <p>{selectedStudent.meritPoints}</p>
                  </div>
                  <div>
                    
                    <label className='label'>
                      <span className='label-text'>Demerits</span>
                    </label>
                    <p>{selectedStudent.demerits}</p>
                  </div>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <p>{selectedStudent.email}</p>
                  </div>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Contact Number</span>
                    </label>
                    <p>{selectedStudent.contactNumber}</p>
                  </div>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Status</span>
                    </label>
                    <p>
                      <span
                        className={`badge ${
                          selectedStudent.blocked
                            ? 'badge-error'
                            : 'badge-success'
                        }`}
                      >
                        {selectedStudent.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className='modal-action'>
                  <button
                    className='btn btn-ghost'
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
  )
}

export default StudentsAdmin
