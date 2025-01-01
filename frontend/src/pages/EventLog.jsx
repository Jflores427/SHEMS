import { useState, useContext, useEffect } from "react";
import { AuthOptions } from "../authentication/AuthOptions";
import PaginatedDeviceEventList from "../components/PaginatedDeviceEventList";

import {
  getEnrolledDevices,
  getServiceLocations,
  getEnrolledDeviceEvents,
  getAllEnrolledDeviceEvents,
  postEnrolledDeviceEvents,
  deleteEnrolledDeviceEvent,
} from "../functionsAPI/apiEvents";

import "./EventLog.css";

const EventLog = () => {
  const { user } = useContext(AuthOptions);
  const { cID } = user;
  const [loading, setLoading] = useState(true);
  const [checkedsID, setCheckedsID] = useState("");
  const [checkedEnrolledDeviceID, setCheckedEnrolledDeviceID] = useState("");
  const [serviceLocations, setServiceLocations] = useState([]);
  const [enrolledDevices, setEnrolledDevices] = useState([]);
  const [enrolledDeviceEvents, setEnrolledDeviceEvents] = useState([]);

  const offset = 4;
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageRangeStart, setPageRangeStart] = useState(1);
  const [pageRangeEnd, setPageRangeEnd] = useState(offset);

  const handleResetPagination = () => {
    setCurrentPage(1);
    setPageRangeStart(1);
    setPageRangeEnd(offset);
  };

  const handleGetServiceLocations = async () => {
    try {
      const serviceLocationsResult = await getServiceLocations(cID);
      if (serviceLocationsResult && serviceLocationsResult.length > 0) {
        setServiceLocations(serviceLocationsResult);

        if (serviceLocationsResult && serviceLocationsResult.length > 0) {
          const firstServiceLocationID = serviceLocationsResult[0].sID;
          setCheckedsID(firstServiceLocationID);

          const enrolledDevicesResult = await getEnrolledDevices(
            serviceLocationsResult[0].sID
          );
          if (enrolledDevicesResult && enrolledDevicesResult.length > 0) {
            setEnrolledDevices(enrolledDevicesResult);

            const result = await getAllEnrolledDeviceEvents(
              firstServiceLocationID
            );
            setEnrolledDeviceEvents(result);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetEnrolledDevices = async (sID) => {
    try {
      const result = await getEnrolledDevices(sID);
      if (result && result.length > 0) {
        setEnrolledDevices(result);
      } else {
        setEnrolledDevices([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetEnrolledDeviceEvents = async (sID, enDevID) => {
    try {
      const result = await getEnrolledDeviceEvents(sID, enDevID);
      if (result && result.length >= 0) {
        setEnrolledDeviceEvents(result);
      } else {
        setEnrolledDeviceEvents([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetAllEnrolledDeviceEvents = async (sID) => {
    try {
      const result = await getAllEnrolledDeviceEvents(sID);
      if (result && result.length >= 0) {
        setEnrolledDeviceEvents(result);
      } else {
        setEnrolledDeviceEvents([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteEnrolledDeviceEvent = async (e) => {
    const edEventID = e.target.value;
    try {
      await deleteEnrolledDeviceEvent(edEventID);
      if (
        Math.ceil((enrolledDeviceEvents.length - 1) / itemsPerPage) <
        currentPage
      ) {
        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
      }
      if (checkedEnrolledDeviceID !== "") {
        setTimeout(
          handleGetEnrolledDeviceEvents.bind(
            null,
            checkedsID,
            checkedEnrolledDeviceID
          ),
          100
        );
      } else {
        setTimeout(
          handleGetAllEnrolledDeviceEvents.bind(null, checkedsID),
          100
        );
      }
    } catch (error) {
      alert("Delete Failed; Try Again!");
      console.log(error.message);
    }
  };

  const handleRefresh = () => {
    setCheckedEnrolledDeviceID("");
    handleGetAllEnrolledDeviceEvents(checkedsID);
  };

  const handleSelectSID = (e) => {
    const sID = e.target.value;
    setCheckedsID(sID);
    setCheckedEnrolledDeviceID("");
    setEnrolledDevices([]);
    handleGetEnrolledDevices(sID);
    handleGetAllEnrolledDeviceEvents(sID);
    handleResetPagination();
  };

  const handleSelectEnrolledDeviceID = (e) => {
    const enrolledDeviceID = e.target.value;
    setCheckedEnrolledDeviceID(enrolledDeviceID);
    handleGetEnrolledDeviceEvents(checkedsID, enrolledDeviceID);
    handleResetPagination();
  };

  const handleGenerateEvents = async () => {
    try {
      await postEnrolledDeviceEvents(checkedsID);
      handleGetAllEnrolledDeviceEvents(checkedsID);
      setCheckedEnrolledDeviceID("");
      handleResetPagination();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleGetServiceLocations();
    setTimeout(setLoading.bind(null, false), 300);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-xl-10 d-flex justify-content-between"
          style={{ width: "100%" }}
        >
          <h3 className="text-secondary mb-4" style={{ width: "100%" }}>
            My Event Log
          </h3>
        </div>
      </div>

      <div className="card shadow" style={{ minHeight: "500px" }}>
        <div className="card-header py-3 bg-secondary">
          <p className="text-primary m-0 fw-bold text-light">
            Device Events Info
          </p>
        </div>
        <div className="card-body text-uppercase event-bg-gradient">
          {!loading && (
            <div
              id="dataTable_filter"
              className="text-md-end dataTables_filter row mb-3 d-flex flex-row justify-content-center align-items-center"
            >
              <div className="col-1">
                <button className="btn text-warning refresh-btn" onClick={handleRefresh}>
                  <i className="fa fa-refresh fa-spin refresh-btn" />
                </button>
              </div>

              <div className="col-3">
                <select
                  id="device-id"
                  className="form-select mx-1 text-center"
                  onChange={handleSelectEnrolledDeviceID}
                  value={checkedEnrolledDeviceID}
                >
                  <optgroup className="text-center" label="Devices">
                    <option className="text-center" value="" disabled hidden>
                      {" "}
                      Select a Device
                    </option>
                    {enrolledDevices.length > 0 &&
                      enrolledDevices.map((enrolledDevice) => (
                        <option
                          key={enrolledDevice.enDevID}
                          value={enrolledDevice.enDevID}
                          className="text-center"
                        >
                          {enrolledDevice.enDevName}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
              <div className="col-3">
                <select
                  id="service-id"
                  className="form-select mx-1 text-center"
                  onChange={handleSelectSID}
                  value={checkedsID}
                >
                  <optgroup className="text-center" label="Service Locations">
                    <option className="text-center" value="" disabled hidden>
                      {" "}
                      Select a Service Location
                    </option>
                    {serviceLocations.length > 0 &&
                      serviceLocations.map((serviceLocation) => (
                        <option
                          key={serviceLocation.sID}
                          value={serviceLocation.sID}
                          className="text-center"
                        >
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
              <div className="col-5 col-sm-3 d-flex flex-row justify-content-center">
                <button
                  className="btn btn-light rounded bg-secondary my-1 generate-btn"
                  id="event-generate-toggle"
                  type="button"
                  onClick={handleGenerateEvents}
                >
                  Generate Events
                </button>
              </div>
            </div>
          )}

          <PaginatedDeviceEventList
            items={enrolledDeviceEvents}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageRangeStart={pageRangeStart}
            setPageRangeStart={setPageRangeStart}
            pageRangeEnd={pageRangeEnd}
            setPageRangeEnd={setPageRangeEnd}
            handleDeleteEnrolledDeviceEvent={handleDeleteEnrolledDeviceEvent}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EventLog;
