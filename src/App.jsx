import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Common/login";
import Dashboard from "./Users/SuperAdmin/Dashboard";
import AdminDashboard from "./Users/Admin/Dashboard";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/super-admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
