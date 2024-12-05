import React, { useState } from "react";
import Dashboard from "./main";
import Sidebar from "./sidebar";
import Main from "./main";
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
        {activeOption === "Dashboard" && <Main />}
      </div>
    </div>
  );
};

export default AdminDashboard;
