import axios from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
    baseURL: api.baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {

                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                const response = await axios.post(`${api.baseURL}/refresh`, {
                    refreshToken: refreshToken
                });
                const newToken = response.data.token;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('token', newToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return instance(originalRequest);

            } catch (refreshError) {
                console.error("Refresh token expired or invalid", refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;