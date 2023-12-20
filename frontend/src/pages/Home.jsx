import "./Home.css"

import { useState, useEffect, useContext } from "react";

import ENavBar from "../components/ENavBar";
import SNavBar from "../components/SNavBar";
import { AuthOptions } from "../authentication/AuthOptions";

const Home = (props) => {
  // const {cFirstName, cLastName, serviceLocations} = props;

  const { username, customerID } = useContext(AuthOptions);

  const [checkedsID, setCheckedsID] = useState("");
  
  const [serviceLocations, setServiceLocations] = useState([]);


  const [monthlyEnergyConsumption, setMonthlyEnergyConsumption] = useState("") // /api/getMonthlyUsageByCID/  ?Fix
  const [monthlyEnergyCost, setMonthlyEnergyCost] = useState("")  // /api/getMonthlyCostByCID/
  const [totalServiceLocations, setTotalServiceLocations] = useState([]); // /api/getTotalServiceLocationByCID/
  const [totalEnrolledDevices, setTotalEnrolledDevices] = useState([]); // '/api/getTotalEnrolledDeviceByCID/

  function selectSID(e) {
    setCheckedsID(e.target.value);
  }

  function getServiceLocations() {
    axios
      .get("http://127.0.0.1:5000/api/getServiceLocation/", {
        params: { cID: customerID },
      })
      .then((response) => {
        const result = [];
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i])
        }
        setServiceLocations(result)
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  function getEnrolledDevices(sID) {

  }

  function getMonthlyEnergyCost () {}
  function getMonthlyEnergyConsumption () {}

  

  /* 5 Table APIS
  /api/getDailyUsageBySID/
'/api/getMonthlyUsageBySID/'
'/api/getYearlyUsageBySID/'
'/api/getMonthlyUsageByCID/'
/api/getMonthlyCostByCID
*/
  useEffect(() => {
    getServiceLocations();
  }, [])

  return (
    <>
      <div id="page-top">
        <div id="wrapper">
          <ENavBar />
          <div className="d-flex flex-column" id="content-wrapper">
            <div id="content">
              <SNavBar />
              <div className="container-fluid" style={{ overflow: "auto" }}>
                <div className="d-sm-flex justify-content-between align-items-center mb-4">
                  <h3 className="text-dark mb-0">
                    <i>
                      Welcome, {username}
                    </i>
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
                          <div className="col me-2">
                            <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                              <span>Service Locations</span>
                            </div>
                            <div className="text-dark fw-bold h5 mb-0">
                              <span>$40,000</span>
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-home fa-2x text-secondary" />
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
                          <div className="col me-2">
                            <div className="text-uppercase text-success fw-bold text-xs mb-1">
                              <span>
                                Enrolled <br />
                                Devices
                              </span>
                            </div>
                            <div className="text-dark fw-bold h5 mb-0">
                              <span>$215,000</span>
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-microchip fa-2x text-primary" />
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
                          <div className="col me-2">
                            <div
                              className="text-uppercase text-info fw-bold text-xs mb-1"
                              style={{ width: "95%" }}
                            >
                              <span style={{ width: "95%" }}>
                                Monthly Energy Consumption (KWH)
                              </span>
                              <div className="text-dark fw-bold h5 mb-0 me-3">
                                <span>25.00</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-clipboard-list fa-2x text-info" />
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
                          <div className="col me-2" style={{ height: "61.58px" }}>
                            <div className="text-uppercase text-warning fw-bold text-xs mb-1">
                              <span>MoNTHLY Cost</span>
                            </div>
                            <div className="text-dark fw-bold h5 mb-0">
                              <span>$18</span>
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="fas fa-dollar-sign fa-2x text-success" />
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
                        padding: 5
                      }}
                      onChange={selectSID}
                    >
                      <optgroup label="sIDs">
                        {serviceLocations.length > 0 &&
                          serviceLocations.map((serviceLocation) => (
                            <option value={serviceLocation.sID}>{serviceLocation.streetNum + " " + serviceLocation.street + ", " + serviceLocation.unit}</option>
                          ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-7 col-xl-8">
                    <div className="card shadow mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="text-primary fw-bold m-0">
                          Earnings Overview
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
                          <canvas data-bss-chart='{"type":"line","data":{"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],"datasets":[{"label":"Earnings","fill":true,"data":["0","10000","5000","15000","10000","20000","15000","25000"],"backgroundColor":"rgba(78, 115, 223, 0.05)","borderColor":"rgba(78, 115, 223, 1)"}]},"options":{"maintainAspectRatio":false,"legend":{"display":false,"labels":{"fontStyle":"normal"}},"title":{"fontStyle":"normal"},"scales":{"xAxes":[{"gridLines":{"color":"rgb(234, 236, 244)","zeroLineColor":"rgb(234, 236, 244)","drawBorder":false,"drawTicks":false,"borderDash":["2"],"zeroLineBorderDash":["2"],"drawOnChartArea":false},"ticks":{"fontColor":"#858796","fontStyle":"normal","padding":20}}],"yAxes":[{"gridLines":{"color":"rgb(234, 236, 244)","zeroLineColor":"rgb(234, 236, 244)","drawBorder":false,"drawTicks":false,"borderDash":["2"],"zeroLineBorderDash":["2"]},"ticks":{"fontColor":"#858796","fontStyle":"normal","padding":20}}]}}}' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-xl-4">
                    <div className="card shadow mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="text-primary fw-bold m-0">
                          Revenue Sources
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
                          <canvas data-bss-chart='{"type":"doughnut","data":{"labels":["Direct","Social","Referral"],"datasets":[{"label":"","backgroundColor":["#4e73df","#1cc88a","#36b9cc"],"borderColor":["#ffffff","#ffffff","#ffffff"],"data":["50","30","15"]}]},"options":{"maintainAspectRatio":false,"legend":{"display":false,"labels":{"fontStyle":"normal"}},"title":{"fontStyle":"normal"}}}' />
                        </div>
                        <div className="text-center small mt-4">
                          <span className="me-2">
                            <i className="fas fa-circle text-primary" />
                            &nbsp;Direct
                          </span>
                          <span className="me-2">
                            <i className="fas fa-circle text-success" />
                            &nbsp;Social
                          </span>
                          <span className="me-2">
                            <i className="fas fa-circle text-info" />
                            &nbsp;Refferal
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-7 col-xl-8">
                    <div className="card shadow mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="text-primary fw-bold m-0">
                          Earnings Overview
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
                          <canvas data-bss-chart='{"type":"line","data":{"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],"datasets":[{"label":"Earnings","fill":true,"data":["0","10000","5000","15000","10000","20000","15000","25000"],"backgroundColor":"rgba(78, 115, 223, 0.05)","borderColor":"rgba(78, 115, 223, 1)"}]},"options":{"maintainAspectRatio":false,"legend":{"display":false,"labels":{"fontStyle":"normal"}},"title":{"fontStyle":"normal"},"scales":{"xAxes":[{"gridLines":{"color":"rgb(234, 236, 244)","zeroLineColor":"rgb(234, 236, 244)","drawBorder":false,"drawTicks":false,"borderDash":["2"],"zeroLineBorderDash":["2"],"drawOnChartArea":false},"ticks":{"fontColor":"#858796","fontStyle":"normal","padding":20}}],"yAxes":[{"gridLines":{"color":"rgb(234, 236, 244)","zeroLineColor":"rgb(234, 236, 244)","drawBorder":false,"drawTicks":false,"borderDash":["2"],"zeroLineBorderDash":["2"]},"ticks":{"fontColor":"#858796","fontStyle":"normal","padding":20}}]}}}' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-xl-4">
                    <div className="card shadow mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="text-primary fw-bold m-0">
                          Revenue Sources
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
                          <canvas data-bss-chart='{"type":"doughnut","data":{"labels":["Direct","Social","Referral"],"datasets":[{"label":"","backgroundColor":["#4e73df","#1cc88a","#36b9cc"],"borderColor":["#ffffff","#ffffff","#ffffff"],"data":["50","30","15"]}]},"options":{"maintainAspectRatio":false,"legend":{"display":false,"labels":{"fontStyle":"normal"}},"title":{"fontStyle":"normal"}}}' />
                        </div>
                        <div className="text-center small mt-4">
                          <span className="me-2">
                            <i className="fas fa-circle text-primary" />
                            &nbsp;Direct
                          </span>
                          <span className="me-2">
                            <i className="fas fa-circle text-success" />
                            &nbsp;Social
                          </span>
                          <span className="me-2">
                            <i className="fas fa-circle text-info" />
                            &nbsp;Refferal
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-7 col-xl-12">
                    <div className="card shadow mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="text-primary fw-bold m-0">
                          Earnings Overview
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
                          <canvas data-bss-chart='{"type":"line","data":{"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],"datasets":[{"label":"Earnings","fill":true,"data":["0","10000","5000","15000","10000","20000","15000","25000"],"backgroundColor":"rgba(78, 115, 223, 0.05)","borderColor":"rgba(78, 115, 223, 1)"}]},"options":{"maintainAspectRatio":false,"legend":{"display":false,"labels":{"fontStyle":"normal"}},"title":{"fontStyle":"normal"},"scales":{"xAxes":[{"gridLines":{"color":"rgb(234, 236, 244)","zeroLineColor":"rgb(234, 236, 244)","drawBorder":false,"drawTicks":false,"borderDash":["2"],"zeroLineBorderDash":["2"],"drawOnChartArea":false},"ticks":{"fontColor":"#858796","fontStyle":"normal","padding":20}}],"yAxes":[{"gridLines":{"color":"rgb(234, 236, 244)","zeroLineColor":"rgb(234, 236, 244)","drawBorder":false,"drawTicks":false,"borderDash":["2"],"zeroLineBorderDash":["2"]},"ticks":{"fontColor":"#858796","fontStyle":"normal","padding":20}}]}}}' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="bg-white sticky-footer">
              <div className="container my-auto">
                <div className="text-center my-auto copyright">
                  <span>Copyright © Energize 2023</span>
                </div>
              </div>
            </footer>
          </div>
          <a className="border rounded d-inline scroll-to-top" href="#page-top">
            <i className="fas fa-angle-up" />
          </a>
        </div>
      </div>
    </>

  );


};

export default Home;
