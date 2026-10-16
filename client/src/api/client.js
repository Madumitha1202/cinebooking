import axios from "axios";

export const TOKEN_KEY = "cinebook_token";

// Axios instance used for every API call
const api = axios.create({ baseURL: "/api", timeout: 10000 });

// Attach the JWT token to every request (Experiment: token management)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle unauthorized / expired token responses globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    if (status === 401 && ["TOKEN_EXPIRED", "INVALID_TOKEN", "NO_TOKEN"].includes(code)) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized", { detail: { code, message: error.response.data.message } }));
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  if (error.code === "ERR_CANCELED") return "";
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED" || error.message === "Network Error") {
    return "Cannot reach the server. Make sure the API is running on port 5000.";
  }
  return error.message || "Something went wrong";
};

export default api;
