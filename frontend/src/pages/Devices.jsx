import { useState, useEffect, useContext } from "react";
import { AuthOptions } from "../authentication/AuthOptions";
import Modal from "react-bootstrap/Modal";
import PaginatedDeviceList from "../components/PaginatedDeviceList";
import {
  getDevices,
  getDeviceModels,
  getServiceLocations,
  getDevID,
  addNewEnrolledDevice,
  setEnrolledDeviceStatus,
  deleteEnrolledDevice,
  getEnrolledDevices,
} from "../functionsAPI/apiDevices";

import "./Devices.css";

const Devices = () => {
  const { user } = useContext(AuthOptions);
  const { cID } = user;
  const [loading, setLoading] = useState(true);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [deviceModels, setDeviceModels] = useState([]);
  const [checkedsID, setCheckedsID] = useState("");
  const [serviceLocations, setServiceLocations] = useState([]);
  const [enrolledDevices, setEnrolledDevices] = useState([]);
  const [deviceFormData, setDeviceFormData] = useState({
    cID,
    enDevName: "",
    devID: 0,
    type: "",
    model: "",
    sID: 0,
    enrolledStatus: "enabled",
  });

  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleResetPagination = () => setCurrentPage(1);

  const handleGetServiceLocations = async () => {
    try {
      const result = await getServiceLocations(cID);
      if (result && result.length > 0) {
        setServiceLocations(result);
        if (checkedsID === "" && result.length > 0) {
          handleGetEnrolledDevices(result[0].sID);
          setCheckedsID(result[0].sID);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetEnrolledDevices = async (checkedsID) => {
    try {
      const result = await getEnrolledDevices(checkedsID);
      if (result && result.length >= 0) {
        setEnrolledDevices(result);
      }
      setTimeout(setLoading.bind(null, false), 100);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteEnrolledDevice = (e) => {
    e.preventDefault();
    const enDevID = e.target.value;
    try {
      deleteEnrolledDevice(enDevID);
      if (
        Math.ceil((enrolledDevices.length - 1) / itemsPerPage) < currentPage
      ) {
        setCurrentPage(currentPage - 1);
      }
      setTimeout(handleGetEnrolledDevices.bind(null, checkedsID), 100);
    } catch (error) {
      alert("Delete Failed; Try Again!");
      console.log(error.message);
    }
  };

  const handleDeviceStatusChange = (e) => {
    try{
    const enDevIDValue = parseInt(e.target.id.substring(25));
    const target = enrolledDevices.filter(
      (enrolledDevice) =>
        enrolledDevice.enDevID == enDevIDValue
    );
    const enDevIDTarget = target[0].enDevID;
    const enrolledStatusTarget =
      target[0].enrolledStatus == "enabled" ? "disabled" : "enabled";
    setEnrolledDeviceStatus(enDevIDTarget, enrolledStatusTarget);
    setTimeout(handleGetEnrolledDevices.bind(null, checkedsID), 100);
  }
  catch(error) {
    console.log(error.message)
  }
  };

  const handleGetDevices = async () => {
    const result = await getDevices();
    if (result && result.length > 0) {
      setDeviceTypes(result);
    }
  };

  const handleGetDeviceModels = async (type) => {
    const result = await getDeviceModels(type);
    if (result && result.length > 0) {
      setDeviceModels(result);
    }
  };

  const handleChange = (e) => {
    setDeviceFormData({ ...deviceFormData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = async (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedDeviceType = selectedOption.value;

    handleGetDeviceModels(selectedDeviceType);
    setDeviceFormData({ ...deviceFormData, [e.target.name]: e.target.value });
  };

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    const newDevID = await getDevID(deviceFormData.model, deviceFormData.type);
    const newDeviceData = { ...deviceFormData, devID: newDevID };
    addNewEnrolledDevice(newDeviceData);
    handleCloseButton();
    setTimeout(handleGetEnrolledDevices.bind(null, checkedsID), 100);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseButton = () => {
    setDeviceFormData({
      cID: cID,
      sID: 0,
      enDevName: "",
      model: "",
      type: "",
      devID: 0,
      enrolledStatus: "enabled",
    });
    setDeviceModels([]);
    handleClose();
  };

  const handleSelectSID = (e) => {
    const sID = e.target.value;
    setCheckedsID(sID);
    handleGetEnrolledDevices(sID);
    handleResetPagination();
  }

  useEffect(() => {
    handleGetDevices();
    handleGetServiceLocations();
    handleGetEnrolledDevices(checkedsID);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-xl-10 d-flex justify-content-between"
          style={{ width: "100%" }}
        >
          <h3 className="text-secondary mb-4" style={{ width: "100%" }}>
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
      <Modal
        show={show}
        backdrop="static"
        size="xl"
        onHide={handleClose}
        style={{ translate: "60px 60px" }}
      >
        <form
          className="d-flex flex-column gap-4"
          onSubmit={handleSubmitButton}
        >
          <Modal.Header>
            <div
              className="modal-header"
              style={{ background: "var(--bs-secondary)", width: "100%" }}
            >
              <h4 className="modal-title" style={{ color: "var(--bs-light)" }}>
                New Device
              </h4>
              <button
                className="btn-close btn-close-white"
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
                    borderRadius: "10px 10px 0 0",
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
                    borderWidth: 1,
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
                    borderRadius: "10px 10px 0 0",
                  }}
                  htmlFor="form-device-type"
                >
                  Device Type
                </label>
                <select
                  className="form-select w-100"
                  id="form-device-type"
                  style={{ borderRadius: "0 0 10px 10px" }}
                  name="type"
                  onChange={handleTypeChange}
                  required
                  disabled={deviceTypes.length > 0 ? false : true}
                >
                  <optgroup label="Device Type">
                    <option value="" selected disabled hidden>
                      {" "}
                      Select a Device Type
                    </option>
                    {deviceTypes.length > 0 &&
                      deviceTypes.map((device, index) => (
                        <option key={device.type} value={device.type}>
                          {device.type.charAt(0).toUpperCase() +
                            device.type.substring(1)}
                        </option>
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
                    borderRadius: "10px 10px 0 0",
                  }}
                  htmlFor="form-device-model"
                >
                  Device Model
                </label>
                <select
                  className="form-select w-100"
                  id="form-device-model"
                  style={{ borderRadius: "0 0 10px 10px" }}
                  name="model"
                  onChange={handleChange}
                  required
                  disabled={deviceModels.length > 0 ? false : true}
                >
                  <optgroup label="Device Models">
                    <option value="" selected disabled hidden>
                      {" "}
                      Select a Device Model
                    </option>
                    {deviceModels.length > 0 &&
                      deviceModels.map((device, index) => (
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
                    borderRadius: "10px 10px 0 0",
                  }}
                  htmlFor="form-device-sID"
                >
                  Service Locations
                </label>
                <select
                  className="form-select w-100"
                  id="form-device-sID"
                  style={{ borderRadius: "0 0 10px 10px" }}
                  name="sID"
                  onChange={handleChange}
                  required
                  disabled={serviceLocations.length > 0 ? false : true}
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
                            serviceLocation.unit}
                        </option>
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
                type="submit"
                style={{ background: "var(--bs-secondary)" }}
                disabled={
                  deviceFormData.sID &&
                  deviceFormData.model &&
                  deviceFormData.type
                    ? false
                    : true
                }
              >
                Save
              </button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>

      <div className="card shadow" style={{ minHeight: "500px" }}>
        <div className="card-header py-3 bg-secondary">
          <p className="text-primary m-0 fw-bold text-light">Device Info</p>
        </div>
        <div className="card-body text-uppercase">
          {!loading && (
            <div className="row">
              <div className="col-xl-12">
                <div
                  className="text-md-end dataTables_filter"
                  id="dataTable_filter"
                >
                  <label className="form-label" htmlFor="service-id" />
                  <select id="service-id" onChange={handleSelectSID}>
                    <optgroup label="Service Locations">
                      <option value="" selected disabled hidden>
                        {" "}
                        Select a Service Location
                      </option>
                      {serviceLocations.length > 0 &&
                        serviceLocations.map((serviceLocation, index) =>
                          index == 0 ? (
                            <option
                              selected
                              key={serviceLocation.sID}
                              value={serviceLocation.sID}
                            >
                              {serviceLocation.streetNum +
                                " " +
                                serviceLocation.street +
                                ", " +
                                serviceLocation.unit}
                            </option>
                          ) : (
                            <option
                              key={serviceLocation.sID}
                              value={serviceLocation.sID}
                            >
                              {serviceLocation.streetNum +
                                " " +
                                serviceLocation.street +
                                ", " +
                                serviceLocation.unit}
                            </option>
                          )
                        )}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
          )}

          <PaginatedDeviceList
            items={enrolledDevices}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleDeviceStatusChange={handleDeviceStatusChange}
            handleDeleteEnrolledDevice={handleDeleteEnrolledDevice}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Devices;
