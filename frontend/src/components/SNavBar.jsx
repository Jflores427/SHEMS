import { AuthOptions } from "../authentication/AuthOptions";
import { useContext, useState, useEffect, Suspense } from "react";
import defaultProfilePic from "../../../backend/uploads/default_profile_image.jpeg";
import LoadingIndicator from "./LoadingIndicator";
import api from "../functionsAPI/api";

const SNavBar = (props) => {

    const { user } = useContext(AuthOptions);
    const { username, cID } = user;
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState('');
    const hostName = "http://127.0.0.1:5000/";

    function getUploadImage(cID) {
      api.get("/getUploadImage/", {
          params : { cID : cID}   
      }).then(function (response) {
          const cProfileURL = response.data.cProfileURL;
          const cProfileURLPath = hostName + cProfileURL;
          if (cProfileURL.length > 0) {
            setImage(cProfileURLPath);
          }
          else {
            setImage(defaultProfilePic);
          }
      }).catch( function (error) {
          console.log(error);
      })
    }

    useEffect(() => {
      setLoading(true);
      getUploadImage(cID);
      setLoading(false);
    });

    return(
    <>
    
    <nav
      className="navbar navbar-expand bg-secondary shadow mb-4 topbar static-top navbar-light"
      style={{
        overflow: "hidden",
        background: "var(--bs-secondary)",
        position: "relative"
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
                className="dropdown-toggle nav-link d-flex flex-row gap-1"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                href="#"
              >
                <span className="d-none d-lg-inline me-2 text-gray-600 small">
                  {username}
                </span>
                {!loading && image &&
                <img
                  className="border rounded-circle img-profile"
                  // src={loading ? <LoadingIndicator minHeightVal={"100px"} size={"1rem"} /> : image ? image : defaultProfilePic}
                  src={!loading && (image ? image: defaultProfilePic)}
                  /> }

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
}

export default SNavBar;