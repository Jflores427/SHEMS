import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUsernameExists, register } from "../functionsAPI/apiRegister";
import { Button, InputGroup, Form } from "react-bootstrap";

import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    cFirstName: "",
    cLastName: "",
    streetNum: "",
    street: "",
    unit: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const [usernameExists, setUsernameExists] = useState(false);
  const [usernameError, setUsernameError] = useState("Username Taken");
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [passwordError, setPasswordError] = useState("Password Mismatch");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Register Your Information Below");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckUsernameExists = async (username) => {
    if (!username) {
      setUsernameExists(false);
      setMessage("Register Your Information Below");
      return;
    }

    const userExists = await checkUsernameExists(username);
    if (userExists) {
      setUsernameExists(true);
    } else {
      setUsernameExists(false);
      setMessage("Username Is Available")
    }
  };

  const checkPasswordsMatch = () => {
    if (formData.password === "" && formData.confirmPassword === "") {
      setPasswordNotMatch(false);
      setMessage("Register Your Information Below");
    } else if (formData.password !== formData.confirmPassword) {
      setPasswordNotMatch(true);
    } else {
      setPasswordNotMatch(false);
      setMessage("Password Match");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setPasswordNotMatch(true);
      setLoading(false);
      return;
    }

    setPasswordNotMatch(false);
    await handleCheckUsernameExists(formData.username);

    if (usernameExists) {
      setLoading(false);
    } else {
      try {
        const response = await register(formData);
        setLoading(false);
        setMessage("Registration successful");
        alert("Redirecting to Login...");
        setTimeout(navigate("/login"), 100);
      } catch (error) {
        setLoading(false);
        setMessage("Registration failed");
        console.log(error.message);
        // setError(error.response.data || "Registration failed");
      }
    }
  };

  const handleDelay = (fn, ms = 100) => {
    let timer = 0;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(fn.bind(this, ...args), ms || 0);
    };
  };

  const handleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  return (
    <div
      className="bg-gradient-primary"
      style={{
        width: "100dvw",
        background: "var(--bs-secondary)",
      }}
    >
      <div
        className="container-fluid"
        style={{ width: "80dvw", height: "100vh", padding: 0 }}
      >
        <div
          className="card shadow-lg o-hidden border-0 justify-content-center align-items-center"
          style={{ minHeight: "100dvh" }}
        >
          <div className="card-body p-0" style={{ height: "100%" }}>
            <div className="row">
              <div
                className="col-lg-5 offset-xxl-0 d-none d-lg-flex"
                style={{ height: "100%" }}
              >
                <div
                  className="flex-grow-1 bg-register-image m-5"
                  style={{
                    background:
                      'url("assets/img/dogs/smart-home-vector-3993909.jpg") center / contain no-repeat',
                    height: 784,
                  }}
                />
              </div>
              <div className="col-lg-6 col-xl-6">
                <div
                  className="p-5"
                  style={{ minHeight: "759.5px", width: "100%" }}
                >
                  <div
                    className="d-xl-flex justify-content-xl-center my-4"
                    style={{ transform: "translate(0px)", width: "auto" }}
                  >
                    <a
                      className="navbar-brand d-xl-flex justify-content-xl-center align-items-xl-center sidebar-brand m-0 px-2"
                      href="/"
                      style={{
                        background: "var(--bs-secondary)",
                        transform: "translate(0px)",
                        borderRadius: 20,
                        minWidth: "fit-content",
                      }}
                    >
                      <span style={{ transform: "rotate(0deg)" }}>
                        Energ
                        <i
                          className="fas fa-lightbulb"
                          style={{
                            transform: "rotate(180deg)",
                            color: "rgb(255,245,0)",
                          }}
                        />
                        ze
                      </span>
                    </a>
                  </div>
                  <div className="text-center">
                    <h4 className="text-secondary mb-4">Create An Account</h4>
                    <p
                      className={
                        usernameExists || passwordNotMatch
                          ? "text-danger"
                          : message === "Register Your Information Below"
                          ? "text-secondary"
                          : "text-success"
                      }
                    >
                      {usernameExists
                        ? usernameError
                        : passwordNotMatch
                        ? passwordError
                        : message}
                    </p>
                  </div>
                  <form
                    className="user"
                    style={{ height: "80%", width: "100%" }}
                    onSubmit={handleSubmit}
                  >
                    <div className="row gy-2">
                      <div className="col-xl-6">
                        <input
                          className="form-control form-control-user rounded"
                          type="text"
                          id="form-first-name"
                          placeholder="First Name"
                          name="cFirstName"
                          value={formData.cFirstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-xl-6">
                        <input
                          className="form-control form-control-user rounded"
                          type="text"
                          id="form-last-name"
                          placeholder="Last Name"
                          name="cLastName"
                          value={formData.cLastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row mt-2" style={{ margin: 0 }}>
                      <div
                        className="col-sm-6 col-xl-5 col-lg-6"
                        style={{ width: "100%", padding: 0 }}
                      >
                        <input
                          className="form-control form-control-user rounded"
                          type="text"
                          id="form-user-name"
                          style={
                            {
                              // padding: 16,
                              // marginLeft: 0,
                              // paddingRight: 8,
                              // paddingTop: 16,
                            }
                          }
                          placeholder="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          onKeyUp={handleDelay(
                            handleCheckUsernameExists.bind(
                              null,
                              formData.username
                            )
                          )}
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-1 w-100 gy-0 gx-0">
                      <div className="col-sm-5 col-xl-5">
                        <InputGroup className="mt-2">
                          <Form.Control
                            className="form-control form-control-user rounded-start"
                            type={showPassword ? "text" : "password"}
                            id="form-password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={checkPasswordsMatch}
                            onKeyUp={handleDelay(checkPasswordsMatch)}
                            required
                          />
                          <InputGroup.Text style={{cursor:"pointer"}}>
                            <i
                              onClick={handleShowPassword}
                              className={
                                showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                              }
                            ></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </div>
                      <div className="col-sm-5 col-xl-5 offset-sm-2">
                        <InputGroup className="mt-2">
                          <input
                            className="form-control form-control-user rounded-start"
                            type={showPassword ? "text" : "password"}
                            id="form-password-repeat"
                            placeholder="Repeat Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={checkPasswordsMatch}
                            onKeyUp={handleDelay(checkPasswordsMatch)}
                            required
                          />
                          <InputGroup.Text style={{cursor:"pointer"}}>
                            <i
                              onClick={handleShowPassword}
                              className={
                                showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                              }
                            ></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </div>
                    </div>
                    <div className="row my-2">
                      <div className="col col-sm-3 col-xl-3">
                        <input
                          className="form-control form-control-user rounded"
                          type="text"
                          id="form-street-num"
                          placeholder="Street #"
                          name="streetNum"
                          value={formData.streetNum}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col col-sm-6 col-xl-6">
                        <input
                          className="form-control form-control-user rounded"
                          type="text"
                          id="form-street"
                          placeholder="Street"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col col-sm-3 col-xl-3">
                        <input
                          className="form-control form-control-user rounded"
                          type="text"
                          id="form-unit"
                          placeholder="unit"
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="row my-2 gx-2">
                        <div className="col col-sm-4 col-xl-5 gx-4">
                          <input
                            className="form-control form-control-user rounded"
                            type="text"
                            id="form-city"
                            placeholder="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col col-sm-4 col-xl-5">
                          <input
                            className="form-control form-control-user rounded"
                            type="text"
                            id="form-state"
                            placeholder="state/province"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col col-sm-4 col-xl-2">
                          <input
                            className="form-control form-control-user rounded"
                            type="text"
                            id="form-zipcode"
                            placeholder="zipcode"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row my-0">
                      <div className="col">
                        <input
                          className="form-control form-control-user rounded"
                          id="form-country"
                          name="country"
                          placeholder="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <button
                      className="btn d-block btn-user w-100 ms-2 my-2 register-btn"
                      type="submit"
                      style={{ transform: "translate(-11px)"}}
                    >
                      Register Account
                    </button>
                    <hr className="my-6" style={{ 
                      // margin: "32px 0px" 
                      }} />
                      
                  <div className="text-center">
                    <a className="small" href="/login">
                      Already have an account? Login!
                    </a>
                  </div>
                  </form>
                  {/* <div className="text-center">
                    <a className="small" href="/forget-password">
                      Forgot Password?
                    </a>
                  </div> */}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
