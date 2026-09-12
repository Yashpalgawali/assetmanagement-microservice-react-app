import { apiClient } from "./apiClient";

export const saveAssetType = (assettype) => apiClient.post('asset/assettype/api/', assettype)

export const updateAssetType = (assettype) => apiClient.put(`asset/assettype/api/`, assettype)

export const getAssetType = (id) => apiClient.get(`asset/assettype/api/${id}`)

export const getAllAssetTypes = () => apiClient.get('asset/assettype/api/')