import { apiClient } from "./apiClient";


export const updatePassword = (user) => apiClient.put('users/update/password', user)

export const sendOtp = (email) => apiClient.get(`users/password/otp/${email}`)

export const updateForgotPassword = (user) => apiClient.put(`users/password/forgot`, user)

export const validateOtp = (email, otp) => apiClient.get(`users/password/email/${encodeURIComponent(email)}/otp/${otp}`)
