import { Box, Button, TextField, Typography, Card, CardContent, Stack, InputAdornment, IconButton, Container } from "@mui/material"
import { ErrorMessage, Form, Formik } from "formik"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import { toast } from "react-toastify"
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import gsap from "gsap";
import { updateForgotPassword, updatePassword } from "../api/ChangePasswordApiService"

export default function ChangePassword() {

    const navigate = useNavigate()
    const containerRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showCnfPassword, setShowCnfPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".card-anim", { scale: 0.95, opacity: 0, duration: 0.8, ease: "power3.out" });
            gsap.from(".header-anim", { y: -20, opacity: 0, duration: 0.6, delay: 0.2, ease: "power2.out" });
            gsap.from(".field-anim", { x: -20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" });
        }, containerRef);
        return () => ctx.revert();
    }, [])

    useEffect(() => {
        

    }, [])

    function handleSubmit(values) {
        if (values.password !== values.cnfpassword) {
            toast.error('Passwords Do Not Match')
        }
        else {
            setLoading(true)
            if (sessionStorage.getItem('userid') != null) {
                const user = {
                    user_id: parseInt(sessionStorage.getItem('userid')),
                    password: values.password
                }

                updatePassword(user).then((response) => {
                    toast.success(response.data.statusMsg)
                    navigate(`/`)
                }).catch((error) => {
                    toast.error(error.response?.data?.errorMessage || 'An error occurred')
                    navigate(`/change/password`)
                }).finally(() => setLoading(false))
            }
            else {
                let user = {
                    email: sessionStorage.getItem('email'),
                    password: values.password
                }
                updateForgotPassword(user).then((response) => {
                    sessionStorage.removeItem('email')
                    toast.success(response.data.statusMsg)
                    navigate(`/login`)
                }).catch((error) => {
                    sessionStorage.removeItem('email')
                    toast.error(error.response?.data?.errorMessage || 'An error occurred')
                    navigate(`/login`)
                }).finally(() => setLoading(false))
            }
        }
    }

    function validate(values) {
        let errors = {}
        if (!values.password) {
            errors.password = 'Password Cannot be blank'
        } else if (values.password.length < 3) {
            errors.password = 'Password must be at least 3 characters'
        }
        if (!values.cnfpassword) {
            errors.cnfpassword = 'Confirm Password Cannot be blank'
        }
        return errors;
    }

    return (
        <Box ref={containerRef} sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
            p: 2
        }}>
            <Container maxWidth="sm">
                <Card className="card-anim" sx={{
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    overflow: 'visible'
                }}>
                    <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                        <Stack alignItems="center" spacing={2} mb={4} className="header-anim">
                            <Box sx={{
                                width: 64, height: 64,
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 16px rgba(142, 197, 252, 0.4)',
                                transform: 'rotate(45deg)'
                            }}>
                                <ManageAccountsIcon sx={{ color: '#4a148c', fontSize: 32, transform: 'rotate(-45deg)' }} />
                            </Box>
                            <Typography variant="h4" fontWeight="800" color="#1e293b" align="center" sx={{ mt: 3 }}>
                                Update Password
                            </Typography>
                            <Typography variant="body1" color="text.secondary" align="center">
                                Enhance your account security with a strong new password.
                            </Typography>
                        </Stack>

                        <Formik
                            initialValues={{ password: '', cnfpassword: '' }}
                            validateOnChange={false}
                            validateOnBlur={false}
                            onSubmit={handleSubmit}
                            validate={validate}
                        >
                            {(props) => (
                                <Form>
                                    <Stack spacing={3}>
                                        <Box className="field-anim">
                                            <TextField
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                label="New Password"
                                                variant="outlined"
                                                placeholder="Enter new password"
                                                value={props.values.password}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.password && Boolean(props.errors.password)}
                                                helperText={<ErrorMessage name="password" />}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    sx: { borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.7)' }
                                                }}
                                            />
                                        </Box>

                                        <Box className="field-anim">
                                            <TextField
                                                id="cnfpassword"
                                                type={showCnfPassword ? 'text' : 'password'}
                                                name="cnfpassword"
                                                label="Confirm New Password"
                                                variant="outlined"
                                                placeholder="Re-enter new password"
                                                value={props.values.cnfpassword}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.cnfpassword && Boolean(props.errors.cnfpassword)}
                                                helperText={<ErrorMessage name="cnfpassword" />}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><VpnKeyIcon color="action" /></InputAdornment>,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowCnfPassword(!showCnfPassword)} edge="end">
                                                                {showCnfPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    sx: { borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.7)' }
                                                }}
                                            />
                                        </Box>

                                        <Box className="field-anim">
                                            <Button
                                                type="submit"
                                                fullWidth
                                                disabled={loading}
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    mt: 2,
                                                    py: 1.5,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 700,
                                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.4)',
                                                    '&:hover': {
                                                        boxShadow: '0 12px 25px rgba(79, 70, 229, 0.5)',
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {loading ? 'Processing...' : 'Change Password'}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}