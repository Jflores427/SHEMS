import { useState, useContext, useEffect } from "react";
import { AuthOptions } from "../authentication/AuthOptions";

import { getCustomer } from "../../../backend/static/app";

import ENavBar from "../components/ENavBar"
import SNavBar from "../components/SNavBar";
import "./Profile.css"

const Profile = (props) => {

    const { username, customerID } = useContext(AuthOptions);
    const [customerInfo, setCustomerInfo] = useState({});
    const [billingAddressInfo, setBillingAddressInfo] = useState({});

    const [contactFormData, setContactFormData] = useState({
      streetNum: "",
      street: "",
      unit: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
  });

  const handleChange = (e) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBillingAddress(customerID, contactFormData);
    fetchBillingAddress(customerID);
  }

  async function fetchBillingAddress(customerID) {
    axios
    .get("http://127.0.0.1:5000/api/getBillingAddress/", { params: { cID: customerID }})
    .then(function (response) {
      setBillingAddressInfo(response.data[0]);
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  async function updateBillingAddress(customerID, contactFormData) {


  }

  async function fetchCustomer(customerID) {
    axios
    .get("http://127.0.0.1:5000/api/getCustomer/", { params: { cID: customerID } })
    .then(function (response) {
      console.log(response.data[0]);
      setCustomerInfo(response.data[0]);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  

    useEffect(() => {
      console.log(customerID);
      fetchCustomer(customerID);
      fetchBillingAddress(customerID);
    }, [])
    // const {userName, cFirstName, cLastName } = props;

    return (
    <>    
<div id="page-top">
    <div id="wrapper">
      <ENavBar />
      <div className="d-flex flex-column" id="content-wrapper">
        <div id="content">
        <SNavBar cFirstName={customerInfo.cFirstName} />

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
                                {username}
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
                                {customerInfo.cFirstName}
                              </p>
                            </div>
                          </div>
                          <div className="col">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="last_name">
                                <strong>Last Name</strong>
                              </label>
                              <p>
                                {customerInfo.cLastName}
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
                        placeholder={billingAddressInfo.streetNum}
                        name="streetNum"
                        onChange={handleChange}
                        required
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
                        placeholder={billingAddressInfo.street}
                        name="street"
                        onChange={handleChange}
                        required
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
                            placeholder={billingAddressInfo.unit}
                            name="unit"
                            onChange={handleChange}
                            required
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
                            placeholder={billingAddressInfo.zipcode}
                            name="zipcode"
                            onChange={handleChange}
                            required
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
                            placeholder={billingAddressInfo.city}
                            name="city"
                            onChange={handleChange}
                            required
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
                            placeholder={billingAddressInfo.state}
                            name="state"
                            onChange={handleChange}
                            required
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
                          <input
                            className="form-control"
                            type="text"
                            id="contact-country"
                            placeholder={billingAddressInfo.country}
                            name="country"
                            onChange={handleChange}
                            required
                          />
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