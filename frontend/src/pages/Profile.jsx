import { useContext } from "react";
import { AuthOptions } from "../authentication/AuthOptions";

import { getCustomer } from "../../../backend/static/app";

import ENavBar from "../components/ENavBar"
import SNavBar from "../components/SNavBar";
import "./Profile.css"

const Profile = (props) => {

    const { username, customerID } = useContext(AuthOptions);

    useEffect(() => {
      getCustomer(customerID);
    })
    // const {userName, cFirstName, cLastName } = props;

    return (
    <>    
<div id="page-top">
    <div id="wrapper">
      <ENavBar />
      <div className="d-flex flex-column" id="content-wrapper">
        <div id="content">
        <SNavBar cFirstName={cFirstName} />

        <div className="container-fluid">
          <h3
            className="text-primary mb-4"
            style={{ color: "var(--bs-primary)" }}
          >
            My Profile
          </h3>
          <div className="row mb-3">
            <div className="col-lg-4">
              <div className="card mb-3" style={{ height: "100%" }}>
                <div
                  className="card-body text-center shadow"
                  style={{ background: "transparent" }}
                >
                  <img
                    className="rounded-circle mb-3 mt-4"
                    src="assets/img/dogs/image2.jpeg"
                    width={160}
                    height={160}
                  />
                  <div className="mb-3">
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      style={{
                        background: "var(--bs-secondary)",
                        color: "var(--bs-btn-color)"
                      }}
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row" style={{ height: "100%", margin: 0 }}>
                <div className="col">
                  <div
                    className="card shadow mb-3"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <div className="card-header text-bg-secondary py-3">
                      <p
                        className="text-light m-0 fw-bold"
                        style={{ color: "var(--bs-text-color)" }}
                      >
                        User Settings
                      </p>
                    </div>
                    <div className="card-body">
                      <form className="d-flex flex-column justify-content-xl-start">
                        <div className="row" style={{ margin: "10px -12px" }}>
                          <div className="col">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="username">
                                <strong>Username</strong>
                              </label>
                              <p style={{ color: "rgb(133, 135, 150)" }}>
                                {userName}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ margin: "10px -12px" }}>
                          <div className="col">
                            <div className="mb-3">
                              <label
                                className="form-label"
                                htmlFor="first_name"
                              >
                                <strong>First Name</strong>
                              </label>
                              <p>
                                {cFirstName}
                              </p>
                            </div>
                          </div>
                          <div className="col">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="last_name">
                                <strong>Last Name</strong>
                              </label>
                              <p>
                                {cLastName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="card shadow">
                <div
                  className="card-header py-3"
                  style={{ background: "var(--bs-secondary)" }}
                >
                  <p className="text-light m-0 fw-bold">Contact Settings</p>
                </div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        htmlFor="contact-street-num"
                      >
                        <strong>Street #</strong>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="contact-street-num"
                        placeholder={211}
                        name="contact-street-num"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        htmlFor="contact-street"
                        style={{ fontWeight: "bold" }}
                      >
                        Street
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="contact-street"
                        placeholder="Sunset Blvd"
                        name="contact-street"
                      />
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="contact-unit">
                            <strong>Unit</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="contact-unit"
                            placeholder="unit"
                            name="contact-unit"
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="contact-zipcode"
                          >
                            <strong>Zip Code</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="contact-zipcode"
                            placeholder="zipcode"
                            name="contact-zipcode"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="contact-city">
                            <strong>City</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="contact-city"
                            placeholder="city"
                            name="contact-city"
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="contact-state">
                            <strong>State/Province</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="contact-state"
                            placeholder="state/province"
                            name="contact-state"
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="contact-country"
                          >
                            <strong>Country</strong>
                          </label>
                          <select
                            className="form-select"
                            id="contact-country"
                            name="contact-country"
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
                    <div className="d-flex justify-content-end mb-3">
                      <button
                        className="btn btn-primary btn-sm d-xl-flex"
                        type="submit"
                        style={{
                          background: "var(--bs-secondary)",
                          color: "var(--bs-btn-color)"
                        }}
                      >
                        Save&nbsp;Settings
                      </button>
                    </div>
                  </form>
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
}

export default Profile;