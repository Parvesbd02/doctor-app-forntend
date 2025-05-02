import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const dayOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchDocInfo = () => {
    const selectedDoc = doctors.find((doc) => doc._id === docId);
    setDocInfo(selectedDoc);
  };

  const getAvailableSlots = () => {
    if (!docInfo) return;

    const today = new Date();
    const slots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isBooked =
          docInfo.slots_booked?.[slotDate]?.includes(formattedTime) ?? false;

        if (!isBooked) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    setDocSlots(slots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    const selectedSlot = docSlots[slotIndex].find((slot) => slot.time === slotTime);
    if (!selectedSlot) {
      toast.error("Please select a valid slot");
      return;
    }

    const date = selectedSlot.dateTime;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const slotDate = `${day}_${month}_${year}`;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Remove booked slot
        setDocSlots((prev) => {
          const updated = [...prev];
          updated[slotIndex] = updated[slotIndex].filter((slot) => slot.time !== slotTime);
          return updated;
        });

        setSlotTime("");
        getDoctorsData();
        navigate("/my-appointment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  return (
    <div>
      {docInfo ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <img className="bg-sky-500 w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={docInfo.name} />

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-2">
              {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
            </h2>
            <p className="text-sm mt-1 text-gray-600">{docInfo.degree} - {docInfo.speciality}</p>
            <p className="text-sm text-gray-500 mt-2">{docInfo.about}</p>
            <p className="text-gray-500 font-medium mt-1">
              Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>
      ) : (
        <p>Loading doctor details...</p>
      )}

      <div className="sm:ml-72 sm:pl-4 font-medium text-gray-700">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center overflow-x-scroll mt-4">
          {docSlots.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index ? "bg-sky-500 text-white" : "border-gray-200"
                }`}
              >
                <p className="text-sm font-semibold">
                  {item[0] && dayOfWeek[item[0].dateTime.getDay()]}
                </p>
                <p className="text-xs">{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          {docSlots[slotIndex]?.map((slot, index) => (
            <button
              key={index}
              onClick={() => setSlotTime(slot.time)}
              className={`px-4 py-2 m-1 rounded-lg ${
                slotTime === slot.time ? "bg-sky-500 text-white" : "bg-gray-100 hover:bg-sky-100"
              }`}
            >
              {slot.time.toLowerCase()}
            </button>
          ))}
        </div>

        {slotTime && (
          <div className="mt-6 sm:ml-72 text-green-600 font-medium">
            You selected: {dayOfWeek[docSlots[slotIndex][0].dateTime.getDay()]},{" "}
            {docSlots[slotIndex][0].dateTime.toLocaleDateString()} at {slotTime}
          </div>
        )}

        <button
          onClick={bookAppointment}
          className="bg-sky-500 text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      {docInfo && <RelatedDoctors docId={docId} speciality={docInfo.speciality} />}
    </div>
  );
};

export default Appointment;
