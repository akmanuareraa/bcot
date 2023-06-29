import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import vaccineImage from "../assets/images/vaccine-bottle.png";
import statusImageOne from "../assets/icons/status-a.svg";
import manufacturedStatus from "../assets/icons/status-manu.svg";
import distributedStatus from "../assets/icons/status-dist.svg";
import deliveredStatus from "../assets/icons/status-deli.svg";
import clipboard from "../assets/icons/doubleclipboard.svg";
import document from "../assets/icons/document.svg";
import verfied from "../assets/icons/verified.svg";
import optimalDivider from "../assets/icons/optimal-divider.svg";
import up from "../assets/icons/up.svg";
import down from "../assets/icons/down.svg";

function Batch(props) {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [vaccineBatch, setVaccineBatch] = useState({});

  useEffect(() => {
    console.log("Batch ID: ", batchId, props.appState);
    if (props.appState.userProfile?.vaccineBatches?.length > 0) {
      props.appState.userProfile.vaccineBatches.forEach((batch) => {
        if (batch.batchId === batchId) {
          console.log("Vaccine Batch(A): ", batch);
          console.log(
            "Vaccine Batch(A)1: ",
            "MPs",
            batch.manufactureParams,
            "DPs",
            batch.distributorParams
          );
          if (props.appState.userProfile.role === "Manufacturer") {
            batch.manufactureParams = JSON.parse(batch.manufactureParams);
            if (batch.manufactureParams.temperature === undefined) {
              batch.manufactureParams = JSON.parse(
                JSON.parse(batch.manufactureParams)
              );
            }

            try {
              batch.distributorParams = batch.distributorParams.replace(
                /\\/g,
                ""
              );
              batch.distributorParams = batch.distributorParams.slice(1, -1);
              batch.distributorParams = JSON.parse(batch.distributorParams);
            } catch (error) {
              console.log(error);
              console.log("Man no dist params");
            }
          } else if (props.appState.userProfile.role === "Distributor") {
            batch.manufactureParams = batch.manufactureParams.replace(
              /\//g,
              ""
            );
            batch.manufactureParams = JSON.parse(batch.manufactureParams);
            try {
              batch.manufactureParams = JSON.parse(batch.manufactureParams);
            } catch (error) {
              console.log(error);
            }
            try {
              batch.manufactureParams = JSON.parse(batch.manufactureParams);
            } catch (error) {
              console.log(error);
            }
            try {
              batch.distributorParams = batch.distributorParams.replace(
                /\\/g,
                ""
              );
              batch.distributorParams = batch.distributorParams.slice(1, -1);
              batch.distributorParams = JSON.parse(batch.distributorParams);
            } catch (error) {
              console.log(error);
              console.log("Dist no dist params");
            }
          } else if (props.appState.userProfile.role === "HProf") {
            if (batch.distributorParams !== undefined) {
              batch.manufactureParams = batch.manufactureParams.replace(
                /\//g,
                ""
              );
              batch.manufactureParams = JSON.parse(
                JSON.parse(JSON.parse(batch.manufactureParams))
              );
              batch.distributorParams = batch.distributorParams.replace(
                /\\/g,
                ""
              );
              batch.distributorParams = batch.distributorParams.slice(1, -1);
              console.log("Vaccine Batch(A)1.5: ", batch.distributorParams);
              batch.distributorParams = JSON.parse(batch.distributorParams);
            }
          }
          console.log(
            "Vaccine Batch(A)2: ",
            "MPs",
            batch.manufactureParams,
            "DPs",
            batch.distributorParams
          );
          setVaccineBatch(batch);
          console.log("Vaccine Batch(B): ", batch);
        }
      });
    }
  }, []);

  return (
    <>
      <div className="flex flex-col px-40 pb-16 mt-8">
        <div className="flex flex-col space-y-1">
          <div className="flex flex-row items-center justify-between w-full">
            <p className="text-3xl font-bold">Shipment Details</p>
            {/* <button
              className="capitalize border-0 btn bg-custom-primary"
              onClick={() => {
                navigate("/track");
              }}
            >
              Track Another Shipment
            </button> */}
          </div>
          <div className="divider"></div>
        </div>
        {/* main column */}
        {vaccineBatch?.batchId ? (
          <div className="flex flex-col justify-center">
            {/* vaccine details container */}
            <div className="grid items-center grid-cols-3 mt-8">
              {/* left container */}
              <div className="flex flex-col items-end space-y-10">
                {/* vaccine name */}
                <div className="flex flex-col items-end">
                  <p className="text-xs">Vaccine Name</p>
                  <p className="text-xl font-bold uppercase">
                    {vaccineBatch.vaccineName}
                  </p>
                </div>
                {/* batch number */}
                <div className="flex flex-col items-end">
                  <p className="text-xs">Batch Number</p>
                  <p className="text-xl font-bold uppercase">
                    {vaccineBatch.batchId}
                  </p>
                </div>
                {/* expiry date */}
                <div className="flex flex-col items-end">
                  <p className="text-xs">Expiry Date</p>
                  <p className="text-xl font-bold uppercase">
                    {vaccineBatch.expiry}
                  </p>
                </div>
                {/* received date */}
                {/* <div className="flex flex-col items-end">
                  <p className="text-xs">Administered Date</p>
                  <p className="text-xl font-bold uppercase">
                    {vaccineBatch.receivedTimestamp
                      ? vaccineBatch.receivedTimestamp
                      : "Not Administered Yet"}
                  </p>
                </div> */}
              </div>
              {/* middle container */}
              <div className="flex flex-col">
                {/* vaccine image */}
                <img
                  src={vaccineImage}
                  alt="vaccine"
                  className="mx-auto w-60 h-80"
                ></img>
              </div>
              {/* right container */}
              <div className="flex flex-col space-y-10">
                {/* vaccine count */}
                <div className="flex flex-col">
                  <p className="text-xs">Vaccine Count</p>
                  <p className="text-xl font-bold uppercase">
                    {vaccineBatch.vaccineCount}
                  </p>
                </div>
                {/* date of manufacture */}
                <div className="flex flex-col">
                  <p className="text-xs">Date of Manufacture</p>
                  <p className="text-xl font-bold uppercase">
                    {new Date(
                      Number(vaccineBatch.timestamp)
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {/* manufacturer id */}
                <div className="flex flex-col">
                  <p className="text-xs">Manufacturer ID</p>
                  <p className="text-xl font-bold uppercase">
                    {vaccineBatch.manufacturerID}
                  </p>
                </div>
                {/* distributed date */}
                {/* <div className="flex flex-col">
                  <p className="text-xs">Distributed Date</p>
                  <p className="text-xl font-bold uppercase">
                    {vaccineBatch.distributedTimestamp
                      ? vaccineBatch.distributedTimestamp
                      : "Not Distributed"}
                  </p>
                </div> */}
              </div>
            </div>
            {/* status diagram */}
            <div className="flex flex-col justify-center mt-8 ml-10">
              {vaccineBatch.status === "Sent to Inventory" ||
              vaccineBatch.status === "Sent to Distributor" ? (
                <img src={manufacturedStatus} alt="status"></img>
              ) : vaccineBatch.status === "Received by Distributor" ||
                vaccineBatch.status === "In transit to HProf" ? (
                <img src={distributedStatus} alt="status"></img>
              ) : vaccineBatch.status === "Administered" ||
                vaccineBatch.status === "Received by HProf" ? (
                <img src={deliveredStatus} alt="status"></img>
              ) : (
                <img src={manufacturedStatus} alt="status"></img>
              )}
            </div>
            {/* auth QC txn */}
            <div className="flex flex-row items-center justify-between mt-8 space-x-4">
              {/* authority */}
              <div className="flex flex-col items-center h-56 py-6 space-y-6 w-72 bg-custom-secondary rounded-xl">
                <div className="flex flex-col items-center space-y-0">
                  <p className="text-2xl font-bold">Authority</p>
                  <p className="text-xs">Address</p>
                </div>
                <p className="text-xs font-bold">
                  {/* 0xBKK468U..6841KJH */}
                  {vaccineBatch.authorizedBy.slice(0, 10) +
                    "..." +
                    vaccineBatch.authorizedBy.slice(-10)}
                </p>
                <button
                  className="capitalize border-0 btn bg-custom-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(vaccineBatch.authorizedBy);
                  }}
                >
                  <div className="flex flex-row space-x-2">
                    <p>Copy Address</p>
                    <img src={clipboard} alt="status"></img>
                  </div>
                </button>
              </div>
              {/* qc */}
              <div className="flex flex-col items-center h-56 py-6 space-y-6 w-72 bg-custom-secondary rounded-xl">
                <div className="flex flex-col items-center space-y-0">
                  <p className="text-2xl font-bold">QC</p>
                  <p className="text-xs">Documents</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <button className="capitalize border-0 btn bg-custom-primary">
                    <div className="flex flex-row space-x-2">
                      <p>Raw Material QC</p>
                      <img src={document} alt="status"></img>
                    </div>
                  </button>
                  <button className="capitalize border-0 btn bg-custom-primary">
                    <div className="flex flex-row space-x-2">
                      <p>Manufacture QC</p>
                      <img src={document} alt="status"></img>
                    </div>
                  </button>
                </div>
              </div>
              {/* transaction */}
              <div className="flex flex-col items-center h-56 py-6 space-y-6 w-72 bg-custom-secondary rounded-xl">
                <div className="flex flex-col items-center space-y-0">
                  <p className="text-2xl font-bold">Transaction</p>
                  <p className="text-xs">Hash</p>
                </div>
                <p className="text-xs font-bold">
                  {vaccineBatch.txnHash.slice(0, 10) +
                    "..." +
                    vaccineBatch.txnHash.slice(-10)}
                </p>
                <div className="flex flex-col items-center space-y-2">
                  <button
                    className="capitalize border-0 btn bg-custom-primary"
                    onClick={() => {
                      window.open(
                        `https://mumbai.polygonscan.com/tx/${vaccineBatch.txnHash}`,
                        "_blank"
                      );
                    }}
                  >
                    <div className="flex flex-row space-x-2">
                      <p>Verify Transaction</p>
                      <img src={verfied} alt="status"></img>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/* manufacture parameters */}
            {props.iotData !== undefined ? (
              Object.keys(vaccineBatch?.manufactureParams).length > 0 ? (
                <>
                  <div className="flex flex-row items-center justify-between w-full mt-14 ">
                    <p className="text-3xl font-bold">Manufacture Parameters</p>
                  </div>
                  <div className="mt-0 divider"></div>
                  {/* parameters */}
                  <div className="grid grid-cols-3 grid-rows-2 gap-y-8 gap-x-20 ">
                    {/* temperature */}
                    <div className="flex flex-col items-center mt-4 space-y-2 w-fit">
                      <p className="mb-2 text-2xl font-extrabold">
                        Temperature
                      </p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {parseFloat(
                              vaccineBatch.manufactureParams.temperature.average
                            ).toFixed(1)}
                            °C
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {"<"}40°C
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.temperature.min
                              ).toFixed(1)}
                              °C
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.temperature.max
                              ).toFixed(1)}
                              °C
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* humidity */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">Humidity</p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {parseFloat(
                              vaccineBatch.manufactureParams.humidity.average
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {">"}10%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.humidity.min
                              ).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.humidity.max
                              ).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* light exposure */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">Pressure</p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {parseFloat(
                              vaccineBatch.manufactureParams.pressure.average
                            ).toFixed(1)}
                            &nbsp;pa
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {"<"}200&nbsp;pa
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.pressure.min
                              ).toFixed(1)}
                              &nbsp;pa
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.pressure.max
                              ).toFixed(1)}
                              &nbsp;pa
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* pressure */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">
                        Air Quality
                      </p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {parseFloat(
                              vaccineBatch.manufactureParams.airquality.average
                            ).toFixed(1)}
                            &nbsp;PM
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {"<"}500&nbsp;PM
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.airquality.min
                              ).toFixed(1)}
                              &nbsp;PM
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.airquality.max
                              ).toFixed(1)}
                              &nbsp;PM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* o2 levels */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">Power</p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {parseFloat(
                              vaccineBatch.manufactureParams.power.average
                            ).toFixed(1)}
                            &nbsp;W
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              --
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.power.min
                              ).toFixed(1)}
                              &nbsp;W
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {parseFloat(
                                vaccineBatch.manufactureParams.power.max
                              ).toFixed(1)}
                              &nbsp;W
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* co2 levels */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">Ph Levels</p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {vaccineBatch.manufactureParams.ph.average.charAt(
                              0
                            )}
                            &nbsp;Ph
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {"<"}10&nbsp;Ph
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.manufactureParams.ph.min.charAt(0)}
                              &nbsp;Ph
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.manufactureParams.ph.max.charAt(0)}
                              &nbsp;Ph
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="w-full text-2xl font-bold text-center text-black/50">
                  No Manufacture Parameters Available
                </p>
              )
            ) : (
              <p className="w-full text-2xl font-bold text-center text-black/50">
                No Manufacture Parameters Available
              </p>
            )}

            {/* distributor parameters */}
            <div className="flex flex-row items-center justify-between w-full mt-20 ">
              <p className="text-3xl font-bold">Logistics Parameters</p>
            </div>
            <div className="mt-0 divider"></div>
            {vaccineBatch.distributorParams !== undefined &&
            (vaccineBatch.status === "In transit to HProf" ||
              vaccineBatch.status === "Administered" ||
              vaccineBatch.status === "Received by HProf") ? (
              Object.keys(vaccineBatch?.distributorParams).length > 0 ? (
                <>
                  {/* parameters */}
                  <div className="grid grid-cols-3 grid-rows-2 gap-y-8 gap-x-20 ">
                    {/* temperature */}
                    <div className="flex flex-col items-center mt-4 space-y-2 w-fit">
                      <p className="mb-2 text-2xl font-extrabold">
                        Temperature
                      </p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-2xl font-extrabold">
                            {vaccineBatch.status === "In transit to HProf"
                              ? parseFloat(
                                  props.iotData.temperature.average
                                ).toFixed(1)
                              : parseFloat(
                                  vaccineBatch.distributorParams.temperature
                                    .average
                                ).toFixed(1)}
                            °C
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {"<"}40°C
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(
                                    props.iotData.temperature.average
                                  ).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.temperature
                                      .average
                                  ).toFixed(1)}
                              °C
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(
                                    props.iotData.temperature.average
                                  ).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.temperature
                                      .average
                                  ).toFixed(1)}
                              °C
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* humidity */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">Humidity</p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {vaccineBatch.status === "In transit to HProf"
                              ? parseFloat(
                                  props.iotData.humidity.average
                                ).toFixed(1)
                              : parseFloat(
                                  vaccineBatch.distributorParams.humidity
                                    .average
                                ).toFixed(1)}
                            %
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {">"}10%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(
                                    props.iotData.humidity.min
                                  ).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.humidity.min
                                  ).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(
                                    props.iotData.humidity.max
                                  ).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.humidity.max
                                  ).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* light exposure */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">Pressure</p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {vaccineBatch.status === "In transit to HProf"
                              ? parseFloat(
                                  props.iotData.pressure.average
                                ).toFixed(1)
                              : parseFloat(
                                  vaccineBatch.distributorParams.pressure
                                    .average
                                ).toFixed(1)}
                            &nbsp;pa
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {"<"}200&nbsp;pa
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(
                                    props.iotData.pressure.min
                                  ).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.pressure.min
                                  ).toFixed(1)}
                              &nbsp;pa
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(
                                    props.iotData.pressure.max
                                  ).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.pressure.max
                                  ).toFixed(1)}
                              &nbsp;pa
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* pressure */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">
                        Air Quality
                      </p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {vaccineBatch.status === "In transit to HProf"
                              ? parseFloat(
                                  props.iotData.airquality.average
                                ).toFixed(1)
                              : parseFloat(
                                  vaccineBatch.distributorParams.airquality
                                    .average
                                ).toFixed(1)}
                            &nbsp;PM
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {"<"}500&nbsp;PM
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(
                                    props.iotData.airquality.min
                                  ).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.airquality
                                      .min
                                  ).toFixed(1)}
                              &nbsp;PM
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(
                                    props.iotData.airquality.max
                                  ).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.airquality
                                      .max
                                  ).toFixed(1)}
                              &nbsp;PM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* o2 levels */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">Power</p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {vaccineBatch.status === "In transit to HProf"
                              ? parseFloat(props.iotData.power.average).toFixed(
                                  1
                                )
                              : parseFloat(
                                  vaccineBatch.distributorParams.power.average
                                ).toFixed(1)}
                            &nbsp;W
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              --
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(props.iotData.power.min).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.power.min
                                  ).toFixed(1)}
                              &nbsp;W
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(props.iotData.power.max).toFixed(1)
                                : parseFloat(
                                    vaccineBatch.distributorParams.power.max
                                  ).toFixed(1)}
                              &nbsp;W
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* co2 levels */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      <p className="mb-2 text-2xl font-extrabold">Ph Levels</p>
                      <div className="flex flex-row justify-between space-x-8">
                        <div className="flex flex-col">
                          <p className="text-sm">Average</p>
                          <p className="text-4xl font-extrabold">
                            {vaccineBatch.status === "In transit to HProf"
                              ? parseFloat(
                                  props.iotData.ph.average / 10
                                ).toFixed(1)
                              : parseFloat(
                                  vaccineBatch.distributorParams.ph.average / 10
                                ).toFixed(1)}
                            &nbsp;Ph
                          </p>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={optimalDivider} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-sm">Optimal</p>
                            <p className="text-sm font-semibold text-green">
                              {"<"}10&nbsp;Ph
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between pt-2 space-x-10">
                        <div className="flex flex-row space-x-4">
                          <img src={down} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Lowest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(props.iotData.ph.min / 10).toFixed(
                                    1
                                  )
                                : parseFloat(
                                    vaccineBatch.distributorParams.ph.min / 10
                                  ).toFixed(1)}
                              &nbsp;Ph
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                          <img src={up} alt="status"></img>
                          <div className="flex flex-col">
                            <p className="text-xs">Highest</p>
                            <p className="text-sm font-extrabold">
                              {vaccineBatch.status === "In transit to HProf"
                                ? parseFloat(props.iotData.ph.max / 10).toFixed(
                                    1
                                  )
                                : parseFloat(
                                    vaccineBatch.distributorParams.ph.max / 10
                                  ).toFixed(1)}
                              &nbsp;Ph
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="w-full text-2xl font-bold text-center text-black/50">
                  No Logistics Parameters Available
                </p>
              )
            ) : (
              <p className="w-full text-2xl font-bold text-center text-black/50">
                No Logistics Parameters Available
              </p>
            )}
          </div>
        ) : (
          <p className="w-full mt-10 text-3xl font-extrabold text-center text-black/50">
            Batch data not found
          </p>
        )}
      </div>
    </>
  );
}

export default Batch;
