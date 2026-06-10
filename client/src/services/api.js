import axios from "axios";

const API = axios.create({
    baseURL: "https://smartcampus-h5xz.onrender.com/api/auth"
});

API.interceptors.request.use((req) => {

    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;