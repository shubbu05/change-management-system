import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiUrl
});

api.interceptors.request.use((config) => {
    // Helpful error if VITE_API_URL is missed in Vercel
    if (!apiUrl || (apiUrl.includes('localhost') && window.location.hostname !== 'localhost')) {
        return Promise.reject(new Error("VITE_API_URL is missing or invalid in Vercel Environment Variables. Please set it to your deployed backend URL."));
    }
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;