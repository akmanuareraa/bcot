import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import dbIcon from "../assets/icons/db.svg";
import blockIcon from "../assets/icons/blockchain.svg";
import wirelessIcon from "../assets/icons/wifi.svg";

function Signin(props) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  return (
    <div className="flex flex-col w-full h-screen bg-black bg-vaccine-bg">
      <div className="flex flex-col w-full h-screen bg-black/50">
        <div className="flex flex-col items-center w-full spaze-y-0">
          <p className="font-anton text-[120px] text-white">
            BCo
            <span className="text-custom-primary">T</span>
          </p>
          <p className="text-xs text-white subheading">
            Blockchain Empowered Cloud of
            <span className="font-bold text-custom-primary"> Things</span>
          </p>
        </div>
        <div className="flex flex-col items-center w-full my-6">
          <p className="text-2xl text-white">Vaccine Supply Chain Management</p>
        </div>
        <div className="flex flex-row justify-center w-full mt-0 space-x-28">
          <img src={dbIcon} alt="Database" className="w-20 h-20 " />
          <img src={blockIcon} alt="Blockchain" className="w-20 h-20 " />
          <img src={wirelessIcon} alt="Wireless" className="w-20 h-20 " />
        </div>
        <div className="flex flex-col items-center w-full mt-8 space-y-2">
          <p className="text-2xl text-white">Sign Up</p>
          <p className="text-sm font-light text-white">
            Connect your Metamask Wallet
          </p>
        </div>
        <div className="flex flex-col items-center w-full mt-8">
          {props.appState.account === "" ? (
            <button
              className="capitalize border-0 btn bg-custom-primary w-60 hover:bg-custom-primary"
              onClick={() => props.setUpWeb3()}
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <input
                type="text"
                className="input w-60"
                placeholder="Enter your name"
                onInput={(e) => setName(e.target.value)}
              ></input>
              <select
                className="input w-60 custom-dropdown"
                value={selectedRole}
                onChange={handleRoleChange}
                style={{
                  appearance: "none",
                  paddingRight: "20px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                  backgroundSize: "10px",
                }}
              >
                <option value="" disabled>
                  Select Role
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼
                </option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Distributor">Distributor</option>
                <option value="HProf">Healthcare Professional</option>
              </select>

              <div className="">
                <p className="my-4 text-white">{props.appState.account}</p>
              </div>
              <div className="flex flex-row space-x-2">
                <button
                  className="capitalize bg-black border-0 btn w-60 hover:bg-black"
                  onClick={() => props.walletLogout()}
                >
                  Disconnect Wallet
                </button>
                <button
                  className="capitalize border-0 btn bg-custom-primary w-60 hover:bg-custom-primary"
                  onClick={() => {
                    props.getSignature("signup", selectedRole, name);
                    console.log(name, selectedRole);
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
          <div className="">
            <p className="mt-6 text-white">
              Already have an account?&nbsp;
              <span
                className="font-bold underline text-custom-primary hover:cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
