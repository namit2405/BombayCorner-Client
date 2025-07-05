import axios from "axios"

const isDevelopment =  import.meta.env.MODE === 'development'
const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY

const instance = axios.create({
    baseURL : myBaseUrl,
    headers : {
        "Content-Type" : "application/json"
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token){
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export { myBaseUrl };
export default instance;