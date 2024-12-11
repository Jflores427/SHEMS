const api = axios.create({
    // baseURL: 'http://127.0.0.1:5000', 
    baseURL: '/api', 
    withCredentials: true, // Sending cookies with requests is enabled
    headers: {
        'Content-Type': 'application/json', 
    },
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.log('Attempting to refresh token...');
            try {
                // await api.post('/api/refresh-token'); // Refresh the token
                // return api(error.config); // Retry the failed request
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError.message);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;