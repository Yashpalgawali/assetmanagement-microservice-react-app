import axios from "axios";
import keycloak from "../Component/Security/keycloak";

export const apiClient = axios.create({
  baseURL: 'http://192.168.0.219:8072/assetmanagement/'
})

apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (keycloak.authenticated) {

        // Refresh if token expires within 30 seconds
        await keycloak.updateToken(30);

        config.headers.Authorization =
          `Bearer ${keycloak.token}`;
      }

      return config;

    } catch (error) {
      console.error("Unable to refresh Keycloak token", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);
// // Automatically attach Keycloak Bearer token on every request
// apiClient.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("access_token")
//     || localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// export const apiClient = axios.create({
//   baseURL: '/assetmanagementrest/'
// })
//export const apiClient = axios.create({
//  baseURL: 'http://localhost:8072/assetmanagementrest/'
//}) 