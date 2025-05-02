import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Doctor from "./pages/Doctor.jsx";
import Login from "./pages/Login.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import MyProfile from "./pages/MyProfil.jsx";
import MyAppointment from "./pages/MyAppointment.jsx";
import Appointment from "./pages/Appointment.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer></ToastContainer>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
        <Route path="/doctor" element={<Doctor></Doctor>}></Route>
        <Route path="/doctor/:speciality" element={<Doctor></Doctor>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/about" element={<About></About>}></Route>
        <Route path="/contact" element={<Contact></Contact>}></Route>
        <Route path="/doctors/:speciality?" element={<Doctor key={location.pathname} />} />
        

        <Route path="/my-profile" element={<MyProfile></MyProfile>}></Route>
        <Route
          path="/my-appointment"
          element={<MyAppointment></MyAppointment>}
        ></Route>
        <Route
          path="/appointment/:docId"
          element={<Appointment></Appointment>}
        ></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
};

export default App;
