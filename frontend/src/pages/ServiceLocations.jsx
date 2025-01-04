import { useContext, useEffect, useState } from "react";
import { AuthOptions } from "../authentication/AuthOptions";
import Modal from "react-bootstrap/Modal";
import PaginatedServiceList from "../components/PaginatedServiceList";
import {
  addServiceLocation,
  getServiceLocations,
  deleteServiceLocation,
  setServiceLocationStatus,
} from "../functionsAPI/apiServiceLocations";

import "./ServiceLocations.css";

const ServiceLocations = () => {
  const itemsPerPage = 8;
  const { user } = useContext(AuthOptions);
  const { cID } = user;
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
  const currentDate = new Date(Date.now());
  const currentDateFormatted =
    currentDate.getFullYear() +
    "-" +
    (currentDate.getMonth() + 1 < 10
      ? "0" + (currentDate.getMonth() + 1)
      : currentDate.getMonth() + 1) +
    "-" +
    (currentDate.getDate() < 10
      ? "0" + currentDate.getDate()
      : currentDate.getDate());

  const handleGetServiceLocations = async () => {
    try {
      const result = await getServiceLocations(cID);
      setServiceLocations(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddServiceLocation = async (newService) => {
    try {
      await addServiceLocation(newService);
      setTimeout(handleGetServiceLocations, 100);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteServiceLocation = async (e) => {
    try {
      const serviceLocationID = e.target.value;
      await deleteServiceLocation(serviceLocationID);
      if (
        Math.ceil((serviceLocations.length - 1) / itemsPerPage) < currentPage
      ) {
        setCurrentPage(currentPage - 1);
      }
      handleResetPagination();
      setTimeout(handleGetServiceLocations, 100);
    } catch (error) {
      console.log(error.message);
    }
  };

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
    handleAddServiceLocation(serviceFormData);
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
    handleCloseButton();
    setTimeout(handleGetServiceLocations, 100);
  };

  const handleSetServiceLocationStatus = async (e) => {
    const target = serviceLocations.filter(
      (serviceLocation) =>
        serviceLocation.sID == parseInt(e.target.id.substring(17))
    );
    const sIDTarget = target[0].sID;
    const serviceStatusTarget =
      target[0].serviceStatus == "active" ? "inactive" : "active";
    await setServiceLocationStatus(sIDTarget, serviceStatusTarget);
    setTimeout(handleGetServiceLocations, 100);
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
          <h3
            className="text-secondary mb-4"
            style={{ width: "100%", fontFamily: "Ribeye, Mogra, sans-serif" }}
          >
            My Service Locations
          </h3>
          <div style={{ width: "5%" }}>
            <button
              className="btn btn-primary rounded-circle bg-secondary plus-btn"
              id="service-modal-toggle"
              type="button"
              onClick={handleShow}
            >
              <i class="fa fa-plus pt-1" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        size="xl"
        backdrop="static"
        onHide={handleClose}
        centered
      >
        <form className="d-flex flex-column service-bg-gradient">
          <Modal.Header>
            <div
              className="modal-header"
              style={{
                background: "var(--bs-secondary)",
                width: "100%",
                fontFamily: "Ribeye, Mogra, sans-serif",
              }}
            >
              <h4 className="modal-title" style={{ color: "var(--bs-light)" }}>
                New Service Location
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
            <div className="modal-body" style={{ fontFamily: "Mogra, Ribeye, sans-serif" }}>
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
                      placeholder="194"
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
                      placeholder="Placeholder St."
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
                      placeholder="C"
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
                      placeholder="Brooklyn"
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
                      placeholder="Ohio"
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
                      placeholder="XXXXX"
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
                      placeholder="USA"
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
            <div className="modal-footer" style={{ fontFamily: "Mogra, Ribeye, sans-serif" }}>
              <button
                className="btn btn-danger"
                type="button"
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

      <div
        className="card shadow w-100 mb-3"
        style={{ fontFamily: "Mogra, Ribeye, sans-serif" }}
      >
        <div className="card-header py-3 bg-secondary">
          <p className="text-primary m-0 fw-bold text-light">
            Service Location Info
          </p>
        </div>
        <div className="card-body text-uppercase service-bg-gradient">
          <PaginatedServiceList
            items={serviceLocations}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleServiceStatusChange={handleSetServiceLocationStatus}
            handleDeleteServiceLocation={handleDeleteServiceLocation}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceLocations;
