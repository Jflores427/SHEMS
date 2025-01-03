import { useState, useContext, useEffect } from "react";
import { AuthOptions } from "../authentication/AuthOptions";
import {
  getBillingAddress,
  updateBillingAddress,
  getCustomer,
} from "../functionsAPI/apiProfile";

import UploadImage from "../components/UploadImage";

import "./Profile.css";

const Profile = () => {
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

  const handleGetBillingAddress = async (cID) => {
    try {
      const result = await getBillingAddress(cID);
      setBillingAddressInfo(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateBillingAddress = async (cID, addressData) => {
    try {
      const result = await updateBillingAddress(cID, addressData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetCustomer = async (cID) => {
    try {
      const result = await getCustomer(cID);
      setCustomerInfo(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateBillingAddress(cID, contactFormData);
    window.location.reload();
  };

  useEffect(() => {
    handleGetCustomer(cID);
    handleGetBillingAddress(cID);
  }, []);

  return (
    <div className="container-fluid">
      <h3 className="text-secondary mb-4" style={{fontFamily: "Ribeye, Mogra, sans-serif"}}>My Profile</h3>
      <div className="row mb-3">
        <div className="col-lg-4">
          <div className="card mb-1" style={{fontFamily: "Mogra, Ribeye, sans-serif"}}>
            <div className="card-body text-center shadow-lg display-bg-gradient">
              <UploadImage cID={cID} />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="row" style={{ height: "99%", margin: 0 }}>
            <div className="col">
              <div
                className="card shadow-lg mb-sm-3 my-3 my-lg-0"
                style={{ height: "100%", width: "100%", fontFamily: "Mogra, Ribeye, sans-serif"}}
              >
                <div className="card-header text-bg-secondary py-3">
                  <p
                    className="text-light m-0 fw-bold"
                    style={{ color: "var(--bs-text-color)" }}
                  >
                    User Settings
                  </p>
                </div>
                <div className="card-body display-bg-gradient">
                  <form className="d-flex flex-column justify-content-xl-start">
                    <div className="row" style={{ margin: "10px -12px" }}>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-dark"
                            htmlFor="username"
                          >
                            <strong>Username</strong>
                          </label>
                          <p className="text-secondary">{username}</p>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ margin: "10px -12px" }}>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-dark"
                            htmlFor="first_name"
                          >
                            <strong>First Name</strong>
                          </label>
                          <p className="text-secondary">
                            {customerInfo.cFirstName}
                          </p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-dark"
                            htmlFor="last_name"
                          >
                            <strong>Last Name</strong>
                          </label>
                          <p className="text-secondary">
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
          <div className="card shadow-lg my-3" style={{fontFamily: "Mogra, Ribeye, sans-serif"}}>
            <div
              className="card-header py-3"
              style={{ background: "var(--bs-secondary)" }}
            >
              <p className="text-light m-0 fw-bold">Contact Settings</p>
            </div>
            <div className="card-body display-bg-gradient">
              <form onSubmit={handleSubmit}>
                <div className="row my-3 me-sm-5 me-lg-0 ms-md-0">
                  <div className="col col-sm-3 col-md-3 col-lg-2 col-xl-2 offset-sm-1 offset-md-1 offset-lg-2 offset-xl-2">
                    <label
                      className="form-label text-dark"
                      htmlFor="contact-street-num"
                    >
                      <strong className="no-wrap">Street&nbsp;#</strong>
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
                  <div className="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-4">
                      <label
                        className="form-label text-dark"
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
                  <div className="col col-sm-2 col-md-3 col-lg-2 col-xl-2">
                      <label
                        className="form-label text-dark"
                        htmlFor="contact-unit"
                      >
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

                <div className="row my-3 gap-md-1 ms-md-1 ms-lg-5 ms-xl-0 me-lg-0 me-xl-5 d-lg-flex justify-content-lg-center">
                  <div className="col-6 col-md-3 col-lg-3 col-xl-2 offset-sm-3 offset-md-1 offset-lg-0">
                      <label
                        className="form-label text-dark"
                        htmlFor="contact-city"
                      >
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
                  <div className="col-6 col-md-3 col-lg-3 col-xl-2 offset-sm-3 offset-md-0">
                      <label
                        className="form-label text-dark"
                        htmlFor="contact-state"
                      >
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
                  <div className="col col-sm-6 col-md-3 col-lg-3 col-xl-2 offset-sm-3 offset-md-0 mt-2 mt-sm-0">
                      <label
                        className="form-label text-dark"
                        htmlFor="contact-zipcode"
                      >
                        <strong>Zip&nbsp;Code</strong>
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
                <div className="row my-3 align-items-center justify-content-center">
                  <div className="col-10 col-sm-8 col-md-7 offset-sm-0 offset-lg-0 ms-lg-5 ms-xl-0">
                    <div className="mb-3">
                      <label
                        className="form-label text-dark"
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

                  <div className="col col-sm-5 col-md-6 ms-xl-4">
                    <div className="d-flex justify-content-center me-0 me-lg-5 mt-3">
                      <button
                        className="btn btn-primary btn-sm d-xl-flex py-2 px-5 scale-btn"
                        type="submit"
                        style={{
                          background: "var(--bs-secondary)",
                        }}
                      >
                        Save&nbsp;Settings
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
