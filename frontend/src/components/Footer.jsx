import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-white sticky-footer">
        <div className="container my-auto">
          <div className="text-center my-auto copyright">
            <span>Copyright © Energize 2023</span>
          </div>
        </div>
      </footer>
      <a className="border rounded d-inline scroll-to-top" href="#page-top">
        <i className="fas fa-angle-up" />
      </a>
    </>
  );
};

export default Footer;
