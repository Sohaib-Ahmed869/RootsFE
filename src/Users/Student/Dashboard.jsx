import React, { useState } from "react";
import Dashboard from "./main";
import Sidebar from "./sidebar";
import Main from "./main";
import ReportCard from "./ReportCard";
import MeritSystem from "./MeritSystem";
import HomeworkView from "./HomeWork";
import StudentPortal from "./Account";
import { BiMenu } from "react-icons/bi";
const StudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeOption, setActiveOption] = useState("Dashboard");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <Sidebar
        isOpen={isOpen}
        toggle={toggleSidebar}
        activeOption={activeOption}
        setActiveOption={setActiveOption}
      />
      <div className="fixed ">
        <button onClick={toggleSidebar} className="btn bg-transparent border-0">
          <BiMenu className="text-3xl" />
        </button>
      </div>

      <div className="p-5 w-full">
        {activeOption === "Dashboard" && <Main />}
        {activeOption === "Merit System" && <MeritSystem />}
        {activeOption === "Settings" && <StudentPortal />}
      </div>
    </div>
  );
};

export default StudentDashboard;
