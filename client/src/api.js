import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nik_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function imageUrl(id) {
  return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/images/${id}`;
}
