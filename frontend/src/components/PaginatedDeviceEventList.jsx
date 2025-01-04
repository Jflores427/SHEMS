import React, { Suspense, useState } from "react";
import PaginationComponent from "./PaginationComponent";
import LoadingIndicator from "./LoadingIndicator";
import MissingDataComponent from "./MissingDataComponent";

import "../pages/Devices.css";
 
const PaginatedDeviceEventList = ({
  items,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  pageRangeStart,
  setPageRangeStart,
  pageRangeEnd,
  setPageRangeEnd,
  handleDeleteEnrolledDeviceEvent,
  loading,
}) => {
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageRangeStartChange = (pageRangeStartNumber) => {
    setPageRangeStart(pageRangeStartNumber);
  }

  const handlePageRangeEndChange = (pageRangeEndNumber) => {
    setPageRangeEnd(pageRangeEndNumber);
  }

  return loading ? (
    <LoadingIndicator minHeightVal={"672px"} size={"5rem"} color={"light"} />
  ) : 
      items.length > 0 ? (
        <div
          className="table-responsive text-capitalize mt-2 d-flex flex-column justify-content-between align-items-start"
          id="dataTable-1"
          role="grid"
          aria-describedby="dataTable_info"
          style={{ minHeight: "610px" }}
        >
          <table className="table border border-1 border-secondary" id="dataTable">
            <thead>
              <tr>
                <th className="event-header-bg-gradient text-light">Device Name</th>
                <th className="event-header-bg-gradient text-light">Event Time</th>
                <th className="event-header-bg-gradient text-light">Event Label</th>
                <th className="event-header-bg-gradient text-light">Event Value</th>
                <th className="event-header-bg-gradient text-light">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length !== 0 &&
                currentItems.map((enrolledDeviceEvent) => (
                  <tr
                    style={{ fontSize: "1rem" }}
                    key={enrolledDeviceEvent.edEventID}
                    id={`enrolled-device-event-id-${enrolledDeviceEvent.edEventID}`}
                  >
                    <td className="border border-1 border-secondary">{enrolledDeviceEvent.enDevName}</td>
                    <td className="border border-1 border-secondary">{enrolledDeviceEvent.eventTime}</td>
                    <td className="border border-1 border-secondary">{enrolledDeviceEvent.eventLabel}</td>
                    <td className="border border-1 border-secondary" >{enrolledDeviceEvent.eventValue}</td>
                    <td>
                      <button
                        className="btn btn-primary delete-device-btn"
                        type="button"
                        style={{
                          borderRadius: 20,
                          borderColor: "var(--bs-secondary)",
                          borderTopColor: "rgb(255,",
                          borderRightColor: "255,",
                          borderBottomColor: "255)",
                          borderLeftColor: "255,",
                        }}
                        id={`delete-edEventID-${enrolledDeviceEvent.edEventID}`}
                        value={enrolledDeviceEvent.edEventID}
                        onClick={handleDeleteEnrolledDeviceEvent}
                      >
                        <i
                          className="far fa-trash-alt"
                          style={{ color: "rgb(0,0,0)" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <th className="event-header-bg-gradient-reverse text-light">Device Name</th>
                <th className="event-header-bg-gradient-reverse text-light">Event Time</th>
                <th className="event-header-bg-gradient-reverse text-light">Event Label</th>
                <th className="event-header-bg-gradient-reverse text-light">Event Value</th>
                <th className="event-header-bg-gradient-reverse text-light">Delete</th>
              </tr>
            </tfoot>
          </table>

          <div className="w-100 d-flex flex-row border-primary justify-content-between px-6">
            <div className="row-md-6 align-self-center mx-5">
              <p
                id="dataTable_info"
                className="dataTables_info text-uppercase text-light"
                role="status"
                aria-live="polite"
              >
                Showing{" "}
                <span className="text-warning">
                {items.length == 0 ? "0" : (currentPage - 1) * itemsPerPage + 1}{" "}
                </span>
                to{" "}
                <span className="text-warning">
                {items.length < itemsPerPage
                  ? items.length
                  : itemsPerPage * currentPage > items.length
                  ? items.length
                  : itemsPerPage * currentPage}{" "}
                </span>
                of {items.length}
              </p>
            </div>

            <div className="row-md-6 mx-5">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageRangeStart={pageRangeStart}
                onPageRangeStartChange ={handlePageRangeStartChange}
                pageRangeEnd={pageRangeEnd}
                onPageRangeEndChange={handlePageRangeEndChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <MissingDataComponent
          message={"No Device Events Available..."}
          minHeight={"610px"}
          textColor={"light"}
        />
      )
};


export default PaginatedDeviceEventList;
