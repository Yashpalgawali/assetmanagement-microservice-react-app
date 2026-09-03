import { apiClient } from "./apiClient";

export const saveEmployee = (employee) => apiClient.post(`employee/`, employee)

export const getAllEmployeesList = () => apiClient.get(`employee/`)

export const retrieveEmployeeById = (empId) => apiClient.get(`employee/${empId}`)

export const updateEmployee = (employee) => apiClient.put(`employee/`, employee)

export const getAllAssignedAssets = () => apiClient.get(`employee/viewassignedassets`)

export const getAllAssignedAssetsByEmpId = (empid) => apiClient.get(`employee/getassignedassetsbyempid/${empid}`)

export const exportAllAssignedAssets = () => apiClient.get(`employee/exportassignedassets/excel`, {
    responseType: 'arraybuffer'
})

export const exportAllAssignedAssetsByEmployeeId = (id) => apiClient.get(`employee/exportassignshistory/excel/${id}`, {
    responseType: 'arraybuffer'
})

export const exportAllEmployees = () => apiClient.get(`employee/exportemployees/excel`, {
    responseType: 'arraybuffer'
})

