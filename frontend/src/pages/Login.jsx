import { AuthOptions } from "../authentication/AuthOptions";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTables } from "../functionsAPI/apiLogin";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthOptions);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleCreateTables = async (e) => {
    e.preventDefault();
    try {
      const result = await createTables();
      alert(
        `Test Username: ${result.username} \n Test Password: ${result.password}`
      );
    } catch (error) {
      setError(true);
      setMessage("Failed Data Generation")
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await login(username, password);
    }
    catch(error) {
        setError(true);
        setMessage("Incorrect Username/Password Combination!");
    }

    navigate("/");
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
              style={{ height: "90vh" }}
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
                          transform: "translate(0px)",
                          borderRadius: 20,
                          width: "25%",
                        }}
                      >
                        <span className=""style={{ transform: "rotate(0deg)" }}>
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
                    <div className="flex-column p-5 " style={{ height: "70vh" }}>
                      <div className="text-center">
                        <h3
                          className="text-dark mb-4"
                          style={{ background: "var(--bs-body-bg)" }}
                        >
                          Welcome Back!
                        </h3>
                        <h6 className="text-danger mb-4">{error && message}</h6>
                      </div>
                      
                      <form
                        className="d-flex flex-column user my-5"
                        style={{ height: "60%", gap: 5 }}
                      >
                        <div className="mb-3">
                          <input
                            className="form-control form-control-user"
                            type="text"
                            id="loginUserName"
                            placeholder="Enter Username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            className="form-control form-control-user"
                            type="password"
                            id="loginPassword"
                            placeholder="Enter Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
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
                          className="btn btn-primary d-block btn-user w-100 bg-purple text-white"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Login
                        </button>
                        <hr />
                        <div className="text-center d-flex align-items-center justify-content-center">
                          <button
                            className="btn btn-primary d-block btn-user w-50 bg-purple text-white"
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
