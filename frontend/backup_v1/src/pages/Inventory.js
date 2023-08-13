import React from "react";

import ManufacturerInventory from "./manufacturer/Inventory";
import DistributorInventory from "./distributor/Inventory";
import HProfInventory from "./hprof/Inventory";

function Inventory(props) {
  return (
    <>
      {props.appState.userData.role === "Manufacturer" ? (
        <ManufacturerInventory
          appState={props.appState}
          updateStatus={props.updateStatus}
        />
      ) : props.appState.userData.role === "Distributor" ? (
        <DistributorInventory
          appState={props.appState}
          updateStatus={props.updateStatus}
        />
      ) : props.appState.userData.role === "HProf" ? (
        <HProfInventory
          appState={props.appState}
          updateStatus={props.updateStatus}
        />
      ) : null}
    </>
  );
}

export default Inventory;
