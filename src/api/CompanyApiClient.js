import { apiClient } from "./apiClient";

export const getAllCompaniesList = () => apiClient.get(`company/company/`)

export const getCompanyById = (comp_id) => apiClient.get(`company/company/${comp_id}`)

export const getCompanyByName = (comp_name) => apiClient.get(`company/company/name/${comp_name}`)

export const saveCompany = (company) => apiClient.post(`company/company/`, company)

export const updateCompany = (company) => apiClient.put(`company/company/`, company)