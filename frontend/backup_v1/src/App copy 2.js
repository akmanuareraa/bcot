import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Routes, Route, useNavigate } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";
import io from "socket.io-client";

import "./App.css";
import Loading from "./components/Loading";

import Homepage from "./pages/Homepage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

import contractABI from "./smart-contract/contractABI.json";
import New from "./pages/New";
import Inventory from "./pages/Inventory";
import History from "./pages/History";
import Track from "./pages/Track";
import Batch from "./pages/Batch";

const socket = io("https://bcot-iot-backend.onrender.com", { secure: true });

function App() {
  const navigate = useNavigate();
  const backendURL = "http://localhost:4948";
  const [loading, setLoading] = useState({
    loading: false,
    message: "",
  });
  const [appState, setAppState] = useState({
    loggedIn: false,
    web3: null,
    account: "",
    contractAddress: "0x3eEc05efde82F496C5fD7028836AeDEddeEb0dA3",
    userData: {
      name: "",
      role: "",
      key: "",
      hash: "",
    },
    manufacturerStats: {
      batchesManufactured: 0,
      vaccinesManufactured: 0,
      increasedProduction: 0,
      vaccinesDistributed: 0,
      vaccinesInTransit: 0,
      unitsInStock: 0,
    },
  });
  const [iotData, setIoTData] = useState([]);

  useEffect(() => {
    // Listen for 'data' event from the server
    socket.on("data", (receivedData) => {
      console.log("<< Data Received from IoT Device >>", receivedData);
      // Update the state with the received data
      setIoTData((prevData) => [...prevData, receivedData]);
    });

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return <>{/* ...other code here  */}</>;
}

export default App;
