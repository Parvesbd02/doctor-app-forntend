import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token,getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const slotDateFormat = (slotDate) => {
    const dateArr = slotDate.split("_");
    return `${dateArr[0]} ${months[Number(dateArr[1])]} ${dateArr[2]}`;
  };

  // useCallback to avoid ESLint warning
  const getUserAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/appointments`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is sent correctly
          },
        }
      );
  
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error("Failed to load appointments");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please log in again.");
      } else {
        toast.error("Error fetching appointments");
      }
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);
  

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (data.success) {
        toast.success(data.message);
        getUserAppointments(); 
        getDoctorsData(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token, getUserAppointments]);

  return (
    <div>
      <p className="pb-3 mt-13 font-semibold text-zinc-700 border-b">
        My appointments
      </p>

      {loading ? (
        <div className="text-center py-8">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8">No appointments found</div>
      ) : (
        appointments.map((item) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={item._id}
          >
            <div className="w-32 bg-indigo-50 mb-0">
              {item.docData?.image ? (
                <img src={item.docData.image} alt={`Doctor ${item._id}`} />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData?.name || "Doctor Name Unavailable"}
              </p>
              <p className="text-sky-400 font-bold">
                Speciality: {item.docData?.speciality || "Unavailable"}
              </p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              {item.docData?.address ? (
                <>
                  <p className="text-xm">{item.docData.address.line1}</p>
                  <p className="text-xm">{item.docData.address.line2}</p>
                </>
              ) : (
                <p className="text-xm">Address not available</p>
              )}
              <p className="text-sm mt-1">
                <span className="font-medium">Date & Time:</span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && (
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-sky-500 hover:text-white transition-all duration-300">
                  Pay Online
                </button>
              )}
              {!item.cancelled && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && (
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-not-allowed opacity-60">
                  Appointment Cancelled
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyAppointment;
