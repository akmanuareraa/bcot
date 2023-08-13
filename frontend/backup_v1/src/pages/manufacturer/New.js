import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import uploadIcon from "../../assets/icons/upload.svg";
import uploadedIcon from "../../assets/icons/uploaded.svg";
import profileIcon from "../../assets/icons/profile.svg";
import hashIcon from "../../assets/icons/hash.svg";

function New(props) {
  const navigate = useNavigate();
  const [batchNumber, setBatchNumber] = useState("");
  const [rawMaterialQCFile, setRawMaterialQCFile] = useState(null);
  const [manufactureQCFile, setManufactureQCFile] = useState(null);
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineCount, setVaccineCount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [disCode, setDisCode] = useState("");
  const [addedToBlockchain, setAddedToBlockchain] = useState(false);
  const [txnHash, setTxnHash] = useState("");
  const [manufactureParams, setManufactureParams] = useState({
    temperature: "",
    humidity: "",
    pressure: "",
    airQuality: "",
    powerConsumption: "",
    pHLevel: "",
    gasEmissions: "",
    energyUsage: "",
  });

  const generateBatchNumber = () => {
    const alphabetChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomAlphabets = Array.from(
      { length: 2 },
      () => alphabetChars[Math.floor(Math.random() * alphabetChars.length)]
    );
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const batchNumber = randomAlphabets.join("") + randomDigits;
    console.log(batchNumber);
    setBatchNumber(batchNumber);
  };

  const handleFileUpload = (event, name) => {
    const file = event.target.files[0];
    if (file) {
      if (name === "rawMaterialQCFile") {
        setRawMaterialQCFile(file);
      } else if (name === "manufactureQCFile") {
        setManufactureQCFile(file);
      }
    }
  };

  useEffect(() => {
    if (batchNumber === "") {
      generateBatchNumber();
    }
  }, []);

  return (
    <div className="flex flex-col px-40 pb-16 mt-8">
      <div className="flex flex-col space-y-1">
        <p className="text-3xl font-bold">New Manufacture</p>
        <button className="btn" onClick={() => console.log(props.appState)}>
          Check State
        </button>
        <div className="divider"></div>
      </div>
      <div className="flex flex-col mt-4 space-y-12">
        {/* first */}
        <div className="flex flex-row items-center justify-between">
          {/* left */}
          <div className="flex flex-row space-x-16">
            {/* batch number */}
            <div className="flex flex-col">
              <p>Batch Number</p>
              <p className="text-3xl font-bold">{batchNumber}</p>
              <p className="text-xs italic font-light">
                (Generated Automatically)
              </p>
            </div>
            {/* date of manufacture */}
            <div className="flex flex-col">
              <p>Date of Manufacture</p>
              <p className="text-3xl font-bold">
                {new Date().toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            {/* manufacturer id */}
            <div className="flex flex-col">
              <p>Manufacturer ID</p>
              <p className="text-3xl font-bold">
                {props.appState.userProfile.uid}
              </p>
            </div>
          </div>
          {/* right */}
          <div>
            <QRCode
              value={"http://localhost:4600/track/" + batchNumber}
              size={60}
            />
          </div>
        </div>
        {/* second vaccine */}
        <div className="flex flex-col">
          <div className="mb-3">
            <p className="text-xl font-bold">Vaccine Data</p>
          </div>
          <div className="flex flex-row space-x-14">
            {/* vaccine name */}
            <div className="flex flex-col space-y-1">
              <p className="text-sm">Vaccine Name</p>
              <input
                type="text"
                className="border-2 border-black rounded-xl input w-60"
                placeholder='"Covishield"'
                onChange={(e) => setVaccineName(e.target.value)}
              ></input>
            </div>
            {/* vaccine count */}
            <div className="flex flex-col space-y-1">
              <p className="text-sm">Vaccine Count</p>
              <input
                type="text"
                className="border-2 border-black rounded-xl input w-60"
                placeholder="240"
                onChange={(e) => setVaccineCount(e.target.value)}
              ></input>
            </div>
            {/* expiry date */}
            <div className="flex flex-col space-y-1">
              <p className="text-sm">Expiry Date</p>
              <input
                type="text"
                className="border-2 border-black rounded-xl input w-60"
                placeholder="05-12-2050"
                onChange={(e) => setExpiryDate(e.target.value)}
              ></input>
            </div>
            {/* <div className="flex flex-col space-y-1">
              <p className="text-sm">Expiry Date</p>
              <DatePicker
                selected={expiryDate}
                onChange={handleDateChange}
                dateFormat="dd MMM, yyyy"
                className="border-2 border-black rounded-xl input w-60"
                placeholderText="Select Expiry Date"
              />
            </div> */}
          </div>
        </div>
        {/* third qc */}
        <div className="flex flex-col">
          <div className="mb-3">
            <p className="text-xl font-bold">QC Data</p>
          </div>
          <div className="flex flex-col space-y-4">
            {/* raw material qc */}
            <div className="flex flex-row items-center space-x-16">
              <p>Raw Material QC</p>
              <input
                type="file"
                className="hidden"
                id="rawInput"
                onChange={(e) => handleFileUpload(e, "rawMaterialQCFile")}
              />

              <label
                htmlFor="rawInput"
                className="flex flex-row items-center px-8 space-x-4 text-xs font-light text-white capitalize border-0 cursor-pointer btn bg-custom-primary btn-sm"
              >
                <p>{rawMaterialQCFile !== null ? "Uploaded" : "Upload"}</p>
                <img
                  src={rawMaterialQCFile !== null ? uploadedIcon : uploadIcon}
                  alt="upload"
                />
              </label>
            </div>
            {/* manufacture qc */}
            <div className="flex flex-row items-center space-x-16">
              <p>Manufacture QC</p>
              <input
                type="file"
                className="hidden"
                id="manInput"
                onChange={(e) => {
                  handleFileUpload(e, "manufactureQCFile");
                }}
              />

              <label
                htmlFor="manInput"
                className="flex flex-row items-center px-8 space-x-4 text-xs font-light text-white capitalize border-0 cursor-pointer btn bg-custom-primary btn-sm"
              >
                <p>{manufactureQCFile !== null ? "Uploaded" : "Upload"}</p>
                <img
                  src={manufactureQCFile !== null ? uploadedIcon : uploadIcon}
                  alt="upload"
                />
              </label>
            </div>
          </div>
        </div>
        {/* fourth distributor */}
        <div className="flex flex-col">
          <div className="mb-3">
            <p className="text-xl font-bold">Distributor Data</p>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm">Distributor Code</p>
            <input
              type="text"
              className="border-2 border-black rounded-xl input w-60"
              placeholder="DIS455"
              onChange={(e) => {
                setDisCode(e.target.value);
              }}
            ></input>
          </div>
        </div>
        {/* fifth txn and authorization */}
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="text-xl font-bold">Transaction and Authorization</p>
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-row space-x-6">
              <img src={profileIcon} alt="profile icon" className="w-12 h-12" />
              <div className="flex flex-col">
                <p>Authorized By</p>
                <p className="font-bold">
                  {addedToBlockchain === true ? props.appState.account : "--"}
                </p>
              </div>
            </div>
            <div className="flex flex-row space-x-6">
              <img src={hashIcon} alt="profile icon" className="w-12 h-12" />
              <div className="flex flex-col">
                <p>Transaction Hash</p>
                <p className="font-bold">
                  {addedToBlockchain === true ? txnHash : "--"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center w-full pt-16 space-x-12">
        {addedToBlockchain === false ? (
          <button
            className="capitalize border-0 btn bg-custom-primary hover:bg-custom-primary/80"
            onClick={async () => {
              console.log(
                "Adding to blockchain",
                vaccineCount,
                vaccineName,
                expiryDate,
                disCode
              );
              if (
                vaccineName === "" ||
                vaccineCount === "" ||
                expiryDate === "" ||
                // rawMaterialQCFile === null ||
                // manufactureQCFile === null ||
                disCode === ""
              ) {
                toast.error("Please provide all the data");
              } else {
                console.log("Adding to blockchain");
                const hash = await props.createNewVaccineBatchOnBlockchain(
                  batchNumber,
                  props.appState.userProfile.uid,
                  vaccineName,
                  vaccineCount,
                  expiryDate,
                  disCode,
                  manufactureParams
                );
                console.log("Final Hash Received: ", hash);
                setTxnHash(hash);
                setAddedToBlockchain(true);
              }
            }}
          >
            Create and Add data to blockchain
          </button>
        ) : (
          <>
            <button
              className="capitalize border-0 btn bg-custom-primary hover:bg-custom-primary/80"
              onClick={() => {
                props.updateStatus(batchNumber, "Sent to Distributor");
              }}
            >
              Send to Distributor
            </button>
            <button
              className="capitalize bg-black border-0 btn"
              onClick={() => {
                props.updateStatus(batchNumber, "Sent to Inventory");
              }}
            >
              Move to Inventory
            </button>
            
          </>
        )}
      </div>
    </div>
  );
}

export default New;
