import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Common/login";
import Dashboard from "./Users/SuperAdmin/Dashboard";
import AdminDashboard from "./Users/Admin/Dashboard";
import StudentDashboard from "./Users/Student/Dashboard";
import ParentDashboard from "./Users/Parent/Dashboard";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/super-admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
