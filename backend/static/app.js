//<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
//<script type="module" src="../static/app.js"></script>

// get customer info by cID
function getCustomer(cID) {
  axios
    .get("http://127.0.0.1:5000/api/getCustomer/", { params: { cID: cID } })
    .then(function (response) {
      console.log(response.data[0]);
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
function addNewAddress(newAddress) {
  axios
    .post("http://127.0.0.1:5000/api/handleAddress", newAddress)
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
// addNewAddress(newAddress); //works

// addNewCustomer
function addNewCustomer(newCustomer) {
  axios
    .post("http://127.0.0.1:5000/api/addCustomer", newCustomer)
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
// addNewCustomer(newCustomer); // works

// addNewService
function addNewService(newService) {
  axios
    .post("http://127.0.0.1:5000/api/addServiceLocation", newService)
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

// addNewUser
function addNewUser(newUser) {
  axios
    .post("http://127.0.0.1:5000/api/register/", newUser)
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
// addNewUser(newUser); // works

// login
function login(loginInfo) {
  axios
    .post("http://127.0.0.1:5000/api/login/", loginInfo)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test login
const loginInfo = {
  username: "Jennifer1112",
  password: "123456",
};
// login(loginInfo); // works

// get all service locations by cID
function getServiceLocations(cID) {
  axios
    .get("http://127.0.0.1:5000/api/getServiceLocation/", {
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
getServiceLocations(24); // works

//get all active service locations by cID
function getActiveServiceLocations(cID) {
  axios
    .get("http://127.0.0.1:5000/api/getActiveServiceLocation/", {
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
getActiveServiceLocations(24); // works

// get all enrolled devices by sID
function getEnrolledDevices(sID) {
  axios
    .get("http://127.0.0.1:5000/api/getEnrolledDevice/", {
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

// get all enabled enrolled devices by sID
function getEnabledEnrolledDevices(sID) {
  axios
    .get("http://127.0.0.1:5000/api/getEnrolledDeviceEnrolled/", {
      params: { sID: sID },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// test getEnabledEnrolledDevices
getEnabledEnrolledDevices(1); // works

// dailyUsageByMonthYear
function getDailyUsageByMonthYear(dailyUsageByMonthYear) {
  axios
    .get("http://127.0.0.1:5000/api/getDailyUsageBySID/", {
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
getDailyUsageByMonthYear(dailyUsageByMonthYear); // works

// monlyUsageByYear
function getMonthlyUsageByYear(monthlyUsageByYear) {
  axios
    .get("http://127.0.0.1:5000/api/getMonthlyUsageBySID/", {
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
getMonthlyUsageByYear(monthlyUsageByYear); // works

// yearlyUsageBySID
function getYearlyUsageBySID(yearlyUsageBySID) {
  axios
    .get("http://127.0.0.1:5000/api/getYearlyUsageBySID/", {
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
getYearlyUsageBySID(yearlyUsageBySID); // works

//getEnergyPrice
function getEnergyPrice() {
  axios
    .get("http://127.0.0.1:5000/api/getEnergyPrice/")
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
function createTables() {
  axios
    .post("http://127.0.0.1:5000/api/create_table/initial")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// createTables(); // works

// add EnrolledDeviceEvent

function addEnrolledDeviceEvent() {
  axios
    .post("http://127.0.0.1:5000/api/addEDE")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// addEnrolledDeviceEvent(); // works
