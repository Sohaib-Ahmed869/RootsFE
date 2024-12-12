import React, { useEffect, useState } from "react";
import AddBranch from "./AddBranch";
import AddAdmin from "./AddAdmin";
import Sidebar from "./sidebar";
import Main from "./main";
import { BiMenu } from "react-icons/bi";
import { use } from "react";
import { BranchService } from "../../../services/branchService";
const Dashboard = () => {
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
        {activeOption === "Add Branch" && <AddBranch />}
        {activeOption === "Add Admin" && <AddAdmin />}
        {activeOption === "Dashboard" && <Main />}
      </div>
    </div>
  );
};

export default Dashboard;
