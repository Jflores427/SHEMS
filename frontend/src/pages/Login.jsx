import { AuthOptions } from "../authentication/AuthOptions";
import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { login } from "../../../backend/static/app";
import "./Login.css"

const Login = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { loggedIn } = useContext(AuthOptions);
    const navigate = useNavigate();

    function fetchCustomerId(username, password) {
        axios
            .post("http://127.0.0.1:5000/api/login/", { username, password })
            .then(function (response) {
                const cID = response.data.cID;
                const username = response.data.username;
                if (typeof (cID) == "number") {
                    loggedIn(username, cID);
                    console.log("Logged in", cID);
                    navigate("/");
                }
                else {
                    console.log("Invalid username or password");
                }
                //return response.data.cID;
            })
            .catch(function (error) {
                console.log(error, "there");
                alert("Incorrect Username/Password Combination, Please Try Again!");
                //    return null;
            });
    }

    // cID is returning a fulfilled promised value???
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchCustomerId(username, password);
        // if (cID) {
        // //loggedIn(username, cID);
        // console.log("Logged in", cID);
        // //navigate("/");
        // } else {
        // console.log("Invalid username or password");
        // }
    };

    function createTables() {
        axios
          .post("http://127.0.0.1:5000/api/create_table/initial")
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      useEffect(()=> {
        // createTables();
      }, [])

    return (
        <div
            className="bg-gradient-primary"
            style={{ background: "var(--bs-secondary)" }}
        >
            <div className="container" style={{ width: "100vw", margin: 0 }}>
                <div
                    className="row justify-content-center"
                    style={{ width: "97vw", height: "100vh" }}
                >
                    <div
                        className="col-md-9 col-lg-12 col-xl-10"
                        style={{ width: "97vw", height: "100vh", borderColor: "transparent" }}
                    >
                        <div
                            className="card shadow-lg o-hidden border-0 my-5"
                            style={{ height: "80vh" }}
                        >
                            <div className="card-body p-0">
                                <div className="row">
                                    <div
                                        className="col-lg-6 d-none d-lg-flex"
                                        style={{ height: "100vh" }}
                                    >
                                        <div
                                            className="flex-grow-1 bg-login-image"
                                            style={{
                                                background:
                                                    'url("assets/img/dogs/istockphoto-1312912134-612x612.jpg") border-box center / contain no-repeat',
                                                height: "80vh",

                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-6" style={{ height: "80vh" }}>
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
                                        <div className="flex-column p-5" style={{ height: "70vh" }}>
                                            <div className="text-center">
                                                <h4
                                                    className="text-dark mb-4"
                                                    style={{ background: "var(--bs-body-bg)" }}
                                                >
                                                    Welcome Back!
                                                </h4>
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
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input custom-control-input"
                                                                type="checkbox"
                                                                id="rememberMe"
                                                            />
                                                            <label
                                                                className="form-check-label custom-control-label"
                                                                htmlFor="rememberMe"
                                                            >
                                                                Remember Me
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-primary d-block btn-user w-100"
                                                    type="submit"
                                                    onClick={handleSubmit}
                                                    style={{ background: "var(--bs-secondary)" }}
                                                >
                                                    Login
                                                </button>
                                                <hr />
                                                <hr />
                                            </form>
                                            <div className="text-center">
                                                <a className="small" href="/forgot-password">
                                                    Forgot Password?
                                                </a>
                                            </div>
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
}

export default Login;