import {
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
    Paper,
    Typography,
    Stack,
    alpha,
    useTheme,
    CircularProgress,
    Grid
} from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "./Security/authContext";
import AOS from "aos";
import "aos/dist/aos.css";

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

export default function RegisterComponent() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { register } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    async function onSubmit(values) {
        setIsSubmitting(true);
        const success = await register(
            values.username,
            values.password,
            values.email,
            values.firstName,
            values.lastName
        );
        if (success) {
            navigate('/login');
        }
        setIsSubmitting(false);
    }

    function validate(values) {
        let errors = {};
        if (!values.username) {
            errors.username = "Username is required";
        } else if (values.username.length < 3) {
            errors.username = "Username must be at least 3 characters";
        }
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = "Enter a valid email address";
        }
        if (!values.firstName) {
            errors.firstName = "First name is required";
        }
        if (!values.lastName) {
            errors.lastName = "Last name is required";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        return errors;
    }

    const textFieldSx = {
        borderRadius: 3,
        bgcolor: alpha('#fff', 0.5)
    };

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
                    right: '-200px',
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
                    left: '-100px',
                    filter: 'blur(80px)',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: alpha(theme.palette.success.light, 0.08),
                    top: '40%',
                    left: '10%',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />

            <Paper
                data-aos="zoom-in"
                elevation={24}
                sx={{
                    width: '100%',
                    maxWidth: 520,
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
                        pb: 3,
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
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                        Join the AssetFlow Management Portal
                    </Typography>
                </Box>

                {/* Form Section */}
                <Box sx={{ p: 4, pt: 3 }}>
                    <Formik
                        initialValues={{
                            username: '',
                            email: '',
                            firstName: '',
                            lastName: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        onSubmit={onSubmit}
                        validate={validate}
                    >
                        {(props) => (
                            <Form>
                                <Stack spacing={2.5}>
                                    {/* Username */}
                                    <Box data-aos="fade-up" data-aos-delay="100">
                                        <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', ml: 0.5 }}>
                                            Username
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="username"
                                            id="reg-username"
                                            placeholder="Choose a username"
                                            value={props.values.username}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.username && Boolean(props.errors.username)}
                                            helperText={props.touched.username && props.errors.username}
                                            size="small"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccountCircleIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                                        </InputAdornment>
                                                    ),
                                                    sx: textFieldSx
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* Email */}
                                    <Box data-aos="fade-up" data-aos-delay="150">
                                        <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', ml: 0.5 }}>
                                            Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="email"
                                            id="reg-email"
                                            type="email"
                                            placeholder="your.email@company.com"
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.email && Boolean(props.errors.email)}
                                            helperText={props.touched.email && props.errors.email}
                                            size="small"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                                        </InputAdornment>
                                                    ),
                                                    sx: textFieldSx
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* First Name & Last Name — side by side */}
                                    <Grid container spacing={2} data-aos="fade-up" data-aos-delay="200">
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', ml: 0.5 }}>
                                                First Name
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="firstName"
                                                id="reg-firstName"
                                                placeholder="First name"
                                                value={props.values.firstName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.firstName && Boolean(props.errors.firstName)}
                                                helperText={props.touched.firstName && props.errors.firstName}
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <BadgeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                                            </InputAdornment>
                                                        ),
                                                        sx: textFieldSx
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', ml: 0.5 }}>
                                                Last Name
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="lastName"
                                                id="reg-lastName"
                                                placeholder="Last name"
                                                value={props.values.lastName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.lastName && Boolean(props.errors.lastName)}
                                                helperText={props.touched.lastName && props.errors.lastName}
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        sx: textFieldSx
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* Password */}
                                    <Box data-aos="fade-up" data-aos-delay="250">
                                        <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', ml: 0.5 }}>
                                            Password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            id="reg-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={props.values.password}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.password && Boolean(props.errors.password)}
                                            helperText={props.touched.password && props.errors.password}
                                            size="small"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                                size="small"
                                                            >
                                                                {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    sx: textFieldSx
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* Confirm Password */}
                                    <Box data-aos="fade-up" data-aos-delay="300">
                                        <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', ml: 0.5 }}>
                                            Confirm Password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="confirmPassword"
                                            id="reg-confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={props.values.confirmPassword}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.confirmPassword && Boolean(props.errors.confirmPassword)}
                                            helperText={props.touched.confirmPassword && props.errors.confirmPassword}
                                            size="small"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                edge="end"
                                                                size="small"
                                                            >
                                                                {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    sx: textFieldSx
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* Submit Button */}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                        disabled={isSubmitting}
                                        data-aos="fade-up"
                                        data-aos-delay="350"
                                        endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                                        sx={{
                                            mt: 1,
                                            py: 1.5,
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
                                        {isSubmitting ? "Creating Account..." : "Create Account"}
                                    </Button>

                                    <Divider data-aos="fade-up" data-aos-delay="400" />

                                    {/* Sign In Link */}
                                    <Box
                                        data-aos="fade-up"
                                        data-aos-delay="450"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: 0.5,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Already have an account?
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            component={RouterLink}
                                            to="/login"
                                            sx={{
                                                color: theme.palette.primary.main,
                                                fontWeight: 'bold',
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                                transition: '0.2s',
                                                '&:hover': {
                                                    color: theme.palette.primary.dark,
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            Sign In
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Paper>
        </Box>
    );
}
