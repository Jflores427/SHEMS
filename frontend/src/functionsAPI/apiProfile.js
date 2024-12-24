import api from "./api";

export const getBillingAddress = async (cID) => {
  try {
    const response = await api.get("/getBillingAddress", {
      params: { cID: cID },
    });
    return response.data[0];
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateBillingAddress = async (cID, addressData) => {
  try {
    const response = await api.put(`/updateBillingAddress`, addressData, {
      params: { cID: cID },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getCustomer = async (cID) => {
  try {
    const response = await api.get("/getCustomer", { params: { cID: cID } });
    return response.data[0];
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
