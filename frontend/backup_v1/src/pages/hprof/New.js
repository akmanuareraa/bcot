import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import clipboardIcon from "../../assets/icons/clipboard.svg";
import linkIcon from "../../assets/icons/link_arrow.svg";
import CustomInputOne from "../../components/CustomInputOne";

function New(props) {
  const navigate = useNavigate();
  const [shipmentCards, setShipmentCards] = useState([]);
  //   const [hprofId, setHprofId] = useState("");

  let hprofId = "";

  const handleInput = (value) => {
    console.log("Input value", value, hprofId);
    hprofId = value;
  };

  const processShipmentCards = () => {
    let tempCards = [];
    setShipmentCards([]);
    console.log(
      "Processing inventory cards",
      props.appState.userProfile.vaccineBatches
    );
    if (props.appState.userProfile.vaccineBatches.length > 0) {
      props.appState.userProfile.vaccineBatches.forEach((batch, index) => {
        if (batch.status === "In transit to HProf") {
          let inventoryCard = (
            <div className="flex flex-col w-full space-y-2">
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row items-center">
                  <div className="pr-10">
                    <p>{index + 1}</p>
                  </div>
                  <div className="flex flex-col w-32">
                    <p className="text-xs text-black/50">Batch Number</p>
                    <p classname="text-sm ">{batch.batchId}</p>
                  </div>
                  <div className="flex flex-col w-32">
                    <p className="text-xs text-black/50">Vaccine Count</p>
                    <p classname="text-sm ">{batch.vaccineCount}</p>
                  </div>
                  <div className="flex flex-col w-40">
                    <p className="text-xs text-black/50">Date</p>
                    <p classname="text-sm ">
                      {new Date(Number(batch.timestamp)).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col w-48">
                    <p className="text-xs text-black/50">Authorized By</p>
                    <div className="flex flex-row items-center">
                      <p classname="text-sm ">
                        {batch.authorizedBy.slice(0, 9) +
                          "..." +
                          batch.authorizedBy.slice(-7)}
                      </p>
                      <img
                        src={clipboardIcon}
                        alt="clipboard icon"
                        className="w-4 h-4 ml-2 hover:cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-48 ml-4">
                    <p className="text-xs text-black/50">Transaction Hash</p>
                    <div className="flex flex-row items-center">
                      <p classname="text-sm ">
                        {/* 0x6513135..SDJFSDF */}
                        {batch.txnHash.slice(0, 9) +
                          "..." +
                          batch.txnHash.slice(-7)}
                      </p>
                      <img
                        src={clipboardIcon}
                        alt="clipboard icon"
                        className="w-4 h-4 ml-2 hover:cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-col space-y-1">
                  <p className="text-sm">Healthcare Professional ID</p>
                  <CustomInputOne functioToCall={handleInput} />
                </div> */}
              </div>

              <div className="flex flex-row space-x-4">
                <button
                  className="flex flex-row items-center space-x-4 capitalize border-0 btn bg-custom-primary"
                  onClick={() => {
                    props.updateStatus(batch.batchId, "Administered", {});
                  }}
                >
                  <p>Ready for Administration</p>
                  <img src={linkIcon} alt="link icon" className="w-6 h-6" />
                </button>
                <button
                  className="flex flex-row items-center space-x-4 capitalize border-0 btn bg-custom-primary"
                  onClick={() => {
                    props.updateStatus(batch.batchId, "Received by HProf", {});
                  }}
                >
                  <p>Move to Inventory</p>
                  <img src={linkIcon} alt="link icon" className="w-6 h-6" />
                </button>
                <button
                  className="flex flex-row items-center space-x-4 capitalize border-0 btn bg-custom-primary"
                  onClick={() => {
                    toast("Verifying authenticity of the data.");
                    toast("Please wait...");

                    console.log(
                      "View details button clicked",
                      hprofId,
                      batch.batchId
                    );

                    // find the object in an array with key batchId === batch.batchId
                    let batchObj = props.appState.scData.find(
                      (obj) => obj.batchId === batch.batchId
                    );

                    console.log("Batch object", batchObj);
                    props.verifyAuthenticity(
                      batch.batchId,
                      batchObj.key,
                      batchObj.hash
                    );
                  }}
                >
                  <p>Verify Authenticity</p>
                  <img src={linkIcon} alt="link icon" className="w-6 h-6" />
                </button>
                {/* <button
                  className="btn"
                  onClick={() => {
                    console.log("State", props.appState);
                  }}
                >
                  State
                </button> */}
              </div>
            </div>
          );
          tempCards.push(inventoryCard);
          setShipmentCards(tempCards);
        }
      });
    } else {
      console.log("No vaccine batches found");
    }
  };

  useEffect(() => {
    console.log("Inventory page loaded", props.appState);
    processShipmentCards();
  }, []);

  return (
    <>
      <div className="flex flex-col px-40 pb-16 mt-8">
        <div className="flex flex-col space-y-1">
          <p className="text-3xl font-bold">Incoming Shipments</p>
          <div className="divider"></div>
        </div>
        {/* All vaccine batches */}
        <div className="flex flex-col items-center w-full py-4 space-y-8">
          {shipmentCards.length > 0 ? (
            shipmentCards
          ) : (
            <p className="text-2xl font-bold text-black/50">No Shipments</p>
          )}
        </div>
      </div>
    </>
  );
}

export default New;
