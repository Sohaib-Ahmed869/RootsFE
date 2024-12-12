import React, { useEffect, useState } from "react";
import {
  Plus,
  Users,
  BookOpen,
  GraduationCap,
  Search,
  X,
  Edit,
} from "lucide-react";
import { BranchService } from "../../../services/branchService";
import { AuthService } from "../../../services/authService";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchId, setBranchId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  // State for subject input
  const [currentSubject, setCurrentSubject] = useState({
    name: "",
    teacher_id: "",
  });
  const [subjectsList, setSubjectsList] = useState([]);

  const [newClass, setNewClass] = useState({
    grade: "",
    section: "",
  });

  // Fetch branch ID and teachers on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [branchResponse, teachersResponse] = await Promise.all([
          AuthService.getAdminBranch(),
          AuthService.getAllUsers("teacher"),
        ]);
        setBranchId(branchResponse.data._id);
        setTeachers(teachersResponse.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch classes when branchId changes
  useEffect(() => {
    if (branchId) {
      fetchClasses();
    }
  }, [branchId]);

  const fetchClasses = async () => {
    try {
      const response = await BranchService.getBranchClasses(branchId);
      setClasses(response.data.data);
      console.log("Classes:", response.data.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleAddSubject = () => {
    if (currentSubject.name.trim() && currentSubject.teacher_id) {
      setSubjectsList([
        ...subjectsList,
        {
          name: currentSubject.name.trim(),
          teacher_id: currentSubject.teacher_id,
        },
      ]);
      setCurrentSubject({ name: "", teacher_id: "" });
    }
  };

  const handleRemoveSubject = (indexToRemove) => {
    setSubjectsList(subjectsList.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create class with subjects
      const name = `${newClass.grade}-${newClass.section}`;
      await BranchService.addClass(name, branchId);
      await fetchClasses();

      // Reset form
      setNewClass({ grade: "", section: "" });
      setSubjectsList([]);
      setShowModal(false);
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    }
  };

  const handleEditClass = async (classId) => {
    console.log("Editing class:", classId);
    setSelectedClass(classId);
    setShowEditModal(true);
  };

  const assignTeacher = async (classId, subjectName, teacherId) => {
    try {
      await BranchService.assignTeacher(classId, subjectName, teacherId);
      console.log(
        "Assigning teacher to subject:",
        classId,
        subjectName,
        teacherId
      );
      await fetchClasses();
    } catch (error) {
      console.error("Error assigning teacher:", error);
      alert("Failed to assign teacher. Please try again.");
    }
  };

  const handleAddSubjectToClass = async (e) => {
    e.preventDefault();
    if (!currentSubject.name || !currentSubject.teacher_id || !selectedClass) {
      console.error("Invalid form data");
      console.log(currentSubject, selectedClass);
      return;
    }
    try {
      await BranchService.addSubjectToClass(selectedClass, currentSubject.name);

      // Assign teacher to subject

      await assignTeacher(
        selectedClass,
        currentSubject.name,
        currentSubject.teacher_id
      );

      await fetchClasses();
      setCurrentSubject({ name: "", teacher_id: "" });
    } catch (error) {
      console.error("Error adding subject to class:", error);
      alert("Failed to add subject. Please try again.");
    }
  };

  const getFilteredClasses = () => {
    if (!searchQuery) return classes;
    const query = searchQuery.toLowerCase();
    return classes.filter((cls) => cls.name.toLowerCase().includes(query));
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t._id === teacherId);
    return teacher ? teacher.name : "Unknown Teacher";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Class Management
            </h1>
            <p className="text-gray-600">Manage and monitor school classes</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classes by name..."
              className="input input-bordered w-full pr-10"
            />
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredClasses().map((cls) => (
            <div key={cls.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {cls.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleEditClass(cls.id)}
                  className="btn btn-sm bg-[#800000] text-white hover:bg-[#600000]"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-gray-400" size={20} />
                  <div className="flex flex-col gap-2 w-full">
                    {cls.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                      >
                        <span className="font-medium">{subject.name}</span>
                        <span className="text-sm text-gray-600">
                          {subject.teacher ? subject.teacher.name : "Unknown"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Class Modal */}
        {showModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Add New Class</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Grade</span>
                    </label>
                    <input
                      type="number"
                      value={newClass.grade}
                      onChange={(e) =>
                        setNewClass({ ...newClass, grade: e.target.value })
                      }
                      className="input input-bordered w-full"
                      required
                      min="1"
                      max="12"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Section</span>
                    </label>
                    <input
                      type="text"
                      value={newClass.section}
                      onChange={(e) =>
                        setNewClass({ ...newClass, section: e.target.value })
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowModal(false);
                      setSubjectsList([]);
                      setCurrentSubject("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
        
                  >
                    Add Class
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Edit Class Modal */}
        {showEditModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Add Subject to Class</h3>
              <form onSubmit={handleAddSubjectToClass} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSubject.name}
                    onChange={(e) =>
                      setCurrentSubject({
                        ...currentSubject,
                        name: e.target.value,
                      })
                    }
                    className="input input-bordered flex-1"
                    placeholder="Enter subject name"
                    required
                  />
                  <select
                    value={currentSubject.teacher_id}
                    onChange={(e) =>
                      setCurrentSubject({
                        ...currentSubject,
                        teacher_id: e.target.value,
                      })
                    }
                    className="select select-bordered w-64"
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                    onClick={handleAddSubjectToClass}
                  >
                    Add Subject
                  </button>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedClass(null);
                      setCurrentSubject({ name: "", teacher_id: "" });
                    }}
                  >
                    Close
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

export default ClassManagement;
