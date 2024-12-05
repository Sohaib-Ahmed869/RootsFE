import React, { useState } from "react";

// Dummy Data
const CLASSES = [
  { id: 1, name: "10-A", subject: "Mathematics" },
  { id: 2, name: "10-B", subject: "Mathematics" },
  { id: 3, name: "9-A", subject: "Mathematics" },
];

const STUDENTS = {
  "10-A": [
    { id: 1, rollNo: "101", name: "John Doe", defaultStatus: "present" },
    { id: 2, rollNo: "102", name: "Jane Smith", defaultStatus: "present" },
    { id: 3, rollNo: "103", name: "Mike Johnson", defaultStatus: "present" },
    { id: 4, rollNo: "104", name: "Sarah Williams", defaultStatus: "present" },
    { id: 5, rollNo: "105", name: "Tom Brown", defaultStatus: "present" },
  ],
  "10-B": [
    { id: 6, rollNo: "201", name: "Alex Wilson", defaultStatus: "present" },
    { id: 7, rollNo: "202", name: "Emily Davis", defaultStatus: "present" },
    { id: 8, rollNo: "203", name: "James Miller", defaultStatus: "present" },
  ],
};

const PREVIOUS_ATTENDANCE = {
  "2024-03-14": {
    "10-A": {
      1: "present",
      2: "absent",
      3: "present",
      4: "late",
      5: "present",
    },
  },
};

const AttendanceScreen = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState({});
  const [remarks, setRemarks] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  // Initialize attendance when class is selected
  const handleClassChange = (className) => {
    setSelectedClass(className);
    if (className && STUDENTS[className]) {
      const initialAttendance = {};
      STUDENTS[className].forEach((student) => {
        initialAttendance[student.id] = student.defaultStatus;
      });
      setAttendance(initialAttendance);
      setRemarks({});
      setShowSummary(false);
    }
  };

  // Handle status change for a student
  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Handle remarks change
  const handleRemarksChange = (studentId, remark) => {
    setRemarks((prev) => ({
      ...prev,
      [studentId]: remark,
    }));
  };

  // Mark all students with a specific status
  const markAll = (status) => {
    const newAttendance = {};
    STUDENTS[selectedClass].forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  // Calculate attendance summary
  const calculateSummary = () => {
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      total: STUDENTS[selectedClass].length,
    };

    Object.values(attendance).forEach((status) => {
      summary[status]++;
    });

    return summary;
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log({
      class: selectedClass,
      date: selectedDate,
      attendance,
      remarks,
    });
    setShowSummary(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
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
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            {selectedClass && (
              <div className="flex gap-2">
                <button
                  onClick={() => markAll("present")}
                  className="btn btn-sm btn-success"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => markAll("absent")}
                  className="btn btn-sm btn-error"
                >
                  Mark All Absent
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Table */}
        {selectedClass && STUDENTS[selectedClass] && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS[selectedClass].map((student) => (
                    <tr key={student.id}>
                      <td>{student.rollNo}</td>
                      <td>{student.name}</td>
                      <td>
                        <select
                          value={attendance[student.id] || "present"}
                          onChange={(e) =>
                            handleStatusChange(student.id, e.target.value)
                          }
                          className={`select select-bordered select-sm w-full max-w-xs ${
                            attendance[student.id] === "absent"
                              ? "select-error"
                              : attendance[student.id] === "late"
                              ? "select-warning"
                              : "select-success"
                          }`}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={remarks[student.id] || ""}
                          onChange={(e) =>
                            handleRemarksChange(student.id, e.target.value)
                          }
                          placeholder="Add remarks"
                          className="input input-bordered input-sm w-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="btn btn-primary bg-[#800000] hover:bg-[#600000] border-none"
              >
                Submit Attendance
              </button>
            </div>

            {/* Attendance Summary Modal */}
            {showSummary && (
              <dialog open className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg mb-4">Attendance Summary</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {Object.entries(calculateSummary()).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold">{value}</div>
                        <div className="text-sm text-gray-600 capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="modal-action">
                    <button
                      className="btn"
                      onClick={() => setShowSummary(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </dialog>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceScreen;
