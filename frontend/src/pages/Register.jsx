import React, { useState } from "react";
import api from "../functionsAPI/api";
import { useNavigate } from "react-router-dom";

const Register = (props) => {
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
    const [passwordNotMatch, setPasswordNotMatch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(
        "Please enter your information for registration"
    );
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const checkUsernameExists = async (username) => {
        api
            .get("/checkUsername", {
                params: { username: username },
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data.isExist) {
                    setUsernameExists(true);
                    setMessage("Username already exists");
                }
                else {
                    setUsernameExists(false);
                    setMessage("Username is available");
                }
            })
            .catch(function (error) {
                console.log(error);
                return null;
            });
    };
    const checkPasswordsMatch = () => {
        if (formData.password === "" || formData.confirmPassword === "") {
            setPasswordNotMatch(false);
        }
        else if (formData.password !== formData.confirmPassword) {
            setPasswordNotMatch(true);
            setMessage("Passwords do not match");
        }
        else {
            setPasswordNotMatch(false);
            setMessage("Passwords match");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setPasswordNotMatch(true);
            setLoading(false);
            return;
        }
        setPasswordNotMatch(false);
        await checkUsernameExists(formData.username);
        if (usernameExists) {
            setLoading(false);
            return;
        }
        else {
            api
                .post("/register", formData)
                .then(function (response) {
                    console.log(response.data);
                    setLoading(false);
                    setMessage("Registration successful");
                    alert("Redirecting to Login...")
                    setTimeout(navigate("/login"), 100)
                })
                .catch(function (error) {
                    console.log(error.response.data);
                    setLoading(false);
                    setMessage("Registration failed");
                    setError(error.response.data || "Registration failed");
                });
        }
    };
    return (
        <div
            className="bg-gradient-primary"
            style={{
                width: "100vw",
                // marginLeft: "2.5vw",
                // marginRight: "2.5vw",
                background: "var(--bs-secondary)"
            }}
        >
            <div
                className="container"
                style={{ width: "100%", height: "100vh", padding: 0 }}
            >
                <div
                    className="card shadow-lg o-hidden border-0"
                    style={{ height: "100vh" }}
                >
                    <div className="card-body p-0" style={{ height: "80%" }}>
                        <div className="row">
                            <div
                                className="col-lg-5 offset-xxl-0 d-none d-lg-flex"
                                style={{ height: "80%" }}
                            >
                                <div
                                    className="flex-grow-1 bg-register-image"
                                    style={{
                                        background:
                                            'url("assets/img/dogs/smart-home-vector-3993909.jpg") center / contain no-repeat',
                                        height: 784
                                    }}
                                />
                            </div>
                            <div className="col-lg-7 col-xl-6">
                                <div className="p-5" style={{ height: "759.5px", width: "100%" }}>
                                    <div
                                        className="d-xl-flex justify-content-xl-center my-4"
                                        style={{ transform: "translate(0px)", width: "auto" }}
                                    >
                                        <a
                                            className="navbar-brand d-xl-flex justify-content-xl-center align-items-xl-center sidebar-brand m-0"
                                            href="/"
                                            style={{
                                                background: "var(--bs-secondary)",
                                                transform: "translate(0px)",
                                                borderRadius: 20,
                                                width: "25%"
                                            }}
                                        >
                                            {/* <div
                                                className="sidebar-brand-icon rotate-n-15"
                                                style={{ width: "initial" }}
                                            >
                                                <i
                                                    className="far fa-lightbulb"
                                                    style={{ transform: "rotate(14deg)", color: "#f5f5f5" }}
                                                />
                                            </div> */}
                                            <span style={{ transform: "rotate(0deg)" }}>
                                                Energ
                                                <i
                                                    className="fas fa-lightbulb"
                                                    style={{
                                                        transform: "rotate(180deg)",
                                                        color: "rgb(255,245,0)"
                                                    }}
                                                />
                                                ze
                                            </span>
                                        </a>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-dark mb-4">Create An Account</h4>
                                        <p>{message}</p>
                                    </div>
                                    <form className="user" style={{ height: "80%", width: "100%" }} onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-xl-6">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="form-first-name"
                                                    placeholder="First Name"
                                                    name="cFirstName"
                                                    value={formData.cFirstName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col">
                                                <input
                                                    className="form-control form-control-user"
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
                                        <div className="row my-2" style={{ margin: 0 }}>
                                            <div
                                                className="col-sm-6 col-xl-5 col-lg-6"
                                                style={{ width: "100%", padding: 0 }}
                                            >
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="form-user-name"
                                                    style={{
                                                        padding: 16,
                                                        marginLeft: 0,
                                                        paddingRight: 8,
                                                        paddingTop: 16
                                                    }}
                                                    placeholder="UserName"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    onBlur={(e) => checkUsernameExists(formData.username)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row my-2" style={{ margin: 0, width: 486 }}>
                                            <div
                                                className="col-sm-6 col-xl-5 mb-sm-0"
                                                style={{ padding: 0, margin: "0 0px 0px 0px" }}
                                            >
                                                <input
                                                    className="form-control form-control-user"
                                                    type="password"
                                                    id="form-password"
                                                    placeholder="Password"
                                                    name="password"
                                                    style={{ width: "100%", margin: 0, marginBottom: 10 }}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    onBlur={checkPasswordsMatch}
                                                    required
                                                />
                                            </div>
                                            <div
                                                className="col-sm-6 col-xl-5 ms-5"
                                                style={{ padding: 0, margin: 0 }}
                                            >
                                                <input
                                                    className="form-control form-control-user"
                                                    type="password"
                                                    id="form-password-repeat"
                                                    placeholder="Repeat Password"
                                                    name="confirmPassword"
                                                    style={{ width: "100%" }}
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    onBlur={checkPasswordsMatch}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <div className="col-xl-6">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="form-street-num"
                                                    placeholder="Street #"
                                                    name="streetNum"
                                                    value={formData.streetNum}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="form-street"
                                                    placeholder="Street"
                                                    name="street"
                                                    value={formData.street}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <div className="col">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="form-unit"
                                                    placeholder="unit"
                                                    name="unit"
                                                    value={formData.unit}
                                                    onChange={handleChange}

                                                />
                                            </div>
                                            <div className="col">
                                                <input
                                                    className="form-control form-control-user"
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
                                        <div className="row my-2">
                                            <div className="col">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="form-city"
                                                    placeholder="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="form-state"
                                                    placeholder="state/province"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col">
                                                <input
                                                    className="form-control form-control-user"
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
                                            className="btn btn-primary d-block btn-user w-100"
                                            type="submit"
                                            style={{ transform: "translate(-11px)" }}
                                        >
                                            Register Account
                                        </button>
                                        <hr style={{ margin: "32px 0px" }} />
                                        <hr style={{ margin: "32px 0px" }} />
                                    </form>
                                    <div className="text-center">
                                        <a className="small" href="/forget-password">
                                            Forgot Password?
                                        </a>
                                    </div>
                                    <div className="text-center">
                                        <a className="small" href="/login">
                                            Already have an account? Login!
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}

export default Register;