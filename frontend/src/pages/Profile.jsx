import { useState, useContext, useEffect } from "react";
import { AuthOptions } from "../authentication/AuthOptions";
import { useNavigate } from "react-router-dom";
import { getCustomer } from "../../../backend/static/app";
import api from "../functionsAPI/api";

import UploadImage from "../components/UploadImage";
import "./Profile.css"

const Profile = (props) => {

  async function fetchBillingAddress(cID) {
    api
    .get("/getBillingAddress", { params: { cID: cID }})
    .then(function (response) {
      setBillingAddressInfo(response.data[0]);
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  async function updateBillingAddress(cIDBilling, addressData) {
    api.put(`/updateBillingAddress`, addressData, {
      params: {cID: cIDBilling}
    }
    ).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.log(error);
    })
  }

  async function fetchCustomer(cID) {
    api
    .get("/getCustomer", { params: { cID: cID } })
    .then(function (response) {
      console.log(response.data[0]);
      setCustomerInfo(response.data[0]);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

    const { user } = useContext(AuthOptions);
    const { username, cID } = user;
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
    const navigate = useNavigate();

  const handleChange = (e) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBillingAddress(cID, contactFormData);
    // fetchBillingAddress(cID);
    window.location.reload();
  }

    useEffect(() => {
      console.log(cID);
      fetchCustomer(cID);
      fetchBillingAddress(cID);
    }, [])
    // const {userName, cFirstName, cLastName } = props;

    return (
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
                  {/* <img
                    className="rounded-circle mb-3 mt-4"
                    src="assets/img/dogs/image2.jpeg"
                    width={160}
                    height={160}
                  />
                  <div className="mb-3">
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={upload}
                      style={{
                        background: "var(--bs-secondary)",
                        color: "var(--bs-btn-color)"
                      }}
                    >
                      Change Photo
                    </button>
                  </div> */}

                  <UploadImage cID={cID} />
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
                  <form onSubmit={handleSubmit}>
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


    );
}

export default Profile;