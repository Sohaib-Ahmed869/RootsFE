import React, { useState } from 'react';
import { Plus, Search, Edit2, Eye, EyeOff, Mail, Phone } from 'lucide-react';

// Dummy data for teachers
const INITIAL_TEACHERS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@school.com",
    phone: "9876543210",
    subject: "Mathematics",
    qualification: "Ph.D. Mathematics",
    joiningDate: "2023-06-15",
    assignedClasses: ["10-A", "10-B"],
    status: "active"
  },
  {
    id: 2,
    name: "Prof. Michael Smith",
    email: "michael.smith@school.com",
    phone: "9876543211",
    subject: "Science",
    qualification: "M.Sc. Physics",
    joiningDate: "2023-07-01",
    assignedClasses: ["9-A", "9-B"],
    status: "active"
  }
];

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology"
];

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    joiningDate: '',
    assignedClasses: [],
    password: '',
    confirmPassword: '',
    status: 'active'
  });

  const getFilteredTeachers = () => {
    if (!searchQuery) return teachers;
    
    const query = searchQuery.toLowerCase();
    return teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(query) ||
      teacher.email.toLowerCase().includes(query) ||
      teacher.subject.toLowerCase().includes(query)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (newTeacher.password !== newTeacher.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (editingTeacher) {
      setTeachers(teachers.map(teacher =>
        teacher.id === editingTeacher.id ? { ...newTeacher, id: editingTeacher.id } : teacher
      ));
    } else {
      setTeachers([...teachers, { ...newTeacher, id: teachers.length + 1 }]);
    }

    // Reset form and close modal
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      subject: '',
      qualification: '',
      joiningDate: '',
      assignedClasses: [],
      password: '',
      confirmPassword: '',
      status: 'active'
    });
    setEditingTeacher(null);
    setShowModal(false);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setNewTeacher({
      ...teacher,
      password: '',
      confirmPassword: ''
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Teacher Management</h1>
            <p className="text-gray-600">Manage and monitor teaching staff</p>
          </div>
          <button
            onClick={() => {
              setEditingTeacher(null);
              setNewTeacher({
                name: '',
                email: '',
                phone: '',
                subject: '',
                qualification: '',
                joiningDate: '',
                assignedClasses: [],
                password: '',
                confirmPassword: '',
                status: 'active'
              });
              setShowModal(true);
            }}
            className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teachers by name, email, or subject..."
              className="input input-bordered w-full pr-10"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Subject</th>
                <th>Qualification</th>
                <th>Assigned Classes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredTeachers().map(teacher => (
                <tr key={teacher.id}>
                  <td>
                    <div className="font-medium">{teacher.name}</div>
                    <div className="text-sm text-gray-500">Joined: {teacher.joiningDate}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone size={14} />
                      <span>{teacher.phone}</span>
                    </div>
                  </td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.qualification}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {teacher.assignedClasses.map(cls => (
                        <span key={cls} className="badge badge-ghost">{cls}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      teacher.status === 'active' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="btn btn-sm bg-[#800000] text-white hover:bg-[#600000]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Teacher Modal */}
        {showModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div>
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newTeacher.name}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newTeacher.email}
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
                      name="phone"
                      value={newTeacher.phone}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Subject</span>
                    </label>
                    <select
                      name="subject"
                      value={newTeacher.subject}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select Subject</option>
                      {SUBJECTS.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Qualification</span>
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={newTeacher.qualification}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Joining Date</span>
                    </label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={newTeacher.joiningDate}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  {/* Password fields - only show if adding new teacher or resetting password */}
                  <div>
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={newTeacher.password}
                        onChange={handleInputChange}
                        className="input input-bordered w-full pr-10"
                        required={!editingTeacher}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Confirm Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={newTeacher.confirmPassword}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required={!editingTeacher}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      name="status"
                      value={newTeacher.status}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Assigned Classes</span>
                    </label>
                    <select
                      multiple
                      name="assignedClasses"
                      value={newTeacher.assignedClasses}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setNewTeacher(prev => ({
                          ...prev,
                          assignedClasses: values
                        }));
                      }}
                      className="select select-bordered w-full h-24"
                      required
                    >
                      <option value="10-A">10-A</option>
                      <option value="10-B">10-B</option>
                      <option value="9-A">9-A</option>
                      <option value="9-B">9-B</option>
                    </select>
                    <span className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</span>
                  </div>
                </div>

                <div className="modal-action">
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTeacher(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default TeacherManagement;