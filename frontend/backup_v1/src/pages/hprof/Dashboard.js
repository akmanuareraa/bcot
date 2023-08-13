import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import dbIcon from "../../assets/icons/db.svg";
import blockIcon from "../../assets/icons/blockchain.svg";

import dashboardIcon from "../../assets/icons/dashboard.svg";
import historyIcon from "../../assets/icons/history.svg";
import searchIcon from "../../assets/icons/search.svg";
import addIcon from "../../assets/icons/add.svg";
import editIcon from "../../assets/icons/edit.svg";

function Dashboard(props) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vaccineBatches: 0,
    vaccines: 0,
    averageVacccines: 0,
    vaccinesDistributed: 0,
    vaccinesInTransit: 0,
    unitsInStock: 0,
  });

  useEffect(() => {
    if (props.appState.userProfile.vaccineBatches.length > 0) {
      let vaccines = 0;
      let vaccinesDistributed = 0;
      let vaccinesInTransit = 0;
      let unitsInStock = 0;
      let vaccineBatchCount = 0;
      props.appState.userProfile.vaccineBatches.forEach((batch) => {
        if (batch.status === "Administered") {
          vaccineBatchCount += 1;
          vaccines += parseInt(batch.vaccineCount);
          vaccinesDistributed += parseInt(batch.vaccineCount);
        }
        if (batch.status === "In Transit to HProf") {
          vaccineBatchCount += 1;
          vaccines += parseInt(batch.vaccineCount);
          vaccinesInTransit += parseInt(batch.vaccineCount);
        }
        if (batch.status === "Received by HProf") {
          vaccineBatchCount += 1;
          vaccines += parseInt(batch.vaccineCount);
          unitsInStock += parseInt(batch.vaccineCount);
        }
      });
      setStats({
        vaccineBatches: vaccineBatchCount,
        vaccines: vaccines,
        averageVacccines:
          vaccines / props.appState.userProfile.vaccineBatches.length,
        vaccinesDistributed: vaccinesDistributed,
        vaccinesInTransit: vaccinesInTransit,
        unitsInStock: unitsInStock,
      });
    }
  }, [props.appState]);

  return (
    <div className="flex flex-col px-40 pb-16 mt-8">
      <div className="flex flex-col space-y-1">
        <p className="text-3xl font-bold">Dashboard</p>
        <div className="divider"></div>
      </div>
      <div className="flex flex-col items-center w-full mt-4 space-y-6">
        <div className="flex flex-row space-x-12">
          <div className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow hover:cursor-pointer">
            <p className="font-bold text-7xl">{stats.vaccineBatches}</p>
            <p className="text-center">
              Batches <br />
              Received
            </p>
          </div>
          <div className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow hover:cursor-pointer">
            <p className="font-bold text-7xl">{stats.vaccines}</p>
            <p className="text-center">Vaccines Received</p>
          </div>
          <div className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow hover:cursor-pointer">
            <p className="font-bold text-7xl">
              {parseInt(stats.averageVacccines)}
            </p>
            <p className="text-center">Average Vaccines</p>
          </div>
          <div className="flex flex-col items-center w-48 px-6 py-6 text-white bg-black rounded-2xl custom-shadow hover:cursor-pointer">
            <img src={dbIcon} alt="Database" className="w-20 h-20 " />
            <div className="flex flex-col items-center space-y-2">
              <p className="font-bold">Cloud Database</p>
              <hr
                className="h-1 m-0 divider"
                style={{ borderTop: "1px solid #fff" }}
              />
              <p className="text-center text-green">Online</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-12">
          <div className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow hover:cursor-pointer">
            <p className="font-bold text-7xl">{stats.vaccinesDistributed}</p>
            <p className="text-center">Vaccines Administered</p>
          </div>
          <div className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow hover:cursor-pointer">
            <p className="font-bold text-7xl">{stats.vaccinesInTransit}</p>
            <p className="text-center">Vaccines In Transit</p>
          </div>
          <div className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow hover:cursor-pointer">
            <p className="font-bold text-7xl">{stats.unitsInStock}</p>
            <p className="text-center">Units in Stock</p>
          </div>
          <div className="flex flex-col items-center w-48 px-6 py-6 text-white bg-black rounded-2xl custom-shadow hover:cursor-pointer">
            <img src={blockIcon} alt="Database" className="w-20 h-20 " />
            <div className="flex flex-col items-center space-y-2">
              <p className="font-bold">Blockchain</p>
              <hr
                className="h-1 m-0 divider"
                style={{ borderTop: "1px solid #fff" }}
              />
              <p className="text-center text-green">Online</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-12">
          <div
            className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow bg-custom-primary hover:cursor-pointer"
            onClick={() => navigate("/history")}
          >
            <svg
              width="25"
              height="29"
              viewBox="0 0 25 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20"
            >
              <path
                d="M1.01163 23.6046C0.458605 23.6046 0 23.146 0 22.593V7.75581C0 1.80744 1.80744 0 7.75581 0H17.1977C23.146 0 24.9535 1.80744 24.9535 7.75581V21.2442C24.9535 21.46 24.9535 21.6623 24.94 21.8781C24.8995 22.4312 24.4005 22.8628 23.8609 22.8223C23.3079 22.7819 22.8763 22.2963 22.9167 21.7433C22.9302 21.5814 22.9302 21.406 22.9302 21.2442V7.75581C22.9302 2.94046 22.0265 2.02326 17.1977 2.02326H7.75581C2.92698 2.02326 2.02326 2.94046 2.02326 7.75581V22.593C2.02326 23.146 1.56465 23.6046 1.01163 23.6046Z"
                fill="white"
              />
              <path
                d="M19.2209 29.0003H5.73256C2.57628 29.0003 0 26.424 0 23.2677V22.391C0 19.7068 2.18512 17.5352 4.85581 17.5352H23.9419C24.4949 17.5352 24.9535 17.9938 24.9535 18.5468V23.2677C24.9535 26.424 22.3772 29.0003 19.2209 29.0003ZM4.85581 19.5584C3.29116 19.5584 2.02326 20.8263 2.02326 22.391V23.2677C2.02326 25.3179 3.68233 26.977 5.73256 26.977H19.2209C21.2712 26.977 22.9302 25.3179 22.9302 23.2677V19.5584H4.85581Z"
                fill="white"
              />
              <path
                d="M17.8721 8.7674H7.08145C6.52843 8.7674 6.06982 8.30879 6.06982 7.75577C6.06982 7.20275 6.52843 6.74414 7.08145 6.74414H17.8721C18.4252 6.74414 18.8838 7.20275 18.8838 7.75577C18.8838 8.30879 18.4252 8.7674 17.8721 8.7674Z"
                fill="white"
              />
              <path
                d="M13.8256 13.4886H7.08145C6.52843 13.4886 6.06982 13.03 6.06982 12.477C6.06982 11.9239 6.52843 11.4653 7.08145 11.4653H13.8256C14.3787 11.4653 14.8373 11.9239 14.8373 12.477C14.8373 13.03 14.3787 13.4886 13.8256 13.4886Z"
                fill="white"
              />
            </svg>
            <p className="text-center text-white">History</p>
          </div>
          <div
            className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow bg-custom-primary hover:cursor-pointer"
            onClick={() => navigate("/track")}
          >
            <svg
              width="29"
              height="30"
              viewBox="0 0 29 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20"
            >
              <path
                d="M25.293 6.07033H17.1992C16.6461 6.07033 16.1875 5.61168 16.1875 5.0586C16.1875 4.50552 16.6461 4.04688 17.1992 4.04688H25.293C25.8461 4.04688 26.3048 4.50552 26.3048 5.0586C26.3048 5.61168 25.8461 6.07033 25.293 6.07033Z"
                fill="white"
              />
              <path
                d="M21.2461 10.1172H17.1992C16.6461 10.1172 16.1875 9.65855 16.1875 9.10548C16.1875 8.5524 16.6461 8.09375 17.1992 8.09375H21.2461C21.7992 8.09375 22.2579 8.5524 22.2579 9.10548C22.2579 9.65855 21.7992 10.1172 21.2461 10.1172Z"
                fill="white"
              />
              <path
                d="M13.8269 27.6539C6.20526 27.6539 0 21.4486 0 13.8269C0 6.20526 6.20526 0 13.8269 0C14.38 0 14.8387 0.458649 14.8387 1.01173C14.8387 1.5648 14.38 2.02345 13.8269 2.02345C7.31141 2.02345 2.02345 7.3249 2.02345 13.8269C2.02345 20.329 7.31141 25.6304 13.8269 25.6304C20.3425 25.6304 25.6304 20.329 25.6304 13.8269C25.6304 13.2739 26.0891 12.8152 26.6421 12.8152C27.1952 12.8152 27.6539 13.2739 27.6539 13.8269C27.6539 21.4486 21.4486 27.6539 13.8269 27.6539Z"
                fill="white"
              />
              <path
                d="M27.9919 29.0027C27.7356 29.0027 27.4793 28.9083 27.277 28.7059L24.579 26.008C24.1878 25.6168 24.1878 24.9693 24.579 24.5781C24.9702 24.1869 25.6178 24.1869 26.009 24.5781L28.7069 27.276C29.0981 27.6672 29.0981 28.3147 28.7069 28.7059C28.5045 28.9083 28.2482 29.0027 27.9919 29.0027Z"
                fill="white"
              />
            </svg>

            <p className="text-center text-white">Track</p>
          </div>
          <div
            className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow bg-custom-primary hover:cursor-pointer"
            onClick={() => navigate("/new")}
          >
            <svg
              width="120"
              height="119"
              viewBox="0 0 120 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20"
            >
              <path
                d="M32.7002 58.5581L60.4004 77.9482L88.1006 58.5581"
                stroke="white"
                stroke-width="8.31005"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 102.879V42.6722C5 38.7802 7.04206 35.1736 10.3794 33.1711L54.6997 6.57895C58.2087 4.47368 62.592 4.47368 66.1011 6.579L110.421 33.1712C113.759 35.1736 115.801 38.7802 115.801 42.6722V102.879C115.801 108.999 110.84 113.959 104.721 113.959H16.0801C9.96071 113.959 5 108.999 5 102.879Z"
                stroke="white"
                stroke-width="8.31005"
              />
            </svg>

            <p className="text-center text-white">Add New</p>
          </div>
          <div
            className="flex flex-col items-center w-48 px-6 py-6 space-y-4 rounded-2xl custom-shadow bg-custom-primary hover:cursor-pointer"
            onClick={() => navigate("/edit")}
          >
            <svg
              width="31"
              height="31"
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20"
            >
              <path
                d="M17.2401 5.64001L21.8801 1L30 9.12002L25.36 13.76M17.2401 5.64001L1.48048 21.3996C1.17284 21.7072 1 22.1245 1 22.5596V30H8.44049C8.87558 30 9.29284 29.8273 9.6005 29.5195L25.36 13.76M17.2401 5.64001L25.36 13.76"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <p className="text-center text-white">Edit</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center w-full pt-10 space-x-4">
        <button
          className="capitalize border-0 btn bg-custom-primary"
          onClick={() => console.log("STATE: ", props.appState)}
        >
          Get State
        </button>
        <button
          className="capitalize border-0 btn bg-custom-primary"
          onClick={() => {
            props.fetchUserProfile();
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
