import { AuthOptions } from "../authentication/AuthOptions";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createTables } from "../functionsAPI/apiLogin";
import { InputGroup, Form } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthOptions);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [dots, setDots] = useState("");
  const navigate = useNavigate();

  const handleCreateTables = async (e) => {
    e.preventDefault();

    const timer = setInterval(() => {
      setDots((prevDots) => {
        setMessage("Generating Data" + prevDots)
        if (prevDots === "...") {
          return ".";
        }
        return prevDots + ".";
      });
    }, 333)

    try {
      setSuccess(false);
      setError(false);
      setNotification(true);
      const result = await createTables();
      setMessage("Generation Complete!")
      alert(
        `Test Username: ${result.username}\nTest Password: ${result.password}`
      );
      setSuccess(true);
      setNotification(false);
    } catch (error) {
      setNotification(false);
      setSuccess(false);
      setError(true);
      setMessage("Generation Failed!")
      console.log(error.message);
    }
    clearInterval(timer);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await login(username, password);
        console.log('Logged in successfully:', userData);
    }
    catch(error) {
        setError(true);
        setMessage("Incorrect Username/Password Combination!");
        console.error('Login failed:', error.message);
    }

    navigate("/");
  };

  const handleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  return (
    <div
      style={{ background: "var(--bs-secondary)" }}
    >
      <div className="container-fluid">
        <div
          className="row justify-content-center"
          style={{ width: "97dvw", height: "100dvh" }}
        >
          <div
            className="col-md-9 col-lg-12 col-xl-12"
          >
            <div
              className="card shadow-lg o-hidden border-0 mt-5"
              style={{ height: "90vh", fontFamily: "Mogra, Ribeye, sans-serif" }}
            >
              <div className="card-body p-0">
                <div className="row">
                  <div
                    className="col-lg-6 d-none d-lg-flex"
                    style={{ height: "100dvh" }}
                  >
                    <div
                      className="flex-grow-1 bg-login-image"
                      style={{
                        background:
                          'url("../src/assets/istockphoto-1312912134-612x612.jpg") border-box center / cover no-repeat',
                      }}
                    />
                  </div>
                  <div className="col-lg-6 mt-5">
                    <div
                      className="d-xl-flex justify-content-xl-center mt-5"
                    >
                      <a
                        className="navbar-brand d-xl-flex justify-content-xl-center align-items-xl-center sidebar-brand m-0 p-2"
                        href="/"
                        style={{
                          background: "var(--bs-secondary)",
                          borderRadius: 20,
                          width: "25%",
                        }}
                      >
                        <span className="sidebar-brand-text hover-light" style={{ transform: "rotate(0deg)" }}>
                          Energ
                          <i
                            className="hover-lightbulb"
                            style={{
                              transform: "rotate(180deg)",
                              color: "rgb(255,245,0)",
                            }}
                          />
                          ze
                        </span>
                      </a>
                    </div>
                    <div className="flex-column p-5 " style={{ height: "70vh" }}>
                      <div className="text-center">
                        <h3
                          className="text-secondary mb-4 anim-typewriter line-1"
                          style={{ background: "var(--bs-body-bg)", fontFamily: "Mogra, Ribeye, sans-serif" }}
                        >
                          Welcome Back!
                        </h3>
                        <h6 className={`text-${notification ? "warning-muted" : error ? "danger" : "success" } mb-4`}>{(notification || error || success) && message}</h6>
                      </div>
                      
                      <form
                        className="d-flex flex-column user my-5"
                        style={{ height: "60%", gap: 5 }}
                      >
                        <div className="mb-3">
                          <InputGroup className="mt-2">
                          <Form.Control
                            className="form-control form-control-user rounded mt-1"
                            type="text"
                            id="loginUserName"
                            placeholder="Enter Username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{}}
                            />
                          </InputGroup>
                          <InputGroup className="mt-2">
                          <Form.Control
                            className="form-control form-control-user rounded"
                            type={showPassword ? "text" : "password"}
                            id="loginPassword"
                            placeholder="Enter Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <InputGroup.Text style={{ cursor: "pointer" }}>
                            <i
                              onClick={handleShowPassword}
                              className={
                                showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                              }
                            ></i>
                          </InputGroup.Text>
                        </InputGroup>
                        </div>
                        <div className="mb-3">
                          <div className="custom-control custom-checkbox small">
                            <div className="form-check d-flex align-items-center gap-1 justify-content-center">
                              <input
                                className="form-check-input custom-control-input"
                                type="checkbox"
                                id="rememberMe"
                                checked
                                disabled
                              />
                              <label
                                className="form-check-label custom-control-label mt-1"
                                htmlFor="rememberMe"
                                style={{ fontSize: "0.75rem" }}
                              >
                                Remember Me
                              </label>
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn d-block btn-user w-100 login-btn"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Login
                        </button>
                        <hr />
                        <div className="text-center d-flex align-items-center justify-content-center">
                          <button
                            className="btn d-block btn-user w-50 login-btn"
                            id="sidebarToggle-1"
                            type="button"
                            onClick={handleCreateTables}
                          >
                            Generate data
                          </button>
                        </div>
                        <hr />
                      </form>
                      <div className="text-center">
                        <a className="small" href="/register">
                            Create an Account!
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
