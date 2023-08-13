import React from "react";

import ManufacturerDashboard from "./manufacturer/Dashboard";
import DistributorDashboard from "./distributor/Dashboard";
import HProfDashboard from "./hprof/Dashboard";

function Dashboard(props) {
  return props.appState.userData.role === "Manufacturer" ? (
    <ManufacturerDashboard
      appState={props.appState}
      fetchUserProfile={props.fetchUserProfile}
    />
  ) : props.appState.userData.role === "Distributor" ? (
    <DistributorDashboard
      appState={props.appState}
      fetchUserProfile={props.fetchUserProfile}
    />
  ) : props.appState.userData.role === "HProf" ? (
    <HProfDashboard
      appState={props.appState}
      fetchUserProfile={props.fetchUserProfile}
    />
  ) : null;
}

export default Dashboard;
