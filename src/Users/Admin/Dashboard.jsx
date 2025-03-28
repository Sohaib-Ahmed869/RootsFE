import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import BranchAdminDashboard from "./main";
import StudentsAdmin from "./AddStudent";
import MeritRulesManagement from "./MeritPoints";
import TeacherManagement from "./AddTeacher";
import ClassManagement from "./ClassManagement";
import ParentManagement from "./AddParent";
import { BiMenu } from "react-icons/bi";
const AdminDashboard = () => {
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
        {activeOption === "Dashboard" && <BranchAdminDashboard />}
        {activeOption === "Students" && <StudentsAdmin />}
        {activeOption === "Merit Points" && <MeritRulesManagement />}
        {activeOption === "Teacher Management" && <TeacherManagement />}
        {activeOption === "Class Management" && <ClassManagement />}
        {activeOption === "Parent Management" && <ParentManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
