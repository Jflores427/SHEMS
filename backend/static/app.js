//<script src="https://cdn.jsdelivr.net/npm/api/dist/api.min.js"></script>
//<script type="module" src="../static/app.js"></script>

// get customer info by cID

import api from "../../frontend/src/functionsAPI/api";

async function getCustomer(cID) {
  api
    .get("/getCustomer", { params: { cID: cID } })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getCustomer
for (let i = 1; i < 7; i++) {
  getCustomer(i); // works
}

// addNewAddress
async function addNewAddress(newAddress) {
  api
    .post("/handleAddress", newAddress)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
//test addNewAddress
const newAddress = {
  streetNum: "1234",
  street: " Main St.",
  unit: "Apt1",
  city: "Anytown",
  state: "CA",
  zipcode: "12345",
  country: "USA",
};

// fetchAddress
async function fetchAddress(cIDBilling) {
  api
    .get("/getBillingAddress", {
      params: { cID: cIDBilling },
    })
    .then(function (response) {
      console.log(response.data[0]);
    })
    .catch(function (error) {
      console.log(error);
    });
}
//test addNewAddress
fetchAddress(1); // works

async function updateBillingAddress(cIDBilling, addressData) {
  api.put("/updateBillingAddress", {
    params: {cID: cIDBilling}, 
    addressData: addressData,
  }).then(function (response) {
    console.log(response.data)
  }).catch(function (error) {
    console.log(error);
  })
}

const updateAddress = {
  streetNum: "1235",
  street: " Main St.",
  unit: "Apt1",
  city: "Anytown",
  state: "CA",
  zipcode: "12345",
  country: "USA",
};

// updateBillingAddress(1, updateAddress)

// addNewCustomer
async function addNewCustomer(newCustomer) {
  api
    .post("/addCustomer", newCustomer)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test addNewCustomer
const newCustomer = {
  cFirstName: "Johnny",
  cLastName: "Doooo7",
  streetNum: "131",
  street: " Main St.",
  unit: "Apt377",
  city: "Anytown",
  state: "CA",
  zipcode: "12345",
  country: "USA",
};
//addNewCustomer(newCustomer); // works

// addNewService
async function addNewService(newService) {
  api
    .post("/addServiceLocation", newService)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test addNewService
const newService = {
  cID: 1,
  startDate: "2021-08-01",
  squareFt: 1000,
  bedroomNum: 2,
  occupantNum: 2,
  serviceStatus: "active",
  streetNum: "1234",
  street: " Main St.",
  unit: "Apt1",
  city: "Anytown",
  state: "CA",
  zipcode: "12345",
  country: "USA",
};
// addNewService(newService); // works

async function deleteServiceLocation(serviceLocationID) {
  api.delete("/deleteServiceLocation", {
    params: { cID: cID },
  }).then(function (response) {
    console.log(response)
  }).catch(function (error) {
    console.log(error);
  })
}
// addNewUser
async function addNewUser(newUser) {
  api
    .post("/register", newUser)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test addNewUser
const newUser = {
  username: "testuser",
  password: "testpassword",
  cFirstName: "Johnny",
  cLastName: "Doooo22",
  streetNum: "1384",
  street: " Main St.",
  unit: "Apt7",
  city: "Anytown",
  state: "CA",
  zipcode: "12345",
  country: "USA",
};
//addNewUser(newUser); // works

// checkUsername
async function checkUsername(username) {
  api
    .get("/checkUsername", {
      params: { username: username },
    })
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
}
// test checkUsername
checkUsername("Jennifer3505"); // works
checkUsername("Jennifer3515"); // works

// login
export async function login(loginInfo) {
  api
    .post("/login", loginInfo)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
}
// test login
const loginInfo = {
  username: "Linda9654",
  password: "123456",
};
login(loginInfo); // works

// get total number of service locations by cID
async function getTotalServiceLocations(cID) {
  api
    .get("/getTotalServiceLocationByCID", {
      params: { cID: cID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getTotalServiceLocations
getTotalServiceLocations(38); // works

// get all service locations by cID
async function getServiceLocations(cID) {
  api
    .get("/getServiceLocation", {
      params: { cID: cID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getServiceLocations
getServiceLocations(38); // works

//get all active service locations by cID
async function getActiveServiceLocations(cID) {
  api
    .get("/getActiveServiceLocation", {
      params: { cID: cID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getActiveServiceLocations
getActiveServiceLocations(38); // works

// set service status by sID
async function setServiceStatus(sID, serviceStatus) {
  api
    .post("/setServiceLocationStatus", {
      sID: sID,
      serviceStatus: serviceStatus,
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test setServiceStatus
setServiceStatus(1, "active"); // works

// get supported devices
async function getSupportedDevices() {
  api
    .get("/getSupportedDevice")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
getSupportedDevices(); // works

// get supported devices by type
async function getSupportedDevicesByType(type) {
  api
    .get("/getSupportedDeviceByType", {
      params: { type: type },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getSupportedDevicesByType
getSupportedDevicesByType("microwave"); // works

//get total number of enrolled device by cID
async function getTotalEnrolledDevices(cID) {
  api
    .get("/getTotalEnrolledDeviceByCID", {
      params: { cID: cID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getTotalEnrolledDevices
// getTotalEnrolledDevices(2); // works

// get devID by model and type
async function getDevID(model, type) {
  api
    .get("/getDevIDByModelAndType", {
      params: { model: model, type: type },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
//test getDevID
getDevID("M390", "microwave"); // works

// get all enrolled devices by sID
async function getEnrolledDevices(sID) {
  api
    .get("/getEnrolledDevice", {
      params: { sID: sID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getEnrolledDevices
getEnrolledDevices(1); // works

// get all enrolled devices by sID, enrolledStatus
async function getEnrolledDevicesByStatus(sID, enrolledStatus) {
  api
    .get("/getEnrolledDevicesByStatus", {
      params: { sID: sID, enrolledStatus: enrolledStatus },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getEnabledEnrolledDevices
getEnrolledDevicesByStatus(1, "enabled"); // works

// add new enrolled device
async function addNewEnrolledDevice(newEnrolledDevice) {
  api
    .post("/enrollDevice", newEnrolledDevice)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test addNewEnrolledDevice
const newEnrolledDevice = {
  enDevName: "myEnrolledDevice1111",
  sID: 1,
  devID: 1,
};
const newEnrolledDevice2 = {
  enDevName: "qqq",
  sID: 101,
  devID: 9,
};
// addNewEnrolledDevice(newEnrolledDevice); // works
// addNewEnrolledDevice(newEnrolledDevice2); // works

// set enrolled device status by enDevID
async function setEnrolledDeviceStatus(enDevID, enrolledStatus) {
  api
    .post("/setEnrolledDeviceStatus", {
      enDevID: enDevID,
      enrolledStatus: enrolledStatus,
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test setEnrolledDeviceStatus
// setEnrolledDeviceStatus(1501, "disabled"); // works


function deleteEnrolledDevice(enDevID) {
  api.delete("/deleteEnrolledDevice",{ 
      data: { "enDevID": enDevID }}).then(function (response) {
    console.log(response.data)
    getEnrolledDevices()
  }).catch(function (error) {
    console.log(error);
  })
}


// get all enrolled device events by sID
async function getEnrolledDeviceEvents(sID) {
  api
    .get("/getEnrolledDeviceEvent", {
      params: { sID: sID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getEnrolledDeviceEvents
// getEnrolledDeviceEvents(1); // works

// get all enrolled device event by sID, enrolledStatus
async function getEnrolledDeviceEventsByStatus(sID, enrolledStatus) {
  api
    .get("/getEnrolledDeviceEventsByStatus", {
      params: { sID: sID, enrolledStatus: enrolledStatus },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getEnrolledDeviceEventsByStatus
getEnrolledDeviceEventsByStatus(1, "enabled"); // works

// get monthly usage of all year and all sID by cID
async function getMonthlyUsageByCID(cID) {
  api
    .get("/getMonthlyUsageByCID", {
      params: { cID: cID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getMonthlyUsageByCID
getMonthlyUsageByCID(2); // works

// get the total monthly cost of all service locations by cID
async function getTotalMonthlyCostByCID(cID) {
  api
    .get("/getMonthlyCostByCID", {
      params: { cID: cID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getTotalMonthlyCostByCID
// getTotalMonthlyCostByCID(2); // works

// dailyUsageByMonthYear
async function getDailyUsageByMonthYear(dailyUsageByMonthYear) {
  api
    .get("/getDailyUsageBySID", {
      params: dailyUsageByMonthYear,
    })
    .then(function (response) {
      let data = response.data;
      console.log(data ? data : "no data found");
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test dailyUsageByMonthYear
const dailyUsageByMonthYear = {
  sID: 1,
  Month: 8,
  Year: 2022,
};
// getDailyUsageByMonthYear(dailyUsageByMonthYear); // works

// monlyUsageByYear
async function getMonthlyUsageByYear(monthlyUsageByYear) {
  api
    .get("/getMonthlyUsageBySID", {
      params: monthlyUsageByYear,
    })
    .then(function (response) {
      let data = response.data;
      console.log(data ? data : "no data found");
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test monlyUsageByYear
const monthlyUsageByYear = {
  sID: 1,
  Year: 2022,
};
// getMonthlyUsageByYear(monthlyUsageByYear); // works

// yearlyUsageBySID
async function getYearlyUsageBySID(yearlyUsageBySID) {
  api
    .get("/getYearlyUsageBySID", {
      params: yearlyUsageBySID,
    })
    .then(function (response) {
      let data = response.data;
      console.log(data ? data : "no data found");
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test yearlyUsageBySID
const yearlyUsageBySID = {
  sID: 1,
};
// getYearlyUsageBySID(yearlyUsageBySID); // works

//getEnergyPrice
async function getEnergyPrice() {
  api
    .get("/getEnergyPrice")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getEnergyPrice
getEnergyPrice(); // works

//-------------------------------------Generate Data Zone-----------------------------------------------------------

// create tables
async function createTables() {
  api
    .post("/create_table/initial")
    .then(function (response) {
      let data = response.data;
      console.log(data);
      alert(`Test Username: ${data.username} \n Test Password: ${data.password}`)
    })
    .catch(function (error) {
      console.log(error);
    });
}
// createTables(); // works

// add EnrolledDeviceEvent

async function addEnrolledDeviceEvent() {
  api
    .post("/addEDE")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// addEnrolledDeviceEvent(); // works

export {createTables, getCustomer, updateBillingAddress};