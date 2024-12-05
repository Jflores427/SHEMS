import { useCallback, useContext, useEffect, useState } from "react";

import ENavBar from "../components/ENavBar"
import SNavBar from "../components/SNavBar"
import Modal from 'react-bootstrap/Modal';
import "./ServiceLocations.css"
import { AuthOptions } from "../authentication/AuthOptions";
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

    const { username, customerID } = useContext(AuthOptions);
    const [serviceLocations, setServiceLocations] = useState([]);
    const [offset, setOffset] = useState((serviceLocations.length > 0) ? 1 : 0)
    const [show, setShow] = useState(false);
    const [serviceFormData, setServiceFormData] = useState({
        cID : customerID,
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

    const handleChange = (e) => {
        setServiceFormData({ ...serviceFormData, [e.target.name]: e.target.value });
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseButton = () => {
        setServiceFormData({
            cID : customerID,
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
    }

    function addNewService(newService) {
        axios
          .post("http://127.0.0.1:5000/api/addServiceLocation/", newService)
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
            console.log("It was addNewService")
          });
      }

      function getServiceLocations() {
        axios
        .get("http://127.0.0.1:5000/api/getServiceLocation/", {
          params: { cID: customerID },
        })
        .then((response) => {
            const result = [];
            for (let i= 0; i < response.data.length; i++){
                result.push(response.data[i])
            }
            setServiceLocations(result)
        })
        .catch(function (error) {
          console.log(error);
        })
      }

                  // console.log(result);
            
            // setServiceLocations(result);
            // console.log(result, 2)
            // response.data.map((response, index) => {
            //     setServiceLocations([...serviceLocations, response]);
            // })
            // console.log(serviceLocations.length)

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
        setTimeout(getServiceLocations, 100); //Triggers Rerender
        handleClose();
        
        // setServiceLocations([...serviceLocations]); // Triggers UseEffect
    }

    function handleServiceStatusChange(e)  { 
        // Find ServiceLocation From e
        // Write back to Service Locations Table with UpdateServiceLocationAPI(target.sID)
        // Call fetchServiceLocations

        let target = serviceLocations.filter((serviceLocation) => serviceLocation.sID == parseInt(e.target.id.substring(17,)))
        let sIDTarget = target[0].sID;
        let serviceStatusTarget = (target[0].serviceStatus == "active") ? "inactive" : "active";
        axios
        .post("http://127.0.0.1:5000/api/setServiceLocationStatus/", {
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
    }

    // function fetchServiceLocations(customerID) { 
    //     // Return List of Service Locations from API and setServiceLocations() with that list.
    // }

    // function updateServiceLocation(sID) {};

    // function postServiceLocation(customerID, serviceFormData) { 
    //     // Create Address with serviceFormData, get addressID
    //     // Create Service Location, with that new addressID as serviceAddressID and customerID
    // }

    useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/api/getServiceLocation/", {
              params: { cID: customerID },
            })
            .then((response) => {
                const result = [];
                for (let i= 0; i < response.data.length; i++){
                    result.push(response.data[i])
                }
                setServiceLocations(result)
            })
            .catch(function (error) {
              console.log(error);
            })
    }, []);

    return (
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


                            <Modal show={show} size="xl" onHide={handleClose} style={{ translate: "60px 60px" }}>
                                <form className="d-flex flex-column ">
                                    <Modal.Header >
                                        <div
                                            className="modal-header"
                                            style={{ background: "var(--bs-secondary)", width: "100%" }}
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
                                    <Modal.Body >
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
                                                                borderRadius: "10px 10px 0 0"
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
                                                                margin: 0
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
                                                                borderRadius: "10px 10px 0 0"
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
                                                                borderRadius: "10px 10px 0 0"
                                                            }}
                                                            htmlFor="form-unit"
                                                        >
                                                            Unit
                                                        </label>
                                                        <input
                                                            className="form-control form-control-user"
                                                            type="text"
                                                            id="form-unit"
                                                            style={{ borderRadius: "0 0 10px 10px", margin: 0 }}
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
                                                                borderRadius: "10px 10px 0 0"
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
                                                                borderRadius: "10px 10px 0px 0px"
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
                                                                borderRadius: "10px 10px 0 0"
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
                                                                borderRadius: "10px 10px 0px 0px"
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
                                                                borderRadius: "10px 10px 0 0"
                                                            }}
                                                            htmlFor="form-start-date"
                                                        >
                                                            Start Date
                                                        </label>
                                                        <input
                                                            className="form-control form-control-user"
                                                            type="date"
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
                                                                borderRadius: "10px 10px 0 0"
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
                                                                borderRadius: "10px 10px 0 0"
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
                                                                borderRadius: "10px 10px 0 0"
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
                                    <div
                                        className="table-responsive text-capitalize table mt-2"
                                        id="dataTable"
                                        role="grid"
                                        aria-describedby="dataTable_info"
                                    >
                                        <table className="table my-0" id="dataTable">
                                            <thead>
                                                <tr>
                                                    <th>Street#</th>
                                                    <th>Street</th>
                                                    <th>Unit</th>
                                                    <th>City</th>
                                                    <th>State</th>
                                                    <th>Zip Code</th>
                                                    <th>Country</th>
                                                    <th>Start date</th>
                                                    <th>Sq Ft.</th>
                                                    <th>Bedrooms</th>
                                                    <th>Occupants</th>
                                                    <th>Status</th>
                                                    <th>Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {serviceLocations.length !== 0 && serviceLocations.map((serviceLocation) => (
                                                    <tr key={serviceLocation.sID} id={`service-id-${serviceLocation.sID}`}>
                                                        <td>{serviceLocation.streetNum}</td>
                                                        <td>{serviceLocation.street}</td>
                                                        <td>{serviceLocation.unit}</td>
                                                        <td>{serviceLocation.city}</td>
                                                        <td>{serviceLocation.state}</td>
                                                        <td>{serviceLocation.zipcode}</td>
                                                        <td>{serviceLocation.country}</td>
                                                        <td>{serviceLocation.startDate}</td>
                                                        <td>{serviceLocation.squareFt}</td>
                                                        <td>{serviceLocation.bedroomNum}</td>
                                                        <td>{serviceLocation.occupantNum}</td>
                                                        <td><input type="checkbox" id={`service-id-check-${serviceLocation.sID}`} checked={(serviceLocation.serviceStatus == "active") ? true : false} onChange={handleServiceStatusChange} /></td>
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
                                                            id={`delete-sid-${serviceLocation.sID}`}
                                                            onClick={handleDeleteServiceLocation}>
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
                                                    <th>Street#</th>
                                                    <th>Street</th>
                                                    <th>Unit</th>
                                                    <th>City</th>
                                                    <th>State</th>
                                                    <th>Zip Code</th>
                                                    <th>Country</th>
                                                    <th>Start date</th>
                                                    <th>Sq Ft.</th>
                                                    <th>Bedrooms</th>
                                                    <th>Occupants</th>
                                                    <th>Status</th>
                                                    <th>Remove</th>
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

                                                Showing {offset} to {(serviceLocations.length < 10) ? serviceLocations.length : "10"} of {
                                                    serviceLocations.length}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <nav
                                                className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers"
                                                style={{ color: "rgb(133, 135, 150)" }}
                                            >
                                                <ul className="pagination">
                                                    <li className="page-item disabled">
                                                        <a className="page-link" aria-label="Previous" href="#">
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
                                                        <a className="page-link" aria-label="Next" href="#">
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

    );
};

export default ServiceLocations;