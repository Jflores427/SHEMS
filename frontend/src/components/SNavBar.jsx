import { AuthOptions } from "../authentication/AuthOptions";
import { useContext, useState, useEffect, Suspense } from "react";
import defaultProfilePic from "../../../backend/uploads/default_profile_image.jpeg";
import LoadingIndicator from "./LoadingIndicator";

const SNavBar = (props) => {

    const { username, customerID } = useContext(AuthOptions);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState('');
    const profilePicHost = "http://127.0.0.1:5000/";

    function getUploadImage(cID) {
      setLoading(true);
      axios.get("http://127.0.0.1:5000/api/getUploadImage/", {
          params : { cID : cID}
      }).then(function (response) {
          const cProfileURL = response.data.cProfileURL;
          const cProfileURLPath = profilePicHost + cProfileURL;
          console.log(cProfileURLPath);
          if (cProfileURL) {
              setImage(cProfileURLPath);
              setLoading(false);
          }
      }).catch( function (error) {
          console.log(error);
      })
    }

    useEffect(() => {
      setLoading(true);
      getUploadImage(customerID);
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
              {!loading && image ?
              <a
                className="dropdown-toggle nav-link"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                href="#"
              >
                <span className="d-none d-lg-inline me-2 text-gray-600 small">
                  {username}
                </span>
                <img
                  className="border rounded-circle img-profile"
                  // src={loading ? <LoadingIndicator minHeightVal={"100px"} size={"1rem"} /> : image ? image : defaultProfilePic}
                  src={loading ? <LoadingIndicator minHeightVal={"100px"} size={"1rem"} /> : image}
                  />

              </a> : (<div></div>)}
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