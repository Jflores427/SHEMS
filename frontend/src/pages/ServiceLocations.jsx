import { Suspense, useCallback, useContext, useEffect, useState } from "react";

import ENavBar from "../components/ENavBar";
import SNavBar from "../components/SNavBar";
import Modal from "react-bootstrap/Modal";
import PaginatedServiceList from "../components/PaginatedServiceList";
import "./ServiceLocations.css";
import { AuthOptions } from "../authentication/AuthOptions";
import LoadingIndicator from "../components/LoadingIndicator";
import api from "../functionsAPI/api";

/*
            <ProtectedRoute isAuthenticated={isAuthenticated}>

            </ProtectedRoute>
*/

// {
//     sID: 1,
//     streetNum: "sadd",
//     street: "asd",
//     unit: "asd",
//     city: "dsa",
//     state: "asdasd",
//     zipcode: "112",
//     country: "dasd",
//     startDate: "12/12/23",
//     squareFt: 11.2,
//     bedroomNum: 3,
//     serviceStatus: "false",
//     occupantNum: 4,
// },
// {
//     sID: 2,
//     streetNum: "sadd",
//     street: "asd",
//     unit: "asd",
//     city: "dsa",
//     state: "asdasd",
//     zipcode: "112",
//     country: "dasd",
//     startDate: "12/12/23",
//     squareFt: 11.2,
//     bedroomNum: 3,
//     serviceStatus: "active",
//     occupantNum: 4,
// },

