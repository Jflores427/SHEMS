import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Devices from "./pages/Devices.jsx";
import EventLog from "./pages/EventLog";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ServiceLocations from "./pages/ServiceLocations";
import { AuthProvider } from './authentication/AuthOptions.jsx'


function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [customer, setCustomer] = useState({ cFirstName: "Him" });
  const [billingAddress, setBillingAddress] = useState({});
  const [serviceLocations, setServiceLocations] = useState([]);
  const [enrolledDevices, setEnrolledDevices] = useState([]);
  const [enrolledDeviceEvents, setEnrolledDeviceEvents] = useState([]);



  useEffect(() => {
    // setUser({ Hello: "gdgfd" });
    // setUser({ Hello: "gdgfd" });
    // setUser({ Hello: "gdgfd" });
    // setUser({ Hello: "gdgfd" });
    // console.log("There");
  }, []);

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={loggedIn ? <Home cFirstName="data" cLastName={"Money"} /> : <Login />} >
            </Route>
            <Route path="/device" index={true} element={<Devices cFirstName={customer.cFirstName} devices={enrolledDevices} />} />
            <Route path="/login" index={true} element={<Login />} />
            <Route path="/device-events" index={true} element={<EventLog enrolledDeviceEvents={enrolledDeviceEvents} />} />
            <Route path="/profile" index={true} element={<Profile cFirstName={customer.cFirstName} />} />
            <Route path="/register" index={true} element={<Register />} />
            <Route path="/service-location" index={true} element={<ServiceLocations serviceLocations={serviceLocations} />} />
            <Route path="*" index={true} element={<h1>Page Not Found</h1>} />
          </Routes>
        </BrowserRouter>

      </AuthProvider>
    </>
  )
}

export default App
