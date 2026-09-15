import { apiClient } from "./apiClient";


export const saveDesignation = (designation) => apiClient.post(`designation/api/`, designation)

export const retrieveDesignationById = (id) => apiClient.get(`designation/api/${id}`)

export const getAllDesignations = () => apiClient.get(`designation/api/`)

export const updateDesignation = (designation) => apiClient.put(`designation/api/`, designation)
