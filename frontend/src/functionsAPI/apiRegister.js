import api from "./api";

export const checkUsernameExists = async (username) => {
  try {
    const response = await api.get("/checkUsername", {
      params: { username: username },
    });
    return response.data.isExist;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const register = async (formData) => {
  try {
    const response = await api.post("/register", formData);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
