import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axiosInstance";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [value, setValue] = useState("");

 
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      setUser(res.data.data);
    } catch (err) {
      toast.error("Please login ");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  
  const updateField = async (field) => {
    try {
      const res = await axiosInstance.patch("/user/update", {
        [field]: value,
      });
      setUser(res.data.data);
      setEditField(null);
      toast.success("Updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!user) return <p className="text-center mt-10 text-4xl text-white">Login to see the profile....!!!</p>;

  
  const renderField = (label, field) => (
    <div className="flex justify-between items-center border-b py-4">
      <div className="w-full">
        <p className="text-gray-500 text-sm">{label}</p>

        {editField === field ? (
          <input
            className="border px-2 py-1 w-full mt-1"
            defaultValue={user[field]}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <p className="font-medium">{user[field] || "-"}</p>
        )}
      </div>

      <div className="ml-4">
        {editField === field ? (
          <button
            onClick={() => updateField(field)}
            className="text-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => {
              setEditField(field);
              setValue(user[field] || "");
            }}
            className="text-blue-600"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );

  return (
  <>
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl border">
      <h1 className="text-2xl font-bold mb-6">{user.name}</h1>

      {renderField("Name", "name")}
      {renderField("Email", "email")}
      {renderField("Phone", "phone")}
     


        </div>
  </>
);
}

export default Profile;

