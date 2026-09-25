import { apiClient } from "./apiClient";

export const saveEmployee = (employee) => apiClient.post(`employee/api/`, employee)

export const getAllEmployeesList = () => apiClient.get(`employee/api/`)

export const retrieveEmployeeById = (empId) => apiClient.get(`employee/api/${empId}`)

export const updateEmployee = (employee) => apiClient.put(`employee/api/`, employee)

export const getAllAssignedAssets = () => apiClient.get(`employee/api/viewassignedassets`)

export const getAllAssignedAssetsByEmpId = (empid) => apiClient.get(`employee/getassignedassetsbyempid/${empid}`)

export const exportAllAssignedAssets = () => apiClient.get(`employee/api/exportassignedassets/excel`, {
    responseType: 'arraybuffer'
})

export const exportAllAssignedAssetsByEmployeeId = (id) => apiClient.get(`employee/api/exportassignshistory/excel/${id}`, {
    responseType: 'arraybuffer'
})

export const exportAllEmployees = () => apiClient.get(`employee/api/exportemployees/excel`, {
    responseType: 'arraybuffer'
})

