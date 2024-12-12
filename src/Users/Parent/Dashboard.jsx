// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { useNavigate } from "react-router-dom";
// import { MeritService } from "../../../services/meritService";

// // Sample data for two children
// const STUDENTS_DATA = {
//   1: {
//     studentInfo: {
//       id: 1,
//       name: "John Smith",
//       grade: "10th",
//       section: "A",
//       rollNumber: "1023",
//     },
//     records: [
//       {
//         id: 1,
//         date: "2024-03-15",
//         type: "merit",
//         points: 5,
//         class: "Mathematics",
//         reason: "Helping fellow students with difficult problems",
//         issuedBy: "Mr. Anderson",
//       },
//       {
//         id: 2,
//         date: "2024-03-14",
//         type: "violation",
//         points: -2,
//         class: "Physics",
//         reason: "Disruptive behavior during lab session",
//         issuedBy: "Mrs. Roberts",
//       },
//       {
//         id: 5,
//         date: "2024-03-12",
//         type: "merit",
//         points: 3,
//         class: "Chemistry",
//         reason: "Outstanding lab work",
//         issuedBy: "Mrs. Davis",
//       },
//     ],
//   },
//   2: {
//     studentInfo: {
//       id: 2,
//       name: "Sarah Johnson",
//       grade: "10th",
//       section: "B",
//       rollNumber: "1024",
//     },
//     records: [
//       {
//         id: 3,
//         date: "2024-03-15",
//         type: "merit",
//         points: 3,
//         class: "English",
//         reason: "Outstanding presentation skills",
//         issuedBy: "Ms. Thompson",
//       },
//       {
//         id: 4,
//         date: "2024-03-13",
//         type: "merit",
//         points: 4,
//         class: "Science",
//         reason: "Excellence in lab work",
//         issuedBy: "Mr. Wilson",
//       },
//       {
//         id: 6,
//         date: "2024-03-11",
//         type: "violation",
//         points: -1,
//         class: "History",
//         reason: "Late submission of assignment",
//         issuedBy: "Mr. Brown",
//       },
//     ],
//   },
// };

// const StudentMeritTracker = () => {
//   const [selectedStudent, setSelectedStudent] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;
//   const [data,setData] = useState([]);
//   useEffect(()=>{
//     MeritService.getChildrenStats().then((res)=>{
//       setData(res.data);
//     })  
//   },[]);

//   // Calculate total points for chart
//   const chartData = Object.entries(STUDENTS_DATA).map(([_, data]) => ({
//     name: data.studentInfo.name,
//     points: data.records.reduce((sum, record) => sum + record.points, 0),
//   }));

//   // Get current records for pagination
//   const getCurrentRecords = () => {
//     const student = STUDENTS_DATA[selectedStudent];
//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     return student.records.slice(indexOfFirstRecord, indexOfLastRecord);
//   };

//   const totalPages = Math.ceil(
//     STUDENTS_DATA[selectedStudent]?.records.length / recordsPerPage
//   );
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Add logout logic here
//     navigate("/");
//   };

//   return (
//     <div className="mx-auto p-4">
//       <Navbar onLogout={handleLogout} />
//       {/* Chart Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-bold mb-6">Merit Points Overview</h2>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="points" fill="#88141C" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Student Selection */}
//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <select
//           value={selectedStudent}
//           onChange={(e) => {
//             setSelectedStudent(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="w-full p-2 border rounded"
//         >
//           {Object.values(STUDENTS_DATA).map((student) => (
//             <option key={student.studentInfo.id} value={student.studentInfo.id}>
//               {student.studentInfo.name} - {student.studentInfo.grade}{" "}
//               {student.studentInfo.section}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Student Details */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-xl font-bold">
//               {STUDENTS_DATA[selectedStudent].studentInfo.name}
//             </h2>
//             <p className="text-gray-600">
//               Grade {STUDENTS_DATA[selectedStudent].studentInfo.grade} - Section{" "}
//               {STUDENTS_DATA[selectedStudent].studentInfo.section}
//             </p>
//             <p className="text-gray-600">
//               Roll Number:{" "}
//               {STUDENTS_DATA[selectedStudent].studentInfo.rollNumber}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total Merit Points</p>
//             <p className="text-2xl font-bold text-primary">
//               {STUDENTS_DATA[selectedStudent].records.reduce(
//                 (sum, record) => sum + record.points,
//                 0
//               )}
//             </p>
//           </div>
//         </div>

