import { apiClient } from "./apiClient";

export const getAllCompaniesList = () => apiClient.get(`company/api/`)

export const getCompanyById = (comp_id) => apiClient.get(`company/api/${comp_id}`)

export const getCompanyByName = (comp_name) => apiClient.get(`company/api/name/${comp_name}`)

export const saveCompany = (company) => apiClient.post(`company/api/`, company)

export const updateCompany = (company) => apiClient.put(`company/api/`, company)