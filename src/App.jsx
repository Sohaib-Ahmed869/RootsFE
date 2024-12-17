// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./Common/login";
// import Dashboard from "./Users/SuperAdmin/Dashboard";
// import AdminDashboard from "./Users/Admin/Dashboard";
// import StudentDashboard from "./Users/Student/Dashboard";
// import ParentDashboard from "./Users/Parent/Dashboard";
// import TeacherDashboard from "./Users/Teacher/dashboard";
// import LandingPage from "./Utils/free";
// import { Toaster } from "react-hot-toast";

// const App = () => {
//   return (
//     <Router>
//       <Toaster />
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/landing" element={<LandingPage />} />
//         <Route path="/superadmin/dashboard" element={<Dashboard />} />
//         <Route path="/branchadmin/dashboard" element={<AdminDashboard />} />
//         <Route path="/student/dashboard" element={<StudentDashboard />} />
//         <Route path="/parent/dashboard" element={<ParentDashboard />} />
//         <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Common/login";
import Dashboard from "./Users/SuperAdmin/Dashboard";
import AdminDashboard from "./Users/Admin/Dashboard";
import StudentDashboard from "./Users/Student/Dashboard";
import ParentDashboard from "./Users/Parent/Dashboard";
import TeacherDashboard from "./Users/Teacher/dashboard";
import LandingPage from "./Utils/free";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Common/ProtectedRoute"; // Adjust the import path as needed

const App = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/superadmin/dashboard" element={<ProtectedRoute element={Dashboard} role={"superadmin"}/>} />
        <Route path="/branchadmin/dashboard" element={<ProtectedRoute element={AdminDashboard} role={"branchadmin"} />} />
        <Route path="/student/dashboard" element={<ProtectedRoute element={StudentDashboard} role={"student"} />} />
        <Route path="/parent/dashboard" element={<ProtectedRoute element={ParentDashboard} role={"parent"}/>} />
        <Route path="/teacher/dashboard" element={<ProtectedRoute element={TeacherDashboard} role={"teacher"}/>} />
      </Routes>
    </Router>
  );
};

export default App;