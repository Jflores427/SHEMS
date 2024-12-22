import api from './api';

export const login = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        return response.data.userData;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

export const logout = async () => {
    try {
        await api.post('/logout');
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

export const validateToken = async () => {
    try {
        const response = await api.post('/validate-token', {});
        return response.data.userData;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};