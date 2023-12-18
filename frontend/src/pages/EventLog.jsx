import ENavBar from "../components/ENavBar";
import SNavBar from "../components/SNavBar";
import "./EventLog.css"

const EventLog = (props) => {

    const { enrolledDeviceEvents } = props;

    return (
        <div id="page-top">
            <div id="wrapper">
                <ENavBar />
                <div className="d-flex flex-column" id="content-wrapper">
                    <div id="content">
                        <SNavBar />
                        <div className="container-fluid">
                            <h3 className="text-dark mb-4">My Device Events</h3>
                            <div className="card shadow">
                                <div className="card-header py-3 bg-secondary">
                                    <p className="text-primary m-0 fw-bold text-light">Device Info</p>
                                </div>
                                <div className="card-body text-uppercase">
                                    <div className="row">
                                        <div className="col-md-6 col-xl-12">
                                            <div
                                                className="text-md-end dataTables_filter"
                                                id="dataTable_filter"
                                            >
                                                <label className="form-label" htmlFor="serviceId" />
                                                <select
                                                    id="service-id-filter"
                                                    style={{ margin: "0px 10px" }}
                                                >
                                                    <optgroup label="Service Locations">
                                                        <option value={12} selected="">
                                                            This is item 1
                                                        </option>
                                                        <option value={13}>This is item 2</option>
                                                        <option value={14}>This is item 3</option>
                                                    </optgroup>
                                                </select>
                                                <label className="form-label" htmlFor="deviceStatus" />
                                                <select
                                                    id="device-name-filter"
                                                    style={{ margin: "0px 10px" }}
                                                >
                                                    <optgroup label="Status">
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
                                                    <th>Event Label</th>
                                                    <th>Event Time</th>
                                                    <th>Event Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>The Televisor</td>
                                                    <td>MA302</td>
                                                    <td>Television</td>
                                                    <td>
                                                        <p>Paragraph</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>The Televisor</td>
                                                    <td>MA302</td>
                                                    <td>Television</td>
                                                    <td>
                                                        <p>Paragraph</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>The Televisor</td>
                                                    <td>MA302</td>
                                                    <td>Television</td>
                                                    <td>
                                                        <p>Paragraph</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>The Televisor</td>
                                                    <td>MA302</td>
                                                    <td>Television</td>
                                                    <td>
                                                        <p>Paragraph</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>The Televisor</td>
                                                    <td>MA302</td>
                                                    <td>Television</td>
                                                    <td>
                                                        <p>Paragraph</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td style={{ fontWeight: "bold" }}>Device Name</td>
                                                    <td style={{ fontWeight: "bold" }}>Event Label</td>
                                                    <td style={{ fontWeight: "bold" }}>Event Time</td>
                                                    <td style={{ fontWeight: "bold" }}>Event Value</td>
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
                                                Showing 1 to {(enrolledDeviceEvents.length < 10) ?
                                                enrolledDeviceEvents.length : "10"} of {
                                                enrolledDeviceEvents.length}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
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

export default EventLog;