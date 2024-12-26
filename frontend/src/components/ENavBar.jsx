import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthOptions } from "../authentication/AuthOptions";

const ENavBar = () => {
    const { logout } = useContext(AuthOptions);
    
    return(
        <nav
        className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark"
        style={{ background: "rgb(0,0,0)", position: "static" }}
      >
        <div className="container-fluid d-flex flex-column p-0">
          <a
            className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
            href="/"
          >
            <div className="sidebar-brand-icon rotate-n-15">
              <i
                className="far fa-lightbulb"
                style={{ transform: "rotate(14deg)", color: "#f5f5f5" }}
              />
            </div>
            <div className="sidebar-brand-text mx-3">
              <span>
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
            </div>
          </a>
          <hr className="sidebar-divider my-0" />
          <ul className="navbar-nav text-light" id="accordionSidebar-1">
          <Link to="/">
            <li className="nav-item">
              <div className="nav-link">
                <i className="fas fa-tachometer-alt" />
                <span>Dashboard</span>
              </div>
            </li>
          </Link>
          <Link to="/profile">
            <li className="nav-item">
              <div className="nav-link">
                <i className="fas fa-user" />
                <span>Profile</span>
              </div>
            </li>
          </Link>
          <Link to="/service-location">
            <li className="nav-item">
              <div className="nav-link">
                <i className="fas fa-home" />
                <span>My Service Locations</span>
              </div>
            </li>
          </Link>
          <Link to="/device">
            <li className="nav-item">
              <div className="nav-link">
                <i className="fas fa-microchip" />
                <span>My Devices</span>
              </div>
            </li>
          </Link>
          <Link to="/device-events">
          <li className="nav-item">
            <div className="nav-link">
                <i className="fas fa-table" />
                <span>My Event Log</span>
              </div>
          </li>
          </Link>
          <Link to="/login" onClick={logout}>
            <li className="nav-item">
              <div className="nav-link">
                <i className="fas fa-solid fa-door-open" />
                <span className="text-danger fw-bolder">Logout</span>
              </div>
            </li>
          </Link>
          </ul>
        </div>
      </nav>
    );
}

export default ENavBar;