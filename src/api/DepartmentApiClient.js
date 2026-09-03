import { apiClient } from "./apiClient";

export const getAllDepartments = () =>  apiClient.get('/department/');

export const retrieveDepartmentById = (dept_id) => apiClient.get(`/department/${dept_id}`);

export const saveDepartment = (departmentData) => apiClient.post('/department/', departmentData);        
export const updateDepartment = (departmentData) => apiClient.put('/department/', departmentData);

export const retrieveDepartmentsByCompanyId = (comp_id) => apiClient.get(`/department/getdeptbycompid/${comp_id}`);