import React from "react";
import { useNavigate } from "react-router-dom";

import dbIcon from "../assets/icons/db.svg";
import blockIcon from "../assets/icons/blockchain.svg";
import wirelessIcon from "../assets/icons/wifi.svg";

function Homepage(props) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-screen bg-black bg-vaccine-bg">
      <div className="flex flex-col w-full h-screen bg-black/50">
        <div className="flex flex-col items-center w-full spaze-y-0">
          <p className="font-anton text-[150px] text-white">
            BCo
            <span className="text-custom-primary">T</span>
          </p>
          <p className="text-white text-md subheading">
            Blockchain Empowered Cloud of
            <span className="font-bold text-custom-primary"> Things</span>
          </p>
        </div>
        <div className="flex flex-col items-center w-full my-6">
          <p className="text-4xl text-white">Vaccine Supply Chain Management</p>
        </div>
        <div className="flex flex-row justify-center w-full mt-4 space-x-28">
          <img src={dbIcon} alt="Database" className="w-20 h-20 " />
          <img src={blockIcon} alt="Blockchain" className="w-20 h-20 " />
          <img src={wirelessIcon} alt="Wireless" className="w-20 h-20 " />
        </div>
        <div className="flex flex-col items-center w-full mt-10 space-y-4">
          <button
            className="capitalize border-0 btn bg-custom-primary w-60 hover:bg-custom-primary"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
          <button
            className="capitalize border-0 btn bg-custom-primary w-60 hover:bg-custom-primary"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
        {/* <div className="flex flex-col items-center w-full mt-16">
          <button
            className="text-black capitalize bg-white border-0 btn w-60 hover:bg-white"
            onClick={() => navigate("/signin")}
          >
            Demo
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Homepage;
