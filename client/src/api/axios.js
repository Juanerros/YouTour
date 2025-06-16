import axios from 'axios';

const instance = axios.create({
    // URL base del servidor
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance;