import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./Security/authContext";
import {
    Box,
    CircularProgress,
    Typography,
    alpha,
    useTheme
} from "@mui/material";

/**
 * OAuth Callback Component
 *
 * This route handles the redirect back from Keycloak after authentication.
 * It extracts the authorization code and state from the URL, validates the
 * state (CSRF protection), and exchanges the code for tokens via PKCE.
 */
export default function OAuthCallbackComponent() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleCallback, isAuthenticated } = useAuth();
    const [error, setError] = useState(null);
    const hasProcessed = useRef(false);
    // Track that token exchange succeeded, so we know to navigate once state propagates
    const [callbackSuccess, setCallbackSuccess] = useState(false);

    // Step 1: Exchange the authorization code for tokens
    useEffect(() => {
        // Prevent React 18 StrictMode from running code exchange twice
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        async function processCallback() {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const errorParam = searchParams.get("error");
            const errorDescription = searchParams.get("error_description");

            console.log("[CALLBACK] Processing OAuth callback");
            console.log("[CALLBACK] code present:", !!code);
            console.log("[CALLBACK] state present:", !!state);
            console.log("[CALLBACK] errorParam:", errorParam);
            console.log("[CALLBACK] sessionStorage keys:", Object.keys(sessionStorage));

            // Handle Keycloak error responses (e.g., user cancelled login)
            if (errorParam) {
                alert("Keycloak error : " + errorParam + ' \n description' + errorDescription)
                console.error("Keycloak error:", errorParam, errorDescription);
                setError(errorDescription || "Authentication was cancelled or failed.");
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            // Validate required params
            if (!code) {
                alert('No authorization code received. Please try again.')
                setError("No authorization code received. Please try again.");
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            // Validate state for CSRF protection
            const storedState = sessionStorage.getItem("oauth_state");
            console.log("[CALLBACK] Stored state present:", !!storedState);
            console.log("[CALLBACK] State matches:", state === storedState);
            if (storedState && state !== storedState) {
                setError("Security validation failed. Please try again.");
                sessionStorage.removeItem("oauth_state");
                sessionStorage.removeItem("pkce_code_verifier");
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            // Exchange code for tokens (this calls setAuthenticated(true) internally)
            const success = await handleCallback(code);
            console.log("[CALLBACK] handleCallback returned:", success);

            if (success) {
                // Don't navigate yet — wait for isAuthenticated state to propagate
                setCallbackSuccess(true);
            } else {
                setError("Authentication failed. Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            }
        }

        processCallback();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Step 2: Navigate only AFTER isAuthenticated has actually become true in React state
    // This avoids the race condition where AuthenticatedRoute still sees isAuthenticated=false
    useEffect(() => {
        if (callbackSuccess && isAuthenticated) {
            navigate("/viewcompanies", { replace: true });
        }
    }, [callbackSuccess, isAuthenticated, navigate]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.info.main} 100%)`,
                gap: 3
            }}
        >
            {error ? (
                <>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#fff',
                            fontWeight: 600,
                            textAlign: 'center',
                            px: 3,
                            py: 2,
                            borderRadius: 3,
                            background: alpha('#f44336', 0.2),
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {error}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                        Redirecting to login page...
                    </Typography>
                </>
            ) : (
                <>
                    <CircularProgress
                        size={56}
                        thickness={4}
                        sx={{ color: '#fff' }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#fff',
                            fontWeight: 600,
                            letterSpacing: '-0.3px'
                        }}
                    >
                        Completing authentication...
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                        Please wait while we verify your credentials
                    </Typography>
                </>
            )}
        </Box>
    );
}
