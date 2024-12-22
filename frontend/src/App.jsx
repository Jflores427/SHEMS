import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthOptions } from "./authentication/AuthOptions.jsx";

import Devices from "./pages/Devices.jsx";
import EventLog from "./pages/EventLog";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ServiceLocations from "./pages/ServiceLocations";
import Feed from "./pages/Feed.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthOptions);

  useEffect(() => {
    setTimeout(setLoading.bind(null, false), 500);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              !loading ? (
                isAuthenticated ? (
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Home />
                  </ProtectedRoute>
                ) : (
                  <Login />
                )
              ) : (
                <LoadingPage />
              )
            }
          >
            <Route path="/" index element={<Feed />} />
            <Route path="/profile" index element={<Profile />} />
            <Route
              path="/service-location"
              index
              element={<ServiceLocations />}
            />
            <Route path="/device" index element={<Devices />} />
            <Route path="/device-events" index element={<EventLog />} />
          </Route>
          <Route path="*" element={<h1>Page Not Found </h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
