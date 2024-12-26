import "./Feed.css";

import { useState, useEffect, useContext, Suspense } from "react";
import { Chart } from "react-google-charts";
import Fade from "react-bootstrap/Fade";
import { AuthOptions } from "../authentication/AuthOptions";
import {
  getServiceLocations,
  getTotalEnrolledDevices,
  getTotalMonthlyCostByCID,
  getTotalMonthlyUsageByCID,
  getDailyUsageBySID,
  getYearlyUsageBySID,
  getMonthlyUsageBySID,
  getMonthlyCostByCID,
  getMonthlyUsageByCID,
} from "../functionsAPI/apiFeed";
import MissingDataComponent from "../components/MissingDataComponent";

const Feed = () => {
  const { user } = useContext(AuthOptions);
  const { username, cID } = user;
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--bs-secondary")
    .trim();

  const [openWelcome, setOpenWelcome] = useState(false);
  const [checkedsID, setCheckedsID] = useState("");
  const [serviceLocations, setServiceLocations] = useState([]);
  const [dailyUsageBySID, setDailyUsageBySID] = useState([]);
  const [monthlyUsageBySID, setMonthlyUsageBySID] = useState([]);
  const [yearlyUsageBySID, setYearlyUsageBySID] = useState([]);
  const [monthlyCostByCID, setMonthlyCostByCID] = useState([]);
  const [monthlyUsageByCID, setMonthlyUsageByCID] = useState([]);

  const [monthlyEnergyConsumption, setMonthlyEnergyConsumption] = useState("");
  const [monthlyEnergyCost, setMonthlyEnergyCost] = useState("");
  const [totalServiceLocations, setTotalServiceLocations] = useState([]);
  const [totalEnrolledDevices, setTotalEnrolledDevices] = useState([]);

  function selectSID(e) {
    setCheckedsID(e.target.value);
    setDailyUsageBySID([]);
    setMonthlyUsageBySID([]);
    setYearlyUsageBySID([]);
    setMonthlyCostByCID([]);
    setMonthlyUsageByCID([]);
    handleGetDailyUsageBySID({
      sID: e.target.value,
      Month: "12",
      Year: "2022",
    });
    handleGetMonthlyUsageBySID({ sID: e.target.value, Year: "2022" });
    handleGetYearlyUsageBySID({ sID: e.target.value });
    handleGetMonthlyCostByCID(cID);
    handleGetMonthlyUsageByCID(cID);
  }

  const handleGetServiceLocations = async (cID) => {
    try {
      const result = await getServiceLocations(cID);
      setServiceLocations(result);
      setTotalServiceLocations(result.length);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetTotalEnrolledDevices = async (cID) => {
    try {
      const result = await getTotalEnrolledDevices(cID);
      setTotalEnrolledDevices(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetTotalMonthlyCostByCID = async (cID) => {
    try {
      const result = await getTotalMonthlyCostByCID(cID);
      const { month, year, sID, cost } = result;
      setMonthlyEnergyCost(month + " " + year + " - " + sID + " - $" + cost);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetTotalMonthlyUsageByCID = async (cID) => {
    try {
      const result = await getTotalMonthlyUsageByCID(cID);
      const { month, year, sID, usage } = result;
      setMonthlyEnergyConsumption(
        month + " " + year + " - " + sID + " - " + usage
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Chart Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const handleGetDailyUsageBySID = async (dailyUsageBySID) => {
    // sID, Month(MM), Year(YYYY)
    try {
      const result = await getDailyUsageBySID(dailyUsageBySID);
      if (result.length > 2) {
        // Account for the header entries in the front of the result array
        setDailyUsageBySID(result);
      } else {
        setDailyUsageBySID(result);
      }
      console.log(
        result.length > 2 ? result : "no data found",
        "DailySID Usage Data"
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetMonthlyUsageBySID = async (monthlyUsageBySID) => {
    // Year(YYYY), sID
    try {
      const result = await getMonthlyUsageBySID(monthlyUsageBySID);
      if (result.length > 2) {
        // Account for the header entries in the front of the result array
        setMonthlyUsageBySID(result);
      } else {
        setMonthlyUsageBySID(result);
      }
      console.log(
        result.length > 2 ? result : "no data found",
        "MonthlySID Usage Data"
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetYearlyUsageBySID = async (yearlyUsageBySID) => {
    // sID
    try {
      const result = await getYearlyUsageBySID(yearlyUsageBySID);
      if (result.length > 2) {
        // Account for the header entries in the front of the result array
        setYearlyUsageBySID(result);
      } else {
        setYearlyUsageBySID(result);
      }
      console.log(
        result.length > 2 ? result : "no data found",
        "YearlySID Usage Data"
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetMonthlyCostByCID = async (cID) => {
    try {
      const result = await getMonthlyCostByCID(cID);
      if (result.length > 2) {
        // Account for the header entries in the front of the result array
        setMonthlyCostByCID(result);
      } else {
        setMonthlyCostByCID(result);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetMonthlyUsageByCID = async (cID) => {
    try {
      const result = await getMonthlyUsageByCID(cID);
      if (result.length > 2) {
        // Account for the header entries in the front of the result array
        setMonthlyUsageByCID(result);
      } else {
        setMonthlyUsageByCID(result);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleGetServiceLocations(cID);
    handleGetTotalEnrolledDevices(cID);
    handleGetTotalMonthlyCostByCID(cID);
    handleGetTotalMonthlyUsageByCID(cID);
    setTimeout(setOpenWelcome.bind(null, true), 300);
  }, []);

  return (
    <div className="container-fluid" style={{ overflow: "auto" }}>
      <div
        className="d-sm-flex justify-content-between align-items-center mb-4"
        style={{ minHeight: 25 }}
      >
        <Suspense fallback={<h3 className="text-primary">Hidden</h3>}>
          <Fade in={openWelcome}>
            <h3 className="mb-0">
              <i className="text-secondary">Welcome, {username}</i>
            </h3>
          </Fade>
        </Suspense>
      </div>
      <div className="row">
        <div className="col-md-6 col-xl-3 mb-4">
          <div
            className="card shadow border-start-primary py-2"
            style={{ height: "100%" }}
          >
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2 d-flex flex-column justify-content-center align-items-center gap-1">
                  <div className="col-auto">
                    <i className="fas fa-home fa-2x text-secondary" />
                  </div>
                  <div className="text-uppercase text-secondary fw-bold text-xs mb-1 my-3">
                    <p>
                      Service <br />
                      Locations
                    </p>
                    <div className="text-dark fw-bold h5 mb-0">
                      <span>{totalServiceLocations}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3 mb-4">
          <div
            className="card shadow border-start-success py-2"
            style={{ height: "100%" }}
          >
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2 d-flex flex-column justify-content-center align-items-center gap-1">
                  <div className="col-auto">
                    <i className="fas fa-microchip fa-2x text-primary" />
                  </div>
                  <div className="text-uppercase text-primary fw-bold text-xs mb-1 my-3">
                    <p>
                      Enrolled <br />
                      Devices
                    </p>
                    <div className="text-dark fw-bold h5 mb-0">
                      <span>{totalEnrolledDevices}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3 mb-4">
          <div
            className="card shadow border-start-info py-2"
            style={{ height: "100%" }}
          >
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2 d-flex flex-column justify-content-center align-items-center gap-1">
                  <div className="col-auto">
                    <i className="fas fa-clipboard-list fa-2x text-info" />
                  </div>
                  <div
                    className="text-uppercase text-info fw-bold text-xs mb-0 my-3"
                    style={{ width: "95%" }}
                  >
                    <span style={{ width: "95%" }}>
                      Most Recent Monthly Energy Consumption
                    </span>
                    <p>(Date, sID, kWH) </p>
                    <div className="text-dark fw-bold h5 my-4  me-0">
                      <span>{monthlyEnergyConsumption}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3 mb-4">
          <div
            className="card shadow border-start-warning py-2"
            style={{ height: "100%" }}
          >
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2 d-flex flex-column justify-content-center align-items-center gap-2">
                  <div className="col-auto">
                    <i className="fas fa-dollar-sign fa-2x text-success" />
                  </div>
                  <div className="text-uppercase text-success fw-bold text-xs mt-3">
                    <span>Most Recent Monthly Cost </span>
                    <p>(Date, sID, Cost) </p>
                    <div className="text-dark fw-bold h5 my-4">
                      <span className="mt-sm-5">
                        {typeof monthlyEnergyCost == "string"
                          ? monthlyEnergyCost
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <select
            id="service-id-dash"
            style={{
              width: "95%",
              margin: "5px 25px 10px 5px",
              padding: 5,
            }}
            onChange={selectSID}
          >
            <optgroup label="Service Locations">
              <option value="" selected disabled hidden>
                {" "}
                Select a Service Location
              </option>
              {serviceLocations.length > 0 &&
                serviceLocations.map((serviceLocation) => (
                  <option value={serviceLocation.sID}>
                    {serviceLocation.streetNum +
                      " " +
                      serviceLocation.street +
                      ", " +
                      serviceLocation.unit + " (SID - " + serviceLocation.sID + ")"}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-7 col-xl-8">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0">Daily Energy Usage</h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-area">
                {dailyUsageBySID.length > 2 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={dailyUsageBySID}
                    options={{
                      title: "Daily Energy Usage (12/2022)",
                      colors: [primaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Energy Usage (kW)",
                        minValue: 0,
                      },
                      vAxis: {
                        title: "Day",
                      },
                    }}
                  />
                ) : (
                  <MissingDataComponent
                    message={"No Daily Energy Usage Available..."}
                    minHeight={"400px"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-xl-4">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0">Monthly Energy Usage</h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-area">
                {monthlyUsageBySID.length > 2 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={monthlyUsageBySID}
                    options={{
                      title: "Monthly Energy Usage (2022)",
                      colors: [primaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Energy Usage (kW)",
                        minValue: 0,
                      },
                      vAxis: {
                        title: "Month",
                      },
                    }}
                  />
                ) : (
                  <MissingDataComponent
                    message={"No Monthly Energy Usage Available..."}
                    minHeight={"400px"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-7 col-xl-8">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0">Yearly Energy Usage</h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-area">
                {yearlyUsageBySID.length > 2 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={yearlyUsageBySID}
                    options={{
                      title: "Yearly Energy Usage",
                      colors: [primaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Energy Usage (kW)",
                        minValue: 0,
                      },
                      vAxis: {
                        title: "Year",
                      },
                    }}
                  />
                ) : (
                  <MissingDataComponent
                    message={"No Yearly Energy Usage Available..."}
                    minHeight={"400px"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-xl-4">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0">
                Customer Monthly Energy Cost
              </h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-area">
                {monthlyCostByCID.length > 2 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={monthlyCostByCID}
                    options={{
                      title: "Customer Monthly Energy Cost",
                      colors: [primaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Energy Cost ($)",
                        minValue: 0,
                      },
                      vAxis: {
                        title: "Month Year - SID",
                      },
                    }}
                  />
                ) : (
                  <MissingDataComponent
                    message={"No Customer Monthly Energy Cost Available..."}
                    minHeight={"400px"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-7 col-xl-12">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0">
                Constumer Monthly Energy Usage
              </h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-area">
                {monthlyUsageByCID.length > 2 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={monthlyUsageByCID}
                    options={{
                      title: "Customer Monthly Energy Usage",
                      colors: [primaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Energy Usage (kW)",
                        minValue: 0,
                      },
                      vAxis: {
                        title: "Month Year - SID",
                      },
                    }}
                  />
                ) : (
                  <MissingDataComponent
                    message={"No Customer Monthly Energy Usage Available..."}
                    minHeight={"400px"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </>
  );
};

export default Feed;
