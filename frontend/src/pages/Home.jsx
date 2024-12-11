import React from "react";
import { Outlet } from "react-router-dom";
import ENavBar from "../components/ENavBar";
import SNavBar from "../components/SNavBar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div id="page-top">
      <div id="wrapper">
        <ENavBar />
        <div className="d-flex flex-column" id="content-wrapper">
          <div id="content">
            <SNavBar />
            <Outlet />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
