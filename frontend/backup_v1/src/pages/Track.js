import React from "react";

import ManufacturerTrack from "./manufacturer/Track";
import DistributorTrack from "./distributor/Track";
import HProfTrack from "./hprof/Track";

function Track(props) {
  return (
    <>
      {props.appState.userData.role === "Manufacturer" ? (
        <ManufacturerTrack
          appState={props.appState}
          updateStatus={props.updateStatus}
          iotData={props.iotData}
          setIoTData={props.setIoTData}
        />
      ) : props.appState.userData.role === "Distributor" ? (
        <DistributorTrack
          appState={props.appState}
          updateStatus={props.updateStatus}
          iotData={props.iotData}
          setIoTData={props.setIoTData}
        />
      ) : props.appState.userData.role === "HProf" ? (
        <HProfTrack
          appState={props.appState}
          updateStatus={props.updateStatus}
          iotData={props.iotData}
          setIoTData={props.setIoTData}
        />
      ) : null}
    </>
  );
}

export default Track;
