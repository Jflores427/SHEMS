import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthOptions } from "../authentication/AuthOptions";
import "./ENavBar.css";

const ENavBar = () => {
    const { logout } = useContext(AuthOptions);
    
    return(
        <nav
        className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark"
        style={{ background: "var(--bs-primary)", position: "static", minHeight: "100%" }}
      >
        <div className="container-fluid d-flex flex-column p-0" style={{position: "sticky", top: 0}}>
          <a
            className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0 hover-light"
            href="/"
          >
            <div className="sidebar-brand-icon d-md-none rotate-n-15">
              <i
                className="fas fa-lightbulb hover-lightbulb"
                style={{ transform: "rotate(14deg)"}}
              />
            </div>
            <div className="sidebar-brand-text me-3 fs-3" style={{fontFamily : "Mogra, Ribeye, sans-serif"}}>
              <span>
                Energ
                <i
                  className="fas fa-lightbulb hover-lightbulb"
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
          <ul className="navbar-nav text-light" id="accordionSidebar-1" style={{ fontFamily: "Mogra, Ribeye, sans-serif"}}>
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