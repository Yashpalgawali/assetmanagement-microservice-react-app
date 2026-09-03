import axios from "axios";

export const apiClient = axios.create({
  baseURL: 'http://192.168.0.219:8072/assetmanagement/'
})

// export const apiClient = axios.create({
//   baseURL: '/assetmanagementrest/'
// })
//export const apiClient = axios.create({
//  baseURL: 'http://localhost:8072/assetmanagementrest/'
//}) 