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
    <LoadingIndicator minHeightVal={"630px"} size={"5rem"} />
  ) : (
    <Suspense
      fallback={<LoadingIndicator minHeightVal={"630px"} size={"5rem"} />}
    >
      {items.length > 0 ? (
        <div
          className="table-responsive text-capitalize table mt-2 d-flex flex-column align-items-center justify-content-between"
          id="dataTable"
          role="grid"
          aria-describedby="dataTable_info"
          style={{ height: "630px" }}
        >
          <table className="table my-0" id="dataTable">
            <thead>
              <tr>
                <th>Street #</th>
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
              {currentItems.length !== 0 &&
                currentItems.map((serviceLocation) => (
                  <tr
                    key={serviceLocation.sID}
                    id={`service-id-${serviceLocation.sID}`}
                  >
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
                    <td>
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
                    <td>
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
                <th>Street #</th>
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

          <div className="w-100 d-flex flex-row border-primary justify-content-between mt-3">
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
        <MissingDataComponent
          message={"No Service Locations Available"}
          minHeight={"630px"}
        />
      )}
    </Suspense>
  );
};

export default PaginatedServiceList;
