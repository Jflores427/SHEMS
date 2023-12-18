const ENavBar = () => {

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
            <li className="nav-item">
              <a className="nav-link active" href="/">
                <i className="fas fa-tachometer-alt" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/profile">
                <i className="fas fa-user" />
                <span>Profile</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/service-location">
                <i className="fas fa-table" />
                <span>My Service Locations</span>
              </a>
            </li>
            <li className="nav-item" />
            <li className="nav-item">
              <a className="nav-link" href="/device">
                <i className="fas fa-table" />
                <span>My Devices</span>
              </a>
              <a className="nav-link" href="/device-events">
                <i className="fas fa-table" />
                <span>My Event Log</span>
              </a>
              <a className="nav-link" href="/login">
                <i className="fas fa-user-circle" />
                <span>Login</span>
              </a>
              <a className="nav-link" href="/register">
                <i className="fas fa-user-circle" />
                <span>Register</span>
              </a>
              <a className="nav-link" href="/Login">
                <i className="fas fa-user-circle" />
                <span>Logout</span>
              </a>
            </li>
            <li className="nav-item" />
            <li className="nav-item" />
          </ul>
          <div className="text-center d-none d-md-inline">
            <button
              className="btn rounded-circle border-0"
              id="sidebarToggle-1"
              type="button"
            />
          </div>
        </div>
      </nav>
    );
}

export default ENavBar;