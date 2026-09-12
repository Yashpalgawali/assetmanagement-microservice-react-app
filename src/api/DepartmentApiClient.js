import { apiClient } from "./apiClient";

export const getAllDepartments = () => apiClient.get('/department/api/');

export const retrieveDepartmentById = (dept_id) => apiClient.get(`/department/api/${dept_id}`);

export const saveDepartment = (departmentData) => apiClient.post('/department/api/', departmentData);
export const updateDepartment = (departmentData) => apiClient.put('/department/api/', departmentData);

export const retrieveDepartmentsByCompanyId = (comp_id) => apiClient.get(`/department/api/getdeptbycompid/${comp_id}`);