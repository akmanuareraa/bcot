import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import dashboardIcon from "../assets/icons/dashboard.svg";
import historyIcon from "../assets/icons/history.svg";
import searchIcon from "../assets/icons/search.svg";
import addIcon from "../assets/icons/add.svg";

function Navbar(props) {
  const navigate = useNavigate();
  const pattern = /^\/batch\/([A-Za-z0-9]+)$/;
  useEffect(() => {
    console.log("Navbar", window.location.pathname);
  }, []);

  return (
    <>
      {window.location.pathname === "/dashboard" ||
      window.location.pathname === "/history" ||
      window.location.pathname === "/track" ||
      window.location.pathname === "/inventory" ||
      window.location.pathname.match(pattern) ||
      window.location.pathname === "/new" ? (
        <>
          <div
            className={
              props.appState.userData.role === "Manufacturer"
                ? "flex flex-col justify-between pb-4 h-36 bg-vac-man"
                : props.appState.userData.role === "Distributor"
                ? "flex flex-col justify-between pb-4 h-36 bg-dis"
                : props.appState.userData.role === "HProf"
                ? "flex flex-col justify-between pb-4 h-36 bg-hprof"
                : "flex flex-col justify-between pb-4 h-36 bg-vac-man"
            }
          >
            <div className="flex flex-col">
              <div className="flex flex-row justify-between p-2 px-4 py-4">
                <p className="text-3xl text-white font-anton">
                  BCo
                  <span className="text-custom-primary">T</span>
                </p>
                <button
                  className="w-24 text-xs text-black bg-white border-0 rounded-full btn btn-sm hover:bg-white"
                  onClick={() => props.walletLogout()}
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-between px-4">
              <p className="text-2xl font-bold text-white">
                Welcome, {props.appState.userData.name}
              </p>
              <p className="text-2xl font-bold text-white">
                {props.appState.userData.role === "Manufacturer"
                  ? "Vaccine Manufacturer" +
                    "[" +
                    props.appState.userProfile.uid +
                    "]"
                  : props.appState.userData.role === "Distributor"
                  ? "Distributor" + "[" + props.appState.userProfile.uid + "]"
                  : props.appState.userData.role === "HProf"
                  ? "Healthcare Professional" +
                    "[" +
                    props.appState.userProfile.uid +
                    "]"
                  : null}
              </p>
            </div>
          </div>
          <div className="fixed left-0 mt-12 bg-custom-secondary rounded-e-xl custom-shadow">
            <div className="flex flex-col ">
              {/* dashboard */}
              <div className="relative flex flex-row items-center group">
                <div
                  className={
                    window.location.pathname === "/dashboard"
                      ? "p-3 bg-custom-primary rounded-tr-xl svg-container-s flex flex-row items-center hover:cursor-pointer"
                      : "p-3  rounded-tr-xl svg-container-s flex flex-row items-center hover:cursor-pointer hover:bg-custom-primary/50"
                  }
                  onClick={() => navigate("/dashboard")}
                >
                  <svg
                    width="120"
                    height="119"
                    viewBox="0 0 120 119"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 svg-icon"
                  >
                    <path
                      d="M32.7002 58.5581L60.4004 77.9482L88.1006 58.5581"
                      stroke={
                        window.location.pathname === "/dashboard"
                          ? "white"
                          : "black"
                      }
                      stroke-width="8.31005"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 102.879V42.6722C5 38.7802 7.04206 35.1736 10.3794 33.1711L54.6997 6.57895C58.2087 4.47368 62.592 4.47368 66.1011 6.579L110.421 33.1712C113.759 35.1736 115.801 38.7802 115.801 42.6722V102.879C115.801 108.999 110.84 113.959 104.721 113.959H16.0801C9.96071 113.959 5 108.999 5 102.879Z"
                      stroke={
                        window.location.pathname === "/dashboard"
                          ? "white"
                          : "black"
                      }
                      stroke-width="8.31005"
                    />
                  </svg>
                  <p className="absolute hidden ml-4 text-sm font-bold text-black left-10 group-hover:block">
                    Dashboard
                  </p>
                </div>
              </div>
              {/* history */}
              <div className="relative flex flex-row items-center group">
                <div
                  className={
                    window.location.pathname === "/history"
                      ? "p-3 bg-custom-primary svg-container-s flex flex-row items-center"
                      : "p-3 bg-white svg-container-s flex flex-row items-center hover:bg-custom-primary/20"
                  }
                  onClick={() => navigate("/history")}
                >
                  <svg
                    width="25"
                    height="29"
                    viewBox="0 0 25 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 svg-icon"
                  >
                    <path
                      d="M1.01163 23.6046C0.458605 23.6046 0 23.146 0 22.593V7.75581C0 1.80744 1.80744 0 7.75581 0H17.1977C23.146 0 24.9535 1.80744 24.9535 7.75581V21.2442C24.9535 21.46 24.9535 21.6623 24.94 21.8781C24.8995 22.4312 24.4005 22.8628 23.8609 22.8223C23.3079 22.7819 22.8763 22.2963 22.9167 21.7433C22.9302 21.5814 22.9302 21.406 22.9302 21.2442V7.75581C22.9302 2.94046 22.0265 2.02326 17.1977 2.02326H7.75581C2.92698 2.02326 2.02326 2.94046 2.02326 7.75581V22.593C2.02326 23.146 1.56465 23.6046 1.01163 23.6046Z"
                      fill={
                        window.location.pathname === "/history"
                          ? "white"
                          : "black"
                      }
                      className="nav-icons"
                    />
                    <path
                      d="M19.2209 29.0003H5.73256C2.57628 29.0003 0 26.424 0 23.2677V22.391C0 19.7068 2.18512 17.5352 4.85581 17.5352H23.9419C24.4949 17.5352 24.9535 17.9938 24.9535 18.5468V23.2677C24.9535 26.424 22.3772 29.0003 19.2209 29.0003ZM4.85581 19.5584C3.29116 19.5584 2.02326 20.8263 2.02326 22.391V23.2677C2.02326 25.3179 3.68233 26.977 5.73256 26.977H19.2209C21.2712 26.977 22.9302 25.3179 22.9302 23.2677V19.5584H4.85581Z"
                      fill={
                        window.location.pathname === "/history"
                          ? "white"
                          : "black"
                      }
                      className="nav-icons"
                    />
                    <path
                      d="M17.8721 8.7674H7.08145C6.52843 8.7674 6.06982 8.30879 6.06982 7.75577C6.06982 7.20275 6.52843 6.74414 7.08145 6.74414H17.8721C18.4252 6.74414 18.8838 7.20275 18.8838 7.75577C18.8838 8.30879 18.4252 8.7674 17.8721 8.7674Z"
                      fill={
                        window.location.pathname === "/history"
                          ? "white"
                          : "black"
                      }
                      className="nav-icons"
                    />
                    <path
                      d="M13.8256 13.4886H7.08145C6.52843 13.4886 6.06982 13.03 6.06982 12.477C6.06982 11.9239 6.52843 11.4653 7.08145 11.4653H13.8256C14.3787 11.4653 14.8373 11.9239 14.8373 12.477C14.8373 13.03 14.3787 13.4886 13.8256 13.4886Z"
                      fill={
                        window.location.pathname === "/history"
                          ? "white"
                          : "black"
                      }
                      className="nav-icons"
                    />
                  </svg>
                  <p className="absolute hidden ml-4 text-sm font-bold text-black left-10 group-hover:block">
                    History
                  </p>
                </div>
              </div>
              {/* track */}
              <div className="relative flex flex-row items-center group">
                <div
                  className={
                    window.location.pathname === "/track"
                      ? "p-3 bg-custom-primary  svg-container-s flex flex-row items-center hover:cursor-pointer"
                      : "p-3   svg-container-s flex flex-row items-center hover:cursor-pointer hover:bg-custom-primary/20"
                  }
                  onClick={() => navigate("/track")}
                >
                  <svg
                    width="29"
                    height="30"
                    viewBox="0 0 29 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 svg-icon"
                  >
                    <path
                      d="M25.293 6.07033H17.1992C16.6461 6.07033 16.1875 5.61168 16.1875 5.0586C16.1875 4.50552 16.6461 4.04688 17.1992 4.04688H25.293C25.8461 4.04688 26.3048 4.50552 26.3048 5.0586C26.3048 5.61168 25.8461 6.07033 25.293 6.07033Z"
                      fill={
                        window.location.pathname === "/track"
                          ? "white"
                          : "black"
                      }
                    />
                    <path
                      d="M21.2461 10.1172H17.1992C16.6461 10.1172 16.1875 9.65855 16.1875 9.10548C16.1875 8.5524 16.6461 8.09375 17.1992 8.09375H21.2461C21.7992 8.09375 22.2579 8.5524 22.2579 9.10548C22.2579 9.65855 21.7992 10.1172 21.2461 10.1172Z"
                      fill={
                        window.location.pathname === "/track"
                          ? "white"
                          : "black"
                      }
                    />
                    <path
                      d="M13.8269 27.6539C6.20526 27.6539 0 21.4486 0 13.8269C0 6.20526 6.20526 0 13.8269 0C14.38 0 14.8387 0.458649 14.8387 1.01173C14.8387 1.5648 14.38 2.02345 13.8269 2.02345C7.31141 2.02345 2.02345 7.3249 2.02345 13.8269C2.02345 20.329 7.31141 25.6304 13.8269 25.6304C20.3425 25.6304 25.6304 20.329 25.6304 13.8269C25.6304 13.2739 26.0891 12.8152 26.6421 12.8152C27.1952 12.8152 27.6539 13.2739 27.6539 13.8269C27.6539 21.4486 21.4486 27.6539 13.8269 27.6539Z"
                      fill={
                        window.location.pathname === "/track"
                          ? "white"
                          : "black"
                      }
                    />
                    <path
                      d="M27.9919 29.0027C27.7356 29.0027 27.4793 28.9083 27.277 28.7059L24.579 26.008C24.1878 25.6168 24.1878 24.9693 24.579 24.5781C24.9702 24.1869 25.6178 24.1869 26.009 24.5781L28.7069 27.276C29.0981 27.6672 29.0981 28.3147 28.7069 28.7059C28.5045 28.9083 28.2482 29.0027 27.9919 29.0027Z"
                      fill={
                        window.location.pathname === "/track"
                          ? "white"
                          : "black"
                      }
                    />
                  </svg>
                  <p className="absolute hidden ml-4 text-sm font-bold text-black left-10 group-hover:block">
                    Track
                  </p>
                </div>
              </div>
              {/* add new */}
              <div className="relative flex flex-row items-center group">
                <div
                  className={
                    window.location.pathname === "/new"
                      ? "p-3 bg-custom-primary  svg-container-s flex flex-row items-center hover:cursor-pointer"
                      : "p-3   svg-container-s flex flex-row items-center hover:cursor-pointer hover:bg-custom-primary/20"
                  }
                  onClick={() => navigate("/new")}
                >
                  <svg
                    width="76"
                    height="77"
                    viewBox="0 0 76 77"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 svg-icon"
                  >
                    <path
                      d="M51.7884 41.2032H23.7645C22.3282 41.2032 21.1372 40.0122 21.1372 38.576C21.1372 37.1397 22.3282 35.9487 23.7645 35.9487H51.7884C53.2246 35.9487 54.4157 37.1397 54.4157 38.576C54.4157 40.0122 53.2246 41.2032 51.7884 41.2032Z"
                      fill={
                        window.location.pathname === "/new" ? "white" : "black"
                      }
                    />
                    <path
                      d="M37.7762 55.2155C36.3399 55.2155 35.1489 54.0244 35.1489 52.5882V24.5643C35.1489 23.128 36.3399 21.937 37.7762 21.937C39.2124 21.937 40.4034 23.128 40.4034 24.5643V52.5882C40.4034 54.0244 39.2124 55.2155 37.7762 55.2155Z"
                      fill={
                        window.location.pathname === "/new" ? "white" : "black"
                      }
                    />
                    <path
                      d="M48.2853 76.2333H27.2673C8.24609 76.2333 0.119141 68.1064 0.119141 49.0851V28.0672C0.119141 9.04589 8.24609 0.918945 27.2673 0.918945H48.2853C67.3066 0.918945 75.4335 9.04589 75.4335 28.0672V49.0851C75.4335 68.1064 67.3066 76.2333 48.2853 76.2333ZM27.2673 6.17344C11.1185 6.17344 5.37363 11.9183 5.37363 28.0672V49.0851C5.37363 65.2339 11.1185 70.9788 27.2673 70.9788H48.2853C64.4341 70.9788 70.179 65.2339 70.179 49.0851V28.0672C70.179 11.9183 64.4341 6.17344 48.2853 6.17344H27.2673Z"
                      fill={
                        window.location.pathname === "/new" ? "white" : "black"
                      }
                    />
                  </svg>
                  <p className="absolute hidden w-20 ml-4 text-sm font-bold text-black left-10 group-hover:block">
                    Add New
                  </p>
                </div>
              </div>
              {/* modify */}
              <div className="relative flex flex-row items-center group">
                <div
                  className={
                    window.location.pathname === "/inventory"
                      ? "p-3 bg-custom-primary   svg-container-s flex flex-row items-center hover:cursor-pointer rounded-br-xl"
                      : "p-3   svg-container-s flex flex-row items-center hover:cursor-pointer hover:bg-custom-primary/20 rounded-br-xl"
                  }
                  onClick={() => navigate("/inventory")}
                >
                  <svg
                    width="31"
                    height="31"
                    viewBox="0 0 31 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 svg-icon"
                  >
                    <path
                      d="M17.2401 5.64001L21.8801 1L30 9.12002L25.36 13.76M17.2401 5.64001L1.48048 21.3996C1.17284 21.7072 1 22.1245 1 22.5596V30H8.44049C8.87558 30 9.29284 29.8273 9.6005 29.5195L25.36 13.76M17.2401 5.64001L25.36 13.76"
                      stroke={
                        window.location.pathname === "/inventory"
                          ? "white"
                          : "black"
                      }
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p className="absolute hidden w-20 ml-4 text-sm font-bold text-black left-10 group-hover:block">
                    Inventory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Navbar;
