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
    useTheme
} from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { retrieveDesignationById, saveDesignation, updateDesignation } from "../../api/DesignationApiClient";
import { toast } from 'react-toastify';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BadgeIcon from '@mui/icons-material/Badge';
import SaveIcon from '@mui/icons-material/Save';

export default function DesignationComponent() {
    const theme = useTheme();
    const { id } = useParams();
    const desigId = Number(id);
    const navigate = useNavigate();

    const [designationName, setDesignation] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("Add New Designation");

    useEffect(() => {
        if (desigId && desigId !== -1) {
            setTitle("Update Designation");
            retrieveDesignationById(desigId).then((response) => {
                setDesignation(response.data.designationName);
            }).catch(error => {
                toast.error("Error: Could not retrieve designation details.");
            });
        } else {
            setTitle("Add New Designation");
            setDesignation("");
        }
    }, [desigId]);

    function handleSubmit(values, { resetForm }) {
        setIsDisabled(true);
        const designationObject = {
            designationId: desigId,
            designationName: values.designationName
        };

        const apiCall = desigId === -1
            ? saveDesignation(designationObject)
            : updateDesignation(designationObject);

        apiCall.then((response) => {
            toast.success(desigId === -1 ? "Designation successfully added to the system!" : "Designation details have been successfully updated.");
            setIsDisabled(false);
            if (desigId === -1) resetForm();
            navigate('/viewdesignations');
        }).catch((error) => {
            toast.error(error.response?.data?.errorMessage || "An unexpected error occurred while saving the designation.");
            setIsDisabled(false);
        });
    }

    function validate(values) {
        let errors = {};
        if (!values.designationName) {
            errors.designationName = "Designation name is required";
        } else if (values.designationName.length < 2) {
            errors.designationName = "Designation name must be at least 2 characters";
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
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                        color: 'white',
                        borderRadius: '16px 16px 0 0',
                        position: 'relative'
                    }}
                >
                    <IconButton
                        onClick={() => navigate('/viewdesignations')}
                        sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <BadgeIcon sx={{ fontSize: 32 }} />
                        <Typography variant="h5" fontWeight="bold">
                            {title}
                        </Typography>
                    </Stack>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Formik
                        initialValues={{ designationName }}
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                        validate={validate}
                    >
                        {(props) => (
                            <Form>
                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            Role Information
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="designationName"
                                            name="designationName"
                                            label="Designation Name"
                                            placeholder="e.g. Senior Software Engineer"
                                            value={props.values.designationName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.designationName && Boolean(props.errors.designationName)}
                                            helperText={props.touched.designationName && props.errors.designationName}
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
                                            onClick={() => navigate('/viewdesignations')}
                                            sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
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
                                            {isDisabled ? "Saving..." : id === "-1" ? "Create Designation" : "Update Role"}
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