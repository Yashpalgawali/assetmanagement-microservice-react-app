import { useEffect, useState } from "react";
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
    const { handleCallback } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        async function processCallback() {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const errorParam = searchParams.get("error");
            const errorDescription = searchParams.get("error_description");

            // Handle Keycloak error responses (e.g., user cancelled login)
            if (errorParam) {
                console.error("Keycloak error:", errorParam, errorDescription);
                setError(errorDescription || "Authentication was cancelled or failed.");
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            // Validate required params
            if (!code) {
                setError("No authorization code received. Please try again.");
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            // Validate state for CSRF protection
            const storedState = sessionStorage.getItem("oauth_state");
            if (storedState && state !== storedState) {
                setError("Security validation failed. Please try again.");
                sessionStorage.removeItem("oauth_state");
                sessionStorage.removeItem("pkce_code_verifier");
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            // Exchange code for tokens
            const success = await handleCallback(code);

            if (success) {
                navigate("/", { replace: true });
            } else {
                setError("Authentication failed. Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            }
        }

        processCallback();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
