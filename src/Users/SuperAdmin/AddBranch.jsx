import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import logo from "../../assets/logo.png";

const AddBranch = () => {
  const [branch, setBranch] = useState({
    branchName: "",
    branchAddress: "",
    openingHours: "",
    closingHours: "",
    city: "",
  });

  const handleChange = (e) => {
    setBranch({
      ...branch,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(branch);
  };

  return (
    <div className="flex flex-col justify-center items-center p-5 lg:p-10">
      <div className="flex justify-end items-center w-full mb-10">
        <img src={logo} alt="logo" className="h-10" />
      </div>
      <div className="w-full lg:w-2/3 border p-5 rounded-xl shadow-xl">
        <div className="flex items-center w-full gap-2 mb-10">
          <BiPlus className="text-3xl text-primary" />
          <h1 className="text-2xl font-bold">Add Branch</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <label>Branch Name</label>
          <input
            type="text"
            name="branchName"
            className="input input-bordered"
            value={branch.branchName}
            onChange={handleChange}
          />
          <label>Branch Address</label>
          <input
            type="text"
            name="branchAddress"
            className="input input-bordered"
            value={branch.branchAddress}
            onChange={handleChange}
          />
          <div className="flex gap-5">
            <div className="w-1/2 flex flex-col gap-2">
              <label>Opening Hours</label>
              <input
                type="time"
                name="openingHours"
                className="input input-bordered"
                value={branch.openingHours}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <label>Closing Hours</label>
              <input
                type="time"
                name="closingHours"
                className="input input-bordered"
                value={branch.closingHours}
                onChange={handleChange}
              />
            </div>
          </div>
          <label>City</label>
          <input
            type="text"
            name="city"
            className="input input-bordered"
            value={branch.city}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBranch;
