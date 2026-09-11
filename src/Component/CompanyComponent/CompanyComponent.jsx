import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
    useTheme,
    alpha
} from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyById, updateCompany, saveCompany as saveCompanyApi } from "../../api/CompanyApiClient";
import { toast } from "react-toastify";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';

export default function CompanyComponent() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();

    const [companyName, setCompName] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("Add New Company");

    useEffect(() => {
        if (id && id !== "-1") {
            setTitle("Update Company");
            getCompanyById(id).then(response => {
                alert('get company by ID is called')
                console.log(response.data)
                setCompName(response.data.companyName);
            }).catch(error => {
                toast.error("Failed to load company details");
            });
        } else {
            setTitle("Add New Company");
            setCompName("");
        }
    }, [id]);

    function handleSubmit(values, { resetForm }) {
        setIsDisabled(true);
        const companyObject = {
            companyName: values.companyName
        };

        const apiCall = id === "-1"
            ? saveCompanyApi(companyObject)
            : updateCompany({ ...companyObject, companyId: id });

        apiCall.then((row) => {
            toast.success(id === "-1" ? "Company successfully registered and added to directory!" : "Company details have been successfully updated.");
            setIsDisabled(false);
            if (id === "-1") resetForm();
            navigate('/viewcompanies');
        }).catch((error) => {
            toast.error(error.response?.data?.errorMessage || "An unexpected error occurred while saving the company.");
            setIsDisabled(false);
        });
    }

    function validate(values) {
        let errors = {};
        if (!values.companyName) {
            errors.companyName = "Company name is required";
        } else if (values.companyName.length < 2) {
            errors.companyName = "Company name must be at least 2 characters";
        }
        return errors;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }} className="fade-in">
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    borderRadius: 4,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    overflow: 'visible'
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        color: 'white',
                        borderRadius: '16px 16px 0 0',
                        position: 'relative'
                    }}
                >
                    <IconButton
                        onClick={() => navigate('/viewcompanies')}
                        sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <BusinessIcon sx={{ fontSize: 32 }} />
                        <Typography variant="h5" fontWeight="bold">
                            {title}
                        </Typography>
                    </Stack>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Formik
                        initialValues={{ companyName }}
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                        validate={validate}
                    >
                        {(props) => (
                            <Form>
                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            Company Details
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="companyName"
                                            name="companyName"
                                            label="Company Name"
                                            placeholder="e.g. Acme Corporation"
                                            value={props.values.companyName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.companyName && Boolean(props.errors.companyName)}
                                            helperText={props.touched.companyName && props.errors.companyName}
                                            variant="outlined"
                                            InputProps={{
                                                sx: { borderRadius: 2 }
                                            }}
                                        />
                                    </Box>

                                    <Divider />

                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/viewcompanies')}
                                            sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isDisabled || !props.dirty}
                                            startIcon={isDisabled ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                            sx={{
                                                borderRadius: 2,
                                                px: 4,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                boxShadow: 4
                                            }}
                                        >
                                            {isDisabled ? "Saving..." : id === "-1" ? "Register Company" : "Update Profile"}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </Box>
    );
}
