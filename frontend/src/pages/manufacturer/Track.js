import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Track(props) {
  const [batchId, setBatchId] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col px-40 pb-16 mt-8">
        <div className="flex flex-col space-y-1">
          <p className="text-3xl font-bold">Track Shipment</p>
          <div className="divider"></div>
        </div>
        <div className="flex flex-row items-center justify-center w-full pt-8 space-x-8">
          <input
            type="text"
            className="border-2 border-black rounded-xl input w-60"
            placeholder="Batch ID"
            onChange={(e) => setBatchId(e.target.value)}
          ></input>
          <button
            className="capitalize border-0 btn bg-custom-primary"
            onClick={() => {
              console.log("Track shipment button clicked", batchId);
              if (batchId !== "") {
                navigate("/batch/" + batchId);
              } else {
                toast.error("Please enter a batch ID");
              }
            }}
          >
            Track Shipment
          </button>
        </div>
      </div>
    </>
  );
}

export default Track;
