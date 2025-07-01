import axios from 'axios';

const instance = axios.create({
    // URL base del servidor
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

export default instance;