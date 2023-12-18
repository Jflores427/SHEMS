import ENavBar from "../components/ENavBar";
import SNavBar from "../components/SNavBar";
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import "./Devices.css"

const Devices = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { cFirstName, devices } = props;

  return (
    <>
      <div id="page-top">
        <div id="wrapper">
          <ENavBar />
          <div className="d-flex flex-column" id="content-wrapper">
            <div id="content">
              <SNavBar cFirstName={cFirstName} />
              <div className="container-fluid">
                <div className="row">
                  <div
                    className="col-xl-10 d-flex justify-content-between"
                    style={{ width: "100%" }}
                  >
                    <h3 className="text-dark mb-4" style={{ width: "70%" }}>
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
                <Modal show={show} size="xl" onHide={handleClose}>
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
                        onClick={handleClose}
                      />
                    </div>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="modal-body">
                      <form className="d-flex flex-column gap-4">
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
                          />
                        </div>
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
                            htmlFor="form-device-type"
                          >
                            Type
                          </label>
                          <select
                            className="form-select w-100"
                            id="form-device-type"
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
                            htmlFor="form-device-model"
                          >
                            Model
                          </label>
                          <select
                            className="form-select w-100"
                            id="form-device-model"
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
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="form-enable-disable"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form-enable-disable"
                          >
                            Disable/Enable
                          </label>
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
                          Showing 1 to {(devices.length < 10)? devices.length : "10" } of {
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