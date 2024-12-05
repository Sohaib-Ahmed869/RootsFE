import React, { useState } from 'react';

// Dummy Data
const HOMEWORK_DATA = [
  {
    id: 1,
    subject: "Mathematics",
    teacher: "Mr. Anderson",
    title: "Quadratic Equations Exercise",
    description: "Complete questions 1-10 from Chapter 5. Show all working steps clearly.",
    dateAssigned: "2024-03-15",
    dueDate: "2024-03-17",
    attachments: ["Chapter5_Questions.pdf", "Reference_Sheet.pdf"],
    status: "pending",
    class: "10-A"
  },
  {
    id: 2,
    subject: "Physics",
    teacher: "Ms. Davis",
    title: "Wave Motion Lab Report",
    description: "Write a detailed lab report on today's wave motion experiment. Include all observations and calculations.",
    dateAssigned: "2024-03-14",
    dueDate: "2024-03-16",
    attachments: ["Lab_Template.doc"],
    status: "overdue",
    class: "10-A"
  },
  {
    id: 3,
    subject: "English",
    teacher: "Mrs. Smith",
    title: "Shakespeare Essay",
    description: "Write a 500-word essay on the themes of Macbeth Act 1. Focus on ambition and guilt.",
    dateAssigned: "2024-03-15",
    dueDate: "2024-03-20",
    attachments: ["Essay_Guidelines.pdf", "Macbeth_Notes.pdf"],
    status: "pending",
    class: "10-A"
  }
];

const SUBJECTS = ["All", "Mathematics", "Physics", "English", "Chemistry", "Biology"];
const STATUS_TYPES = ["All", "Pending", "Overdue"];

// Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const HomeworkCard = ({ homework }) => {
  const isOverdue = new Date(homework.dueDate) < new Date();
  const daysLeft = Math.ceil((new Date(homework.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="mb-4">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-gray-800">{homework.subject}</span>
              <span className="text-sm text-gray-500">• {homework.class}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isOverdue ? 'Overdue' : `${daysLeft} days left`}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-1">{homework.title}</h3>
            <p className="text-sm text-gray-600">Posted by {homework.teacher}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Assigned: {new Date(homework.dateAssigned).toLocaleDateString()}</p>
            <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
              Due: {new Date(homework.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-700">{homework.description}</p>
        </div>

        {/* Attachments */}
        {homework.attachments.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {homework.attachments.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const HomeworkView = () => {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter homework based on selections
  const filteredHomework = HOMEWORK_DATA.filter(hw => {
    const subjectMatch = selectedSubject === "All" || hw.subject === selectedSubject;
    const statusMatch = selectedStatus === "All" || 
      (selectedStatus === "Overdue" && new Date(hw.dueDate) < new Date()) ||
      (selectedStatus === "Pending" && new Date(hw.dueDate) >= new Date());
    const searchMatch = hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchQuery.toLowerCase());
    return subjectMatch && statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border rounded p-2"
              >
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border rounded p-2"
              >
                {STATUS_TYPES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search homework..."
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Assignments List */}
      <div>
        {filteredHomework.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No homework assignments found.
          </div>
        ) : (
          filteredHomework.map(homework => (
            <HomeworkCard key={homework.id} homework={homework} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeworkView;