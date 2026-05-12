import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("visco_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally → redirect to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("visco_token");
      localStorage.removeItem("visco_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default client;
