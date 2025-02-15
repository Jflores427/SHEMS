import React from "react";

const LoadingPage = () => {
  return (
    <div
      className="container-xl-fluid w-100 d-flex flex-column bg-primary justify-content-center align-items-center mb-5"
      style={{ minHeight: "100dvh"}}
    >
      <div
        className="sidebar-brand-text rounded-pill p-3 mx-3 h1"
        style={{
          position: "relative",
          top: "185px",
          fontFamily: "Mogra, Ribeye, sans-serif"
        }}
      >
        <span className="hover-light">
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

export default LoadingPage;