const ServiceLocations = (props) => {
  const itemsPerPage = 10;
  const { user } = useContext(AuthOptions);
  const { username, cID } = user;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [show, setShow] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    cID: cID,
    streetNum: "",
    street: "",
    unit: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    startDate: "",
    squareFt: 0,
    bedroomNum: 0,
    serviceStatus: "active",
    occupantNum: 0,
  });
  let currentDate = new Date(Date.now());
  // console.log(currentDate);
  // console.log(new Date(Date.now()).getUTCMonth());
  // console.log(currentDate.getDay());
  // console.log(currentDate.getFullYear());
  
  const currentDateFormatted =
    currentDate.getFullYear() +
    "-" +
    (currentDate.getUTCMonth() + 1) +
    "-" +
    (currentDate.getDay() < 10
      ? "0" + (currentDate.getDay())
      : currentDate.getDay());
    
  console.log(currentDateFormatted)

  /* ~~~~~~~~~~~~~~~~~~~ API FUNCTIONS ~~~~~~~~~~~~~~~~~~ */

  function addNewService(newService) {
    api
      .post("/addServiceLocation", newService)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
        console.log("It was addNewService");
      });
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
        console.log("Result: " + result);
        setServiceLocations(result);
        setTimeout(setLoading.bind(null, false), 100);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function deleteServiceLocation(serviceLocationID) {
    api
      .delete("/deleteServiceLocation", {
        data: { sID: serviceLocationID },
      })
      .then(function (response) {
        console.log(response.data);
        getServiceLocations();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // console.log(result);

  // setServiceLocations(result);
  // console.log(result, 2)
  // response.data.map((response, index) => {
  //     setServiceLocations([...serviceLocations, response]);
  // })
  // console.log(serviceLocations.length)

  /* ~~~~~~~~~~~~~~~~~~~~~~~~ Handle Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  const handleResetPagination = () => {
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    setServiceFormData({ ...serviceFormData, [e.target.name]: e.target.value });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseButton = () => {
    setServiceFormData({
      cID: cID,
      streetNum: "",
      street: "",
      unit: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      startDate: "",
      squareFt: 0,
      bedroomNum: 0,
      serviceStatus: "active",
      occupantNum: 0,
    });
    handleClose();
  };

  const handleSubmitButton = (e) => {
    e.preventDefault();
    addNewService(serviceFormData);
    setServiceFormData({
      streetNum: "",
      street: "",
      unit: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      startDate: "",
      squareFt: 0,
      bedroomNum: 0,
      serviceStatus: "active",
      occupantNum: 0,
    });
    handleClose();
    setTimeout(getServiceLocations, 100); //Triggers Rerender
    // setServiceLocations([...serviceLocations]); // Triggers UseEffect
  };

  function handleServiceStatusChange(e) {
    // Find ServiceLocation From e
    // Write back to Service Locations Table with UpdateServiceLocationAPI(target.sID)
    // Call fetchServiceLocations

    let target = serviceLocations.filter(
      (serviceLocation) =>
        serviceLocation.sID == parseInt(e.target.id.substring(17))
    );
    let sIDTarget = target[0].sID;
    let serviceStatusTarget =
      target[0].serviceStatus == "active" ? "inactive" : "active";
    api
      .post("/setServiceLocationStatus", {
        sID: sIDTarget,
        serviceStatus: serviceStatusTarget,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    setTimeout(getServiceLocations, 100); //Triggers Rerender
  }

  // const serviceStatusChangeCallback = useCallback(handleServiceStatusChange,[]);

  // WE STILL NEED handleDeleteServiceLocation
  const handleDeleteServiceLocation = (e) => {
    //Find ServiceLocation data from event.target in serviceLocations
    //Call Delete API
    let serviceLocationID = e.target.value;
    deleteServiceLocation(serviceLocationID);
    setTimeout(getServiceLocations, 100); //Triggers Rerender
    handleResetPagination();
  };

  // function fetchServiceLocations(cID) {
  //     // Return List of Service Locations from API and setServiceLocations() with that list.
  // }

  // function updateServiceLocation(sID) {};

  // function postServiceLocation(cID, serviceFormData) {
  //     // Create Address with serviceFormData, get addressID
  //     // Create Service Location, with that new addressID as serviceAddressID and cID
  // }

  useEffect(() => {
    getServiceLocations();
    console.log(loading);
  }, []);

  return (
            <div className="container-fluid">
              <div className="row">
                <div
                  className="col-xl-10 d-flex justify-content-between"
                  style={{ width: "100%" }}
                >
                  <h3 className="text-dark mb-4" style={{ width: "100%" }}>
                    My Service Locations
                  </h3>
                  <div style={{ width: "5%" }}>
                    <button
                      className="btn btn-primary rounded-circle bg-secondary"
                      id="service-modal-toggle"
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
                size="xl"
                backdrop="static"
                onHide={handleClose}
                style={{ translate: "60px 60px" }}
              >
                <form className="d-flex flex-column ">
                  <Modal.Header>
                    <div
                      className="modal-header"
                      style={{
                        background: "var(--bs-secondary)",
                        width: "100%",
                      }}
                    >
                      <h4
                        className="modal-title"
                        style={{ color: "var(--bs-light)" }}
                      >
                        New Service Location
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
                      <div className="row gap-3 my-3">
                        <div className="col">
                          <div
                            className="input-group"
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
                              htmlFor="form-street-num"
                            >
                              Street #
                            </label>
                            <input
                              className="form-control form-control-user"
                              type="text"
                              id="form-street-num"
                              style={{
                                borderRadius: "0 0 10px 10px",
                                width: "100%",
                                margin: 0,
                              }}
                              name="streetNum"
                              value={serviceFormData.streetNum}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="input-group"
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
                              htmlFor="form-street"
                            >
                              Street
                            </label>
                            <input
                              className="form-control form-control-user"
                              type="text"
                              id="form-street"
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="street"
                              value={serviceFormData.street}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="input-group"
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
                              htmlFor="form-unit"
                            >
                              Unit
                            </label>
                            <input
                              className="form-control form-control-user"
                              type="text"
                              id="form-unit"
                              style={{
                                borderRadius: "0 0 10px 10px",
                                margin: 0,
                              }}
                              name="unit"
                              value={serviceFormData.unit}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row gap-3 my-3">
                        <div className="col">
                          <div
                            className="input-group"
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
                              htmlFor="form-city"
                            >
                              City
                            </label>
                            <input
                              className="form-control form-control-user"
                              type="text"
                              id="form-city"
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="city"
                              value={serviceFormData.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="input-group"
                            style={{ color: "var(--bs-light)" }}
                          >
                            <label
                              className="form-label input-group-text"
                              style={{
                                width: "100%",
                                background: "var(--bs-secondary)",
                                color: "var(--bs-light)",
                                margin: 0,
                                borderRadius: "10px 10px 0px 0px",
                              }}
                              htmlFor="form-state"
                            >
                              State
                            </label>
                            <input
                              className="form-control form-control-user"
                              type="text"
                              id="form-state"
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="state"
                              value={serviceFormData.state}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="input-group"
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
                              htmlFor="form-zipcode"
                            >
                              Zip Code
                            </label>
                            <input
                              className="form-control form-control-user"
                              type="text"
                              id="form-zipcode"
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="zipcode"
                              value={serviceFormData.zipcode}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row gap-3 my-3">
                        <div className="col">
                          <div
                            className="input-group"
                            style={{ color: "var(--bs-light)" }}
                          >
                            <label
                              className="form-label input-group-text"
                              style={{
                                width: "100%",
                                background: "var(--bs-secondary)",
                                color: "var(--bs-light)",
                                margin: 0,
                                borderRadius: "10px 10px 0px 0px",
                              }}
                              htmlFor="form-country"
                            >
                              Country
                            </label>
                            <input
                              className="form-control form-control-user"
                              type="text"
                              id="form-country"
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="country"
                              value={serviceFormData.country}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row gap-3 my-3">
                        <div className="col">
                          <div
                            className="input-group"
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
                              htmlFor="form-start-date"
                            >
                              Start Date
                            </label>
                            <input
                              className="form-control form-control-user"
                              type="date"
                              min={currentDateFormatted}
                              //   min="2024-12-07"
                              id="form-start-date"
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="startDate"
                              value={serviceFormData.startDate}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="input-group"
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
                              htmlFor="form-sq-ft"
                            >
                              Sq Ft.
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              id="form-sq-ft"
                              min={0}
                              step="0.01"
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="squareFt"
                              value={serviceFormData.squareFt}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="input-group"
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
                              htmlFor="form-bedroom-num"
                            >
                              # of Bedrooms
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              id="form-bedroom-num"
                              min={0}
                              step={1}
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="bedroomNum"
                              value={serviceFormData.bedroomNum}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="input-group"
                            style={{ color: "var(--bs-light)", width: "100%" }}
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
                              htmlFor="form-occupant-num"
                            >
                              # of Occupants
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              id="form-occupant-num"
                              min={0}
                              step={1}
                              style={{ borderRadius: "0 0 10px 10px" }}
                              name="occupantNum"
                              value={serviceFormData.occupantNum}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
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
                        disabled={
                          serviceFormData.cID &&
                          serviceFormData.streetNum &&
                          serviceFormData.street &&
                          serviceFormData.unit &&
                          serviceFormData.city &&
                          serviceFormData.state &&
                          serviceFormData.zipcode &&
                          serviceFormData.country &&
                          serviceFormData.startDate &&
                          serviceFormData.squareFt > 0 &&
                          serviceFormData.bedroomNum > 0 &&
                          serviceFormData.occupantNum > 0
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

              <div className="card shadow" style={{ width: "100%" }}>
                <div className="card-header py-3 bg-secondary">
                  <p className="text-primary m-0 fw-bold text-light">
                    Service Location Info
                  </p>
                </div>
                <div className="card-body text-uppercase">
                  <PaginatedServiceList
                    items={serviceLocations}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handleServiceStatusChange={handleServiceStatusChange}
                    handleDeleteServiceLocation={handleDeleteServiceLocation}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
  );
};

export default ServiceLocations;
