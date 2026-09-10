import {
    Box,
    Button,
    Divider,
    Paper,
    Typography,
    Stack,
    alpha,
    useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Security/authContext";
import AOS from "aos";
import "aos/dist/aos.css";

import BusinessIcon from '@mui/icons-material/Business';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function LoginComponent() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isAuthenticated, initiateLogin, login, initiateRegister } = useAuth();

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    // If already authenticated, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.info.main} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                p: 2
            }}
        >
            {/* Animated Background Decor */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: alpha(theme.palette.primary.light, 0.1),
                    top: '-200px',
                    left: '-200px',
                    filter: 'blur(100px)',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: alpha(theme.palette.info.light, 0.1),
                    bottom: '-100px',
                    right: '-100px',
                    filter: 'blur(80px)',
                    zIndex: 0
                }}
            />

            <Paper
                data-aos="zoom-in"
                elevation={24}
                sx={{
                    width: '100%',
                    maxWidth: 450,
                    borderRadius: 6,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: alpha('#fff', 0.8),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#fff', 0.5),
                    zIndex: 1,
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        background: alpha(theme.palette.primary.main, 0.05),
                        borderBottom: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1)
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '16px',
                            bgcolor: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}
                    >
                        <BusinessIcon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-0.5px', color: theme.palette.text.primary }}>
                        AssetFlow
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                        Enterprise Asset Management Portal
                    </Typography>
                </Box>

                {/* Action Section */}
                <Box sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: 'center', lineHeight: 1.6 }}
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            Sign in securely through our identity provider.
                            Your credentials are handled by Keycloak — never stored in this application.
                        </Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={login}
                            // onClick={initiateLogin}
                            data-aos="fade-up"
                            data-aos-delay="200"
                            startIcon={<LoginIcon />}
                            sx={{
                                py: 1.8,
                                borderRadius: 3,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                                }
                            }}
                        >
                            Sign In with Keycloak
                        </Button>

                        <Divider data-aos="fade-up" data-aos-delay="300">
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                NEW HERE?
                            </Typography>
                        </Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={initiateRegister}
                            data-aos="fade-up"
                            data-aos-delay="400"
                            startIcon={<PersonAddIcon />}
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                borderWidth: 2,
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    borderWidth: 2,
                                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                                }
                            }}
                        >
                            Create Account
                        </Button>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2
                            }}
                        >
                            <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}>
                                Forgot Password?
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.palette.divider }}>|</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}>
                                Contact Admin
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}