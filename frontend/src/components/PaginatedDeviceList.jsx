import React, { Suspense, useState } from "react";
import PaginationComponent from "./PaginationComponent";
import "../pages/Devices.css";
import LoadingIndicator from "./LoadingIndicator";
import MissingDataComponent from "./MissingDataComponent";

const PaginatedDeviceList = ({
  items,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  pageRangeStart,
  setPageRangeStart,
  pageRangeEnd,
  setPageRangeEnd,
  handleDeviceStatusChange,
  handleDeleteEnrolledDevice,
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
    <LoadingIndicator minHeightVal={"666.5px"} size={"5rem"} color={"light"} />
  ) : 
      items.length > 0 ? (
        <div
          className="table-responsive text-capitalize mt-2 d-flex flex-column justify-content-between align-items-start"
          id="dataTable-1"
          role="grid"
          aria-describedby="dataTable_info"
          style={{minHeight: "620px"}}
        >
          <table className="table border border-1 border-secondary" id="dataTable">
            <thead>
              <tr>
                <th className="device-header-bg-gradient text-light">Device Name</th>
                <th className="device-header-bg-gradient text-light">Type</th>
                <th className="device-header-bg-gradient text-light">Model</th>
                <th className="device-header-bg-gradient text-light">Status</th>
                <th className="device-header-bg-gradient text-light">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length !== 0 &&
                currentItems.map((enrolledDevice) => (
                  <tr
                    style={{ fontSize: "1rem" }}
                    key={enrolledDevice.enDevID}
                    id={`enrolled-device-id-${enrolledDevice.enDevID}`}
                  >
                    <td className="border border-1 border-secondary">{enrolledDevice.enDevName}</td>
                    <td className="border border-1 border-secondary">{enrolledDevice.type}</td>
                    <td className="border border-1 border-secondary">{enrolledDevice.model}</td>
                    <td className="border border-1 border-secondary">
                      <input
                        type="checkbox"
                        id={`enrolled-device-id-check-${enrolledDevice.enDevID}`}
                        checked={
                          enrolledDevice.enrolledStatus == "enabled"
                            ? true
                            : false
                        }
                        onChange={handleDeviceStatusChange}
                      />
                    </td>
                    <td className="border border-1 border-secondary">
                      <button
                        className="btn btn-primary delete-device-btn"
                        style={{
                          borderRadius: 20,
                          borderColor: "var(--bs-secondary)",
                          borderTopColor: "rgb(255,",
                          borderRightColor: "255,",
                          borderBottomColor: "255)",
                          borderLeftColor: "255,",
                        }}
                        id={`delete-enDevID-${enrolledDevice.enDevID}`}
                        value={enrolledDevice.enDevID}
                        onClick={handleDeleteEnrolledDevice}
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
                <th className="device-header-bg-gradient-reverse text-light">Device Name</th>
                <th className="device-header-bg-gradient-reverse text-light">Type</th>
                <th className="device-header-bg-gradient-reverse text-light">Model</th>
                <th className="device-header-bg-gradient-reverse text-light">Status</th>
                <th className="device-header-bg-gradient-reverse text-light">Delete</th>
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
                <span className="text-light">
                of {items.length}
                </span>
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
          message={"No Devices Available..."}
          minHeight={"628px"}
          textColor={"light"}
        />
      )
};

export default PaginatedDeviceList;
