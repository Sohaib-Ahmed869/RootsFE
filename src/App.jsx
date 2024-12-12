import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Common/login";
import Dashboard from "./Users/SuperAdmin/Dashboard";
import AdminDashboard from "./Users/Admin/Dashboard";
import StudentDashboard from "./Users/Student/Dashboard";
import ParentDashboard from "./Users/Parent/Dashboard";
import TeacherDashboard from "./Users/Teacher/dashboard";
import LandingPage from "./Utils/free";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/superadmin/dashboard" element={<Dashboard />} />
        <Route path="/branchadmin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
