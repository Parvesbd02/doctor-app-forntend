import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.userData);
        localStorage.setItem("userData", JSON.stringify(data.userData)); 
      } else {
        toast.error(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Persist userData to localStorage on change
  useEffect(() => {
    if (!userData) {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
      localStorage.removeItem("userData");
    }
  }, [token]);

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    getDoctorsData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
