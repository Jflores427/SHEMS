import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Devices from "./pages/Devices.jsx";
import EventLog from "./pages/EventLog";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ServiceLocations from "./pages/ServiceLocations";
import Feed from "./pages/Feed.jsx";
import { AuthOptions, AuthProvider } from "./authentication/AuthOptions.jsx";
import fetchCustomerId from "./functionsAPI/fetchCustomerId.js";

import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoadingIndicator from "./components/LoadingIndicator.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  // // const [login, setLogin] = useState(false);
  // // const { auth } = useContext(AuthOptions);
  // // const [user, setUser] = useState({});
  const { isAuthenticated, validateToken } = useContext(AuthOptions);

  useEffect(() => {
    // console.log(auth);
    setLoading(true);
    validateToken();
    setTimeout(setLoading.bind(null, false), 500);
    // setLogin(false);
  }, []);

  return (
    <>
      {/* <AuthProvider> */}
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={!loading ? isAuthenticated ? 
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Home />
                </ProtectedRoute> 
                : <Login /> : <LoadingPage />
              }
              // element={<LoadingPage />}
            >
              <Route path="/" index={true} element={<Feed />} />
              <Route path="/profile" index={true} element={<Profile />} />
              <Route
                path="/service-location"
                index={true}
                element={<ServiceLocations />}
              />
              <Route path="/device" index={true} element={<Devices />} />
              <Route
                path="/device-events"
                index={true}
                element={<EventLog />}
              />
            </Route>
            <Route path="*" element={<h1>Page Not Found </h1>} />
          </Routes>
        </BrowserRouter>
      {/* </AuthProvider> */}
    </>
  );
}

export default App;
