import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 10000,
});

export const urlClient = "https://192.168.0.21:5173/";
