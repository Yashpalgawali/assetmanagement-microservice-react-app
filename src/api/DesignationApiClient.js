import {apiClient} from "./apiClient";


export const saveDesignation= (designation) => apiClient.post(`designation/`,designation)

export const retrieveDesignationById= (id) => apiClient.get(`designation/${id}`)

export const getAllDesignations = () => apiClient.get(`designation/`)

export const updateDesignation= (designation) => apiClient.put(`designation/`,designation)
