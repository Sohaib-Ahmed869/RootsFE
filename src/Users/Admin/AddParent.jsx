import React, { useState } from "react";
import { Search, UserPlus, Plus, Users, Trash2, Edit2 } from "lucide-react";

// Dummy data for parents
const INITIAL_PARENTS = [
  {
    id: 1,
    name: "Robert Smith",
    email: "robert.smith@email.com",
    phone: "9876543210",
    occupation: "Engineer",
    address: "123 Main St, City",
    relation: "Father",
    status: "active",
  },
  {
    id: 2,
    name: "Mary Johnson",
    email: "mary.johnson@email.com",
    phone: "9876543211",
    occupation: "Doctor",
    address: "456 Oak St, City",
    relation: "Mother",
    status: "active",
  },
];

// Parent-Student relationships
const INITIAL_RELATIONSHIPS = [
  { parentId: 1, studentId: 1, relation: "Father" },
  { parentId: 1, studentId: 2, relation: "Father" },
  { parentId: 2, studentId: 1, relation: "Mother" },
];

// Getting students data from your existing ALL_STUDENTS object
const ALL_STUDENTS = {
  "10-A": [
    { id: 1, rollNo: "101", name: "John Doe", class: "10-A" },
    { id: 2, rollNo: "102", name: "Jane Smith", class: "10-A" },
  ],
  "10-B": [{ id: 3, rollNo: "201", name: "Sarah Williams", class: "10-B" }],
};

const RELATIONS = ["Father", "Mother", "Guardian", "Step Parent", "Other"];

const ParentManagement = () => {
  const [parents, setParents] = useState(INITIAL_PARENTS);
  const [relationships, setRelationships] = useState(INITIAL_RELATIONSHIPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [editingParent, setEditingParent] = useState(null);

  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    address: "",
    relation: "",
    status: "active",
  });

  const [selectedStudents, setSelectedStudents] = useState([]);

  const getFilteredParents = () => {
    if (!searchQuery) return parents;

    const query = searchQuery.toLowerCase();
    return parents.filter(
      (parent) =>
        parent.name.toLowerCase().includes(query) ||
        parent.email.toLowerCase().includes(query) ||
        parent.phone.includes(query)
    );
  };

  const getAllStudents = () => {
    return Object.values(ALL_STUDENTS).flat();
  };

  const getParentStudents = (parentId) => {
    const parentRelationships = relationships.filter(
      (r) => r.parentId === parentId
    );
    return getAllStudents().filter((student) =>
      parentRelationships.some((r) => r.studentId === student.id)
    );
  };

  const handleAddParent = (e) => {
    e.preventDefault();

    if (editingParent) {
      setParents(
        parents.map((parent) =>
          parent.id === editingParent.id
            ? { ...newParent, id: editingParent.id }
            : parent
        )
      );
    } else {
      const newParentId = Math.max(...parents.map((p) => p.id)) + 1;
      setParents([...parents, { ...newParent, id: newParentId }]);
    }

    setNewParent({
      name: "",
      email: "",
      phone: "",
      occupation: "",
      address: "",
      relation: "",
      status: "active",
    });
    setEditingParent(null);
    setShowAddModal(false);
  };

  const handleAddRelationships = (e) => {
    e.preventDefault();

    const newRelationships = selectedStudents.map((studentId) => ({
      parentId: selectedParent.id,
      studentId,
      relation: selectedParent.relation,
    }));

    setRelationships([...relationships, ...newRelationships]);
    setSelectedStudents([]);
    setShowRelationshipModal(false);
  };

  const handleRemoveRelationship = (parentId, studentId) => {
    if (confirm("Are you sure you want to remove this relationship?")) {
      setRelationships(
        relationships.filter(
          (r) => !(r.parentId === parentId && r.studentId === studentId)
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Parent Management
            </h1>
            <p className="text-gray-600">
              Manage parents and their relationships with students
            </p>
          </div>
          <button
            onClick={() => {
              setEditingParent(null);
              setShowAddModal(true);
            }}
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
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Parents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getFilteredParents().map((parent) => (
            <div key={parent.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {parent.name}
                  </h3>
                  <p className="text-gray-600">{parent.relation}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingParent(parent);
                      setNewParent(parent);
                      setShowAddModal(true);
                    }}
                    className="btn btn-sm btn-ghost"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <p>{parent.email}</p>
                  <p>{parent.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p>{parent.occupation}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{parent.address}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Associated Students</p>
                    <button
                      onClick={() => {
                        setSelectedParent(parent);
                        setShowRelationshipModal(true);
                      }}
                      className="btn btn-sm bg-[#800000] text-white hover:bg-[#600000]"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Student
                    </button>
                  </div>
                  <div className="space-y-2">
                    {getParentStudents(parent.id).map((student) => (
                      <div
                        key={student.id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">
                            {student.class} | Roll No: {student.rollNo}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveRelationship(parent.id, student.id)
                          }
                          className="btn btn-sm btn-ghost text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Parent Modal */}
        {showAddModal && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">
                {editingParent ? "Edit Parent" : "Add New Parent"}
              </h3>
              <form onSubmit={handleAddParent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={newParent.name}
                      onChange={(e) =>
                        setNewParent({ ...newParent, name: e.target.value })
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Relation</span>
                    </label>
                    <select
                      value={newParent.relation}
                      onChange={(e) =>
                        setNewParent({ ...newParent, relation: e.target.value })
                      }
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select Relation</option>
                      {RELATIONS.map((relation) => (
                        <option key={relation} value={relation}>
                          {relation}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      value={newParent.email}
                      onChange={(e) =>
                        setNewParent({ ...newParent, email: e.target.value })
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Phone</span>
                    </label>
                    <input
                      type="tel"
                      value={newParent.phone}
                      onChange={(e) =>
                        setNewParent({ ...newParent, phone: e.target.value })
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Occupation</span>
                    </label>
                    <input
                      type="text"
                      value={newParent.occupation}
                      onChange={(e) =>
                        setNewParent({
                          ...newParent,
                          occupation: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      value={newParent.status}
                      onChange={(e) =>
                        setNewParent({ ...newParent, status: e.target.value })
                      }
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <textarea
                      value={newParent.address}
                      onChange={(e) =>
                        setNewParent({ ...newParent, address: e.target.value })
                      }
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
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingParent(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                  >
                    {editingParent ? "Update Parent" : "Add Parent"}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Add Relationship Modal */}
        {showRelationshipModal && selectedParent && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">
                Add Students for {selectedParent.name}
              </h3>
              <form onSubmit={handleAddRelationships} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Select Students</span>
                  </label>
                  <select
                    multiple
                    value={selectedStudents}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => parseInt(option.value)
                      );
                      setSelectedStudents(values);
                    }}
                    className="select select-bordered w-full h-48"
                    required
                  >
                    {getAllStudents()
                      .filter(
                        (student) =>
                          !relationships.some(
                            (r) =>
                              r.parentId === selectedParent.id &&
                              r.studentId === student.id
                          )
                      )
                      .map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} - {student.class} (Roll No:{" "}
                          {student.rollNo})
                        </option>
                      ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple students
                  </p>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowRelationshipModal(false);
                      setSelectedParent(null);
                      setSelectedStudents([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#800000] hover:bg-[#600000] text-white"
                    disabled={selectedStudents.length === 0}
                  >
                    Add Students
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
