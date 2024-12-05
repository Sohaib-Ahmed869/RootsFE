import React, { useState } from 'react';

// Dummy Data
const MARKS_DATA = [
  {
    examType: "Unit Test 1",
    term: "Term 1",
    subjects: [
      { name: "Mathematics", marks: 85, maxMarks: 100, grade: "A", remarks: "Excellent" },
      { name: "Science", marks: 78, maxMarks: 100, grade: "B", remarks: "Good" },
      { name: "English", marks: 90, maxMarks: 100, grade: "A+", remarks: "Outstanding" },
      { name: "History", marks: 88, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "Computer", marks: 95, maxMarks: 100, grade: "A+", remarks: "Outstanding" }
    ]
  },
  {
    examType: "Unit Test 2",
    term: "Term 1",
    subjects: [
      { name: "Mathematics", marks: 92, maxMarks: 100, grade: "A+", remarks: "Outstanding" },
      { name: "Science", marks: 88, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "English", marks: 87, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "History", marks: 85, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "Computer", marks: 92, maxMarks: 100, grade: "A+", remarks: "Outstanding" }
    ]
  },
  {
    examType: "Term End",
    term: "Term 1",
    subjects: [
      { name: "Mathematics", marks: 88, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "Science", marks: 82, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "English", marks: 92, maxMarks: 100, grade: "A+", remarks: "Outstanding" },
      { name: "History", marks: 90, maxMarks: 100, grade: "A+", remarks: "Outstanding" },
      { name: "Computer", marks: 94, maxMarks: 100, grade: "A+", remarks: "Outstanding" }
    ]
  },
  {
    examType: "Unit Test 1",
    term: "Term 2",
    subjects: [
      { name: "Mathematics", marks: 90, maxMarks: 100, grade: "A+", remarks: "Outstanding" },
      { name: "Science", marks: 85, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "English", marks: 88, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "History", marks: 87, maxMarks: 100, grade: "A", remarks: "Very Good" },
      { name: "Computer", marks: 96, maxMarks: 100, grade: "A+", remarks: "Outstanding" }
    ]
  }
];

const STUDENT = {
  name: "John Doe",
  class: "10-A",
  rollNumber: "2024-001",
  academicYear: "2023-24"
};

const TERMS = ["All", "Term 1", "Term 2"];
const EXAM_TYPES = ["All", "Unit Test 1", "Unit Test 2", "Term End"];

// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);

const ReportCard = () => {
  const [selectedTerm, setSelectedTerm] = useState("All");
  const [selectedExamType, setSelectedExamType] = useState("All");

  // Filter marks based on selection
  const filteredMarks = MARKS_DATA.filter(exam => {
    const termMatch = selectedTerm === "All" || exam.term === selectedTerm;
    const examMatch = selectedExamType === "All" || exam.examType === selectedExamType;
    return termMatch && examMatch;
  });

  // Calculate overall statistics
  const calculateStats = (marks) => {
    const totalMarks = marks.reduce((sum, sub) => sum + sub.marks, 0);
    const totalMaxMarks = marks.reduce((sum, sub) => sum + sub.maxMarks, 0);
    const percentage = ((totalMarks / totalMaxMarks) * 100).toFixed(2);
    return { totalMarks, totalMaxMarks, percentage };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Student Info Header */}
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{STUDENT.name}</h1>
            <p className="text-gray-600">Class {STUDENT.class} | Roll No: {STUDENT.rollNumber}</p>
            <p className="text-gray-600">Academic Year: {STUDENT.academicYear}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="border rounded p-2 min-w-[150px]"
            >
              {TERMS.map(term => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="border rounded p-2 min-w-[150px]"
            >
              {EXAM_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Report Cards */}
      {filteredMarks.map((exam, index) => {
        const stats = calculateStats(exam.subjects);
        return (
          <Card key={index} className="mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {exam.term} - {exam.examType}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Overall: {stats.percentage}% ({stats.totalMarks}/{stats.totalMaxMarks})
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Marks</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Grade</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.subjects.map((subject, subIndex) => (
                    <tr key={subIndex} className="border-b">
                      <td className="py-3 px-4">{subject.name}</td>
                      <td className="py-3 px-4 text-center">
                        {subject.marks}/{subject.maxMarks}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-sm ${
                          subject.grade.startsWith('A') 
                            ? 'bg-green-100 text-green-800' 
                            : subject.grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subject.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">{subject.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Performance Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Marks</p>
                  <p className="text-lg font-semibold">{stats.totalMarks}/{stats.totalMaxMarks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="text-lg font-semibold">{stats.percentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position in Class</p>
                  <p className="text-lg font-semibold">5/30</p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ReportCard;