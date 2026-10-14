import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5173/',
    withCredentials: true
});

let accessToken = null;

export const setAccessToken = (token) =>{
    accessToken = token;
}

api.interceptors.request.use((config) => {
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config;
});

