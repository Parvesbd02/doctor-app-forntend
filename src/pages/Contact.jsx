import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className="text-gray-700 font-bold">US</span>
        </p>
      </div>

      <div className="my-10 flex-col flex md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 items-start text-gray-600">
          <p className="text-gray-800 font-semibold">Our OFFICE</p>
          <p>54709 Willms Station <br /> Suite 350, Washington, USA</p>
          
          <p>Tel: (415) 555‑0132 <br /> Email: greatstackdev@gmail.com</p>
          
          <p className="text-gray-800 font-semibold text-lg "> CAREERS AT PRESCRIPTO</p>
          <p>Learn more about our teams and job openings.</p>
          <button className="px-8 py-4 border border-gray-700 cursor-pointer hover:bg-sky-500 hover:text-white transition-all duration-300">Explore Jobs</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
