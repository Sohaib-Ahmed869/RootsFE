import React, { useState } from "react";

// Dummy Data
const CLASSES = [
  { id: 1, name: "10-A", subject: "Mathematics" },
  { id: 2, name: "10-B", subject: "Mathematics" },
  { id: 3, name: "9-A", subject: "Mathematics" },
];

const STUDENTS = {
  "10-A": [
    { id: 1, rollNo: "101", name: "John Doe", meritPoints: 85, demerits: 2 },
    { id: 2, rollNo: "102", name: "Jane Smith", meritPoints: 90, demerits: 0 },
    {
      id: 3,
      rollNo: "103",
      name: "Mike Johnson",
      meritPoints: 75,
      demerits: 3,
    },
  ],
};

const MERIT_CATEGORIES = [
  {
    id: 1,
    type: "merit",
    points: 5,
    category: "Academic Excellence",
    reason: "Outstanding performance in test/exam",
  },
  {
    id: 2,
    type: "merit",
    points: 3,
    category: "Academic Excellence",
    reason: "Active class participation",
  },
  {
    id: 3,
    type: "merit",
    points: 4,
    category: "Extra Curricular",
    reason: "Sports achievement",
  },
  {
    id: 4,
    type: "merit",
    points: 3,
    category: "Extra Curricular",
    reason: "Cultural performance",
  },
  {
    id: 5,
    type: "merit",
    points: 2,
    category: "Discipline",
    reason: "Helping others",
  },
  {
    id: 6,
    type: "merit",
    points: -2,
    category: "Discipline",
    reason: "Late to class",
  },
  {
    id: 7,
    type: "demerit",
    points: -3,
    category: "Discipline",
    reason: "Misbehavior in class",
  },
  {
    id: 8,
    type: "demerit",
    points: -2,
    category: "Academic",
    reason: "Incomplete homework",
  },
];

const MeritSystem = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customPoints, setCustomPoints] = useState(0);
  const [customReason, setCustomReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    const selectedMerit = MERIT_CATEGORIES.find(
      (m) => m.id === parseInt(selectedCategory)
    );
    const pointsToAward =
      selectedMerit?.type === "other" ? customPoints : selectedMerit?.points;

    console.log({
      student: selectedStudent,
      category: selectedMerit,
      points: pointsToAward,
      reason:
        selectedMerit?.type === "other" ? customReason : selectedMerit?.reason,
      date: new Date(),
    });

    // Reset form
    setSelectedCategory("");
    setCustomPoints(0);
    setCustomReason("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Class Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="">Select Class</option>
                {CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name} - {cls.subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        {selectedClass && STUDENTS[selectedClass] && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Students</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Merit Points</th>
                    <th>Demerits</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS[selectedClass].map((student) => (
                    <tr key={student.id}>
                      <td>{student.rollNo}</td>
                      <td>{student.name}</td>
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
                      <td>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowModal(true);
                          }}
                          className="btn btn-sm bg-[#800000] text-white hover:bg-[#600000]"
                        >
                          Award Points
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Merit/Demerit Modal */}
        {showModal && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                Award Points to {selectedStudent?.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Category</option>
                    {MERIT_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category} - {category.reason} (
                        {category.points > 0 ? "+" : ""}
                        {category.points} points)
                      </option>
                    ))}
                  </select>
                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    Enter Comments
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    placeholder="Enter Comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                {selectedCategory &&
                  MERIT_CATEGORIES.find(
                    (m) => m.id === parseInt(selectedCategory)
                  )?.type === "other" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Points
                        </label>
                        <input
                          type="number"
                          value={customPoints}
                          onChange={(e) =>
                            setCustomPoints(parseInt(e.target.value))
                          }
                          className="input input-bordered w-full"
                          placeholder="Enter points (negative for demerits)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason
                        </label>
                        <textarea
                          value={customReason}
                          onChange={(e) => setCustomReason(e.target.value)}
                          className="textarea textarea-bordered w-full"
                          placeholder="Enter reason"
                          rows={3}
                        />
                      </div>
                    </>
                  )}
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary bg-[#800000] hover:bg-[#600000] border-none"
                  onClick={handleSubmit}
                  disabled={
                    !comments ||
                    !selectedCategory ||
                    (MERIT_CATEGORIES.find(
                      (m) => m.id === parseInt(selectedCategory)
                    )?.type === "other" &&
                      (!customReason || !customPoints))
                  }
                >
                  Award Points
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default MeritSystem;
