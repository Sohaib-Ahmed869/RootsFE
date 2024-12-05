import React, { useState } from 'react';
import { Plus, Users, BookOpen, GraduationCap, Search } from 'lucide-react';

// Initial dummy data for classes
const INITIAL_CLASSES = [
  {
    id: 1,
    name: "10-A",
    section: "A",
    grade: "10",
    classTeacher: "Dr. Sarah Johnson",
    capacity: 30,
    currentStrength: 25,
    subjects: ["Mathematics", "Science", "English", "History"],
    schedule: "Morning",
    room: "201",
    academicYear: "2024-25"
  },
  {
    id: 2,
    name: "10-B",
    section: "B",
    grade: "10",
    classTeacher: "Prof. Michael Smith",
    capacity: 30,
    currentStrength: 28,
    subjects: ["Mathematics", "Science", "English", "Geography"],
    schedule: "Morning",
    room: "202",
    academicYear: "2024-25"
  }
];

const TEACHERS = [
  "Dr. Sarah Johnson",
  "Prof. Michael Smith",
  "Ms. Emily Brown",
  "Mr. David Wilson"
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

const ClassManagement = () => {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingClass, setEditingClass] = useState(null);

  const [newClass, setNewClass] = useState({
    name: '',
    section: '',
    grade: '',
    classTeacher: '',
    capacity: '',
    currentStrength: 0,
    subjects: [],
    schedule: 'Morning',
    room: '',
    academicYear: ''
  });

  const getFilteredClasses = () => {
    if (!searchQuery) return classes;
    
    const query = searchQuery.toLowerCase();
    return classes.filter(cls => 
      cls.name.toLowerCase().includes(query) ||
      cls.classTeacher.toLowerCase().includes(query) ||
      cls.grade.toString().includes(query)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingClass) {
      setClasses(classes.map(cls =>
        cls.id === editingClass.id ? { ...newClass, id: editingClass.id } : cls
      ));
    } else {
      setClasses([...classes, { ...newClass, id: classes.length + 1 }]);
    }

    // Reset form and close modal
    setNewClass({
      name: '',
      section: '',
      grade: '',
      classTeacher: '',
      capacity: '',
      currentStrength: 0,
      subjects: [],
      schedule: 'Morning',
      room: '',
      academicYear: ''
    });
    setEditingClass(null);
    setShowModal(false);
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setNewClass(cls);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Class Management</h1>
            <p className="text-gray-600">Manage and monitor school classes</p>
          </div>
          <button
            onClick={() => {
              setEditingClass(null);
              setNewClass({
                name: '',
                section: '',
                grade: '',
                classTeacher: '',
                capacity: '',
                currentStrength: 0,
                subjects: [],
                schedule: 'Morning',
                room: '',
                academicYear: ''
              });
              setShowModal(true);
            }}
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
              placeholder="Search classes by name, teacher, or grade..."
              className="input input-bordered w-full pr-10"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredClasses().map(cls => (
            <div key={cls.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                  <p className="text-gray-600">Grade {cls.grade} Section {cls.section}</p>
                </div>
                <button
                  onClick={() => handleEdit(cls)}
                  className="btn btn-sm btn-ghost"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-gray-400" size={20} />
                  <span>{cls.classTeacher}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="text-gray-400" size={20} />
                  <span>{cls.currentStrength} / {cls.capacity} Students</span>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="text-gray-400" size={20} />
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.map(subject => (
                      <span key={subject} className="badge badge-ghost">{subject}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Room:</span>
                    <span className="ml-2">{cls.room}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Schedule:</span>
                    <span className="ml-2">{cls.schedule}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Academic Year:</span>
                    <span className="ml-2">{cls.academicYear}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Class Modal */}
        {showModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Grade</span>
                    </label>
                    <input
                      type="number"
                      name="grade"
                      value={newClass.grade}
                      onChange={handleInputChange}
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
                      name="section"
                      value={newClass.section}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Class Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newClass.name}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Class Teacher</span>
                    </label>
                    <select
                      name="classTeacher"
                      value={newClass.classTeacher}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select Teacher</option>
                      {TEACHERS.map(teacher => (
                        <option key={teacher} value={teacher}>{teacher}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Room Number</span>
                    </label>
                    <input
                      type="text"
                      name="room"
                      value={newClass.room}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Capacity</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={newClass.capacity}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Schedule</span>
                    </label>
                    <select
                      name="schedule"
                      value={newClass.schedule}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Academic Year</span>
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      value={newClass.academicYear}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                      placeholder="2024-25"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="label">
                      <span className="label-text">Subjects</span>
                    </label>
                    <select
                      multiple
                      name="subjects"
                      value={newClass.subjects}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setNewClass(prev => ({
                          ...prev,
                          subjects: values
                        }));
                      }}
                      className="select select-bordered w-full h-32"
                      required
                    >
                      {SUBJECTS.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
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
                      setEditingClass(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    {editingClass ? 'Update Class' : 'Add Class'}
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