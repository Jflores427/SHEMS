import api from "./api";

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

  export const getEnrolledDeviceEvents = async (sID, enDevID) => {
    try {
      const response = await api.get("/enrolled-device-event-management/events", { params: {sID, enDevID} });
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

  export const getAllEnrolledDeviceEvents = async (sID) => {
    try {
      const response = await api.get("/enrolled-device-event-management/all-events", { params: {sID} });
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

  export const getAllEnabledEnrolledDeviceEvents = async (sID) => {
    try {
      const response = await api.get("/enrolled-device-event-management/all-events-by-status", { params: {sID, enrolledStatus: "enabled"} });
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

  export const deleteEnrolledDeviceEvent = async (edEventID) => {
    try {
      const response = await api.delete(`/enrolled-device-event-management/events/${edEventID}`);
      alert(`Device Event with ID: ${edEventID} deleted!`);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  export const postEnrolledDeviceEvents = async (sID) => {
    try {
      const response = await api.post("/enrolled-device-event-management/events", {}, { params : { sID }});
      if (response.data.success == false) {
        alert("No Devices to create events for...")
      }
      else {
        alert("New Events Added");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };