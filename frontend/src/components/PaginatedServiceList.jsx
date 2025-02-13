import React, { Suspense } from "react";
import PaginationComponent from "./PaginationComponent";
import LoadingIndicator from "./LoadingIndicator";
import MissingDataComponent from "./MissingDataComponent";
import "../pages/ServiceLocations.css";

const PaginatedServiceList = ({
  items,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  handleServiceStatusChange,
  handleDeleteServiceLocation,
  loading,
}) => {
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return loading ? (
    <LoadingIndicator minHeightVal={"654.5px"} size={"5rem"} color={"white"} />
  ) : 
      items.length > 0 ? (
        <div
          className="table-responsive text-capitalize mt-4 d-flex flex-column align-items-start justify-content-between"
          id="dataTable"
          role="grid"
          aria-describedby="dataTable_info"
          style={{ height: "630px" }}
        >
          <table
            className="table border border-1 border-secondary"
            id="dataTable"
          >
            <thead>
              <tr>
                <th className="service-header-bg-gradient text-white">
                  Street #
                </th>
                <th className="service-header-bg-gradient text-white">
                  Street
                </th>
                <th className="service-header-bg-gradient text-white">Unit</th>
                <th className="service-header-bg-gradient text-white">City</th>
                <th className="service-header-bg-gradient text-white">State</th>
                <th className="service-header-bg-gradient text-white">
                  Zip Code
                </th>
                <th className="service-header-bg-gradient text-white">
                  Country
                </th>
                <th className="service-header-bg-gradient text-white">
                  Start date
                </th>
                <th className="service-header-bg-gradient text-white">
                  Sq Ft.
                </th>
                <th className="service-header-bg-gradient text-white">
                  Bedrooms
                </th>
                <th className="service-header-bg-gradient text-white">
                  Occupants
                </th>
                <th className="service-header-bg-gradient text-white">
                  Status
                </th>
                <th className="service-header-bg-gradient text-white">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length !== 0 &&
                currentItems.map((serviceLocation) => (
                  <tr
                    key={serviceLocation.sID}
                    id={`service-id-${serviceLocation.sID}`}
                  >
                    <td className="border border-1 border-secondary">{serviceLocation.streetNum}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.street}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.unit}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.city}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.state}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.zipcode}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.country}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.startDate}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.squareFt}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.bedroomNum}</td>
                    <td className="border border-1 border-secondary">{serviceLocation.occupantNum}</td>
                    <td className="border border-1 border-secondary">
                      <input
                        type="checkbox"
                        id={`service-id-check-${serviceLocation.sID}`}
                        checked={
                          serviceLocation.serviceStatus == "active"
                            ? true
                            : false
                        }
                        onChange={handleServiceStatusChange}
                      />
                    </td>
                    <td className="border border-1 border-secondary">
                      <button
                        className="btn btn-primary delete-service-btn"
                        value={serviceLocation.sID}
                        type="button"
                        style={{
                          borderRadius: 20,
                          borderColor: "var(--bs-secondary)",
                          borderTopColor: "rgb(255,",
                          borderRightColor: "255,",
                          borderBottomColor: "255)",
                          borderLeftColor: "255,",
                        }}
                        id={`delete-sid-${serviceLocation.sID}`}
                        onClick={handleDeleteServiceLocation}
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
                <th className="service-header-bg-gradient-reverse text-white">
                  Street #
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Street
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Unit
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  City
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  State
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Zip Code
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Country
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Start date
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Sq Ft.
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Bedrooms
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Occupants
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Status
                </th>
                <th className="service-header-bg-gradient-reverse text-white">
                  Delete
                </th>
              </tr>
            </tfoot>
          </table>

          <div className="w-100 d-flex flex-row border-primary justify-content-between mt-3">
            <div className="row-md-6 mx-5">
              <p
                id="dataTable_info"
                className="dataTables_info text-uppercase text-light"
                role="status"
                aria-live="polite"
              >
                Showing{" "}
                <span className="text-warning">
                  {items.length == 0
                    ? "0"
                    : (currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to {" "}
                <span className="text-warning">
                  {items.length < itemsPerPage
                    ? items.length
                    : itemsPerPage * currentPage > items.length
                    ? items.length
                    : itemsPerPage * currentPage}{" "}
                </span>
                of <span className="text-light">{items.length}</span>
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
        <MissingDataComponent
          message={"No Service Locations Available..."}
          minHeight={"654.5px"}
          textColor={"light"}
        />
      )
};

export default PaginatedServiceList;
