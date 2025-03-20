import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Loader,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Edit,
  Trash2,
  Ban,
} from "lucide-react";
import { AuthService } from "../../../services/authService";
import { BranchService } from "../../../services/branchService";
import TeacherExcelUpload from "./TeacherExcelUpload";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    qualification: "",
    branch_id: "",
    cnic: "",
    address: "",
    contactNumber: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    AuthService.getAdminBranch().then((response) => {
      setBranchId(response.data._id);
    });
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await BranchService.getBranchTeachers();
      setTeachers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setNewTeacher({
      ...teacher,
      password: "", // Exclude password when editing
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const handleBlockClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowBlockModal(true);
  };

  const handleDelete = async () => {
    try {
      await AuthService.deleteUser("teacher", selectedTeacher._id);
      await fetchTeachers();

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Failed to delete teacher. Please try again.");
    }
  };

  const handleBlock = async () => {
    try {
      if (selectedTeacher.blocked) {
        await AuthService.updateUser("teacher", selectedTeacher._id, {
          blocked: false,
        });
      } else {
        await AuthService.updateUser("teacher", selectedTeacher._id, {
          blocked: true,
        });
      }
      await fetchTeachers();
      setShowBlockModal(false);
    } catch (error) {
      console.error("Error blocking/unblocking teacher:", error);
      alert("Failed to update teacher status. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await AuthService.updateUser(
          "teacher",
          selectedTeacher._id,
          newTeacher
        );
      } else {
        await AuthService.registerTeacher(
          newTeacher.name,
          newTeacher.email,
          newTeacher.password,
          newTeacher.qualification,
          branchId,
          newTeacher.cnic,
          newTeacher.address,
          newTeacher.contactNumber
        );
      }

      await fetchTeachers();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert("Failed to save teacher. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setNewTeacher({
      name: "",
      email: "",
      password: "",
      qualification: "",
      branch_id: "",
      cnic: "",
      address: "",
      contactNumber: "",
    });
    setShowModal(false);
    setIsEditing(false);
    setSelectedTeacher(null);
  };

  useEffect(() => {
    if (searchQuery) {
      const filteredTeachers = teachers.filter((teacher) => {
        const searchFields = [
          teacher.name,
          teacher.email,
          teacher.qualification,
          teacher.cnic,
          teacher.address,
        ];
        return searchFields.some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setTeachers(filteredTeachers);
    } else {
      fetchTeachers();
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading teachers...</span>
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
      {showUploadModal && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              Upload Teachers Excel File
            </h3>
            <TeacherExcelUpload
              branchId={branchId}
              onSuccess={() => {
                setShowUploadModal(false);
                // Refresh the teachers list
                fetchTeachers();
              }}
            />
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowUploadModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Teacher Management
            </h1>
            <p className="text-gray-600">Manage and monitor teaching staff</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Teachers
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teachers by name, email, or qualification..."
              className="input input-bordered w-full pr-10"
            />
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Qualification</th>
                <th>CNIC</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>
                    <div className="font-medium">{teacher.name}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone size={14} />
                      <span>{teacher.contactNumber}</span>
                    </div>
                  </td>
                  <td>{teacher.qualification}</td>
                  <td>{teacher.cnic}</td>
                  <td>{teacher.address}</td>
                  <td>
                    <span
                      className={`badge ${
                        teacher.blocked ? "badge-error" : "badge-success"
                      }`}
                    >
                      {teacher.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(teacher)}
                        className="btn btn-sm btn-ghost"
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(teacher)}
                        className="btn btn-sm btn-ghost"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <button
                        onClick={() => handleBlockClick(teacher)}
                        className="btn btn-sm btn-ghost"
                      >
                        <Ban
                          className={`w-4 h-4 ${
                            teacher.blocked
                              ? "text-green-500"
                              : "text-orange-500"
                          }`}
                        />
                      </button>
                    </div>
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
                {isEditing ? "Edit Teacher" : "Add New Teacher"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {!isEditing && (
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
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400"
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
                    <label className="label">
                      <span className="label-text">CNIC</span>
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={newTeacher.cnic}
                      onChange={handleInputChange}
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
                      name="contactNumber"
                      value={newTeacher.contactNumber}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
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

                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <textarea
                      name="address"
                      value={newTeacher.address}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full"
                      rows="3"
                      required
                    />
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    {isEditing ? "Save Changes" : "Add Teacher"}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Delete</h3>
              <p className="py-4">
                Are you sure you want to delete teacher {selectedTeacher?.name}?
                This action cannot be undone.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-error" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* Block/Unblock Confirmation Modal */}
        {showBlockModal && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Confirm {selectedTeacher?.blocked ? "Unblock" : "Block"}
              </h3>
              <p className="py-4">
                Are you sure you want to{" "}
                {selectedTeacher?.blocked ? "unblock" : "block"} teacher{" "}
                {selectedTeacher?.name}?
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowBlockModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`btn ${
                    selectedTeacher?.blocked ? "btn-success" : "btn-warning"
                  }`}
                  onClick={handleBlock}
                >
                  {selectedTeacher?.blocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default TeacherManagement;
