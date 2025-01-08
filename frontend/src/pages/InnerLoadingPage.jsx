import React from "react";

const InnerLoadingPage = () => {
  return (
    <div
      className="container-xl-fluid w-100 d-flex flex-column bg-light justify-content-center align-items-center mb-5"
      style={{ minHeight: "100dvh", marginTop: -20 }}
    >
      <div
        className="sidebar-brand-text rounded-pill p-3 mx-3 h1 text-primary"
        style={{
          position: "relative",
          top: "185px",
          fontFamily: "Mogra, Ribeye, sans-serif"
        }}
      >
        {/* <span className="text-primary">
          Energ
          <i
            className="fa fa-lightbulb"
            style={{
              transform: "rotate(180deg)",
              color: "rgb(255,245,0)",
            }}
          />
          ze
        </span> */}
      </div>
      <div
        className="container d-flex flex-row justify-content-center align-items-center"
        style={{ minHeight: "100%" }}
      >
        <div
          className="spinner-border text-secondary"
          role="status"
          style={{ width: "18rem", height: "18rem" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default InnerLoadingPage;
