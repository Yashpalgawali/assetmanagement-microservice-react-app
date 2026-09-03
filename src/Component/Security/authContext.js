import { createContext, useContext, useEffect, useState, useRef } from "react";

import {
    redirectToKeycloakLogin,
    redirectToKeycloakRegister,
    exchangeCodeForTokens,
    executeKeycloakLogout,
    executeTokenRefresh
} from "../../api/basicAuthentication";

import { apiClient } from "../../api/apiClient";

import { jwtDecode } from "jwt-decode";
import { showToast } from "../SharedComponent/showToast";

//Create Context
export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const redirectToLogin = () => {
    window.location.href = "/assetmanagement/login";
};

export default function AuthProvider({ children }) {

    const [isAuthenticated, setAuthenticated] = useState(false)

    const [jwtToken, setJwtToken] = useState('')
    const [userid, setUserId] = useState('')
    const [username, setUsername] = useState('')
    const [roles, setRoles] = useState([])

    const [loading, setLoading] = useState(true); // 👈 new

    // Refs for interceptor and refresh timer management
    const requestInterceptorRef = useRef(null);
    const refreshTimerRef = useRef(null);

    /**
     * Apply tokens from Keycloak response to app state, localStorage, and axios interceptor.
     * Keycloak JWT uses:
     *   - `sub`                  → user ID
     *   - `preferred_username`   → username
     *   - `realm_access.roles`   → array of realm role names
     */
    function applyTokens(accessToken, refreshToken, expiresIn) {
        const decoded = jwtDecode(accessToken);
        const bearerToken = 'Bearer ' + accessToken;

        // Update state
        setJwtToken(bearerToken);
        setUserId(decoded.sub);
        setUsername(decoded.preferred_username);
        setRoles(decoded.realm_access?.roles || []);
        setAuthenticated(true);

        // Persist in localStorage
        localStorage.setItem("token", bearerToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userid", decoded.sub);
        localStorage.setItem("username", decoded.preferred_username);
        sessionStorage.setItem("userid", decoded.sub);

        // Update axios request interceptor (eject old one first to avoid stacking)
        if (requestInterceptorRef.current !== null) {
            apiClient.interceptors.request.eject(requestInterceptorRef.current);
        }
        requestInterceptorRef.current = apiClient.interceptors.request.use((config) => {
            config.headers.Authorization = bearerToken;
            return config;
        });

        // Schedule automatic token refresh before expiry
        scheduleTokenRefresh(expiresIn);
    }

    /**
     * Schedule token refresh 60 seconds before expiry.
     * If token lifetime is very short (< 2 min), refresh at half-life.
     */
    function scheduleTokenRefresh(expiresInSeconds) {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        if (!expiresInSeconds || expiresInSeconds <= 0) return;

        const refreshDelay = expiresInSeconds > 120
            ? (expiresInSeconds - 60) * 1000    // 60s before expiry
            : (expiresInSeconds / 2) * 1000;    // half-life for short tokens

        refreshTimerRef.current = setTimeout(async () => {
            const storedRefreshToken = localStorage.getItem("refreshToken");
            if (!storedRefreshToken) return;

            try {
                const resp = await executeTokenRefresh(storedRefreshToken);
                if (resp.status === 200) {
                    const { access_token, refresh_token, expires_in } = resp.data;
                    applyTokens(access_token, refresh_token, expires_in);
                }
            } catch (error) {
                console.error("Token refresh failed — forcing re-login:", error);
                clearAuthState();
                showToast("Session expired. Please login again.", "warning");
                redirectToLogin();
            }
        }, refreshDelay);
    }

    /**
     * Clear all auth state, storage, and timers.
     */
    function clearAuthState() {
        setAuthenticated(false);
        setUserId('');
        setJwtToken('');
        setUsername('');
        setRoles([]);

        sessionStorage.clear();
        localStorage.clear();

        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }

        if (requestInterceptorRef.current !== null) {
            apiClient.interceptors.request.eject(requestInterceptorRef.current);
            requestInterceptorRef.current = null;
        }
    }

    // ✅ Restore auth from localStorage on refresh
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userid");
        const storedUsername = localStorage.getItem("username");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedToken && storedUserId) {
            setJwtToken(storedToken);
            setUserId(storedUserId);
            setUsername(storedUsername);
            setAuthenticated(true);

            // Re-attach axios request interceptor
            requestInterceptorRef.current = apiClient.interceptors.request.use((config) => {
                config.headers.Authorization = storedToken;
                return config;
            });

            // Decode to get roles and check expiry
            try {
                const tokenOnly = storedToken.replace('Bearer ', '');
                const decoded = jwtDecode(tokenOnly);
                setRoles(decoded.realm_access?.roles || []);

                const now = Date.now() / 1000;
                const timeRemaining = decoded.exp - now;

                if (timeRemaining <= 0 && storedRefreshToken) {
                    // Token expired — attempt silent refresh
                    executeTokenRefresh(storedRefreshToken)
                        .then(resp => {
                            if (resp.status === 200) {
                                applyTokens(resp.data.access_token, resp.data.refresh_token, resp.data.expires_in);
                            }
                        })
                        .catch(() => {
                            clearAuthState();
                            redirectToLogin();
                        });
                } else if (timeRemaining > 0) {
                    // Token still valid — schedule refresh before expiry
                    scheduleTokenRefresh(timeRemaining);
                }
            } catch (e) {
                console.error("Failed to decode stored token:", e);
            }
        }

        // Response interceptor for global 401 handling
        const respInterceptor = apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                const isAuthApi =
                    error.config?.url?.includes("/auth/login") ||
                    error.config?.url?.includes("/auth/register");

                // 🔴 Allow login/register to handle their own errors
                if (isAuthApi) {
                    return Promise.reject(error);
                }

                // 🔐 Token expired / unauthorized for protected APIs
                if (error.response?.status === 401) {
                    showToast("Authentication required. Please login again to continue.", "error");
                    localStorage.clear();
                    sessionStorage.clear();
                    redirectToLogin();
                    return Promise.reject(error);
                }

                // 🌐 Backend down
                if (!error.response) {
                    showToast("Server unavailable. Please check your network connection.", "error");
                    return Promise.reject(error);
                }

                return Promise.reject(error);
            }
        );

        setLoading(false); // 👈 auth check done

        return () => {
            apiClient.interceptors.response.eject(respInterceptor);
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, []);

    /**
     * Initiate login — redirect the browser to Keycloak's login page.
     * (Authorization Code + PKCE flow)
     */
    function initiateLogin() {
        redirectToKeycloakLogin();
    }

    /**
     * Initiate registration — redirect the browser to Keycloak's registration page.
     * After registration, Keycloak redirects back with an auth code (same as login).
     */
    function initiateRegister() {
        redirectToKeycloakRegister();
    }

    /**
     * Handle the OAuth callback — exchange the authorization code for tokens.
     * Called by OAuthCallbackComponent after Keycloak redirects back.
     *
     * @param {string} code - The authorization code from Keycloak
     * @returns {boolean} true on success, false on failure
     */
    async function handleCallback(code) {
        try {
            // Retrieve the PKCE code verifier stored before the redirect
            const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

            if (!codeVerifier) {
                showToast("Authentication failed. Missing PKCE verifier. Please try again.", "error");
                return false;
            }

            const resp = await exchangeCodeForTokens(code, codeVerifier);

            // Clean up PKCE and state values
            sessionStorage.removeItem("pkce_code_verifier");
            sessionStorage.removeItem("oauth_state");

            if (resp.status === 200) {
                const { access_token, refresh_token, expires_in } = resp.data;
                applyTokens(access_token, refresh_token, expires_in);
                return true;
            } else {
                clearAuthState();
                return false;
            }
        } catch (error) {
            console.error("OAuth code exchange failed:", error);

            // Clean up PKCE and state values
            sessionStorage.removeItem("pkce_code_verifier");
            sessionStorage.removeItem("oauth_state");

            if (error.response?.status === 400) {
                showToast("Authentication failed. The authorization code may have expired. Please try again.", "error");
            } else {
                showToast("Authentication failed. Server is currently unreachable.", "error");
            }

            clearAuthState();
            return false;
        }
    }

    /**
     * Logout — revoke the refresh token on Keycloak, then clear local state.
     */
    async function logout() {
        try {
            const storedRefreshToken = localStorage.getItem("refreshToken");
            if (storedRefreshToken) {
                await executeKeycloakLogout(storedRefreshToken);
            }
        } catch (error) {
            // Non-critical — Keycloak logout is best-effort
            console.error("Keycloak logout error (non-critical):", error);
        }

        showToast("Logout successful. See you soon!", "success");
        clearAuthState();
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            initiateLogin,
            initiateRegister,
            handleCallback,
            logout,
            jwtToken,
            userid,
            username,
            roles
        }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}