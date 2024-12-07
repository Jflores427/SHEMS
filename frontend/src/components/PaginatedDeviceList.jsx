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
  handleDeviceStatusChange,
  handleDeleteEnrolledDevice,
  loading,
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return loading ? (
    <LoadingIndicator minHeightVal={"630px"} size={"5rem"} />
  ) : (
    <Suspense fallback={<LoadingIndicator minHeightVal={"630px"} size={"5rem"} />}>
      {items.length > 0 ? (
        <div
          className="table-responsive h-75 text-capitalize table mt-2 d-flex flex-column gap-4 justify-content-center align-items-center"
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
              {currentItems.length !== 0 &&
                currentItems.map((enrolledDevice) => (
                  <tr
                    key={enrolledDevice.enDevID}
                    id={`enrolled-device-id-${enrolledDevice.enDevID}`}
                  >
                    <td>{enrolledDevice.enDevName}</td>
                    <td>{enrolledDevice.type}</td>
                    <td>{enrolledDevice.model}</td>
                    <td>
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
                    <button
                      className="btn btn-primary delete-device-btn"
                      type="button"
                      style={{
                        borderRadius: 20,
                        // background: "transparent",
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
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Device Name</th>
                <th>Type</th>
                <th>Model</th>
                <th>Status</th>
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
              />
            </div>
          </div>
        </div>
      ) : (
        <MissingDataComponent message={"No Devices Available"} />
      )}
    </Suspense>
  );
};

export default PaginatedDeviceList;
