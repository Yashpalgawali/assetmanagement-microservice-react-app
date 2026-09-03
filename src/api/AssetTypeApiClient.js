import { apiClient } from "./apiClient";

export const saveAssetType = (assettype) => apiClient.post('assettype', assettype)

export const updateAssetType = (assettype) => apiClient.put(`assettype/`, assettype)

export const getAssetType = (id) => apiClient.get(`assettype/${id}`)

export const getAllAssetTypes = () => apiClient.get('assettype/')