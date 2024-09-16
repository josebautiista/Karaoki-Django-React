import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.21:8000/",
  timeout: 10000,
});

export const urlClient = "http://192.168.0.21:5173/";
