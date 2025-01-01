import { AuthOptions } from "../authentication/AuthOptions";
import { useContext, useState, useEffect } from "react";
import { getUploadImage } from "../functionsAPI/apiUploadImage";
import defaultProfilePic from "../../../backend/uploads/default_profile_image.jpeg";
import LoadingIndicator from "./LoadingIndicator";

const SNavBar = () => {
  const { user } = useContext(AuthOptions);
  const { username, cID } = user;
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");

  const handleGetUploadImage = async (cID) => {
    try {
      const result = await getUploadImage(cID);
      setImage(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleGetUploadImage(cID);
    setTimeout(setLoading.bind(null, false), 300);
  });

  return (
    <>
      <nav
        className="navbar navbar-expand bg-secondary shadow mb-4 topbar static-top navbar-light"
        style={{
          overflow: "hidden",
          background: "var(--bs-secondary)",
          position: "relative",
        }}
      >
        <div className="container-fluid">
          <button
            className="btn btn-link d-md-none rounded-circle me-3"
            id="sidebarToggleTop-1"
            type="button"
          >
            <i className="fas fa-bars" />
          </button>
          <ul className="navbar-nav flex-nowrap ms-auto">
            <li className="nav-item dropdown no-arrow">
              <div className="nav-item dropdown">
                <a
                  className="dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  href="#"
                />
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">
                    First Item
                  </a>
                  <a className="dropdown-item" href="#">
                    Second Item
                  </a>
                  <a className="dropdown-item" href="#">
                    Third Item
                  </a>
                </div>
              </div>
              <div className="nav-item dropdown no-arrow">
                <a
                  className="dropdown-toggle nav-link d-flex flex-row gap-1 rounded-circle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  href="#"
                >
                  <span className="d-none d-lg-inline me-1 text-gray-600 small">
                    {username}
                  </span>
                  {!loading ? (
                    <img
                      className="border rounded-circle img-profile bg-light"
                      src={image ? image : defaultProfilePic}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div className="ms-0 me-1">
                      <LoadingIndicator
                        minHeightVal={"40px"}
                        size={"25px"}
                        color={"light"}
                      />
                    </div>
                  )}
                </a>
                <div className="dropdown-menu shadow dropdown-menu-end animated--grow-in">
                  <a
                    className="dropdown-item"
                    href="Profile.html"
                    style={{ color: "rgb(0,0,0)" }}
                  >
                    <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;Profile
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="fas fa-list fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;Event Log
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="Login.html">
                    <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;Logout
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default SNavBar;
