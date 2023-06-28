import React, { useEffect, useState } from "react";

import clipboardIcon from "../../assets/icons/clipboard.svg";
import linkIcon from "../../assets/icons/link_arrow.svg";

function Inventory(props) {
  const [inventoryCards, setInventoryCards] = useState([]);

  const processInventoryCards = () => {
    let tempCards = [];
    let countIndex = 0;
    setInventoryCards([]);
    console.log(
      "Processing inventory cards",
      props.appState.userProfile.vaccineBatches
    );
    if (props.appState.userProfile.vaccineBatches.length > 0) {
      props.appState.userProfile.vaccineBatches.forEach((batch, index) => {
        if (batch.status === "Received by HProf") {
          countIndex++;
          let inventoryCard = (
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center">
                <div className="w-4 pr-10">
                  <p>{countIndex}</p>
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
              <button
                className="flex flex-row items-center space-x-4 capitalize border-0 btn bg-custom-primary"
                onClick={() => {
                  props.updateStatus(batch.batchId, "Administered", {});
                }}
              >
                <p>Ready for Administration</p>
                <img src={linkIcon} alt="link icon" className="w-6 h-6" />
              </button>
            </div>
          );
          tempCards.push(inventoryCard);
          setInventoryCards(tempCards);
        }
      });
    } else {
      console.log("No vaccine batches found");
    }
  };

  useEffect(() => {
    console.log("Inventory page loaded", props.appState);
    processInventoryCards();
  }, []);

  return (
    <>
      <div className="flex flex-col px-40 pb-16 mt-8">
        <div className="flex flex-col space-y-1">
          <p className="text-3xl font-bold">Inventory</p>
          <div className="divider"></div>
        </div>
        {/* All vaccine batches */}
        <div className="flex flex-col items-center w-full py-4 space-y-4">
          {inventoryCards.length > 0 ? (
            inventoryCards
          ) : (
            <p className="text-2xl font-bold text-black/50">
              No Vaccines in Inventory
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Inventory;
