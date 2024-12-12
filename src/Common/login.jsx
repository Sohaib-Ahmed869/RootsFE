import React from "react";
import logo from "../assets/logo.png";
import { AuthService } from "../../services/authService";
import roots_bg from "../assets/roots_bg.png";

const Form = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("superadmin");

  const onClickSubmit = async (e) => {
    e.preventDefault();
    const response =await AuthService.login(role, email, password);
    console.log(response);
    const data =await response.json();
    console.log(data);
    if(data.token){
      localStorage.setItem('token', data.token);
      window.location.href = `/${role}/dashboard`;
    } 


    
  };

  return (
    <form className="border border-gray-200 shadow-xl rounded-xl p-5 lg:p-10 bg-white flex flex-col gap-2 lg:gap-10" onSubmit={onClickSubmit}>
      <div className="flex justify-between flex-col items-center lg:flex-row-reverse">
        <img src={logo} alt="logo" className="h-16" />
        <div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-gray-500">
            Welcome back. Enter your credentials to access your account
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input type="email" className="input input-bordered" id="email" onChange={(e)=>setEmail(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <input type="password" className="input input-bordered" id="password" onChange={(e)=>setPassword(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="role">Role</label>
        <select id="role" className="input input-bordered" onChange={(e)=>setRole(e.target.value)}>
          <option value="superadmin">SuperAdmin</option>
          <option value="branchadmin">BranchAdmin</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
        </div>
        <a href="#" className="text-primary">
          Forgot password?
        </a>
      </div>
      <button type="submit" className="btn btn-primary text-white w-full">
        Login
      </button>

      <p className="text-center text-gray-500">
        If you do not have an account, please contact the administrator
      </p>
    </form>
  );
};

const LoginPage = () => {

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="z-10 lg:w-1/2 p-3 lg:p-0">
        <Form />
      </div>
    </div>
  );
};

export default LoginPage;