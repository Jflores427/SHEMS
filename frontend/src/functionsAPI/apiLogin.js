import api from "./api";

export const createTables = async () => {
    try {
        const response = await api.post("/create_table/initial");
        return response.data;
    }
    catch(error) {
        throw new Error(error.response?.data?.message || error.message);
    }
}

