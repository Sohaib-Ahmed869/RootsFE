import React, { useState } from 'react';

// Dummy Data
const CLASSES = [
  { id: 1, name: "10-A", subject: "Mathematics" },
  { id: 2, name: "10-B", subject: "Mathematics" },
  { id: 3, name: "9-A", subject: "Mathematics" }
];

const HOMEWORK_DATA = {
  "10-A": [
    {
      id: 1,
      title: "Quadratic Equations",
      description: "Complete exercises 5.1 and 5.2",
      dueDate: "2024-03-20",
      assignedDate: "2024-03-15",
      attachments: ["Chapter5_Exercises.pdf"],
      status: "Active"
    },
    {
      id: 2,
      title: "Linear Equations",
      description: "Solve problems from worksheet",
      dueDate: "2024-03-22",
      assignedDate: "2024-03-16",
      attachments: ["Worksheet1.pdf"],
      status: "Active"
    }
  ],
  "10-B": [
    {
      id: 3,
      title: "Trigonometry Basics",
      description: "Complete practice problems",
      dueDate: "2024-03-21",
      assignedDate: "2024-03-15",
      attachments: ["Trig_Practice.pdf"],
      status: "Active"
    }
  ],
  "9-A": []
};

const HomeworkAssignment = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      class: selectedClass,
      title,
      description,
      dueDate,
      files: files.map(f => f.name)
    });
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setFiles([]);
    // Close modal using DaisyUI's dialog close
    window.homework_modal.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Class Selection and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Homework Management</h1>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select select-bordered w-48"
            >
              <option value="">Select Class</option>
              {CLASSES.map(cls => (
                <option key={cls.id} value={cls.name}>
                  {cls.name} - {cls.subject}
                </option>
              ))}
            </select>
          </div>
          {selectedClass && (
            <button
              onClick={() => window.homework_modal.showModal()}
              className="btn btn-primary bg-[#800000] hover:bg-[#600000] border-none"
            >
              Add New Homework
            </button>
          )}
        </div>

        {/* Homework List */}
        {selectedClass ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Assignments for {selectedClass}</h2>
            {HOMEWORK_DATA[selectedClass].length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No assignments found for this class
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Assigned Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HOMEWORK_DATA[selectedClass].map(homework => (
                      <tr key={homework.id}>
                        <td>
                          <div>
                            <div className="font-bold">{homework.title}</div>
                            <div className="text-sm text-gray-500">{homework.description}</div>
                          </div>
                        </td>
                        <td>{homework.assignedDate}</td>
                        <td>{homework.dueDate}</td>
                        <td>
                          <div className="badge badge-success">{homework.status}</div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn btn-ghost btn-xs">Edit</button>
                            <button className="btn btn-ghost btn-xs text-red-500">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            Please select a class to view assignments
          </div>
        )}

        {/* DaisyUI Modal for New Homework */}
        <dialog id="homework_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">New Assignment for {selectedClass}</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Enter homework title"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    placeholder="Enter detailed description"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Due Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input input-bordered w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Attachments</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                    multiple
                  />
                  {files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-base-200 rounded">
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(file)}
                            className="btn btn-ghost btn-xs text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => window.homework_modal.close()}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary bg-[#800000] hover:bg-[#600000] border-none">
                  Assign Homework
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default HomeworkAssignment;