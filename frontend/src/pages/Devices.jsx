import { useState, useEffect, useContext } from "react";
import { AuthOptions } from "../authentication/AuthOptions";
import ENavBar from "../components/ENavBar";
import SNavBar from "../components/SNavBar";
import Modal from 'react-bootstrap/Modal';

import "./Devices.css"

const Devices = (props) => {

  const { username, customerID } = useContext(AuthOptions);
  const [devices, setDevices] = useState([]);
  const [deviceModels, setDeviceModels] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [enrolledDevices, setEnrolledDevices] = useState([]);
  const [deviceFormData, setDeviceFormData] = useState({
    cID: customerID,
    deviceName: "",
    type: "",
    model: "",
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

  function getDevices() { 
    axios
      .get("/api/getSupportedDevice/")
      .then((response) => {
        const result = [];
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i])
        }
        setDevices(result)
      })
      .catch(function (error) {
        console.log(error);
      })

  }
  function getDeviceModels(type) { 
    axios
      .get("/api/getSupportedDevice/")
      .then((response) => {
        const result = [];
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i])
        }
        setDevices(result)
        const newResult = devices.filter((device) => device.type == type)
        setDeviceModels(newResult);
      })
      .catch(function (error) {
        console.log(error);
      })

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
    axios
    .get("http://127.0.0.1:5000/api/getEnrolledDevice/", {
      params: { sID: sID },
    })
    .then(function (response) {
      const result = [];
      for (let i = 0; i < response.data.length; i++) {
        result.push(response.data[i])
      }
      setEnrolledDevices(result)
    })
    .catch(function (error) {
      console.log(error);
    });

  }
  function addNewEnrolledDevice(newEnrolledDevice, sID) { 
    axios
    .post("http://127.0.0.1:5000/api/enrollDevice/", newEnrolledDevice)
    .then(function (response) {
      console.log(response.data);
      // setTimeout(getEnrolledDevices.bind(null, sID), 100);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function setEnrolledDeviceStatus(enDevId, enrolledStatus) {
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


  const handleChange = (e) => {
    setDeviceFormData({ ...deviceFormData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const selectElt = document.getElementById("form-device-type");
    console.log(selectElt);
    console.log(e.target);
    const selectedOption = selectElt.options[selectElt.selectedIndex];
    const selectedDeviceType = selectedOption.value;

    setDeviceModels(devices.filter((device) => device.type == selectedDeviceType));
    setDeviceFormData({ ...deviceFormData, [e.target.name]: e.target.value });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseButton = () => {
    setDeviceFormData({
      cID: customerID,
      deviceName: "",
      model: "",
      type: "",
      enrolledStatus: "enabled",
    });
    handleClose();
  }

  const handleSubmitButton = () => { };

  useEffect(() => {
    getDevices();
    getEnrolledDevices();
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
                            name="deviceName"
                            value={deviceFormData.deviceName}
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
                              {devices.length > 0 &&
                                devices.map((device) => (
                                  <option value={device.type}>{device.type}</option>
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
                        {/* <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="form-enrolled-status"
                            name="enrolledStatus"
                            checked={(device. == "active") ? true : false}
                            onChange={handleChange}
                            required
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form-enable-disable"
                          >
                            Disable/Enable
                          </label>
                        </div> */}
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
                          <select id="service-id">
                            <optgroup label="Service Location">
                              <option value={12} selected="">
                                This is item 1
                              </option>
                              <option value={13}>This is item 2</option>
                              <option value={14}>This is item 3</option>
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
                          <tr>
                            <td>The Televisor</td>
                            <td>Television</td>
                            <td>MA200</td>
                            <td>
                              <input type="checkbox" />
                            </td>
                            <td>
                              <button
                                className="btn btn-primary"
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
                              >
                                <i
                                  className="far fa-trash-alt"
                                  style={{ color: "rgb(0,0,0)" }}
                                />
                              </button>
                            </td>
                          </tr>

                        </tbody>
                        <tfoot>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>Device Name</td>
                            <td style={{ fontWeight: "bold" }}>Model</td>
                            <td style={{ fontWeight: "bold" }}>Type</td>
                            <td style={{ fontWeight: "bold" }}>Status</td>
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
                          Showing 1 to {(devices.length < 10) ? devices.length : "10"} of {
                            devices.length}
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