import React from "react";

import NewManufacturer from "./manufacturer/New";
import NewDistributor from "./distributor/New";
import NewHProf from "./hprof/New";

function New(props) {
  return props.appState.userData.role === "Manufacturer" ? (
    <NewManufacturer
      appState={props.appState}
      createNewVaccineBatchOnBlockchain={
        props.createNewVaccineBatchOnBlockchain
      }
      updateStatus={props.updateStatus}
    />
  ) : props.appState.userData.role === "Distributor" ? (
    <NewDistributor
      appState={props.appState}
      updateStatus={props.updateStatus}
    />
  ) : props.appState.userData.role === "HProf" ? (
    <NewHProf
      appState={props.appState}
      updateStatus={props.updateStatus}
      verifyAuthenticity={props.verifyAuthenticity}
    />
  ) : null;
}

export default New;
