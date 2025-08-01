import axios from "axios";


export const BASE_URL = "https://networx-zdpz.onrender.com"
export const clientServer = axios.create({
    baseURL: BASE_URL,
})