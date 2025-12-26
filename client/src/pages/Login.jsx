import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../axiosInstance";
import { useDispatch } from "react-redux";
import { savedUser } from "../redux/features/userslice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

 const onSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axiosInstance.post("user/login", values);

    
    const token = res.data.token;
    const user = res.data.userObject;

  
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

   
    dispatch(savedUser({ ...user, token }));

    toast.success("Login successful", { position: "top-center" });

    setTimeout(() => {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }, 1000);

  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Login failed!",
      { position: "top-center" }
    );
  }
};

  return (
    <div className="max-w-sm w-full h-[400px] mx-auto mt-15 p-8 border rounded-xl bg-white">
      <ToastContainer />

      <h1 className="text-2xl text-center mb-6">Login</h1>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            className="w-full px-3 py-2 mb-5 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <div className="text-center mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 underline font-medium">
            Create
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

