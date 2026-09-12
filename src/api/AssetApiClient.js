import { apiClient } from "./apiClient";

export const saveAsset = (asset) => apiClient.post('asset/api/', asset);

export const retrieveAssetById = (id) => apiClient.get(`asset/api/${id}`);

export const getAllAssets = () => apiClient.get('asset/api/');
export const updateAsset = (asset) => apiClient.put(`asset/api/`, asset);


export const getAllAssetsCount = () => apiClient.get('asset/api/count');