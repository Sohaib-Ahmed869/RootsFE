import React, { useState, useEffect } from "react";
import { Search, UserPlus, Plus, Trash2, Edit2, Loader, AlertCircle } from "lucide-react";
import { AuthService } from "../../../services/authService";

const RELATIONS = ["Father", "Mother", "Guardian", "Step Parent", "Other"];

const ParentManagement = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
    password: "", // Added for registration
    cnic: "", // Added as required by API
    student_id: "", // Added as required by API
    address: "",
    contactNumber: "",
    relation: ""
  });

  // Fetch parents and students on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [parentsResponse, studentsResponse] = await Promise.all([
        AuthService.getAllUsers('parent'),
        AuthService.getAllUsers('student')
      ]);

      setParents(parentsResponse.data);
      setStudents(studentsResponse.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.registerParent(
        newParent.name,
        newParent.email,
        newParent.password,
        newParent.student_id,
        newParent.cnic,
        newParent.address,
        newParent.contactNumber,
      );

      // Refresh the parents list
      await fetchData();
      
      // Reset form and close modal
      setNewParent({
        name: "",
        email: "",
        password: "",
        cnic: "",
        student_id: "",
        address: "",
        contactNumber: "",
        relation: ""
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating parent:', error);
      alert('Failed to create parent. Please try again.');
    }
  };

  const handleDelete = async (parentId) => {
    if (confirm('Are you sure you want to delete this parent?')) {
      try {
        await AuthService.deleteUser('parent', parentId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting parent:', error);
        alert('Failed to delete parent. Please try again.');
      }
    }
  };

  const getFilteredParents = () => {
    if (!searchQuery) return parents;

    const query = searchQuery.toLowerCase();
    return parents.filter(
      (parent) =>
        parent.name.toLowerCase().includes(query) ||
        parent.email.toLowerCase().includes(query) ||
        (parent.contactNumber && parent.contactNumber.includes(query))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Parent Management</h1>
            <p className="text-gray-600">Manage parent accounts</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Parent
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parents by name, email, or phone..."
              className="input input-bordered w-full pr-10"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Parents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getFilteredParents().map((parent) => (
            <div key={parent._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{parent.name}</h3>
                  <p className="text-gray-600">{parent.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(parent._id)}
                  className="btn btn-sm btn-ghost text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <p>{parent.contactNumber || 'No phone number provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">CNIC</p>
                  <p>{parent.cnic}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{parent.address || 'No address provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Associated Student</p>
                  <p>{students.find(s => s._id === parent.children[0])?.name || 'No student associated'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Parent Modal */}
        {showAddModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Add New Parent</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={newParent.name}
                      onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
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
                      value={newParent.email}
                      onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      value={newParent.password}
                      onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">CNIC</span>
                    </label>
                    <input
                      type="text"
                      value={newParent.cnic}
                      onChange={(e) => setNewParent({ ...newParent, cnic: e.target.value })}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Contact Number</span>
                    </label>
                    <input
                      type="tel"
                      value={newParent.contactNumber}
                      onChange={(e) => setNewParent({ ...newParent, contactNumber: e.target.value })}
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Select Student</span>
                    </label>
                    <select
                      value={newParent.student_id}
                      onChange={(e) => setNewParent({ ...newParent, student_id: e.target.value })}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.name} - {student.rollNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <textarea
                      value={newParent.address}
                      onChange={(e) => setNewParent({ ...newParent, address: e.target.value })}
                      className="textarea textarea-bordered w-full"
                      rows="3"
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
                    Add Parent
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

export default ParentManagement;