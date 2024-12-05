import React, { useState } from "react";
import HomeworkAssignment from "./allotHW";
import AttendanceScreen from "./attendanceScreen";
import MeritSystem from "./allotMeritPoints";
import TeacherDashboardA from "./main";
import Sidebar from "./sidebar";

import { BiMenu } from "react-icons/bi";
const TeacherDashboard = () => {
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
        {activeOption === "Assign Homework" && <HomeworkAssignment />}
        {activeOption === "Attendance" && <AttendanceScreen />}
        {activeOption === "Merit Points" && <MeritSystem />}
        {activeOption === "Dashboard" && <TeacherDashboardA />}
      </div>
    </div>
  );
};

export default TeacherDashboard;
