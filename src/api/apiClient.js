import axios from "axios";

export const apiClient = axios.create({
  baseURL: 'http://192.168.0.219:8072/assetmanagement/'
})

// Automatically attach Keycloak Bearer token on every request
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token")
    || localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// export const apiClient = axios.create({
//   baseURL: '/assetmanagementrest/'
// })
//export const apiClient = axios.create({
//  baseURL: 'http://localhost:8072/assetmanagementrest/'
//}) 