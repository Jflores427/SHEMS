import { useState } from "react";


import ENavBar from "../components/ENavBar"
import SNavBar from "../components/SNavBar"
import Modal from 'react-bootstrap/Modal';
import "./ServiceLocations.css"

const ServiceLocations = (props) => {

    const {serviceLocations, } = props;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                                    <h3 className="text-dark mb-4" style={{ width: "70%" }}>
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


                            <Modal show={show} size="xl" onHide={handleClose} sty>
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
                                            onClick={handleClose}
                                        />
                                    </div>
                                </Modal.Header>
                                <Modal.Body >
                                    <div className="modal-body">
                                        <form className="d-flex flex-column gap-4">
                                            <div className="row">
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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
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
                                                        <select
                                                            className="form-select w-100"
                                                            id="form-state"
                                                            style={{ borderRadius: "0 0 10px 10px" }}
                                                        >
                                                            <optgroup label="This is a group">
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
                                            <div className="row">
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
                                                            type="text"
                                                            id="form-start-date"
                                                            style={{ borderRadius: "0 0 10px 10px" }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
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
                                                            defaultValue={0}
                                                            style={{ borderRadius: "0 0 10px 10px" }}
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
                                                            htmlFor="form-bedrooms"
                                                        >
                                                            # of Bedrooms
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            id="form-bedrooms"
                                                            min={0}
                                                            step={1}
                                                            defaultValue={0}
                                                            style={{ borderRadius: "0 0 10px 10px" }}
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
                                                            htmlFor="form-occupants"
                                                        >
                                                            # of Occupants
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            id="form-occupants"
                                                            min={0}
                                                            step={1}
                                                            defaultValue={0}
                                                            style={{ borderRadius: "0 0 10px 10px" }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            style={{ background: "var(--bs-primary)" }}
                                            onClick={handleClose}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            style={{ background: "var(--bs-secondary)" }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </Modal.Footer>

                            </Modal>


                            <div
                                className="modal fade"
                                role="dialog"
                                tabIndex={-1}
                                id="service-modal"
                            >
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div
                                            className="modal-header"
                                            style={{ background: "var(--bs-secondary)" }}
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
                                            />
                                        </div>
                                        <div className="modal-body">

                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-primary"
                                                type="button"
                                                style={{
                                                    background: "var(--bs-secondary)",
                                                    borderRadius: 20
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                                <tr>
                                                    <td>4332</td>
                                                    <td>Lincoln Road</td>
                                                    <td>1</td>
                                                    <td>Brooklyn</td>
                                                    <td>NY</td>
                                                    <td>
                                                        United States of America
                                                        <br />
                                                        <br />
                                                    </td>
                                                    <td>January 23&nbsp;</td>
                                                    <td>50.3</td>
                                                    <td>3</td>
                                                    <td>10</td>
                                                    <td>
                                                        <input type="checkbox" defaultChecked="" />
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
                                                <tr>
                                                    <td>4332</td>
                                                    <td>Lincoln Road</td>
                                                    <td>1</td>
                                                    <td>Brooklyn</td>
                                                    <td>NY</td>
                                                    <td>
                                                        United States of America
                                                        <br />
                                                        <br />
                                                    </td>
                                                    <td>January 23&nbsp;</td>
                                                    <td>50.3</td>
                                                    <td>3</td>
                                                    <td>10</td>
                                                    <td>
                                                        <input type="checkbox" defaultChecked="" />
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
                                                <tr>
                                                    <td>4332</td>
                                                    <td>Lincoln Road</td>
                                                    <td>1</td>
                                                    <td>Brooklyn</td>
                                                    <td>NY</td>
                                                    <td>
                                                        United States of America
                                                        <br />
                                                        <br />
                                                    </td>
                                                    <td>January 23&nbsp;</td>
                                                    <td>50.3</td>
                                                    <td>3</td>
                                                    <td>10</td>
                                                    <td>
                                                        <input type="checkbox" defaultChecked="" />
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
                                                    <td style={{ fontWeight: "bold" }}>Street#</td>
                                                    <td style={{ fontWeight: "bold" }}>Street</td>
                                                    <td style={{ fontWeight: "bold" }}>Unit</td>
                                                    <td style={{ fontWeight: "bold" }}>City</td>
                                                    <td style={{ fontWeight: "bold" }}>State</td>
                                                    <td style={{ fontWeight: "bold" }}>Country</td>
                                                    <td style={{ fontWeight: "bold" }}>Start date</td>
                                                    <td style={{ fontWeight: "bold" }}>Sq Ft.</td>
                                                    <td style={{ fontWeight: "bold" }}>Bedrooms</td>
                                                    <td style={{ fontWeight: "bold" }}>Occupants</td>
                                                    <td style={{ fontWeight: "bold" }}>status</td>
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

                                                Showing 1 to {(serviceLocations.length < 10) ? serviceLocations.length : "10"} of {
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