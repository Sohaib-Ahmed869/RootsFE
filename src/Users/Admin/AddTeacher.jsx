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
} from "lucide-react";
import { AuthService } from "../../../services/authService";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branchId, setBranchId] = useState(null);

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    qualification: "",
    branch_id: "", // You'll need to get this from your app's context or props
    cnic: "",
    address: "",
    contactNumber: "",
  });

  // Fetch teachers on component mount
  useEffect(() => {
    AuthService.getAdminBranch().then((response) => {
      setBranchId(response.data._id);
    });
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await AuthService.getAllUsers("teacher");
      setTeachers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch teachers. Please try again later.");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTeachers = () => {
    if (!searchQuery) return teachers;

    const query = searchQuery.toLowerCase();
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.qualification.toLowerCase().includes(query)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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

      // Refresh teacher list
      await fetchTeachers();

      // Reset form and close modal
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
    } catch (error) {
      console.error("Error creating teacher:", error);
      alert("Failed to create teacher. Please try again.");
    }
  };

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
              </tr>
            </thead>
            <tbody>
              {getFilteredTeachers().map((teacher) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Teacher Modal */}
        {showModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Add New Teacher</h3>
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

                  {/* Note: You'll need to add branch_id selection based on your app's requirements */}
                  <input
                    type="hidden"
                    name="branch_id"
                    value={newTeacher.branch_id}
                  />
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    Add Teacher
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
