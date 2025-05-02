import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, loadUserProfileData, backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address)); // Confirm backend expects JSON
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const getProfileImage = () => {
    if (image) return URL.createObjectURL(image); // Local preview if uploading new
  
    if (userData?.image) {
      if (userData.image.startsWith("http")) {
        return userData.image;
      } else {
        return `${backendUrl}/${userData.image}`; // Example: http://localhost:4000/uploads/1714151024305.png
      }
    }
  
    return assets.default_profile;
  };
  
  
  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {/* Profile Image */}
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 h-36 rounded-full object-cover opacity-75"
              src={getProfileImage()}
              alt="Profile"
            />
            <img
              className="w-10 absolute bottom-2 right-2 bg-white p-1 rounded-full"
              src={assets.upload_icon}
              alt="Upload Icon"
            />
          </div>
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      ) : (
        <img
          className="w-24 h-24 rounded-full object-cover mx-auto"
          src={getProfileImage()}
          alt="Profile"
        />
      )}

      {/* Name */}
      {isEdit ? (
        <input
          className="bg-gray-50 text-2xl font-medium max-w-60 mt-4"
          type="text"
          value={userData?.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4 text-center">
          {userData?.name}
        </p>
      )}
      <hr />

      {/* Contact Info */}
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email Id :</p>
          <p className="text-blue-500 break-words">{userData?.email}</p>

          <p className="font-medium">Phone Number :</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData?.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          ) : (
            <p className="text-blue-500">{userData?.phone}</p>
          )}

          <p className="font-medium">Address :</p>
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <input
                className="bg-gray-50"
                type="text"
                placeholder="Address Line 1"
                value={userData?.address?.line1 || ""}
                onChange={(e) => handleAddressChange("line1", e.target.value)}
              />
              <input
                className="bg-gray-50"
                type="text"
                placeholder="Address Line 2"
                value={userData?.address?.line2 || ""}
                onChange={(e) => handleAddressChange("line2", e.target.value)}
              />
            </div>
          ) : (
            <div className="text-blue-500">
              <p>{userData?.address?.line1}</p>
              <p>{userData?.address?.line2}</p>
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender :</p>
          {isEdit ? (
            <select
              className="bg-gray-100 max-w-52"
              value={userData?.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-blue-500">{userData?.gender}</p>
          )}

          <p className="font-medium">Birthday Date :</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="date"
              value={userData?.dob || ""}
              onChange={(e) => handleInputChange("dob", e.target.value)}
            />
          ) : (
            <p className="text-blue-500">{userData?.dob}</p>
          )}
        </div>
      </div>

      {/* Save / Edit Button */}
      <div className="mt-10 flex justify-center">
        {isEdit ? (
          <button
            className="border border-sky-500 px-10 py-2 rounded-full hover:bg-sky-500 hover:text-white transition-all duration-300"
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-sky-500 px-10 py-2 rounded-full hover:bg-sky-500 hover:text-white transition-all duration-300"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
