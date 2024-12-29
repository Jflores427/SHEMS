import "./Feed.css";

import { useState, useEffect, useContext, Suspense } from "react";
import { Chart } from "react-google-charts";
import Fade from "react-bootstrap/Fade";
import { AuthOptions } from "../authentication/AuthOptions";
import LoadingIndicator from "../components/LoadingIndicator";
import {
  getServiceLocations,
  getTotalEnrolledDevices,
  getTotalMonthlyCostByCID,
  getTotalMonthlyUsageByCID,
  getDailyUsageBySID,
  getDailyMetricsBySID,
  getMonthlyUsageBySID,
  getMonthlyMetricsBySID,
  getYearlyUsageBySID,
  getYearlyMetricsBySID,
  getMonthlyCostByCID,
  getMonthlyUsageByCID,
  getEnergyUseMonthsByYearAndSID,
  getEnergyUseYearsBySID,
  monthMap,
} from "../functionsAPI/apiFeed";
import MissingDataComponent from "../components/MissingDataComponent";

const Feed = () => {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--bs-secondary")
    .trim();
    const secondaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--bs-warning")
    .trim();
  const { user } = useContext(AuthOptions);
  const { username, cID } = user;

  const [isLoading, setIsLoading] = useState(true);
  const [openWelcome, setOpenWelcome] = useState(false);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [checkedsID, setCheckedsID] = useState("");
  const [checkedDailyMonth, setCheckedDailyMonth] = useState("");
  const [checkedDailyYear, setCheckedDailyYear] = useState("");
  const [checkedMonthlyYear, setCheckedMonthlyYear] = useState("");
  const [dailyMonthOptions, setDailyMonthOptions] = useState([]);
  const [dailyYearOptions, setDailyYearOptions] = useState([]);
  const [monthlyYearOptions, setMonthlyYearOptions] = useState([]);
  
  const [dailyMetricsBySID, setDailyMetricsBySID] = useState([]);
  const [monthlyMetricsBySID, setMonthlyMetricsBySID] = useState([]);
  const [yearlyMetricsBySID, setYearlyMetricsBySID] = useState([]);
  const [monthlyCostByCID, setMonthlyCostByCID] = useState([]);
  const [monthlyUsageByCID, setMonthlyUsageByCID] = useState([]);

  const [totalEnrolledDevices, setTotalEnrolledDevices] = useState(0);
  const [totalServiceLocations, setTotalServiceLocations] = useState(0);
  const [monthlyEnergyConsumption, setMonthlyEnergyConsumption] = useState(0);
  const [monthlyEnergyCost, setMonthlyEnergyCost] = useState(0);

  const handleGetServiceLocations = async (cID) => {
    try {
      const result = await getServiceLocations(cID);
      setServiceLocations(result);
      setTotalServiceLocations(result.length);
      selectSID({target: {value: result[0].sID}});
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
        month + " " + year + " - " + sID + " - " + usage + "kW"
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
      if (result.length > 1) {
        // Account for the header entries in the front of the result array
        setDailyMetricsBySID(result);
      } else {
        setDailyMetricsBySID([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetDailyMetricsBySID = async (dailyMetricsBySID) => {
    // sID, Month(MM), Year(YYYY)
    try {
      const result = await getDailyMetricsBySID(dailyMetricsBySID);
      if (result.length > 1) {
        // Account for the header entries in the front of the result array
        setDailyMetricsBySID(result);
      } else {
        setDailyMetricsBySID([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetMonthlyUsageBySID = async (monthlyMetricsBySID) => {
    // Year(YYYY), sID
    try {
      const result = await getMonthlyUsageBySID(monthlyMetricsBySID);
      if (result.length > 1) {
        // Account for the header entries in the front of the result array
        setMonthlyMetricsBySID(result);
      } else {
        setMonthlyMetricsBySID([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetMonthlyMetricsBySID = async (monthlyMetricsBySID) => {
    // Year(YYYY), sID
    try {
      const result = await getMonthlyMetricsBySID(monthlyMetricsBySID);
      if (result.length > 1) {
        // Account for the header entries in the front of the result array
        setMonthlyMetricsBySID(result);
      } else {
        setMonthlyMetricsBySID([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetYearlyUsageBySID = async (yearlyMetricsBySID) => {
    // sID
    try {
      const result = await getYearlyUsageBySID(yearlyMetricsBySID);
      if (result.length > 1) {
        // Account for the header entries in the front of the result array
        setYearlyMetricsBySID(result);
      } else {
        setYearlyMetricsBySID([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetYearlyMetricsBySID = async (yearlyMetricsBySID) => {
    // sID
    try {
      const result = await getYearlyMetricsBySID(yearlyMetricsBySID);
      if (result.length > 1) {
        // Account for the header entries in the front of the result array
        setYearlyMetricsBySID(result);
      } else {
        setYearlyMetricsBySID([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetMonthlyCostByCID = async (cID) => {
    try {
      const result = await getMonthlyCostByCID(cID);
      if (result.length > 1) {
        // Account for the header entries in the front of the result array
        setMonthlyCostByCID(result);
      } else {
        setMonthlyCostByCID([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetMonthlyUsageByCID = async (cID) => {
    try {
      const result = await getMonthlyUsageByCID(cID);
      if (result.length > 1) {
        // Account for the header entries in the front of the result array
        setMonthlyUsageByCID(result);
      } else {
        setMonthlyUsageByCID([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetEnergyUseMonthsByYearAndSID = async (payload) => {
    //payload: {sID, Year}
    try {
      const result = await getEnergyUseMonthsByYearAndSID(payload);
      setDailyMonthOptions(result);
      return result;
    }
    catch(error) {
      console.log(error.message);
    }
  }

  const handleGetEnergyUseYearsBySID = async (payload) => {
    //payload: {sID}
    try {
      const result = await getEnergyUseYearsBySID(payload);
      setDailyYearOptions(result);
      setMonthlyYearOptions(result);
      return result;
    }
    catch(error) {
      console.log(error.message);
    }
  }

  const selectSID = async (e) => {
    setCheckedsID(e.target.value);
    setCheckedDailyMonth("");
    setCheckedDailyYear("");
    setCheckedMonthlyYear("");
    setDailyMonthOptions([]);
    setDailyYearOptions([]);
    setMonthlyYearOptions([]);
    setDailyMetricsBySID([]);
    setMonthlyMetricsBySID([]);
    setYearlyMetricsBySID([]);
    setMonthlyCostByCID([]);
    setMonthlyUsageByCID([]);

    // Set Monthly Energy Months and Year
    const yearsResult = await handleGetEnergyUseYearsBySID({sID: e.target.value});
    
    if (yearsResult.length > 0) {
      const lastYear =  yearsResult[yearsResult.length - 1].Year;
      setCheckedDailyYear(lastYear);
      setCheckedMonthlyYear(lastYear);
      const monthsResult = await handleGetEnergyUseMonthsByYearAndSID({sID : e.target.value, Year: lastYear });
      
      if (monthsResult.length > 0) {
        const lastMonth = monthsResult[monthsResult.length - 1].Month;
        setCheckedDailyMonth(lastMonth)

        // Invoke chart functions
        handleGetDailyMetricsBySID({
          sID: e.target.value,
          Month: lastMonth,
          Year: lastYear
        })
        handleGetMonthlyMetricsBySID({ sID: e.target.value, Year: lastYear });
        handleGetYearlyMetricsBySID({ sID: e.target.value });
        handleGetMonthlyCostByCID(cID);
        handleGetMonthlyUsageByCID(cID);
      }
    }
  }

  const selectDailyMonth = (e) => {
    setCheckedDailyMonth(e.target.value);
    handleGetDailyMetricsBySID({sID: checkedsID, Month: e.target.value, Year: checkedDailyYear })
  };

  const selectDailyYear = async (e) => {
    setCheckedDailyYear(e.target.value);
    const result = await handleGetEnergyUseMonthsByYearAndSID({sID: checkedsID, Year: e.target.value })
    if (result.length > 0) {
      const lastMonth = result[result.length - 1].Month;
      setCheckedDailyMonth(lastMonth);
      handleGetDailyMetricsBySID({ sID: checkedsID, Month: lastMonth, Year: e.target.value })
    }
    else {
      setCheckedDailyMonth('');
    }
  };

  const selectMonthlyYear = async (e) => {
    setCheckedMonthlyYear(e.target.value);
    handleGetMonthlyMetricsBySID({ sID: checkedsID, Year: e.target.value });
  };

  useEffect(() => {
    handleGetServiceLocations(cID);
    handleGetTotalEnrolledDevices(cID);
    handleGetTotalMonthlyCostByCID(cID);
    handleGetTotalMonthlyUsageByCID(cID);
    setTimeout(setOpenWelcome.bind(null, true), 300);
    setTimeout(setIsLoading.bind(null, false), 100);
  }, []);

  return (
    <div className="container-fluid" style={{ overflow: "auto" }}>
      <div
        className="d-sm-flex justify-content-between align-items-center mb-4"
        style={{ minHeight: 25 }}
      >
        <Fade in={openWelcome}>
          <h3 className="mb-0">
            <i className="text-secondary">Welcome, {username}</i>
          </h3>
        </Fade>
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
                    <div className={`${totalServiceLocations !== 0 ? "text-dark" : "text-light"} fw-bold h5 mb-0`}>
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
                    <div className={`${totalEnrolledDevices !== 0 ? "text-dark" : "text-light"} fw-bold h5 mb-0`}>
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
                    <div className={`${monthlyEnergyConsumption !== 0 ? "text-dark" : "text-light"} text-capitalize fw-bold h5 my-4 me-0`}>
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
                    <div className={`${monthlyEnergyCost !== 0 ? "text-dark" : "text-light"} text-capitalize fw-bold h5 my-4`}>
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
          className="w-100 mb-3 p-2 form-select"
            id="service-id-dash"
            onChange={selectSID}
            value={checkedsID}
          >
            <optgroup label="Service Locations">
              <option value="" disabled hidden>
                {" "}
                Select a Service Location
              </option>
              {serviceLocations.length > 0 &&
                serviceLocations.map((serviceLocation) => (
                  <option key={serviceLocation.sID} value={serviceLocation.sID}>
                    {serviceLocation.streetNum +
                      " " +
                      serviceLocation.street +
                      ", " +
                      serviceLocation.unit +
                      " (SID - " +
                      serviceLocation.sID +
                      ")"}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-xl-4">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header m-1 d-flex flex-row justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0 p-0">Daily Energy Metrics</h6>
              <div className="d-flex flex-flow justify-content-center gap-2 p-0 m-0">
              <select
            id="daily-month-dash"
            className="form-control"
            style={{
              width: "100%",
              height:"10%",
            }}
            onChange={selectDailyMonth}
            value={checkedDailyMonth}
          >
            <optgroup label="Month">
              <option value="" disabled hidden>
                Month
              </option>
              {dailyMonthOptions.length > 0 &&
                dailyMonthOptions.map((dailyMonthOption) => (
                  <option key={dailyMonthOption.Month} value={dailyMonthOption.Month}>
                    {monthMap.get(dailyMonthOption.Month)}
                  </option>
                ))}
            </optgroup>
          </select>
          <select
            id="daily-year-dash"
            className="form-control"
            style={{
              width: "100%",
              height:"10%",
            }}
            onChange={selectDailyYear}
            value={checkedDailyYear}
          >
            <optgroup label="Year">
              <option value="" disabled hidden>
                Year
              </option>
              {dailyYearOptions.length > 0 &&
                dailyYearOptions.map((dailyYearOption) => (
                  <option key={dailyYearOption.Year} value={dailyYearOption.Year}>
                    {dailyYearOption.Year}
                  </option>
                ))}
            </optgroup>
          </select>
            </div>
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
                {isLoading ? <LoadingIndicator minHeightVal={"570px"} size={"5rem"} />  : dailyMetricsBySID.length > 1 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={dailyMetricsBySID}
                    options={{
                      title: "Daily Energy Metrics",
                      colors: [primaryColor, secondaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Total",
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
        <div className="col-lg-6 col-xl-4">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header m-1 d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0 p-0">Monthly Energy Metrics</h6>
              <div className="d-flex flex-flow justify-content-center gap-2 p-0 m-0">
          <select
            id="monthly-year-dash"
            className="form-control"
            style={{
              width: "100%",
              height:"10%",
            }}
            onChange={selectMonthlyYear}
            value={checkedMonthlyYear}
          >
            <optgroup label="Year">
              <option value="" disabled hidden>
                Year
              </option>
              {monthlyYearOptions.length > 0 &&
                monthlyYearOptions.map((monthlyYearOption) => (
                  <option key={monthlyYearOption.Year} value={monthlyYearOption.Year}>
                    {monthlyYearOption.Year}
                  </option>
                ))}
            </optgroup>
          </select>
            </div>
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
                {isLoading ? <LoadingIndicator minHeightVal={"570px"} size={"5rem"} />  : monthlyMetricsBySID.length > 1 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={monthlyMetricsBySID}
                    options={{
                      title: "Monthly Energy Metrics",
                      colors: [primaryColor, secondaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Total",
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
        <div className="col-lg-6 col-xl-4">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0">Yearly Energy Metrics</h6>
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
                { isLoading ? <LoadingIndicator minHeightVal={"570px"} size={"5rem"} />  : yearlyMetricsBySID.length > 1 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={yearlyMetricsBySID}
                    options={{
                      title: "Yearly Energy Metrics",
                      colors: [primaryColor, secondaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Total",
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
      </div>
      <div className="row">

        <div className="col-lg-6 col-xl-6">
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
                {monthlyCostByCID.length > 1 ? (
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
        <div className="col-lg-6 col-xl-6">
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
                {monthlyUsageByCID.length > 1 ? (
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
  );
};

export default Feed;
