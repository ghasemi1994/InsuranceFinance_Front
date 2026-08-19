import axios from "axios";
import toast from "react-hot-toast";
import { getAccessToken, getIdsToken, signOut } from "../utils/userAuthenticate";


axios.interceptors.request.use(config => {
    //config.baseURL = process.env.REACT_APP_API_BASE_URL;
    const apiBaseUrl = import.meta.env.VITE_API_URL
    config.baseURL = apiBaseUrl;
    const authToken = getAccessToken();
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        const status = error.response ? error.response.status : null;
        if (status === 401) {
            signOut();
        }
        else if (status === 400) {
            const message = error.response.data.message;
            toast.error(message, { position: 'top-center' });
        }
        else if (status === 404) {
            toast.error('اطلاعات یافت نشد');
        }
        else if (status === 403) {
            toast.error('عدم دسترسی به منابع');
        }
        else {
            if (error.code === "ERR_NETWORK") {
                toast.error('کاربر گرامی! اتصال به شبکه برقرار نمی باشد');
            } else {
                toast.error('کاربر گرامی! خطای نامشخص رخ داده است لطفا با راهبر سیستم تماس حاصل فرمایید');
            }
        }
        return Promise.reject(error);
    }
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
}