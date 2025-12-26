import React, { useState } from "react";
import { axiosInstance } from "../axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Signup = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

   
    if (values.password !== values.confirmpassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };

      const res = await axiosInstance.post("/user/signup", payload);

      toast.success("Signup successful!", { position: "top-center" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Signup failed", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="w-[500px] mx-auto mt-10 p-8 border rounded-xl bg-white">

      <ToastContainer />

      <h1 className="text-center mb-4 text-2xl">Sign Up</h1>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmpassword"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Signup
        </button>
         <div className='text-center mt-2'>Already have an account<Link to={"/login"} className='text-blue-500 underline font-medium'>Login</Link></div>
      </form>
    </div>
  );
};

export default Signup;
