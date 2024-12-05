import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// Dummy Academic Data
const ACADEMICS_DATA = {
  1: {
    exams: [
      {
        name: "Unit Test 1",
        subjects: [
          { name: "Mathematics", marks: 85, maxMarks: 100, grade: "A" },
          { name: "Science", marks: 78, maxMarks: 100, grade: "B+" },
          { name: "English", marks: 90, maxMarks: 100, grade: "A+" },
          { name: "History", marks: 88, maxMarks: 100, grade: "A" },
          { name: "Computer", marks: 95, maxMarks: 100, grade: "A+" }
        ],
        term: "Term 1",
        date: "2024-01-15"
      },
      {
        name: "Mid Term",
        subjects: [
          { name: "Mathematics", marks: 92, maxMarks: 100, grade: "A+" },
          { name: "Science", marks: 88, maxMarks: 100, grade: "A" },
          { name: "English", marks: 87, maxMarks: 100, grade: "A" },
          { name: "History", marks: 85, maxMarks: 100, grade: "A" },
          { name: "Computer", marks: 94, maxMarks: 100, grade: "A+" }
        ],
        term: "Term 1",
        date: "2024-02-20"
      }
    ],
    classRank: 5,
    totalStudents: 30,
    attendance: 95,
    teacherRemarks: "Excellent performance in most subjects. Shows great potential in Mathematics and Computer Science."
  },
  2: {
    exams: [
      {
        name: "Unit Test 1",
        subjects: [
          { name: "Mathematics", marks: 88, maxMarks: 100, grade: "A" },
          { name: "Science", marks: 92, maxMarks: 100, grade: "A+" },
          { name: "English", marks: 85, maxMarks: 100, grade: "A" },
          { name: "History", marks: 90, maxMarks: 100, grade: "A+" },
          { name: "Computer", marks: 89, maxMarks: 100, grade: "A" }
        ],
        term: "Term 1",
        date: "2024-01-15"
      }
    ],
    classRank: 3,
    totalStudents: 35,
    attendance: 98,
    teacherRemarks: "Shows consistent performance across all subjects. Very attentive in class."
  }
};

// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Performance Trend Chart
const PerformanceChart = ({ examData }) => {
  const chartData = examData.map(exam => ({
    name: exam.name,
    ...Object.fromEntries(exam.subjects.map(sub => [sub.name, sub.marks]))
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        {examData[0].subjects.map((subject, index) => (
          <Line
            key={subject.name}
            type="monotone"
            dataKey={subject.name}
            stroke={`hsl(${index * 45}, 70%, 50%)`}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Subject Performance Bar Chart
const SubjectPerformance = ({ subjects }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={subjects}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 100]} />
      <Tooltip />
      <Bar dataKey="marks" fill="#800000" />
    </BarChart>
  </ResponsiveContainer>
);

const AcademicsTab = ({ viewMode, selectedChild }) => {
  const [selectedExam, setSelectedExam] = useState('all');

  if (viewMode === 'consolidated') {
    return (
      <div className="space-y-6">
        {/* Overall Performance Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Academic Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(ACADEMICS_DATA).map(([childId, data]) => {
              const latestExam = data.exams[data.exams.length - 1];
              const average = latestExam.subjects.reduce((sum, sub) => sum + sub.marks, 0) / latestExam.subjects.length;
              
              return (
                <Card key={childId} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <h4 className="font-semibold">Child {childId}</h4>
                      <p className="text-sm text-gray-600">Latest Exam: {latestExam.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Average</p>
                      <p className="text-xl font-bold">{average.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Class Rank</p>
                      <p className="text-xl font-bold">{data.classRank}/{data.totalStudents}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        {/* Individual Performance Cards */}
        {Object.entries(ACADEMICS_DATA).map(([childId, data]) => (
          <Card key={childId} className="p-6">
            <h3 className="text-lg font-semibold mb-4">Child {childId}'s Performance</h3>
            
            {/* Performance Trend */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">Performance Trend</h4>
              <PerformanceChart examData={data.exams} />
            </div>

            {/* Latest Exam Results */}
            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">Latest Exam Results</h4>
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-4">Subject</th>
                    <th className="text-left py-2 px-4">Marks</th>
                    <th className="text-left py-2 px-4">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {data.exams[data.exams.length - 1].subjects.map((subject, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4">{subject.name}</td>
                      <td className="py-2 px-4">{subject.marks}/{subject.maxMarks}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-sm 
                          ${subject.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 
                            subject.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {subject.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Individual Child View
  const childData = ACADEMICS_DATA[selectedChild];
  const selectedExamData = selectedExam === 'all' ? 
    childData.exams[childData.exams.length - 1] : 
    childData.exams.find(exam => exam.name === selectedExam);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Class Rank</p>
            <p className="text-2xl font-bold">{childData.classRank}/{childData.totalStudents}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Attendance</p>
            <p className="text-2xl font-bold">{childData.attendance}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Best Subject</p>
            <p className="text-2xl font-bold">{
              selectedExamData.subjects.reduce((best, current) => 
                current.marks > best.marks ? current : best
              ).name
            }</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-bold">{
              (selectedExamData.subjects.reduce((sum, sub) => sum + sub.marks, 0) / 
              selectedExamData.subjects.length).toFixed(1)
            }%</p>
          </div>
        </div>

        {/* Teacher's Remarks */}
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="text-md font-medium mb-2">Teacher's Remarks</h4>
          <p className="text-gray-700">{childData.teacherRemarks}</p>
        </div>
      </Card>

      {/* Exam Selector and Results */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Exam Results</h3>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">Latest Exam</option>
            {childData.exams.map(exam => (
              <option key={exam.name} value={exam.name}>{exam.name}</option>
            ))}
          </select>
        </div>

        {/* Subject Performance Chart */}
        <div className="mb-6">
          <SubjectPerformance subjects={selectedExamData.subjects} />
        </div>

        {/* Detailed Marks Table */}
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">Subject</th>
              <th className="text-left py-3 px-4">Marks</th>
              <th className="text-left py-3 px-4">Grade</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedExamData.subjects.map((subject, index) => (
              <tr key={index} className="border-t">
                <td className="py-3 px-4">{subject.name}</td>
                <td className="py-3 px-4">{subject.marks}/{subject.maxMarks}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-sm 
                    ${subject.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 
                      subject.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {subject.grade}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-sm ${subject.marks >= 75 ? 'text-green-600' : 
                    subject.marks >= 60 ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {subject.marks >= 75 ? 'Excellent' : 
                      subject.marks >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Performance Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
        <PerformanceChart examData={childData.exams} />
      </Card>
    </div>
  );
};

export default AcademicsTab;