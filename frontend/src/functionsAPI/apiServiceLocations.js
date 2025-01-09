import api from "./api";

export const addServiceLocation = async (newService) => {
  try {
    const response = await api.post("/addServiceLocation", newService);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getServiceLocations = async (cID) => {
  try {
    const response = await api.get("/getServiceLocation", {
      params: { cID: cID },
    });
    const result = [];
    for (let i = 0; i < response.data.length; i++) {
      result.push(response.data[i]);
    }
    return result;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const setServiceLocationStatus = async (sID, serviceStatus) => {
  try {
    const response = api.post("/setServiceLocationStatus", {
      sID: sID,
      serviceStatus: serviceStatus,
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteServiceLocation = async (serviceLocationID) => {
  try {
    const response = await api.delete("/deleteServiceLocation", {
      data: { sID: serviceLocationID },
    });
    alert(`Service Location with ID: ${serviceLocationID} deleted`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
