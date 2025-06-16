import axios from 'axios';

const instance = axios.create({
    // URL base del servidor
    baseURL: "http://localhost:5001",
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance;