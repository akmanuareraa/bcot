import React from "react";

import ManufacturerHistory from "./manufacturer/History";
import DistributorHistory from "./distributor/History";
import HProfHistory from "./hprof/History";

function History(props) {
  return (
    <>
      {props.appState.userData.role === "Manufacturer" ? (
        <ManufacturerHistory
          appState={props.appState}
          updateStatus={props.updateStatus}
        />
      ) : props.appState.userData.role === "Distributor" ? (
        <DistributorHistory
          appState={props.appState}
          updateStatus={props.updateStatus}
        />
      ) : props.appState.userData.role === "HProf" ? (
        <HProfHistory
          appState={props.appState}
          updateStatus={props.updateStatus}
        />
      ) : null}
    </>
  );
}

export default History;
