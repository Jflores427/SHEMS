import { AuthOptions } from "../authentication/AuthOptions";
import { useContext, useState, useEffect } from "react";
import { getUploadImage } from "../functionsAPI/apiUploadImage";
import defaultProfilePic from "../../../backend/uploads/default_profile_image.jpeg";
import LoadingIndicator from "./LoadingIndicator";
import "./SNavBar.css";

const SNavBar = () => {
  const { user, logout } = useContext(AuthOptions);
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
        class="navbar navbar-expand navbar-light bg-secondary topbar static-top mb-3"
        style={{ maxHeight: 60 }}
      >
        <div class="container-fluid">
          <ul class="navbar-nav w-100 justify-content-end">
            <li class="nav-item dropdown no-arrow">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span
                  className="d-inline me-2 text-gray small"
                  style={{ fontFamily: "Mogra, Ribeye, sans-serif" }}
                >
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
              <ul
                class="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a
                    className="dropdown-item"
                    href="/profile"
                  >
                    <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;Profile
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="/login" onClick={logout}>
                    <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default SNavBar;