//         {/* Records Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Type</th>
//                 <th className="px-4 py-2 text-left">Class</th>
//                 <th className="px-4 py-2 text-left">Reason</th>
//                 <th className="px-4 py-2 text-left">Issued By</th>
//                 <th className="px-4 py-2 text-right">Points</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getCurrentRecords().map((record) => (
//                 <tr key={record.id} className="border-b">
//                   <td className="px-4 py-3">
//                     {new Date(record.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded-full text-sm ${
//                         record.type === "merit"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {record.type === "merit" ? "Merit" : "Violation"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">{record.class}</td>
//                   <td className="px-4 py-3">{record.reason}</td>
//                   <td className="px-4 py-3">{record.issuedBy}</td>
//                   <td
//                     className={`px-4 py-3 text-right font-bold ${
//                       record.type === "merit"
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {record.points > 0 ? "+" : ""}
//                     {record.points}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 border rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentMeritTracker;

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { MeritService } from "../../../services/meritService";

const StudentMeritTracker = () => {
  const [data, setData] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MeritService.getChildrenStats()
      .then((res) => {
        setData(res.data);
        // Set the first student as selected by default
        if (Object.keys(res.data).length > 0) {
          setSelectedStudent(Object.keys(res.data)[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Calculate total points for chart
  const chartData = Object.entries(data).map(([_, studentData]) => ({
    name: studentData.studentInfo.name,
    points: studentData.records.reduce((sum, record) => sum + record.points, 0),
  }));

  // Get current records for pagination
  const getCurrentRecords = () => {
    if (!selectedStudent || !data[selectedStudent]) return [];
    const studentData = data[selectedStudent];
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return studentData.records.slice(indexOfFirstRecord, indexOfLastRecord);
  };

  const totalPages = selectedStudent && data[selectedStudent]
    ? Math.ceil(data[selectedStudent].records.length / recordsPerPage)
    : 0;

  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (Object.keys(data).length === 0) {
    return <div className="flex justify-center items-center h-screen">No data available</div>;
  }

  return (
    <div className="mx-auto p-4">
      <Navbar onLogout={handleLogout} />
      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Merit Points Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="points" fill="#88141C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Selection */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <select
          value={selectedStudent}
          onChange={(e) => {
            setSelectedStudent(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 border rounded"
        >
          {Object.values(data).map((student) => (
            <option key={student.studentInfo.id} value={student.studentInfo.id}>
              {student.studentInfo.name} - {student.studentInfo.grade}{" "}
              {student.studentInfo.section}
            </option>
          ))}
        </select>
      </div>

      {/* Student Details */}
      {selectedStudent && data[selectedStudent] && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">
                {data[selectedStudent].studentInfo.name}
              </h2>
              <p className="text-gray-600">
                Grade {data[selectedStudent].studentInfo.grade} - Section{" "}
                {data[selectedStudent].studentInfo.section}
              </p>
              <p className="text-gray-600">
                Roll Number: {data[selectedStudent].studentInfo.rollNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Merit Points</p>
              <p className="text-2xl font-bold text-primary">
                {data[selectedStudent].records.reduce(
                  (sum, record) => sum + record.points,
                  0
                )}
              </p>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Issued By</th>
                  <th className="px-4 py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentRecords().map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="px-4 py-3">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          record.type === "merit"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.type === "merit" ? "Merit" : "Violation"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{record.class}</td>
                    <td className="px-4 py-3">{record.reason}</td>
                    <td className="px-4 py-3">{record.issuedBy}</td>
                    <td
                      className={`px-4 py-3 text-right font-bold ${
                        record.type === "merit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {record.points > 0 ? "+" : ""}
                      {record.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMeritTracker;