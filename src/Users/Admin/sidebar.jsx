import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { MdDashboard } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { IoHelpCircleSharp } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";

const Sidebar = ({ isOpen, toggle, activeOption, setActiveOption }) => {
  useEffect(() => {
    console.log("Sidebar rendered", isOpen);
  }, [isOpen]);
  const [options] = useState([
    {
      name: "Dashboard",
      icon: <MdDashboard />,
    },
    {
      name: "Students",
      icon: <FaPeopleGroup />,
    },
    {
      name: "Class Management",
      icon: <FaPlus />,
    },
    {
      name: "Teacher Management",
      icon: <FaPlus />,
    },
    {
      name: "Parent Management",
      icon: <FaPeopleGroup />,
    },
    {
      name: "Merit Points",
      icon: <IoHelpCircleSharp />,
    },
    {
      name: "Logout",
      icon: <BiLogOut />,
    },

  ]);

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transform top-0 left-0 w-64 bg-[#9d0a10] text-white h-full fixed overflow-y-auto ease-in-out transition-all duration-300 z-30`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <img src={logo} alt="logo" className="h-10" />
        <button onClick={toggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="">
        {options.map((option, index) => (
          
            option.name!=="Logout"?
            (
          <div
            key={index}
            className={`flex items-center gap-4 p-2 cursor-pointer hover:bg-black ${
              activeOption === option.name ? "bg-black" : ""
            }`}
            onClick={() => setActiveOption(option.name)}
          >
            <div className="p-3 text-xl rounded-lg">{option.icon}</div>
            <p>{option.name}</p>
          </div>
          ):(
            <div
            key={index}
            className={`flex items-center gap-4 p-2 cursor-pointer hover:bg-black ${
              activeOption === option.name ? "bg-black" : ""
            }`}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            <div className="p-3 text-xl rounded-lg">{option.icon}</div>
            <p>{option.name}</p>
          </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
