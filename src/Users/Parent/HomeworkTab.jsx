import React, { useState } from 'react';

// Dummy Homework Data
const HOMEWORK_DATA = {
  1: [
    {
      id: 1,
      subject: "Mathematics",
      title: "Quadratic Equations Exercise",
      description: "Complete questions 1-10 from Chapter 5. Show all working steps clearly.",
      assignedDate: "2024-03-15",
      dueDate: "2024-03-17",
      status: "Pending",
      teacher: "Mr. Anderson",
      attachments: ["Chapter5_Questions.pdf"],
      class: "10-A"
    },
    {
      id: 2,
      subject: "Physics",
      title: "Wave Motion Lab Report",
      description: "Write a detailed lab report on today's wave motion experiment. Include observations and calculations.",
      assignedDate: "2024-03-14",
      dueDate: "2024-03-16",
      status: "Overdue",
      teacher: "Ms. Davis",
      attachments: ["Lab_Template.doc"],
      class: "10-A"
    }
  ],
  2: [
    {
      id: 3,
      subject: "English",
      title: "Book Review",
      description: "Write a review of Chapter 3 from 'To Kill a Mockingbird'",
      assignedDate: "2024-03-15",
      dueDate: "2024-03-18",
      status: "Pending",
      teacher: "Mrs. Smith",
      attachments: ["Review_Guidelines.pdf"],
      class: "8-B"
    },
    {
      id: 4,
      subject: "Science",
      title: "Ecosystem Project",
      description: "Create a diagram of a local ecosystem",
      assignedDate: "2024-03-13",
      dueDate: "2024-03-15",
      status: "Completed",
      teacher: "Mr. Wilson",
      attachments: ["Project_Instructions.pdf"],
      class: "8-B"
    }
  ]
};

// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Homework Tab Component
const HomeworkTab = ({ viewMode, selectedChild }) => {
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allSubjects = [...new Set(Object.values(HOMEWORK_DATA)
    .flat()
    .map(hw => hw.subject))];

  // Homework Card Component
  const HomeworkCard = ({ homework }) => (
    <Card className="p-4 border-l-4 border-[#800000]">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[#800000]">{homework.subject}</span>
            <span className="text-sm text-gray-500">• {homework.class}</span>
          </div>
          <h4 className="font-semibold text-lg">{homework.title}</h4>
        </div>
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(homework.status)}`}>
          {homework.status}
        </span>
      </div>
      <p className="text-gray-600 mb-3">{homework.description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {homework.attachments.map((file, index) => (
          <div 
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {file}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>Due: {new Date(homework.dueDate).toLocaleDateString()}</span>
          <span>Assigned: {new Date(homework.assignedDate).toLocaleDateString()}</span>
        </div>
        <span>Teacher: {homework.teacher}</span>
      </div>
    </Card>
  );

  if (viewMode === 'consolidated') {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border rounded p-2"
              >
                <option value="All">All Subjects</option>
                {allSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded p-2"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold">
                {Object.values(HOMEWORK_DATA).reduce((sum, hw) => sum + hw.length, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {Object.values(HOMEWORK_DATA)
                  .flat()
                  .filter(hw => hw.status === 'Pending').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {Object.values(HOMEWORK_DATA)
                  .flat()
                  .filter(hw => hw.status === 'Overdue').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(HOMEWORK_DATA)
                  .flat()
                  .filter(hw => hw.status === 'Completed').length}
              </p>
            </div>
          </div>
        </Card>

        {/* Homework Lists by Child */}
        {Object.entries(HOMEWORK_DATA).map(([childId, homework]) => {
          const filteredHomework = homework.filter(hw => 
            (filterSubject === 'All' || hw.subject === filterSubject) &&
            (filterStatus === 'All' || hw.status === filterStatus)
          );

          if (filteredHomework.length === 0) return null;

          return (
            <div key={childId} className="space-y-4">
              <h3 className="font-semibold text-lg">Child {childId}'s Homework</h3>
              {filteredHomework.map(hw => (
                <HomeworkCard key={hw.id} homework={hw} />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // Individual Child View
  const childHomework = HOMEWORK_DATA[selectedChild] || [];
  const filteredHomework = childHomework.filter(hw => 
    (filterSubject === 'All' || hw.subject === filterSubject) &&
    (filterStatus === 'All' || hw.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border rounded p-2"
            >
              <option value="All">All Subjects</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded p-2"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Homework List */}
      <div className="space-y-4">
        {filteredHomework.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No homework assignments found matching the filters.
          </div>
        ) : (
          filteredHomework.map(hw => (
            <HomeworkCard key={hw.id} homework={hw} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeworkTab;