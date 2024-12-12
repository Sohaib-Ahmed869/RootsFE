import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import logo from "../../assets/logo.png";
import { BranchService } from "../../../services/branchService";
import { AuthService } from "../../../services/authService";

const AddAdmin = () => {
  const [admin, setAdmin] = useState({
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminBranch: "",
    cnic: "",
    address: "",
    contactNumber: "",
    
  });

  const [branches, setBranches] = useState([
    "Branch 1",
    "Branch 2",
    "Branch 3",
    "Branch 4",
  ]);

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AuthService.registerBranchAdmin(
      admin.adminName,
      admin.adminEmail,
      admin.adminPassword,
      admin.cnic,
      admin.adminBranch,
      admin.address,
      admin.contactNumber

    )
  };
  useEffect(() => {
    // Fetch branches
    const fetchBranches = async () => {
      const response = await BranchService.getAllBranches();
     
      setBranches(response.data.branches);
    };
    fetchBranches();
  }
  , []);


  return (
    <div className="flex flex-col justify-center items-center p-5 lg:p-10">
      <div className="flex justify-end items-center w-full mb-10">
        <img src={logo} alt="logo" className="h-10" />
      </div>
      <div className="w-full lg:w-2/3 border p-5 rounded-xl shadow-xl">
        <div className="flex items-center w-full gap-2 mb-10">
          <BiPlus className="text-3xl text-primary" />
          <h1 className="text-2xl font-bold">Add Admin</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <label>Admin Name</label>
          <input
            type="text"
            name="adminName"
            className="input input-bordered"
            value={admin.adminName}
            onChange={handleChange}
          />
          <label>Admin Email</label>
          <input
            type="email"
            name="adminEmail"
            className="input input-bordered"
            value={admin.adminEmail}
            onChange={handleChange}
          />
          <label>Admin Password</label>
          <input
            type="password"
            name="adminPassword"
            className="input input-bordered"
            value={admin.adminPassword}
            onChange={handleChange}
          />
          <label>CNIC</label>
          <input
            type="text"
            name="cnic"
            className="input input-bordered"
            value={admin.cnic}
            onChange={handleChange}
          />
          <label>Address</label>
          <input
            type="text"
            name="address"
            className="input input-bordered"
            value={admin.address}
            onChange={handleChange}
          />

          <label>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            className="input input-bordered"
            value={admin.contactNumber}
            onChange={handleChange}
          />
          
          <label>Branch</label>
          <select
            name="adminBranch"
            className="input input-bordered"
            value={admin.adminBranch}
            onChange={handleChange}
          >
            <option value="">Select Branch</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
