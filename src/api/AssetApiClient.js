import { apiClient } from "./apiClient";

export const saveAsset = (asset) => apiClient.post('asset/', asset);

export const retrieveAssetById = (id) => apiClient.get(`asset/${id}`);

export const getAllAssets = () => apiClient.get('asset/');
export const updateAsset = (asset) => apiClient.put(`asset/`, asset);


export const getAllAssetsCount = () => apiClient.get('asset/count');