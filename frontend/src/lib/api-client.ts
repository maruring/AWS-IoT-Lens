import Axios, { type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    if (config.headers) {
        config.headers.Accept = 'application/json';
    }

    config.withCredentials = true; 
    return config;
}

export const apiClient = Axios.create({
    baseURL: env.API_URL
});

apiClient.interceptors.request.use(authRequestInterceptor);
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.message || error.message;
        console.error(message); // 後で修正の必要あり
        return Promise.reject(error);
    }
);