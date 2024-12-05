import { useState, useEffect, useContext } from 'react'
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
import { AuthOptions, AuthProvider } from './authentication/AuthOptions.jsx'
import fetchCustomerId from './functionsAPI/fetchCustomerId.js'



function App() {

  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);
  // const { auth } = useContext(AuthOptions);
  // const [user, setUser] = useState({});
  // const { auth } = useContext(AuthOptions);

  useEffect(() => {
    // console.log(auth);
    setLogin(false);
  }, []);

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={login ? <Home /> : <Login setLogin={setLogin} />} >
            </Route>
              <Route path="/profile" index={true} element={login ? <Profile /> : <Login setLogin={setLogin} />} />
              <Route path="/service-location" index={true} element={login ? <ServiceLocations /> : <Login setLogin={setLogin} />} />
              <Route path="/device" element={login ? <Devices /> : <Login setLogin={setLogin} />} />
              <Route path="/device-events" index={true} element={login ? <EventLog /> : <Login setLogin={setLogin} />} />
              <Route path="/login" index={true} element={<Login setLogin={setLogin} />} />
              <Route path="/register" index={true} element={<Register />} />
            <Route path="*" index={true} element={<h1>Page Not Found  </h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
