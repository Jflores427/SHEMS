import { useState, useEffect, useContext } from "react";
import { AuthOptions } from "../authentication/AuthOptions";
import ENavBar from "../components/ENavBar";
import SNavBar from "../components/SNavBar";
import Modal from 'react-bootstrap/Modal';

import "./Devices.css"

const Devices = (props) => {

  const { username, customerID } = useContext(AuthOptions);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [deviceModels, setDeviceModels] = useState([]);
  const [checkedsID, setCheckedsID] = useState("");
  const [serviceLocations, setServiceLocations] = useState([]);
  const [enrolledDevices, setEnrolledDevices] = useState([]);
  const [deviceFormData, setDeviceFormData] = useState({
    cID: customerID,
    enDevName: "",
    devID: 0,
    type: "",
    model: "",
    sID: 0,
    enrolledStatus: "enabled"
  });

  const [show, setShow] = useState(false);

  /* APIs
  // getDevices?? 
  // getDeviceModels?? based on the value of type sent in...
  // getServiceLocations [x]
  // getEnrolledDevices [x] getEnrolledDevice/
  // AddEnrolledDevice [x]
  // updateEnrolledDevice [x]

  */



  // -------------------------------------- API functions -----------------------------------------------


  function getDevices() { // Works
    axios
      .get("http://127.0.0.1:5000/api/getSupportedDevice/", {})
      .then((response) => {
        const result = [];
        // console.log(response);
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i])
        }
        // console.log(result);
        setDeviceTypes(result)
      })
      .catch(function (error) {
        console.log(error);
      })

  }
  function getDeviceModels(type) { //Works
    axios
      .get("http://127.0.0.1:5000/api/getSupportedDeviceByType/", { params: { type: type }, })
      .then((response) => {
        const result = [];
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i])
        }
        setDeviceModels(result);
        // const newResult = devices.filter((device) => device.type == type)
        // setDeviceModels(newResult);
      })
      .catch(function (error) {
        console.log(error);
      })

  }
  function getServiceLocations() { //Works
    axios
      .get("http://127.0.0.1:5000/api/getServiceLocation/", {
        params: { cID: customerID },
      })
      .then((response) => {
        // console.log(response.data)
        // console.log(response.data.length)
        const result = [];
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i])
        }
        // console.log(result);
        setServiceLocations(result)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  // function getDevIDByModelAndType(newEnrolledDevice) { //IDK
  //   let result;
  //   let newResult;
  //   axios
  //     .get("http://127.0.0.1:5000/api/getDevIDByModelAndType/", {
  //       params: { model: newEnrolledDevice.model, type: newEnrolledDevice.type },
  //     })
  //     .then(function (response) {
  //       result = response.data.devID;
  //       console.log(typeof(result));
  //       newResult = { ...newEnrolledDevice, 'devID': result };
  //       console.log(newResult, "This is the new result");
  //       return axios
  //         .post("http://127.0.0.1:5000/api/enrollDevice/", newResult);
  //     })
  //     .then(function (response) {
  //       console.log(response.data, ":post newEnrolledDevice result");
  //       // getEnrolledDevices()
  //       // setTimeout(getEnrolledDevices.bind(null, checkedsID), 100);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  // }

  function getDevIDByModelAndType(newEnrolledDevice) { //IDK
    let result;
    let newResult;
    axios
      .get("http://127.0.0.1:5000/api/getDevIDByModelAndType/", {
        params: { model: newEnrolledDevice.model, type: newEnrolledDevice.type },
      })
      .then(function (response) {
        result = response.data.devID;
        console.log(typeof(result));
        newResult = {'sID':newEnrolledDevice.sID, "enDevName": newEnrolledDevice.enDevName, 'devID': result,  };
        console.log(newResult, "This is the new result");
        return axios
          .post("http://127.0.0.1:5000/api/enrollDevice/", newResult);
      })
      .then(function (response) {
        console.log(response.data, ":post newEnrolledDevice result");
        // getEnrolledDevices()
        // setTimeout(getEnrolledDevices.bind(null, checkedsID), 100);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  // function addNewEnrolledDevice(deviceFormData) {
  //   axios
  //     .post("http://127.0.0.1:5000/api/enrollDevice/", deviceFormData)
  //     .then(function (response) {
  //       console.log(response.data, ":post newEnrolledDevice result");
  //       // setTimeout(getEnrolledDevices.bind(null, sID), 100);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  function setEnrolledDeviceStatus(enDevID, enrolledStatus) {
    axios
      .post("http://127.0.0.1:5000/api/setEnrolledDeviceStatus/", {
        enDevID: enDevID,
        enrolledStatus: enrolledStatus,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getEnrolledDevices(sID) {    //Fixed
    axios
      .get("http://127.0.0.1:5000/api/getEnrolledDevice/", {
        params: { sID: sID },
      })
      .then(function (response) {
        const result = [];
        console.log(response.data.length, "Why is response 0??  ")
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i])
        }
        setEnrolledDevices(result)
        console.log(result);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  // -------------------------------------- handle functions -----------------------------------------------

  function selectSID(e) {
    // console.log(typeof(e.target.value)); //sID correct  sID should be a string
    // const sID = parseInt(e.target.value);
    console.log(e.target.value, ": is Key Value is from", e.target);
    // setCheckedsID(e.target.value);
    // console.log(sID, "sID value")
    
    // console.log(checkedsID), ": checkedsID value";
    getEnrolledDevices(e.target.value); // ALWAYS CORRECT
  }

  const handleDeleteEnrolledDevice = (e) => { }

  const handleDeviceStatusChange = (e) => {
    let target = enrolledDevices.filter((enrolledDevice) => enrolledDevice.enDevID == parseInt(e.target.id.substring(25,)))
    let enDevIDTarget = target[0].enDevID;
    let enrolledStatusTarget = (target[0].enrolledStatus == "enabled") ? "disabled" : "enabled";
    setEnrolledDeviceStatus(enDevIDTarget, enrolledStatusTarget);
    setTimeout(getEnrolledDevices.bind(null, checkedsID), 100); //Triggers Rerender
  }

  const handleChange = (e) => {
    console.log(e.target.value);
    setDeviceFormData({ ...deviceFormData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    // const selectElt = document.getElementById("form-device-type");
    // console.log(selectElt);
    console.log(e.target);
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedDeviceType = selectedOption.value;

    getDeviceModels(selectedDeviceType);
    setDeviceFormData({ ...deviceFormData, [e.target.name]: e.target.value });
    // setDeviceModels(devices.filter((device) => device.type == selectedDeviceType));
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseButton = () => {
    // console.log(deviceFormData); //formData Correct
    setDeviceFormData({
      cID: customerID,
      sID: "",
      enDevName: "",
      model: "",
      type: "",
      devID: "",
      enrolledStatus: "enabled",
    });
    handleClose();
  }

  const handleSubmitButton = (e) => {
    e.preventDefault();
    console.log(deviceFormData);
    getDevIDByModelAndType(deviceFormData);
    // addNewEnrolledDevice(deviceFormData);
    // console.log(checkedsID, ": checkedsID value")
    // getEnrolledDevices()
    // setTimeout(getEnrolledDevices.bind(null, checkedsID), 0)
    handleCloseButton();
  };

  useEffect(() => {
    getDevices();
    getServiceLocations();
    //getEnrolledDevices(checkedsID); //The Issue?
  }, [])

  return (
    <>
      <div id="page-top">
        <div id="wrapper">
          <ENavBar />
          <div className="d-flex flex-column" id="content-wrapper">
            <div id="content">
              <SNavBar />
              <div className="container-fluid">
                <div className="row">
                  <div
                    className="col-xl-10 d-flex justify-content-between"
                    style={{ width: "100%" }}
                  >
                    <h3 className="text-dark mb-4" style={{ width: "100%" }}>
                      My Devices
                    </h3>
                    <div style={{ width: "5%" }}>
                      <button
                        className="btn btn-primary rounded-circle bg-secondary"
                        id="device-modal-toggle"
                        type="button"
                        onClick={handleShow}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <Modal show={show} size="xl" onHide={handleClose} style={{ translate: "60px 60px" }}>
                  <form className="d-flex flex-column gap-4">
                    <Modal.Header>
                      <div
                        className="modal-header"
                        style={{ background: "var(--bs-secondary)", width: "100%" }}
                      >
                        <h4
                          className="modal-title"
                          style={{ color: "var(--bs-light)" }}
                        >
                          New Device
                        </h4>
                        <button
                          className="btn-close"
                          type="button"
                          aria-label="Close"
                          data-bs-dismiss="modal"
                          onClick={handleCloseButton}
                        />
                      </div>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="modal-body">
                        <div
                          className="input-group my-3"
                          style={{ color: "var(--bs-light)" }}
                        >
                          <label
                            className="form-label input-group-text"
                            style={{
                              width: "100%",
                              background: "var(--bs-secondary)",
                              color: "var(--bs-light)",
                              margin: 0,
                              padding: "5px 8px",
                              borderRadius: "10px 10px 0 0"
                            }}
                            htmlFor="form-device-name"
                          >
                            Device Name
                          </label>
                          <input
                            className="form-control form-control-user"
                            type="text"
                            id="form-device-name"
                            style={{
                              borderRadius: "0 0 10px 10px",
                              borderWidth: 1
                            }}
                            name="enDevName"
                            value={deviceFormData.enDevName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div
                          className="input-group my-3"
                          style={{ color: "var(--bs-light)" }}
                        >
                          <label
                            className="form-label input-group-text"
                            style={{
                              width: "100%",
                              background: "var(--bs-secondary)",
                              color: "var(--bs-light)",
                              margin: 0,
                              borderRadius: "10px 10px 0 0"
                            }}
                            htmlFor="form-device-type"
                          >
                            Type
                          </label>
                          <select
                            className="form-select w-100"
                            id="form-device-type"
                            style={{ borderRadius: "0 0 10px 10px" }}
                            name="type"
                            onChange={handleTypeChange}
                            required
                          >
                            <optgroup label="Device Type">
                              {deviceTypes.length > 0 &&
                                deviceTypes.map((device) => (
                                  <option key={device.type} value={device.type}>{device.type}</option>
                                ))}
                            </optgroup>
                          </select>
                        </div>
                        <div
                          className="input-group my-3"
                          style={{ color: "var(--bs-light)" }}
                        >
                          <label
                            className="form-label input-group-text"
                            style={{
                              width: "100%",
                              background: "var(--bs-secondary)",
                              color: "var(--bs-light)",
                              margin: 0,
                              borderRadius: "10px 10px 0 0"
                            }}
                            htmlFor="form-device-model"
                          >
                            Model
                          </label>
                          <select
                            className="form-select w-100"
                            id="form-device-model"
                            style={{ borderRadius: "0 0 10px 10px" }}
                            name="model"
                            onChange={handleChange}
                            required
                          >
                            <optgroup label="Device Models">
                              {deviceModels.length > 0 &&
                                deviceModels.map((device) => (
                                  <option value={device.model}>{device.model}</option>
                                ))}
                            </optgroup>
                          </select>
                        </div>
                        <div
                          className="input-group my-3"
                          style={{ color: "var(--bs-light)" }}
                        >
                          <label
                            className="form-label input-group-text"
                            style={{
                              width: "100%",
                              background: "var(--bs-secondary)",
                              color: "var(--bs-light)",
                              margin: 0,
                              borderRadius: "10px 10px 0 0"
                            }}
                            htmlFor="form-device-sID"
                          >
                            ServiceIDs
                          </label>
                          <select
                            className="form-select w-100"
                            id="form-device-sID"
                            style={{ borderRadius: "0 0 10px 10px" }}
                            name="sID"
                            onChange={handleChange}
                            required
                          >
                            <optgroup label="sIDs">
                              {/* <option value="" selected disabled hidden>Select a Service Location</option> */}
                              {serviceLocations.length > 0 &&
                                serviceLocations.map((serviceLocation) => (
                                  <option value={serviceLocation.sID}>{serviceLocation.streetNum + " " + serviceLocation.street + ", " + serviceLocation.unit}</option>
                                ))}
                            </optgroup>
                          </select>
                        </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <div className="modal-footer">
                        <button
                          className="btn btn-primary"
                          type="button"
                          style={{ background: "var(--bs-primary)" }}
                          onClick={handleCloseButton}
                        >
                          Close
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          style={{ background: "var(--bs-secondary)" }}
                          onClick={handleSubmitButton}
                        >
                          Save
                        </button>
                      </div>
                    </Modal.Footer>
                  </form>

                </Modal>

                <div className="card shadow">
                  <div className="card-header py-3 bg-secondary">
                    <p className="text-primary m-0 fw-bold text-light">
                      Device Info
                    </p>
                  </div>
                  <div className="card-body text-uppercase">
                    <div className="row">
                      <div className="col-md-6 col-xl-12">
                        <div
                          className="text-md-end dataTables_filter"
                          id="dataTable_filter"
                        >
                          <label className="form-label" htmlFor="service-id" />
                          <select id="service-id" onChange={selectSID}>
                            <optgroup label="sIDs">
                              {serviceLocations.length > 0 &&
                                serviceLocations.map((serviceLocation) => (<option key={serviceLocation.sID} value={serviceLocation.sID}>{serviceLocation.streetNum + " " + serviceLocation.street + ", " + serviceLocation.unit}</option>
                                ))}
                            </optgroup>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div
                      className="table-responsive text-capitalize table mt-2"
                      id="dataTable-1"
                      role="grid"
                      aria-describedby="dataTable_info"
                    >
                      <table className="table my-0" id="dataTable">
                        <thead>
                          <tr>
                            <th>Device Name</th>
                            <th>Type</th>
                            <th>Model</th>
                            <th>Status</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrolledDevices.length !== 0 && enrolledDevices.map((enrolledDevice) => (
                            <tr key={enrolledDevice.enDevID} id={`enrolled-device-id-${enrolledDevice.enDevID}`}>
                              <td>{enrolledDevice.enDevName}</td>
                              <td>{enrolledDevice.type}</td>
                              <td>{enrolledDevice.model}</td>
                              <td><input type="checkbox" id={`enrolled-device-id-check-${enrolledDevice.enDevID}`} checked={(enrolledDevice.enrolledStatus == "enabled") ? true : false} onChange={handleDeviceStatusChange} /></td>
                              <button className="btn btn-primary"
                                type="button"
                                style={{
                                  borderRadius: 20,
                                  background: "transparent",
                                  borderColor: "var(--bs-secondary)",
                                  borderTopColor: "rgb(255,",
                                  borderRightColor: "255,",
                                  borderBottomColor: "255)",
                                  borderLeftColor: "255,"
                                }}
                                id={`delete-enDevID-${enrolledDevice.enDevID}`}
                                onClick={handleDeleteEnrolledDevice}>
                                <i
                                  className="far fa-trash-alt"
                                  style={{ color: "rgb(0,0,0)" }}
                                />
                              </button>
                            </tr>

                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>Device Name</th>
                            <th>Model</th>
                            <th>Type</th>
                            <th>Status</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-md-6 align-self-center">
                        <p
                          id="dataTable_info"
                          className="dataTables_info"
                          role="status"
                          aria-live="polite"
                        >
                          Showing {(enrolledDevices.length == 0) ? "0" : "1"} to {(enrolledDevices.length < 10) ? enrolledDevices.length : "10"} of {
                            enrolledDevices.length}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                          <ul className="pagination">
                            <li className="page-item disabled">
                              <a
                                className="page-link"
                                aria-label="Previous"
                                href="#"
                              >
                                <span aria-hidden="true">«</span>
                              </a>
                            </li>
                            <li className="page-item active">
                              <a className="page-link" href="#">
                                1
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="#">
                                2
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="#">
                                3
                              </a>
                            </li>
                            <li className="page-item">
                              <a
                                className="page-link"
                                aria-label="Next"
                                href="#"
                              >
                                <span aria-hidden="true">»</span>
                              </a>
                            </li>
                          </ul>
                        </nav>
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

export default Devices;