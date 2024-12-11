import "./Feed.css";

import { useState, useEffect, useContext } from "react";
import { Chart } from "react-google-charts";

import api from "../functionsAPI/api";
import ENavBar from "../components/ENavBar";
import SNavBar from "../components/SNavBar";
import { AuthOptions } from "../authentication/AuthOptions";
import MissingDataComponent from "../components/MissingDataComponent";

const Feed = (props) => {
  // const {cFirstName, cLastName, serviceLocations} = props;
  const { user } = useContext(AuthOptions);
  const { username, cID } = user;
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--bs-secondary').trim();

  const [checkedsID, setCheckedsID] = useState("");

  const [serviceLocations, setServiceLocations] = useState([]);

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);

  const [monthlyEnergyConsumption, setMonthlyEnergyConsumption] = useState(0); // /getMonthlyUsageByCID/  ?Fix
  const [monthlyEnergyCost, setMonthlyEnergyCost] = useState(0); // /getMonthlyCostByCID/
  const [totalServiceLocations, setTotalServiceLocations] = useState([]); // /getTotalServiceLocationByCID/
  const [totalEnrolledDevices, setTotalEnrolledDevices] = useState([]); // '/getTotalEnrolledDeviceByCID/

  function selectSID(e) {
    setCheckedsID(e.target.value);
    console.log(e.target.value);
    getDailyUsageBySID({ sID: e.target.value, Month: "12", Year: "2022" });
    getMonthlyUsageBySID({ sID: e.target.value, Year: "2022" });
    getYearlyUsageBySID({ sID: e.target.value });
    getMonthlyCostByCID(cID);
    getMonthlyUsageByCID(cID);
  }

  function getServiceLocations() {
    api
      .get("/getServiceLocation", {
        params: { cID: cID },
      })
      .then((response) => {
        const result = [];
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i]);
        }
        setServiceLocations(result);
        setTotalServiceLocations(response.data.length);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  function getTotalEnrolledDevices(cID) {
    api
      .get("/getTotalEnrolledDeviceByCID", {
        params: { cID: cID },
      })
      .then(function (response) {
        console.log(response.data.totalEnrolledDevice);
        setTotalEnrolledDevices(response.data.totalEnrolledDevice);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getTotalMonthlyCostByCID(cID) {
    api
      .get("/getMonthlyCostByCID", {
        params: { cID: cID },
      })
      .then(function (response) {
        console.log(response.data);
        const month = response.data[response.data.length - 1].Month;
        const year = response.data[response.data.length - 1].Year;
        const sID = response.data[response.data.length - 1].sID;
        const cost = parseFloat(
          response.data[response.data.length - 1].totalCost
        );
        console.log(month + "/" + year + " - " + sID + " - $" + cost);
        setMonthlyEnergyCost(
          month + "/" + year + " - " + sID + " - $" + cost.toFixed(2)
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getTotalMonthlyUsageByCID(cID) {
    api
      .get("/getMonthlyUsageByCID", {
        params: { cID: cID },
      })
      .then(function (response) {
        console.log(response.data);
        const month = response.data[response.data.length - 1].Month;
        const year = response.data[response.data.length - 1].Year;
        const sID = response.data[response.data.length - 1].sID;
        const usage = parseFloat(
          response.data[response.data.length - 1].totalUsage
        );
        console.log(month + "/" + year + " - " + sID + " - " + usage);
        setMonthlyEnergyConsumption(
          month + "/" + year + " - " + sID + " - " + usage
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Chart Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  function getDailyUsageBySID(dailyUsageBySID) {
    // sID, Month(MM), Year(YYYY)
    api
      .get("/getDailyUsageBySID", {
        params: dailyUsageBySID,
      })
      .then(function (response) {
        let data = response.data;
        let dataTransformed = data.map((data) => [
          data.Day,
          parseFloat(data.totalUsage),
        ]);
        // console.log(data);
        // console.log(dataTransformed)
        dataTransformed = [["Day", "totalUsage"], ...dataTransformed];
        if (data.length > 0) {
          setData1(dataTransformed);
        }
        else {
          setData1([]);
        }
        console.log(data.length > 0 ? data : "no data found", "DailySID Usage Data");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getMonthlyUsageBySID(monthlyUsageBySID) {
    // Year(YYYY), sID
    api
      .get("/getMonthlyUsageBySID", {
        params: monthlyUsageBySID,
      })
      .then(function (response) {
        let data = response.data;
        // setData2(data);
        let dataTransformed = data.map((data) => [
          data.Month,
          parseFloat(data.totalUsage),
        ]);
        // console.log(data);
        // console.log(dataTransformed)
        dataTransformed = [["Month", "totalUsage"], ...dataTransformed];
        // console.log(dataTransformed);
        if (data.length > 0) {
          setData2(dataTransformed);
        }
        else {
          setData2([]);
        }
        console.log(data.length > 0 ? data : "no data found", "MonthlySID Usage Data");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getYearlyUsageBySID(yearlyUsageBySID) {
    // sID
    api
      .get("/getYearlyUsageBySID", {
        params: yearlyUsageBySID,
      })
      .then(function (response) {
        let data = response.data;
        // setData3(data);
        let dataTransformed = data.map((data) => [
          data.Year.toString(),
          parseFloat(data.totalUsage),
        ]);
        // console.log(data);
        // console.log(dataTransformed)
        dataTransformed = [["Year", "totalUsage"], ...dataTransformed];
        console.log(dataTransformed);
        if (data.length > 0) {
          setData3(dataTransformed);
        }
        else {
          setData3([]);
        }
        console.log(data.length ? data : "no data found", "YearlySID Usage Data");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  function getMonthlyCostByCID(cID) {
    api
      .get("/getMonthlyCostByCID", {
        params: { cID: cID },
      })
      .then(function (response) {
        let data = response.data;
        console.log(data);
        let dataTransformed = data.map((data) => [
          data.Month.toString() + "/" + data.Year.toString() + "-" + data.sID,
          parseFloat(data.totalCost),
        ]);
        // console.log(data);
        console.log(dataTransformed);
        dataTransformed = [["Month/Year", "totalCost"], ...dataTransformed];
        // console.log(dataTransformed);
        if (data.length > 0) {
          setData4(dataTransformed);
        }
        else {
          setData4([]);
        }
        // console.log(response.data, "Monthly Cost Data");
        // setData4(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getMonthlyUsageByCID(cID) {
    api
      .get("/getMonthlyUsageByCID", {
        params: { cID: cID },
      })
      .then(function (response) {
        // setData1(response.data);
        console.log(response.data, "Monthly Usage Data");
        let data = response.data;
        let dataTransformed = data.map((data) => [
          data.Month.toString() + "/" + data.Year.toString() + "-" + data.sID,
          parseFloat(data.totalUsage),
        ]);
        // console.log(data);
        console.log(dataTransformed);
        dataTransformed = [["Month/Year", "totalUsage"], ...dataTransformed];
        // console.log(dataTransformed);
        if (data.length > 0) {
          setData5(dataTransformed);
        }
        else {
          setData5([])
        }
        // console.log(response.data, "Monthly Cost Data");
        // setData4(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /* 5 Table APIS
  /getDailyUsageBySID/
'/getMonthlyUsageBySID/'
'/getYearlyUsageBySID/'
'/getMonthlyUsageByCID/'
/getMonthlyCostByCID
*/
  useEffect(() => {
    getServiceLocations();
    getTotalEnrolledDevices(cID);
    getTotalMonthlyCostByCID(cID);
    getTotalMonthlyUsageByCID(cID);
  }, []);

  return (
    <div className="container-fluid" style={{ overflow: "auto" }}>
      <div className="d-sm-flex justify-content-between align-items-center mb-4">
        <h3 className="text-dark mb-0">
          <i>Welcome, {username}</i>
        </h3>
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
                    <p>Service <br/>
                    Locations</p>
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
              <div className="col me-2 d-flex flex-column justify-content-center align-items-center gap-1">
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-success" />
                </div>
                  <div className="text-uppercase text-success fw-bold text-xs mb-1 my-2">
                    <span>Most Recent Monthly Cost </span>
                    <p>(Date, sID, Cost) </p>
                  <div className="text-dark fw-bold h5 my-4">
                    <span>
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
            <optgroup label="sIDs">
            <option value="" selected disabled hidden> Select a Service Location</option>
              {serviceLocations.length > 0 &&
                serviceLocations.map((serviceLocation) => (
                  <option value={serviceLocation.sID}>
                    {serviceLocation.streetNum +
                      " " +
                      serviceLocation.street +
                      ", " +
                      serviceLocation.unit}
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
              <h6 className="text-primary fw-bold m-0">
                Get Daily Usage by SID
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
                {data1.length > 0 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={data1}
                    options={{
                      title: "Get Daily Usage by SID (12/2022)",
                      colors: [primaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Energy Usage (kW)",
                        minValue: 0,
                      },
                      vAxis: {
                        title: "Days`",
                      },
                    }}
                  />
                ) : (
                  <MissingDataComponent
                    message={"No Daily Usage by SID Data..."}
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
                Get Monthly Usage by SID
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
                {data2.length > 0 ? (
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={data2}
                    options={{
                      title: "Get Monthly Usage by SID (2022)",
                      colors: [primaryColor],
                      chartArea: { width: "50%" },
                      hAxis: {
                        title: "Energy Usage (kW)",
                        minValue: 0,
                      },
                      vAxis: {
                        title: "Month`",
                      },
                    }}
                  />
                ) : (
                  <MissingDataComponent
                    message={"No Monthly Usage by SID Data..."}
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
              <h6 className="text-primary fw-bold m-0">
                Get Yearly Usage by SID
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
                { data3.length > 0 ? 
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="400px"
                  data={data3}
                  options={{
                    title: "Get Yearly Usage by SID",
                    colors: [primaryColor],
                    chartArea: { width: "50%" },
                    hAxis: {
                      title: "Energy Usage (kW)",
                      minValue: 0,
                    },
                    vAxis: {
                      title: "Year`",
                    },
                  }}
                  /> : <MissingDataComponent message={"No Yearly Usage by SID Data..."} minHeight={"400px"} />}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-xl-4">
          <div className="card shadow mb-4" style={{ height: "500px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0">
                Get Monthly Energy Cost By CID
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
                {data4.length > 0 ?  
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="400px"
                  data={data4}
                  options={{
                    title: "Get Monthly Energy Cost",
                    colors: [primaryColor],
                    chartArea: { width: "50%" },
                    hAxis: {
                      title: "Energy Cost ($)",
                      minValue: 0,
                    },
                    vAxis: {
                      title: "Month/Year  - sID",
                    },
                  }}
                  /> : <MissingDataComponent message={"No Monthly Energy Cost Usage by CID Data..."} minHeight={"400px"} />}
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
                Get Monthly Energy Consumption By CID
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
                {data5.length > 0 ?
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="400px"
                  data={data5}
                  options={{
                    title: "Get Monthly Energy Consumption",
                    colors: [primaryColor],
                    chartArea: { width: "50%" },
                    hAxis: {
                      title: "Energy Usage (kW)",
                      minValue: 0,
                    },
                    vAxis: {
                      title: "Month/Year  - sID",
                    },
                  }}
                  /> : <MissingDataComponent message={"No Monthly Energy Consumption by CID Data..."} minHeight={"400px"} />}
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
