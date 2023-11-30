import axios from "axios";

export const baseURL = "http://10.0.2.2:21035";
const timeout = 10000;

const axiosInstance = axios.create({ baseURL, timeout });

export default axiosInstance;
