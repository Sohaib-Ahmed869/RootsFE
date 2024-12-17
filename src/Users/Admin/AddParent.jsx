// import React, { useState, useEffect } from "react";
// import { Search, UserPlus, Plus, Trash2, Edit2, Loader, AlertCircle } from "lucide-react";
// import { AuthService } from "../../../services/authService";

// const RELATIONS = ["Father", "Mother", "Guardian", "Step Parent", "Other"];

// const ParentManagement = () => {
//   const [parents, setParents] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showRelationshipModal, setShowRelationshipModal] = useState(false);
//   const [selectedParent, setSelectedParent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [newParent, setNewParent] = useState({
//     name: "",
//     email: "",
//     password: "", // Added for registration
//     cnic: "", // Added as required by API
//     student_id: "", // Added as required by API
//     address: "",
//     contactNumber: "",
//     relation: ""
//   });

//   // Fetch parents and students on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [parentsResponse, studentsResponse] = await Promise.all([
//         AuthService.getAllUsers('parent'),
//         AuthService.getAllUsers('student')
//       ]);

//       setParents(parentsResponse.data);
//       setStudents(studentsResponse.data);
//     } catch (err) {
//       setError('Failed to fetch data. Please try again later.');
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await AuthService.registerParent(
//         newParent.name,
//         newParent.email,
//         newParent.password,
//         newParent.student_id,
//         newParent.cnic,
//         newParent.address,
//         newParent.contactNumber,
//       );

//       // Refresh the parents list
//       await fetchData();

//       // Reset form and close modal
//       setNewParent({
//         name: "",
//         email: "",
//         password: "",
//         cnic: "",
//         student_id: "",
//         address: "",
//         contactNumber: "",
//         relation: ""
//       });
//       setShowAddModal(false);
//     } catch (error) {
//       console.error('Error creating parent:', error);
//       alert('Failed to create parent. Please try again.');
//     }
//   };

//   const handleDelete = async (parentId) => {
//     if (confirm('Are you sure you want to delete this parent?')) {
//       try {
//         await AuthService.deleteUser('parent', parentId);
//         await fetchData();
//       } catch (error) {
//         console.error('Error deleting parent:', error);
//         alert('Failed to delete parent. Please try again.');
//       }
//     }
//   };

//   const getFilteredParents = () => {
//     if (!searchQuery) return parents;

//     const query = searchQuery.toLowerCase();
//     return parents.filter(
//       (parent) =>
//         parent.name.toLowerCase().includes(query) ||
//         parent.email.toLowerCase().includes(query) ||
//         (parent.contactNumber && parent.contactNumber.includes(query))
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//         <div className="flex items-center gap-2">
//           <Loader className="w-6 h-6 animate-spin" />
//           <span>Loading data...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//         <div className="text-red-500 flex items-center gap-2">
//           <AlertCircle className="w-6 h-6" />
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">Parent Management</h1>
//             <p className="text-gray-600">Manage parent accounts</p>
//           </div>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
//           >
//             <UserPlus className="w-4 h-4 mr-2" />
//             Add New Parent
//           </button>
//         </div>

//         {/* Search */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search parents by name, email, or phone..."
//               className="input input-bordered w-full pr-10"
//             />
//             <Search className="absolute right-3 top-3 text-gray-400" size={20} />
//           </div>
//         </div>

//         {/* Parents Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {getFilteredParents().map((parent) => (
//             <div key={parent._id} className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800">{parent.name}</h3>
//                   <p className="text-gray-600">{parent.email}</p>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(parent._id)}
//                   className="btn btn-sm btn-ghost text-red-500"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Contact Information</p>
//                   <p>{parent.contactNumber || 'No phone number provided'}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">CNIC</p>
//                   <p>{parent.cnic}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">Address</p>
//                   <p>{parent.address || 'No address provided'}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">Associated Student</p>
//                   <p>{students && students.find(s => s._id === parent.children[0])?.name || 'No student associated'}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Add Parent Modal */}
//         {showAddModal && (
//           <dialog open className="modal">
//             <div className="modal-box w-11/12 max-w-3xl">
//               <h3 className="font-bold text-lg mb-4">Add New Parent</h3>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Full Name</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={newParent.name}
//                       onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
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
//                       value={newParent.email}
//                       onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Password</span>
//                     </label>
//                     <input
//                       type="password"
//                       value={newParent.password}
//                       onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
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
//                       value={newParent.cnic}
//                       onChange={(e) => setNewParent({ ...newParent, cnic: e.target.value })}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Contact Number</span>
//                     </label>
//                     <input
//                       type="tel"
//                       value={newParent.contactNumber}
//                       onChange={(e) => setNewParent({ ...newParent, contactNumber: e.target.value })}
//                       className="input input-bordered w-full"
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Select Student</span>
//                     </label>
//                     <select
//                       value={newParent.student_id}
//                       onChange={(e) => setNewParent({ ...newParent, student_id: e.target.value })}
//                       className="select select-bordered w-full"
//                       required
//                     >
//                       <option value="">Select Student</option>
//                       {students.map((student) => (
//                         <option key={student._id} value={student._id}>
//                           {student.name} - {student.rollNumber}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="label">
//                       <span className="label-text">Address</span>
//                     </label>
//                     <textarea
//                       value={newParent.address}
//                       onChange={(e) => setNewParent({ ...newParent, address: e.target.value })}
//                       className="textarea textarea-bordered w-full"
//                       rows="3"
//                     />
//                   </div>
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
//                     Add Parent
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </dialog>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ParentManagement;

// import React, { useState, useEffect } from "react";
// import { Search, UserPlus, Plus, Trash2, Edit2, Loader, AlertCircle, UserCog } from "lucide-react";
// import { AuthService } from "../../../services/authService";
// import ParentService from "../../../services/parentService";

// const RELATIONS = ["Father", "Mother", "Guardian", "Step Parent", "Other"];

// const ParentManagement = () => {
//   const [parents, setParents] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [unassignedStudents, setUnassignedStudents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedParent, setSelectedParent] = useState(null);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [activeTab, setActiveTab] = useState("manage");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [newParent, setNewParent] = useState({
//     name: "",
//     email: "",
//     password: "",
//     cnic: "",
//     student_id: "",
//     address: "",
//     contactNumber: "",
//     relation: ""
//   });

//   const [editParent, setEditParent] = useState({
//     name: "",
//     email: "",
//     cnic: "",
//     address: "",
//     contactNumber: "",
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const [parentsResponse, studentsResponse] = await Promise.all([
//         AuthService.getAllUsers('parent'),
//         AuthService.getAllUsers('student')
//       ]);
//       setParents(parentsResponse.data);
//       setStudents(studentsResponse.data);
//       // Logic to determine unassigned students would go here
//       setUnassignedStudents(studentsResponse.data);
//     } catch (err) {
//       setError('Failed to fetch data. Please try again later.');
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//     const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await AuthService.registerParent(
//         newParent.name,
//         newParent.email,
//         newParent.password,
//         newParent.student_id,
//         newParent.cnic,
//         newParent.address,
//         newParent.contactNumber,
//       );

//       // Refresh the parents list
//       await fetchData();

//       // Reset form and close modal
//       setNewParent({
//         name: "",
//         email: "",
//         password: "",
//         cnic: "",
//         student_id: "",
//         address: "",
//         contactNumber: "",
//         relation: ""
//       });
//       setShowAddModal(false);
//     } catch (error) {
//       console.error('Error creating parent:', error);
//       alert('Failed to create parent. Please try again.');
//     }
//   };

//   const handleDelete = async (parentId) => {
//     if (confirm('Are you sure you want to delete this parent?')) {
//       try {
//         await AuthService.deleteUser('parent', parentId);
//         await fetchData();
//       } catch (error) {
//         console.error('Error deleting parent:', error);
//         alert('Failed to delete parent. Please try again.');
//       }
//     }
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     console.log(selectedStudents)
//     // Implementation will go here
//   };

//   const handleAssignStudents = async (e) => {
//     e.preventDefault();
//     console.log(selectedStudents)
//     ParentService.AddChildren(selectedParent._id,selectedStudents)
//     // Implementation will go here
//   };

//   const openEditModal = (parent) => {
//     setEditParent({
//       id: parent._id,
//       name: parent.name,
//       email: parent.email,
//       cnic: parent.cnic,
//       address: parent.address,
//       contactNumber: parent.contactNumber,
//     });
//     setShowEditModal(true);
//   };

//   const openAssignModal = (parent) => {
//     setSelectedParent(parent);
//     setSelectedStudents([]);
//     setShowAssignModal(true);
//   };

//   const getFilteredParents = () => {
//     if (!searchQuery) return parents;
//     const query = searchQuery.toLowerCase();
//     return parents.filter(
//       (parent) =>
//         parent.name.toLowerCase().includes(query) ||
//         parent.email.toLowerCase().includes(query) ||
//         (parent.contactNumber && parent.contactNumber.includes(query))
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//         <div className="flex items-center gap-2">
//           <Loader className="w-6 h-6 animate-spin" />
//           <span>Loading data...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//         <div className="text-red-500 flex items-center gap-2">
//           <AlertCircle className="w-6 h-6" />
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">Parent Management</h1>
//             <p className="text-gray-600">Manage parent accounts and student assignments</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setActiveTab("manage")}
//               className={`btn ${activeTab === "manage" ? "btn-primary bg-[#800000]" : "btn-ghost"}`}
//             >
//               Manage Parents
//             </button>
//             <button
//               onClick={() => setActiveTab("assign")}
//               className={`btn ${activeTab === "assign" ? "btn-primary bg-[#800000]" : "btn-ghost"}`}
//             >
//               Assign Students
//             </button>
//           </div>
//         </div>

//         {activeTab === "manage" && (
//           <>
//             <div className="flex justify-between mb-6">
//               <div className="relative flex-1 max-w-xl">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search parents by name, email, or phone..."
//                   className="input input-bordered w-full pr-10"
//                 />
//                 <Search className="absolute right-3 top-3 text-gray-400" size={20} />
//               </div>
//               <button
//                 onClick={() => setShowAddModal(true)}
//                 className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white ml-4"
//               >
//                 <UserPlus className="w-4 h-4 mr-2" />
//                 Add New Parent
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {getFilteredParents().map((parent) => (
//                 <div key={parent._id} className="bg-white rounded-lg shadow-md p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">{parent.name}</h3>
//                       <p className="text-gray-600">{parent.email}</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => openEditModal(parent)}
//                         className="btn btn-sm btn-ghost text-blue-500"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => openAssignModal(parent)}
//                         className="btn btn-sm btn-ghost text-green-500"
//                       >
//                         <UserCog className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(parent._id)}
//                         className="btn btn-sm btn-ghost text-red-500"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <div>
//                       <p className="text-sm text-gray-500">Contact Information</p>
//                       <p>{parent.contactNumber || 'No phone number provided'}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">CNIC</p>
//                       <p>{parent.cnic}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Address</p>
//                       <p>{parent.address || 'No address provided'}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Associated Students</p>
//                       <div className="space-y-1">
//                         {parent.children && parent.children.length > 0 ? (
//                           parent.children.map(childId => {
//                             const student = students.find(s => s._id === childId);
//                             return student ? (
//                               <p key={childId}>{student.name} - {student.rollNumber}</p>
//                             ) : null;
//                           })
//                         ) : (
//                           <p className="text-gray-400">No students associated</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* Add Parent Modal */}
//         {showAddModal && (
//           <dialog open className="modal">
//             <div className="modal-box w-11/12 max-w-3xl">
//               <h3 className="font-bold text-lg mb-4">Add New Parent</h3>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Full Name</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={newParent.name}
//                       onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
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
//                       value={newParent.email}
//                       onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Password</span>
//                     </label>
//                     <input
//                       type="password"
//                       value={newParent.password}
//                       onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
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
//                       value={newParent.cnic}
//                       onChange={(e) => setNewParent({ ...newParent, cnic: e.target.value })}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Contact Number</span>
//                     </label>
//                     <input
//                       type="tel"
//                       value={newParent.contactNumber}
//                       onChange={(e) => setNewParent({ ...newParent, contactNumber: e.target.value })}
//                       className="input input-bordered w-full"
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       <span className="label-text">Select Student</span>
//                     </label>
//                     <select
//                       value={newParent.student_id}
//                       onChange={(e) => setNewParent({ ...newParent, student_id: e.target.value })}
//                       className="select select-bordered w-full"
//                       required
//                     >
//                       <option value="">Select Student</option>
//                       {unassignedStudents.map((student) => (
//                         <option key={student._id} value={student._id}>
//                           {student.name} - {student.rollNumber}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="label">
//                       <span className="label-text">Address</span>
//                     </label>
//                     <textarea
//                       value={newParent.address}
//                       onChange={(e) => setNewParent({ ...newParent, address: e.target.value })}
//                       className="textarea textarea-bordered w-full"
//                       rows="3"
//                     />
//                   </div>
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
//                     Add Parent
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </dialog>
//         )}

//         {/* Edit Parent Modal */}
//         {showEditModal && (
//           <dialog open className="modal">
//             <div className="modal-box w-11/12 max-w-3xl">
//               <h3 className="font-bold text-lg mb-4">Edit Parent</h3>
//               <form onSubmit={handleEdit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Full Name</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={editParent.name}
//                       onChange={(e) => setEditParent({ ...editParent, name: e.target.value })}
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
//                       value={editParent.email}
//                       onChange={(e) => setEditParent({ ...editParent, email: e.target.value })}
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
//                       value={editParent.cnic}
//                       onChange={(e) => setEditParent({ ...editParent, cnic: e.target.value })}
//                       className="input input-bordered w-full"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                     <span className="label-text">Contact Number</span>
//                   </label>
//                   <input
//                     type="tel"
//                     value={editParent.contactNumber}
//                     onChange={(e) => setEditParent({ ...editParent, contactNumber: e.target.value })}
//                     className="input input-bordered w-full"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="label">
//                     <span className="label-text">Address</span>
//                   </label>
//                   <textarea
//                     value={editParent.address}
//                     onChange={(e) => setEditParent({ ...editParent, address: e.target.value })}
//                     className="textarea textarea-bordered w-full"
//                     rows="3"
//                   />
//                 </div>
//               </div>

//               <div className="modal-action">
//                 <button
//                   type="button"
//                   className="btn btn-ghost"
//                   onClick={() => setShowEditModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </dialog>
//       )}

//       {/* Assign Students Modal */}
//       {showAssignModal && (
//         <dialog open className="modal">
//           <div className="modal-box w-11/12 max-w-3xl">
//             <h3 className="font-bold text-lg mb-4">
//               Assign Students to {selectedParent?.name}
//             </h3>
//             <form onSubmit={handleAssignStudents} className="space-y-4">
//               <div>
//                 <label className="label">
//                   <span className="label-text">Select Students</span>
//                 </label>
//                 <select
//                   multiple
//                   value={selectedStudents}
//                   onChange={(e) => {
//                     const selected = Array.from(e.target.selectedOptions, option => option.value);
//                     setSelectedStudents(selected);
//                   }}
//                   className="select select-bordered w-full h-48"
//                 >
//                   {unassignedStudents.map((student) => (
//                     <option key={student._id} value={student._id}>
//                       {student.name} - {student.rollNumber}
//                     </option>
//                   ))}
//                 </select>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Hold Ctrl/Cmd to select multiple students
//                 </p>
//               </div>

//               <div className="modal-action">
//                 <button
//                   type="button"
//                   className="btn btn-ghost"
//                   onClick={() => setShowAssignModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
//                 >
//                   Assign Students
//                 </button>
//               </div>
//             </form>
//           </div>
//         </dialog>
//       )}
//     </div>
//   </div>
// );
// };

// export default ParentManagement;
import React, { useState, useEffect } from 'react'
import {
  Search,
  UserPlus,
  Plus,
  Trash2,
  Edit2,
  Loader,
  AlertCircle,
  UserCog
} from 'lucide-react'
import { AuthService } from '../../../services/authService'
import { toast } from 'react-hot-toast'
import ParentService from '../../../services/parentService'

const ParentManagement = () => {
  const [parents, setParents] = useState([])
  const [students, setStudents] = useState([])
  const [unassignedStudents, setUnassignedStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedParent, setSelectedParent] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [activeTab, setActiveTab] = useState('manage')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newParent, setNewParent] = useState({
    name: '',
    email: '',
    password: '',
    cnic: '',
    student_id: '',
    address: '',
    contactNumber: ''
  })

  const [editParent, setEditParent] = useState({
    name: '',
    email: '',
    cnic: '',
    address: '',
    contactNumber: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [parentsResponse, studentsResponse] = await Promise.all([
        AuthService.getAllUsers('parent'),
        AuthService.getAllUsers('student')
      ])
      setParents(parentsResponse.data)
      setStudents(studentsResponse.data)

      // Filter unassigned students
      const unassigned = studentsResponse.data.filter(
        student => !student.parent || student.parent !== selectedParent?._id

      )
      
      setUnassignedStudents(unassigned)
    } catch (err) {
      setError('Failed to fetch data. Please try again later.')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log(newParent)
    try {
      await AuthService.registerParent(
        newParent.name,
        newParent.email,
        newParent.password, 
        newParent.student_id,
        newParent.cnic,
        newParent.address,
        newParent.contactNumber
      )

      await fetchData()
      setShowAddModal(false)
      setNewParent({
        name: '',
        email: '',
        password: '',
        cnic: '',
        student_id: '',
        address: '',
        contactNumber: ''
      })
      toast.success('Parent added successfully')
    } catch (error) {
      console.error('Error creating parent:', error)
      toast.error('Failed to create parent')
    }
  }

  const handleEdit = async e => {
    e.preventDefault()
    try {
      await AuthService.updateUser('parent', editParent.id, {
        name: editParent.name,
        email: editParent.email,
        cnic: editParent.cnic,
        address: editParent.address,
        contactNumber: editParent.contactNumber
      })

      await fetchData()
      setShowEditModal(false)
      toast.success('Parent updated successfully')
    } catch (error) {
      console.error('Error updating parent:', error)
      toast.error('Failed to update parent')
    }
  }

  const handleAssignStudent = async e => {
    e.preventDefault()
    try {
      await ParentService.assignParentToStudent(
        selectedParent._id,
        selectedStudent
      )
      await fetchData()
      setSelectedParent((prevState) => ({
        ...prevState,
        children: [...prevState.children, selectedStudent]
      }))
      setSelectedStudent('')
      toast.success('Student assigned successfully')
    } catch (error) {
      console.error('Error assigning student:', error)
      toast.error('Failed to assign student')
    }
  }

  const handleUnassignStudent = async studentId => {
    try {
      await ParentService.deAssignParentToStudent(selectedParent._id, studentId)
      await fetchData()
      setSelectedParent((prevState) => ({

        ...prevState,
        children: prevState.children.filter(child => child !== studentId)
      }))
      
      toast.success('Student unassigned successfully')
    } catch (error) {
      console.error('Error unassigning student:', error)
      toast.error('Failed to unassign student')
    }
  }

  const handleDelete = async parentId => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      try {
        await AuthService.deleteUser('parent', parentId)
        await fetchData()
        toast.success('Parent deleted successfully')
      } catch (error) {
        console.error('Error deleting parent:', error)
        toast.error('Failed to delete parent')
      }
    }
  }

  const openEditModal = parent => {
    setEditParent({
      id: parent._id,
      name: parent.name,
      email: parent.email,
      cnic: parent.cnic,
      contactNumber: parent.contactNumber
    })
    setShowEditModal(true)
  }

  const openAssignModal = parent => {
    setSelectedParent(parent)
    setSelectedStudent('')
    setShowAssignModal(true)
    setUnassignedStudents(
      students.filter(student => !student.parent || student.parent !== parent._id)
    ) 
  }

  const getFilteredParents = () => {
    if (!searchQuery) return parents
    const query = searchQuery.toLowerCase()
    return parents.filter(
      parent =>
        parent.name.toLowerCase().includes(query) ||
        parent.email.toLowerCase().includes(query) ||
        (parent.contactNumber && parent.contactNumber.includes(query))
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader className='w-6 h-6 animate-spin' />
          <span>Loading data...</span>
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
              Parent Management
            </h1>
            <p className='text-gray-600'>
              Manage parent accounts and student assignments
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className='btn btn-primary bg-[#800000] hover:bg-[#600000] text-white'
          >
            <UserPlus className='w-4 h-4 mr-2' />
            Add New Parent
          </button>
        </div>

        {/* Search */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Search parents by name, email, or phone...'
              className='input input-bordered w-full pr-10'
            />
            <Search
              className='absolute right-3 top-3 text-gray-400'
              size={20}
            />
          </div>
        </div>

        {/* Parents Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {getFilteredParents().map(parent => (
            <div key={parent._id} className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='text-xl font-bold text-gray-800'>
                    {parent.name}
                  </h3>
                  <p className='text-gray-600'>{parent.email}</p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => openEditModal(parent)}
                    className='btn btn-sm btn-ghost text-blue-500'
                  >
                    <Edit2 className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => openAssignModal(parent)}
                    className='btn btn-sm btn-ghost text-green-500'
                  >
                    <UserCog className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(parent._id)}
                    className='btn btn-sm btn-ghost text-red-500'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <p className='text-sm text-gray-500'>Contact Information</p>
                  <p>{parent.contactNumber || 'No phone number provided'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>CNIC</p>
                  <p>{parent.cnic}</p>
                </div>
                {/* <div>
                  <p className='text-sm text-gray-500'>Address</p>
                  <p>{parent.address || 'No address provided'}</p>
                </div> */}
                <div>
                  <p className='text-sm text-gray-500'>Associated Students</p>
                  <div className='space-y-1'>
                    {parent.children && parent.children.length > 0 ? (
                      parent.children.map(childId => {
                        const student = students.find(s => s._id === childId)
                        return student ? (
                          <p key={childId}>
                            {student.name} - {student.rollNumber}
                          </p>
                        ) : null
                      })
                    ) : (
                      <p className='text-gray-400'>No students associated</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Parent Modal */}
        {showAddModal && (
          <dialog open className='modal'>
            <div className='modal-box w-11/12 max-w-3xl'>
              <h3 className='font-bold text-lg mb-4'>Add New Parent</h3>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input
                      type='text'
                      value={newParent.name}
                      onChange={e =>
                        setNewParent({ ...newParent, name: e.target.value })
                      }
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
                      value={newParent.email}
                      onChange={e =>
                        setNewParent({ ...newParent, email: e.target.value })
                      }
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input
                      type='password'
                      value={newParent.password}
                      onChange={e =>
                        setNewParent({ ...newParent, password: e.target.value })
                      }
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>CNIC</span>
                    </label>
                    <input
                      type='text'
                      value={newParent.cnic}
                      onChange={e =>
                        setNewParent({ ...newParent, cnic: e.target.value })
                      }
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>Contact Number</span>
                    </label>
                    <input
                      type='tel'
                      value={newParent.contactNumber}
                      onChange={e =>
                        setNewParent({
                          ...newParent,
                          contactNumber: e.target.value
                        })
                      }
                      className='input input-bordered w-full'
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>Select Student</span>
                    </label>
                    <select
                      value={newParent.student_id}
                      onChange={e =>
                        setNewParent({
                          ...newParent,
                          student_id: e.target.value
                        })
                      }
                      className='select select-bordered w-full'
                      required
                    >
                      <option value=''>Select Student</option>
                      {unassignedStudents.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} - {student.rollNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div className='md:col-span-2'>
                    <label className='label'>
                      <span className='label-text'>Address</span>
                    </label>
                    <textarea
                      value={newParent.address}
                      onChange={e =>
                        setNewParent({ ...newParent, address: e.target.value })
                      }
                      className='textarea textarea-bordered w-full'
                      rows='3'
                    />
                  </div> */}
                </div>

                <div className='modal-action'>
                  <button
                    type='button'
                    className='btn btn-ghost'
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary bg-[#800000] hover:bg-[#600000] text-white'
                  >
                    Add Parent
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Edit Parent Modal */}
        {showEditModal && (
          <dialog open className='modal'>
            <div className='modal-box w-11/12 max-w-3xl'>
              <h3 className='font-bold text-lg mb-4'>Edit Parent</h3>
              <form onSubmit={handleEdit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input
                      type='text'
                      value={editParent.name}
                      onChange={e =>
                        setEditParent({ ...editParent, name: e.target.value })
                      }
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
                      value={editParent.email}
                      onChange={e =>
                        setEditParent({ ...editParent, email: e.target.value })
                      }
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>CNIC</span>
                    </label>
                    <input
                      type='text'
                      value={editParent.cnic}
                      onChange={e =>
                        setEditParent({ ...editParent, cnic: e.target.value })
                      }
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  <div>
                    <label className='label'>
                      <span className='label-text'>Contact Number</span>
                    </label>
                    <input
                      type='tel'
                      value={editParent.contactNumber}
                      onChange={e =>
                        setEditParent({
                          ...editParent,
                          contactNumber: e.target.value
                        })
                      }
                      className='input input-bordered w-full'
                    />
                  </div>

                  {/* <div className='md:col-span-2'>
                    <label className='label'>
                      <span className='label-text'>Address</span>
                    </label>
                    <textarea
                      value={editParent.address}
                      onChange={e =>
                        setEditParent({
                          ...editParent,
                          address: e.target.value
                        })
                      }
                      className='textarea textarea-bordered w-full'
                      rows='3'
                    />
                  </div> */}
                </div>

                <div className='modal-action'>
                  <button
                    type='button'
                    className='btn btn-ghost'
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary bg-[#800000] hover:bg-[#600000] text-white'
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Assign Student Modal */}
        {showAssignModal && (
          <dialog open className='modal'>
            <div className='modal-box w-11/12 max-w-3xl'>
              <h3 className='font-bold text-lg mb-4'>
                Assign Student to {selectedParent?.name}
              </h3>
              <form onSubmit={handleAssignStudent} className='space-y-4'>
                <div>
                  <label className='label'>
                    <span className='label-text'>Select Student</span>
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={e => setSelectedStudent(e.target.value)}
                    className='select select-bordered w-full'
                    required
                  >
                    <option value=''>Select a student</option>
                    {unassignedStudents.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.rollNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currently Assigned Students */}
                <div className='mt-4'>
                  <h4 className='font-semibold text-sm text-gray-600 mb-2'>
                    Currently Assigned Students
                  </h4>
                  <div className='bg-gray-50 rounded-lg p-3'>
                    {selectedParent?.children &&
                    selectedParent.children.length > 0 ? (
                      <div className='space-y-2'>
                        {selectedParent.children.map(childId => {
                          const student = students.find(s => s._id === childId)
                          return student ? (
                            <div
                              key={childId}
                              className='flex justify-between items-center'
                            >
                              <span>
                                {student.name} - {student.rollNumber}
                              </span>
                              <button
                                type='button'
                                onClick={() => handleUnassignStudent(childId)}
                                className='btn btn-xs btn-ghost text-red-500'
                              >
                                <Trash2 className='w-3 h-3' />
                              </button>
                            </div>
                          ) : null
                        })}
                      </div>
                    ) : (
                      <p className='text-gray-400 text-sm'>
                        No students currently assigned
                      </p>
                    )}
                  </div>
                </div>

                <div className='modal-action'>
                  <button
                    type='button'
                    className='btn btn-ghost'
                    onClick={() => {
                      setShowAssignModal(false)
                      setSelectedStudent('')
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary bg-[#800000] hover:bg-[#600000] text-white'
                    disabled={!selectedStudent}
                  >
                    Assign Student
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  )
}

export default ParentManagement
