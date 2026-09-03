import { apiClient } from "./apiClient";

export const getAllCompaniesList = ()=> apiClient.get(`company/`)

export const getCompanyById = (comp_id) => apiClient.get(`company/${comp_id}`)

export const getCompanyByName = (comp_name) => apiClient.get(`company/name/${comp_name}`)

export const saveCompany = (company) => apiClient.post(`company/`,company)

export const updateCompany = (company) => apiClient.put(`company/`,company)