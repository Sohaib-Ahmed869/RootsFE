import React from "react";
import logo from "../assets/logo.png";
import { AuthService } from "../../services/authService";
import roots_bg from "../assets/roots_bg.png";
import { toast } from "react-hot-toast";

const Form = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("superadmin");
  const [showForgotModal, setShowForgotModal] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthService.forgotPassword(forgotEmail);
      const data = response.data;
      if (data.success) {
        toast.success("Password reset link sent to your email");
        setShowForgotModal(false);
        setForgotEmail("");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
    }
  };

  const onClickSubmit = async (e) => {
    e.preventDefault();
    const response = await AuthService.login(role, email, password);
    console.log(response);
    const data = await response.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("branchname", data.branch);
      window.location.href = `/${role}/dashboard`;
    }
  };

  return (
    <div>
      <form
        className="border border-gray-200 shadow-xl rounded-xl p-5 lg:p-10 bg-[#a00c0c] text-white flex flex-col gap-2 lg:gap-10"
        onSubmit={onClickSubmit}
      >
        <div className="flex justify-between flex-col items-center lg:flex-row-reverse">
          <img src={logo} alt="logo" className="h-36 rounded-xl" />
          <div>
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <p className="text-gray-100">
              Welcome back. Enter your credentials to access your account
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="input input-bordered text-black"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="input input-bordered text-black"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 text-black">
          <label htmlFor="role" className="text-white">
            Role
          </label>
          <select
            id="role"
            className="input input-bordered"
            onChange={(e) => setRole(e.target.value)}
          >
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
          <button onClick={() => setShowForgotModal(true)}>
            <a href="#" className="text-white">
              Forgot password?
            </a>
          </button>
        </div>
        <button type="submit" className="btn btn-primary text-white w-full">
          Login
        </button>

        <p className="text-center text-gray-100">
          If you do not have an account, please contact the administrator
        </p>
      </form>
      {showForgotModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Reset Password</h3>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#800000]"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotEmail("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-[#800000] text-white hover:bg-[#600000]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowForgotModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
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
