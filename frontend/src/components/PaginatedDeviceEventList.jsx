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
    <LoadingIndicator minHeightVal={"635px"} size={"5rem"} />
  ) : (
    <Suspense
      fallback={<LoadingIndicator minHeightVal={"635px"} size={"5rem"} />}
    >
      {items.length > 0 ? (
        <div
          className="table-responsive table text-capitalize mt-2 d-flex flex-column justify-content-between align-items-start"
          id="dataTable-1"
          role="grid"
          aria-describedby="dataTable_info"
          style={{ minHeight: "610px" }}
        >
          <table className="table row-12 my-0" id="dataTable">
            <thead>
              <tr>
                <th>Device Name</th>
                <th>Event Time</th>
                <th>Event Label</th>
                <th>Event Value</th>
                <th>Delete</th>
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
                    <td>{enrolledDeviceEvent.enDevName}</td>
                    <td>{enrolledDeviceEvent.eventTime}</td>
                    <td>{enrolledDeviceEvent.eventLabel}</td>
                    <td>{enrolledDeviceEvent.eventValue}</td>
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
                <th>Device Name</th>
                <th>Event Time</th>
                <th>Event Label</th>
                <th>Event Value</th>
                <th>Delete</th>
              </tr>
            </tfoot>
          </table>

          <div className="w-100 d-flex flex-row border-primary justify-content-between px-6">
            <div className="row-md-6 align-self-center mx-5">
              <p
                id="dataTable_info"
                className="dataTables_info text-uppercase text-muted"
                role="status"
                aria-live="polite"
              >
                Showing{" "}
                {items.length == 0 ? "0" : (currentPage - 1) * itemsPerPage + 1}{" "}
                to{" "}
                {items.length < itemsPerPage
                  ? items.length
                  : itemsPerPage * currentPage > items.length
                  ? items.length
                  : itemsPerPage * currentPage}{" "}
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
        />
      )}
    </Suspense>
  );
};


export default PaginatedDeviceEventList;