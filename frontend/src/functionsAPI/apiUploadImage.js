import api from "./api";
import defaultProfilePic from "../../../backend/uploads/default_profile_image.jpeg";

const profilePicHost = "http://127.0.0.1:5000/";

export const getUploadImage = async (cID) => {
  try {
    const response = await api.get("/getUploadImage/", {
      params: { cID: cID },
    });
    const cProfileURL = response.data.cProfileURL;
    const cProfileURLPath = profilePicHost + cProfileURL;
    if (cProfileURL.length > 0) {
      return cProfileURLPath;
    }
    return defaultProfilePic;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const setUploadImage = async (formData) => {
  try {
    const response = await api.put("/setUploadImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
