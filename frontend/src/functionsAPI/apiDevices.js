import api from "./api";

export const getDevices = async () => {
  try {
    const response = await api.get("/getSupportedDevice");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getDeviceModels = async (type) => {
  try {
    const response = await api.get("/getSupportedDeviceByType", {
      params: { type },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getDevID = async (model, type) => {
  try {
    const response = await api.get("/getDevIDByModelAndType", {
      params: { model, type },
    });
    return response.data.devID;
  } catch (error) {
    console.error(error);
  }
};

export const getDevIDByModelAndType = async (newEnrolledDevice)  => {
  try{
  const newDevID  = await getDevID(newEnrolledDevice.model, newEnrolledDevice.type);
  const deviceWithDevID = { enDevName: newEnrolledDevice.enDevName, sID: parseInt(newEnrolledDevice.sID,10), devID: newDevID };
  return await addNewEnrolledDevice(deviceWithDevID);
  }
  catch(error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export const addNewEnrolledDevice = async (deviceFormData) => {
  try {
    return api.post("/enrollDevice", deviceFormData);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const setEnrolledDeviceStatus = async (enDevID, enrolledStatus) => {
  try {
    const response = await api.post("/setEnrolledDeviceStatus", {
      enDevID,
      enrolledStatus,
    });
    console.log(response.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteEnrolledDevice = async (enDevID) => {
  try {
    const response = await api.delete("/deleteEnrolledDevice", {
      data: { enDevID },
    });
    alert(`Device with ${enDevID} deleted!`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getEnrolledDevices = async (sID) => {
  try {
    const response = await api.get("/getEnrolledDevice", { params: { sID } });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getServiceLocations = async (cID) => {
  try {
    const response = await api.get("/getServiceLocation", { params: { cID } });
    const result = [];
    for (let i = 0; i < response.data.length; i++) {
      result.push(response.data[i]);
    }
    console.log(result);
    return result;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};


