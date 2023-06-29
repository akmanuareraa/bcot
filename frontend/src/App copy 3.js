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

function App() {
  const navigate = useNavigate();
  const backendURL = "http://localhost:4948";
  // const [iotData, setIoTData] = useState({
  //   temperature: 0,
  //   humidity: 0,
  //   pressure: 0,
  //   ph: 0,
  //   energy: 0,
  //   power: 0,
  //   airquality: 0,
  //   gasemission: 0,
  // });
  const [iotData, setIoTData] = useState({
    temperature: {
      average: 0,
      min: Infinity,
      max: -Infinity,
    },
    humidity: {
      average: 0,
      min: Infinity,
      max: -Infinity,
    },
    pressure: {
      average: 0,
      min: Infinity,
      max: -Infinity,
    },
    ph: {
      average: 0,
      min: Infinity,
      max: -Infinity,
    },
    energy: {
      average: 0,
      min: Infinity,
      max: -Infinity,
    },
    power: {
      average: 0,
      min: Infinity,
      max: -Infinity,
    },
    airquality: {
      average: 0,
      min: Infinity,
      max: -Infinity,
    },
    gasemission: {
      average: 0,
      min: Infinity,
      max: -Infinity,
    },
  });
  const [loading, setLoading] = useState({
    loading: false,
    message: "",
  });
  const [appState, setAppState] = useState({
    loggedIn: false,
    web3: null,
    account: "",
    // contractAddress: "0x3eEc05efde82F496C5fD7028836AeDEddeEb0dA3",
    contractAddress: "0x700e27954e724a8DD68B6fB9285E201223205670",
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

  // useEffect(() => {
  //   let liveData = {
  //     temperature: 0,
  //     humidity: 0,
  //     pressure: 0,
  //     ph: 0,
  //     energy: 0,
  //     power: 0,
  //     airquality: 0,
  //     gasemission: 0,
  //   };
  //   let avgData = {
  //     temperature: 0,
  //     humidity: 0,
  //     pressure: 0,
  //     ph: 0,
  //     energy: 0,
  //     power: 0,
  //     airquality: 0,
  //     gasemission: 0,
  //   };
  //   let counter = 0;

  //   const fetchData = async () => {
  //     try {
  //       console.log("Start =============================");
  //       const response = await axios.get(
  //         "https://bcot-iot-backend.onrender.com/iotdata"
  //       );
  //       counter++;
  //       console.log("Iteration: ", counter);

  //       liveData = {
  //         temperature: liveData.temperature + response.data.temperature,
  //         humidity: liveData.humidity + response.data.humidity,
  //         pressure: liveData.pressure + response.data.pressure,
  //         ph: liveData.ph + response.data.ph,
  //         energy: liveData.energy + response.data.energy,
  //         power: liveData.power + response.data.power,
  //         airquality: liveData.airquality + response.data.airquality,
  //         gasemission: liveData.gasemission + response.data.gasemission,
  //       };

  //       avgData = {
  //         temperature: calAvg(liveData.temperature, counter),
  //         humidity: calAvg(liveData.humidity, counter),
  //         pressure: calAvg(liveData.pressure, counter),
  //         ph: calAvg(liveData.ph, counter),
  //         energy: calAvg(liveData.energy, counter),
  //         power: calAvg(liveData.power, counter),
  //         airquality: calAvg(liveData.airquality, counter),
  //         gasemission: calAvg(liveData.gasemission, counter),
  //       };

  //       // console.log("Avg Data**: ", avgData);

  //       setIoTData(avgData);

  //       // console.log("Avg Data: ", avgData);
  //       console.log("End =============================");
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   const interval = setInterval(fetchData, 3500); // Poll every second

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    let counter = 0;

    const fetchData = async () => {
      try {
        console.log("Start =============================");
        const response = await axios.get(
          "https://bcot-iot-backend.onrender.com/iotdata"
        );
        counter++;
        console.log("Iteration: ", counter);

        setIoTData((prevData) => {
          const newData = { ...prevData };

          for (const key in response.data) {
            const value = response.data[key];

            // Update minimum
            if (value < newData[key].min) {
              newData[key].min = value;
            }

            // Update maximum
            if (value > newData[key].max) {
              newData[key].max = value;
            }

            // Update average
            newData[key].average = calculateAverage(
              newData[key].average,
              value,
              counter
            );
          }

          return newData;
        });

        console.log("Updated iotData: ", iotData);
        console.log("End =============================");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 3500); // Poll every 3.5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  const calculateAverage = (total, value, count) => {
    return (total * (count - 1) + value) / count;
  };

  useEffect(() => {
    console.log("Updated iotData:", iotData);
  }, [iotData]);

  const calAvg = (total, count) => {
    return total / count;
  };

  const setUpWeb3 = async () => {
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Connecting your wallet...",
      };
    });
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setAppState((prevState) => {
          return { ...prevState, web3: web3 };
        });
        console.log("<< Web3 Object Received  >>");

        window.ethereum
          .request({ method: "net_version" })
          .then(async (chainId) => {
            if (chainId !== "80001") {
              try {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0x13881" }],
                });
                console.log("Polygon Mumbai Chain found.");
              } catch (switchError) {
                console.log("Error connecting to Polygon Mumbai Chain (1)");
              }
            }
          });

        const accounts = await web3.eth.getAccounts();
        console.log("<< Account Received  >>", accounts[0]);

        setAppState((prevState) => {
          return {
            ...prevState,
            account: accounts[0],
          };
        });
        setLoading((prevState) => {
          return {
            loading: false,
            message: "Connecting your wallet...",
          };
        });
      } catch (error) {
        console.error(error);
        console.log("Error getting web3 object. Install Metamask.");
        setLoading((prevState) => {
          return {
            loading: false,
            message: "Connecting your wallet...",
          };
        });
      }
    } else {
      console.log("Please install MetaMask to connect your wallet.");
      setLoading((prevState) => {
        return {
          loading: false,
          message: "Connecting your wallet...",
        };
      });
    }
  };

  const walletLogout = async () => {
    console.log("<< Wallet Logout Called  >>");
    setAppState((prevState) => {
      return {
        ...prevState,
        loggedIn: false,
        username: "",
        account: "",
      };
    });
    navigate("/");
  };

  const disconnectWallet = () => {
    console.log("<< Wallet Logout Called  >>");
    setAppState((prevState) => {
      return {
        ...prevState,
        loggedIn: false,
        username: "",
        account: "",
      };
    });
  };

  const createNonce = async (address) => {
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Creating Nonce...",
      };
    });
    // Remove the first two characters "0x"
    address = address.slice(2);

    // Convert each hexadecimal digit to a decimal number
    const decimalArray = [];
    for (let i = 0; i < address.length; i += 2) {
      decimalArray.push(parseInt(address.slice(i, i + 2), 16));
    }

    // Apply the custom algorithm to each decimal number
    const encodedArray = decimalArray.map((decimal) => {
      return ((decimal * 7) % 23) + 65;
    });

    // Convert the encoded decimal array to a string
    const encodedString = String.fromCharCode(...encodedArray);

    console.log("<< Encoded Wallet Address >>", encodedString);
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Getting Signature...",
      };
    });
    return encodedString;
  };

  const getSignature = async (page, role, name) => {
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Getting signature...",
      };
    });
    try {
      const uuid = await createNonce(appState.account);
      const message =
        "Message: \n\nWelcome to BCoT Framework!\n\nSign this message to verify you wallet address. This request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n" +
        appState.account +
        "\n\nNonce:\n" +
        uuid +
        "\n\n";
      const signature = await appState.web3.eth.personal.sign(
        message,
        appState.account
      );
      console.log("<< Signature Received  >>", signature);
      if (page === "signup") toast.success("Signature received successfully.");
      const signResult = await verifySignature(signature, message);
      if (signResult === true && page === "signup") {
        toast.success("Signature verified successfully.");
        signupUser(appState.account + "@user.com", signature, name, role);
      } else if (signResult === true && page === "signin") {
        signinUser(appState.account + "@user.com", signature);
      } else {
        toast.error("Signature verification failed.");
        setLoading((prevState) => {
          return {
            loading: false,
            message: "Connecting your wallet...",
          };
        });
      }
    } catch (error) {
      console.error("Error in getSignature:", error);
      toast.error("An error occurred while getting the signature.");
      setLoading((prevState) => {
        return {
          loading: false,
          message: "Connecting your wallet...",
        };
      });
    }
  };

  const verifySignature = async (signature, message) => {
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Verifying signature...",
      };
    });
    try {
      const publicKeyAddress = Web3.utils.toChecksumAddress(appState.account);
      const recoveredAddress = appState.web3.eth.accounts.recover(
        message,
        signature
      );
      const isSignatureValid = recoveredAddress === publicKeyAddress;
      return isSignatureValid;
    } catch (error) {
      setLoading((prevState) => {
        return {
          loading: false,
          message: "Connecting your wallet...",
        };
      });
      console.error("Error in verifySignature:", error);
      toast.error("An error occurred while verifying the signature.");
    }
  };

  const signupUser = async (email, password, name, role) => {
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Creating new user account...",
      };
    });
    console.log("<< Signup User Called  >>", email, password, name, role);
    try {
      await axios
        .post(backendURL + "/v1/auth/register", {
          email: email,
          password: password,
          name: name,
        })
        .then(async (response) => {
          // console.log("<< Signup Response Received  >>", response);
          let rand = (Math.floor(Math.random() * 900) + 100).toString();
          let code = "";
          if (role === "Manufacturer") code = "MAN" + rand;
          else if (role === "Distributor") code = "DIS" + rand;
          else if (role === "HProf") code = "HEA" + rand;
          console.log("<< Signup Code Generated  >>", code);
          await axios
            .post(backendURL + "/create-user-profile", {
              userId: response.data.user.id,
              role: role,
              uid: code,
            })
            .then(async (response) => {
              toast.success(
                "User profile created successfully.",
                response.data
              );
              setLoading((prevState) => {
                return {
                  loading: true,
                  message: "Adding user data to Blockchain...",
                };
              });
              const result = await signupSmartContract(
                role,
                response.data.credentials.key,
                response.data.credentials.hash,
                code
              );
              if (result === "success") {
                toast.success("Signup successful.", response);
                setLoading((prevState) => {
                  return {
                    loading: false,
                    message: "Connecting your wallet...",
                  };
                });
                navigate("/signin");
              } else {
                toast.error("An error occurred while signing up.");
                console.log("<< Signup Response Error  >>", result);
                setLoading((prevState) => {
                  return {
                    loading: false,
                    message: "Connecting your wallet...",
                  };
                });
              }
            })
            .catch((error) => {
              console.log(
                "<< User Profile Creation Response Received  >>",
                error
              );
              toast.error("An error occurred while creating the user profile.");
              setLoading((prevState) => {
                return {
                  loading: false,
                  message: "Connecting your wallet...",
                };
              });
            });
        })
        .catch((error) => {
          setLoading((prevState) => {
            return {
              loading: false,
              message: "Connecting your wallet...",
            };
          });
          //   console.log("<< Signup Response Received  >>", error);
          if (error.response.status === 400) {
            toast.error("Account already exists. Please sign in.");
          } else {
            toast.error("An error occurred while signing up.");
          }
          disconnectWallet();
        });
    } catch (error) {
      console.error("Error in signupUser:", error);
      toast.error("An error occurred while signing up.");
    }
  };

  const signinUser = async (email, password) => {
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Signing in...",
      };
    });
    try {
      console.log("<< Signin Request Sent  >>", email, password);
      const result = await signinSmartContract();
      console.log("<< Signin Smart Contract Response Received  >>", result);
      if (result !== "error") {
        await axios
          .post(backendURL + "/v1/auth/login", {
            email: email,
            password: password,
          })
          .then(async (response) => {
            console.log("<< Signin Response Received  >>", response);
            const userId = response.data.user.id;
            toast.success("Signin successful.");
            setAppState((prevState) => {
              return {
                ...prevState,
                loggedIn: true,
                access_token: response.data.tokens.access.token,
                userData: {
                  ...prevState.userData,
                  name: response.data.user.name,
                  key: result.decryptionKey,
                  hash: result.dataHash,
                  id: userId,
                },
              };
            });

            await axios
              .get(backendURL + "/v1/users/" + response.data.user.id, {
                headers: {
                  Authorization: `Bearer ${response.data.tokens.access.token}`,
                },
              })
              .then(async (response) => {
                await axios
                  .get(backendURL + "/user-profile", {
                    params: {
                      userId: userId,
                      key: result.decryptionKey,
                      hash: result.dataHash,
                    },
                  })
                  .then(async (response) => {
                    console.log(
                      "<< User Profile Object Response Received  >>",
                      response
                    );

                    if (response.data.status === "success") {
                      if (
                        typeof response.data.userProfile.userProfile
                          .vaccineBatches === "string"
                      ) {
                        response.data.userProfile.userProfile.vaccineBatches =
                          JSON.parse(
                            response.data.userProfile.userProfile.vaccineBatches
                          );
                      }
                      setAppState((prevState) => {
                        return {
                          ...prevState,
                          userProfile: response.data.userProfile.userProfile,
                        };
                      });

                      // excess vaccines batch fetch step

                      let subUrl = "";
                      let keyId = "";

                      if (
                        response.data.userProfile.userProfile.role ===
                        "Manufacturer"
                      ) {
                        subUrl = "/get-man-batches";
                        keyId = "manId";
                      } else if (
                        response.data.userProfile.userProfile.role ===
                        "Distributor"
                      ) {
                        subUrl = "/get-dis-batches";
                        keyId = "disId";
                      } else if (
                        response.data.userProfile.userProfile.role === "HProf"
                      ) {
                        subUrl = "/get-hpro-batches";
                        keyId = "hproId";
                      }

                      await axios
                        .post(backendURL + subUrl, {
                          [keyId]: response.data.userProfile.userProfile.uid,
                        })
                        .then(async (response) => {
                          console.log(
                            "<< Distributor Batches Response Received  >>",
                            response.data.batches
                          );
                          const batchArray = response.data.batches;

                          const contract = new appState.web3.eth.Contract(
                            contractABI,
                            appState.contractAddress
                          );

                          let arrayWithKeys = [];

                          console.log("<< Batch Array >>", batchArray);

                          await batchArray.forEach(async (batch) => {
                            const result = await contract.methods
                              .getBatchData(batch.batchId)
                              .call({ from: appState.account });
                            // console.log("<< Batch Data Result >>", result);
                            arrayWithKeys.push({
                              batchId: batch.batchId,
                              key: result.decryptionKey,
                              hash: result.dataHash,
                            });
                            setAppState((prevState) => {
                              return {
                                ...prevState,
                                scData: arrayWithKeys,
                              };
                            });
                            if (arrayWithKeys.length === batchArray.length) {
                              console.log(
                                "<< Array With Keys >>",
                                arrayWithKeys
                              );

                              await axios
                                .post(backendURL + "/get-batch-data", {
                                  arrayWithKeys: arrayWithKeys,
                                })
                                .then((response) => {
                                  console.log(
                                    "<< Batch Data Response >>",
                                    response
                                  );
                                  setAppState((prevState) => {
                                    return {
                                      ...prevState,
                                      userProfile: {
                                        ...prevState.userProfile,
                                        vaccineBatches: response.data.batches,
                                      },
                                    };
                                  });
                                })
                                .catch((error) => {
                                  console.log(
                                    "<< Batch Data Response Error >>",
                                    error
                                  );
                                });
                            }
                          });
                        })
                        .catch((error) => {
                          console.log(
                            "<< Distributor Batches Response Error  >>",
                            error
                          );
                        });

                      setLoading((prevState) => {
                        return {
                          loading: false,
                          message: "Connecting your wallet...",
                        };
                      });
                      navigate("/dashboard");

                      // ends here
                    } else {
                      setLoading((prevState) => {
                        return {
                          loading: false,
                          message: "Connecting your wallet...",
                        };
                      });
                      if (
                        response.data.message ===
                        "Error decrypting user profile"
                      ) {
                        toast.error("Decryption Failure. Invalid key. ");
                      } else if (response.data.message === "Hash mismatch") {
                        toast.error(
                          "Data Integrity Failure. Invalid Hash or Data might have been tampered."
                        );
                      }
                    }
                  })
                  .catch((error) => {
                    setLoading((prevState) => {
                      return {
                        loading: false,
                        message: "Connecting your wallet...",
                      };
                    });
                    console.log(
                      "<< User Profile Object Response Received  >>",
                      error
                    );
                    toast.error(
                      "An error occurred while getting the user profile."
                    );
                  });
              })
              .catch((error) => {
                setLoading((prevState) => {
                  return {
                    loading: false,
                    message: "Connecting your wallet...",
                  };
                });
                console.log("<< User Object Response Received  >>", error);
                toast.error("An error occurred while getting the user.");
              });
          })
          .catch((error) => {
            setLoading((prevState) => {
              return {
                loading: false,
                message: "Connecting your wallet...",
              };
            });
            console.log("<< Signin Response Received  >>", error);
            if (error.response.data.code === 401) {
              toast.error("Invalid Credentials.");
            } else {
              toast.error("An error occurred while signing in.");
            }
            disconnectWallet();
          });
      } else {
        setLoading((prevState) => {
          return {
            loading: false,
            message: "Connecting your wallet...",
          };
        });
        toast.error("An error occurred while signing in the smart contract");
      }
    } catch (error) {
      setLoading((prevState) => {
        return {
          loading: false,
          message: "Connecting your wallet...",
        };
      });
      console.error("Error in signinUser:", error);
      toast.error("An error occurred while signing in.");
    }
  };

  const signupSmartContract = async (role, key, hash, uid) => {
    try {
      const contract = new appState.web3.eth.Contract(
        contractABI,
        appState.contractAddress
      );
      const result = await contract.methods
        .signup(role, key, hash, uid)
        .send({ from: appState.account });
      console.log("<< Signup Result >>", result);
      return "success";
    } catch (error) {
      console.error("Error in callLoginInSmartContract:", error);
      toast.error("An error occurred while calling the smart contract.");
      return "error";
    }
  };

  const signinSmartContract = async () => {
    try {
      const contract = new appState.web3.eth.Contract(
        contractABI,
        appState.contractAddress
      );
      const result = await contract.methods
        .signin()
        .call({ from: appState.account });
      console.log("<< Login Result >>", result);
      setAppState((prevState) => {
        return {
          ...prevState,
          loggedIn: true,
          userData: {
            ...prevState.userData,
            role: result.role,
            key: result.decryptionKey,
            hash: result.dataHash,
          },
        };
      });
      return result;
    } catch (error) {
      console.error("Error in callLoginInSmartContract:", error);
      toast.error("An error occurred while calling the smart contract.");
      return "error";
    }
  };

  const createNewVaccineBatchOnBlockchain = async (
    batchId,
    manufacturerID,
    vaccineName,
    vaccineCount,
    expiry,
    distributorId,
    manufactureParams
  ) => {
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Creating new batch...",
      };
    });
    console.log(
      "<< Create New Vaccine Batch Request Sent to Smart Contract >>",
      batchId,
      manufacturerID,
      vaccineName,
      vaccineCount,
      expiry,
      distributorId,
      manufactureParams
    );
    try {
      const contract = new appState.web3.eth.Contract(
        contractABI,
        appState.contractAddress
      );
      setLoading((prevState) => {
        return {
          loading: true,
          message: "Uploading data to Blockchain...",
        };
      });
      const result = await contract.methods
        .newManufacture(batchId, "", "", manufacturerID, distributorId)
        .send({ from: appState.account });
      console.log(
        "<< Create New Vaccine Batch Result Smart Contract>>",
        result
      );
      const txnHash = result.transactionHash;
      let batchObject = {
        batchId: batchId,
        manufacturerID: manufacturerID,
        hprofId: "",
        txnHash: txnHash,
        vaccineName: vaccineName,
        vaccineCount: vaccineCount,
        expiry: expiry,
        distributorId: distributorId,
        manufactureParams: manufactureParams,
        distributorParams: {},
        authorizedBy: appState.account,
        status: "Vaccine Manufacture - Data in Blockchain",
        timestamp: new Date().getTime().toString(),
        distAuthBy: "",
        distTxnHash: "",
        distTimestamp: "",
        hprofAuthBy: "",
        hprofTxnHash: "",
        hprofTimestamp: "",
      };

      let userObject = {
        key: appState.userData.key,
        hash: appState.userData.hash,
        id: appState.userData.id,
      };

      setLoading((prevState) => {
        return {
          loading: true,
          message: "Updating data...",
        };
      });

      // call the backend with this object to create a new batch
      await axios
        .post(backendURL + "/new-manufacture", { batchObject, userObject })
        .then(async (response) => {
          console.log(
            "<< Create New Vaccine Batch Backend New Addition Success  >>",
            response
          );

          setAppState((prevState) => {
            return {
              ...prevState,
              userData: {
                ...prevState.userData,
                hash: response.data.newUserProfileHash,
              },
            };
          });

          console.log("Calling updateManufacture", appState, response);

          // call the updateBatch function to update the key and the hash
          const updateBatchResult = await contract.methods
            .updateBatch(
              batchId,
              response.data.batchKey,
              response.data.batchHash,
              appState.userProfile.uid,
              response.data.newUserProfileHash,
              manufacturerID,
              distributorId,
              ""
            )
            .send({ from: appState.account })
            .then((result) => {
              console.log("<< Update Batch Result Smart Contract >>", result);
              console.log("returning txnHash", txnHash);
              fetchUserProfile(response.data.newUserProfileHash);
              setLoading((prevState) => {
                return {
                  loading: false,
                  message: "Connecting your wallet...",
                };
              });
            })
            .catch((error) => {
              setLoading((prevState) => {
                return {
                  loading: false,
                  message: "Connecting your wallet...",
                };
              });
              console.log("<< Update Batch Error >>", error);
            });
        })
        .catch((error) => {
          setLoading((prevState) => {
            return {
              loading: false,
              message: "Connecting your wallet...",
            };
          });
          console.log(
            "<< Create New Vaccine Batch Response Received  >>",
            error
          );
          toast.error("An error occurred while creating the new batch.");
        });
      return txnHash;
    } catch (error) {
      setLoading((prevState) => {
        return {
          loading: false,
          message: "Connecting your wallet...",
        };
      });
      console.error("Error in createNewVaccineBatch:", error);
      toast.error("An error occurred while calling the smart contract.");
      return "error";
    }
  };

  const fetchUserProfile = async (customHash) => {
    console.log("<< Fetching User Profile >>", appState, customHash);
    setLoading((prevState) => {
      return {
        loading: true,
        message: "Fetching updated user profile...",
      };
    });
    await axios
      .get(backendURL + "/user-profile", {
        params: {
          userId: appState.userProfile.userId,
          key: appState.userData.key,
          hash: customHash ? customHash : appState.userData.hash,
        },
      })
      .then(async (response) => {
        console.log("<< User Profile Object Response Received  >>", response);
        if (response.data.status === "success") {
          console.log(
            "<< User Profile Object type  >>",
            typeof response.data.userProfile.userProfile.vaccineBatches,
            response.data.userProfile.userProfile.vaccineBatches.length
          );
          if (response.data.userProfile.userProfile.vaccineBatches.length > 0) {
            response.data.userProfile.userProfile.vaccineBatches = JSON.parse(
              response.data.userProfile.userProfile.vaccineBatches
            );
          }
          setAppState((prevState) => {
            return {
              ...prevState,
              userProfile: response.data.userProfile.userProfile,
            };
          });
          if (customHash) {
            setAppState((prevState) => {
              return {
                ...prevState,
                userData: {
                  ...prevState.userData,
                  hash: customHash,
                },
              };
            });
          }
          // excess vaccines batch fetch step
          let subUrl = "";
          let keyId = "";

          if (response.data.userProfile.userProfile.role === "Manufacturer") {
            subUrl = "/get-man-batches";
            keyId = "manId";
          } else if (
            response.data.userProfile.userProfile.role === "Distributor"
          ) {
            subUrl = "/get-dis-batches";
            keyId = "disId";
          } else if (response.data.userProfile.userProfile.role === "HProf") {
            subUrl = "/get-hpro-batches";
            keyId = "hproId";
          }

          await axios
            .post(backendURL + subUrl, {
              [keyId]: response.data.userProfile.userProfile.uid,
            })
            .then(async (response) => {
              console.log(
                "<< Distributor Batches Response Received  >>",
                response.data.batches
              );
              const batchArray = response.data.batches;

              const contract = new appState.web3.eth.Contract(
                contractABI,
                appState.contractAddress
              );

              let arrayWithKeys = [];

              console.log("<< Batch Array >>", batchArray);

              await batchArray.forEach(async (batch) => {
                const result = await contract.methods
                  .getBatchData(batch.batchId)
                  .call({ from: appState.account });
                // console.log("<< Batch Data Result >>", result);
                arrayWithKeys.push({
                  batchId: batch.batchId,
                  key: result.decryptionKey,
                  hash: result.dataHash,
                });
                setAppState((prevState) => {
                  return {
                    ...prevState,
                    scData: arrayWithKeys,
                  };
                });
                if (arrayWithKeys.length === batchArray.length) {
                  console.log("<< Array With Keys >>", arrayWithKeys);

                  await axios
                    .post(backendURL + "/get-batch-data", {
                      arrayWithKeys: arrayWithKeys,
                    })
                    .then((response) => {
                      console.log("<< Batch Data Response >>", response);
                      setAppState((prevState) => {
                        return {
                          ...prevState,
                          userProfile: {
                            ...prevState.userProfile,
                            vaccineBatches: response.data.batches,
                          },
                        };
                      });
                    })
                    .catch((error) => {
                      console.log("<< Batch Data Response Error >>", error);
                    });
                }
              });
            })
            .catch((error) => {
              console.log("<< Distributor Batches Response Error  >>", error);
            });

          setLoading((prevState) => {
            return {
              loading: false,
              message: "Connecting your wallet...",
            };
          });
          // navigate("/dashboard");

          // ends here
        } else {
          setLoading((prevState) => {
            return {
              loading: false,
              message: "Connecting your wallet...",
            };
          });
          if (response.data.message === "Error decrypting user profile") {
            toast.error("Decryption Failure. Invalid key. ");
          } else if (response.data.message === "Hash mismatch") {
            toast.error(
              "Data Integrity Failure. Invalid Hash or Data might have been tampered."
            );
          }
        }
      })
      .catch((error) => {
        setLoading((prevState) => {
          return {
            loading: false,
            message: "Connecting your wallet...",
          };
        });
        console.log("<< User Profile Object Response Received  >>", error);
        toast.error("An error occurred while getting the user profile.");
      });
  };

  const updateStatus = async (batchId, status, miscObj) => {
    try {
      setLoading((prevState) => {
        return {
          loading: true,
          message: "Updating status...",
        };
      });
      console.log("<< Update Status >>", batchId, status, appState);
      const contract = new appState.web3.eth.Contract(
        contractABI,
        appState.contractAddress
      );
      const result = await contract.methods
        .getBatchData(batchId)
        .call({ from: appState.account });
      console.log("<< Update Status Result Smart Contract >>", result);
      const batchHash = result.dataHash;
      const batchKey = result.decryptionKey;
      const oldUserHash = appState.userData.hash;

      let objectToSend = {
        batchId: batchId,
        status: status,
        batchHash: batchHash,
        batchKey: batchKey,
        userHash: appState.userData.hash,
        userKey: appState.userData.key,
        userId: appState.userProfile.userId,
      };

      let misc = {};

      if (miscObj) {
        if (miscObj.hprofId !== undefined && miscObj.hprofId !== "")
          misc.hprofId = miscObj.hprofId;
        if (miscObj.disAuthBy !== undefined && miscObj.disAuthBy !== "")
          misc.disAuthBy = miscObj.disAuthBy;
        if (miscObj.disTimestamp !== undefined && misc.disTimestamp !== "")
          misc.disTimestamp = miscObj.disTimestamp;
        if (miscObj.disTxnHash !== undefined && misc.disTxnHash !== "")
          misc.disTxnHash = miscObj.disTxnHash;
        if (miscObj.hprofAuthBy !== undefined && misc.hprofAuthBy !== "")
          misc.hprofAuthBy = miscObj.hprofAuthBy;
        if (miscObj.hprofTimestamp !== undefined && misc.hprofTimestamp !== "")
          misc.hprofTimestamp = miscObj.hprofTimestamp;
        if (miscObj.hprofTxnHash !== undefined && misc.hprofTxnHash !== "")
          misc.hprofTxnHash = miscObj.hprofTxnHash;
      } else console.log("Proceeding without MISC object");

      let subUrl = "/update-status";
      let newUserHash = "";

      if (appState.userProfile.role !== "Manufacturer")
        subUrl = "/update-status-misc";

      console.log("<< Update Status Object to Send >>", {
        objectToSend,
        misc,
      });

      // call the backend with this object to create a new batch
      await axios
        .post(backendURL + subUrl, { objectToSend, misc })
        .then(async (response) => {
          console.log(
            "<< Update Status Backend New Addition Success  >>",
            response
          );
          if (response.data.status === "success") {
            if (appState.userProfile.role === "Manufacturer") {
              setAppState((prevState) => {
                return {
                  ...prevState,
                  userData: {
                    ...prevState.userData,
                    hash: response.data.userHash,
                  },
                };
              });
              newUserHash = response.data.userHash;
            }
          } else {
            toast.error("Safety checks failed. Check console.");
          }

          console.log("Calling updateStatus", appState, response);

          // get the distributorId
          const disId = appState.userProfile.vaccineBatches.filter(
            (batch) => batch.batchId === batchId
          )[0].distributorId;

          const manId = appState.userProfile.vaccineBatches.filter(
            (batch) => batch.batchId === batchId
          )[0].manufacturerID;

          const hId = appState.userProfile.vaccineBatches.filter(
            (batch) => batch.batchId === batchId
          )[0].hprofId;

          console.log("IDs: ", manId, disId, hId);

          console.log(
            "<< Update Status Object to Send to Contract>>",
            batchId,
            "-",
            batchKey,
            "-",
            response.data.batchHash,
            "-",
            appState.userProfile.uid,
            "-",
            oldUserHash,
            "-",
            newUserHash
          );

          let hashToStore = "";
          if (appState.userProfile.role === "Manufacturer")
            hashToStore = newUserHash;
          else hashToStore = oldUserHash;

          // call the updateBatch function to update the key and the hash
          const updateBatchResult = await contract.methods
            .updateBatch(
              batchId,
              batchKey,
              response.data.batchHash,
              appState.userProfile.uid,
              hashToStore,
              manId,
              disId,
              hId
            )
            .send({ from: appState.account })
            .then((result) => {
              console.log("<< Update Batch Result Smart Contract >>", result);
              if (appState.userProfile.role !== "Manufacturer") {
                setAppState((prevState) => {
                  return {
                    ...prevState,
                    userData: {
                      ...prevState.userData,
                      hash: hashToStore,
                    },
                  };
                });
                fetchUserProfile(oldUserHash);
              } else {
                fetchUserProfile(response.data.userHash);
              }
              // navigate("/dashboard");
              setLoading((prevState) => {
                return {
                  loading: false,
                  message: "Connecting your wallet...",
                };
              });
            })
            .catch((error) => {
              setLoading((prevState) => {
                return {
                  loading: false,
                  message: "Connecting your wallet...",
                };
              });
              console.log("<< Update Batch Error >>", error);
            });
        })
        .catch((error) => {
          setLoading((prevState) => {
            return {
              loading: false,
              message: "Connecting your wallet...",
            };
          });
          console.log("<< Update Status Backend New Addition Error  >>", error);
          toast.error("An error occurred while updating the status.");
        });
    } catch (error) {
      setLoading((prevState) => {
        return {
          loading: false,
          message: "Connecting your wallet...",
        };
      });
      console.error("Error in updateStatus:", error);
      toast.error("An error occurred while calling the smart contract.");
    }
  };

  const verifyAuthenticity = async (batchId, key, hash) => {
    console.log("<< Verify Authenticity >>", batchId, key, hash);
    try {
      await axios
        .post(backendURL + "/get-batch-hash-by-id", {
          batchId: batchId,
          eString: key,
        })
        .then(async (response) => {
          console.log("<< Verify Authenticity Backend >>", response.data);
          if (response.data.hash === hash) {
            console.log("The batch is authentic!", response.data.hash, hash);
            toast.success("The batch is authentic!");
          } else {
            toast.error("The batch is not authentic!");
          }
        });
    } catch (error) {
      console.error("Error in verifyAuthenticity:", error);
      toast.error("An error occurred while verifying the batch.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="h-screen">
        {loading.loading === true ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : null}

        {/* <Header appState={appState} loggedInParty={loggedInParty} /> */}
        <Navbar appState={appState} walletLogout={walletLogout} />

        <Routes>
          <Route
            path="/"
            element={
              <Homepage
              // appState={appState}
              // setUpWeb3={setUpWeb3}
              // walletLogout={walletLogout}
              // regsisterUser={regsisterUser}
              // loginUser={loginUser}
              />
            }
          />
          <Route
            path="/signin"
            element={
              <Signin
                appState={appState}
                setUpWeb3={setUpWeb3}
                walletLogout={walletLogout}
                disconnectWallet={disconnectWallet}
                getSignature={getSignature}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup
                appState={appState}
                setUpWeb3={setUpWeb3}
                walletLogout={walletLogout}
                disconnectWallet={disconnectWallet}
                getSignature={getSignature}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                appState={appState}
                setUpWeb3={setUpWeb3}
                walletLogout={walletLogout}
                fetchUserProfile={fetchUserProfile}
              />
            }
          />
          <Route path="/history" element={<History appState={appState} />} />
          <Route
            path="/track"
            element={
              <Track
                appState={appState}
                iotData={iotData}
                setIotData={setIoTData}
              />
            }
          />
          <Route
            path="/new"
            element={
              <New
                appState={appState}
                createNewVaccineBatchOnBlockchain={
                  createNewVaccineBatchOnBlockchain
                }
                updateStatus={updateStatus}
                verifyAuthenticity={verifyAuthenticity}
              />
            }
          />
          <Route
            path="/inventory"
            element={
              <Inventory appState={appState} updateStatus={updateStatus} />
            }
          />
          <Route
            path="/batch/:batchId"
            element={
              <Batch
                appState={appState}
                updateStatus={updateStatus}
                iotData={iotData}
                setIotData={setIoTData}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
