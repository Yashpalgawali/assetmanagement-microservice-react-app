import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useTheme,
    Grid
} from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getAllCompaniesList, getCompanyById } from "../../api/CompanyApiClient";
import { retrieveDepartmentById, saveDepartment, updateDepartment } from "../../api/DepartmentApiClient";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';

export default function DepartmentComponent() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("Add New Department");

    const [initialValues, setInitialValues] = useState({
        dept_id: "",
        dept_name: "",
        companyId: ""
    });

    useEffect(() => {
        getAllCompaniesList().then((response) => {
            setCompanies(response.data);
        });

        if (id && id != -1) {
            setTitle("Update Department");
            retrieveDepartmentById(id).then((response) => {
                setInitialValues({
                    dept_id: response.data.dept_id,
                    dept_name: response.data.dept_name,
                    companyId: response.data.company.comp_id
                });
            }).catch(error => {
                toast.error("Error: Could not retrieve department details.");
            });
        }
    }, [id]);

    const validationSchema = Yup.object({
        dept_name: Yup.string()
            .required('Department name is required')
            .min(2, 'Name must be at least 2 characters'),
        companyId: Yup.string()
            .required('Please select a company')
    });

    async function handleSubmit(values, { resetForm }) {
        setIsDisabled(true);
        try {
            const companyResponse = await getCompanyById(values.companyId);

            let dept_id = id;
            if (id == -1) {
                dept_id = '';
            }

            const deptData = {
                dept_id: dept_id,
                dept_name: values.dept_name,
                company: {
                    comp_id: companyResponse.data.comp_id,
                    comp_name: companyResponse.data.comp_name
                }
            };

            const apiCall = id == -1
                ? saveDepartment(deptData)
                : updateDepartment(deptData);
            alert(apiCall)
            console.log(deptData)
            apiCall.then((response) => {
                toast.success(id === "-1" ? "Department successfully created!" : "Department details have been updated.");
                setIsDisabled(false);
                if (id == -1) resetForm();
                navigate('/viewdepartments');
            }).catch((error) => {
                toast.error(error.response?.data?.errorMessage || "An unexpected error occurred while saving the department.");
                setIsDisabled(false);
            });
        } catch (error) {
            toast.error(error.response?.data?.errorMessage || "An unexpected error occurred while fetching company details.");
            setIsDisabled(false);
        }
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }} className="fade-in">
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 700,
                    borderRadius: 4,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    overflow: 'visible'
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                        color: 'white',
                        borderRadius: '16px 16px 0 0',
                        position: 'relative'
                    }}
                >
                    <IconButton
                        onClick={() => navigate('/viewdepartments')}
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
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(props) => (
                            <Form>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            Department Hierarchy
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant="outlined" error={props.touched.companyId && Boolean(props.errors.companyId)}>
                                            <InputLabel id="company-label">Associated Company</InputLabel>
                                            <Select
                                                labelId="company-label"
                                                id="companyId"
                                                name="companyId"
                                                label="Associated Company"
                                                value={props.values.companyId}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                {companies.map((company) => (
                                                    <MenuItem key={company.comp_id} value={company.comp_id}>
                                                        {company.comp_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {props.touched.companyId && props.errors.companyId && (
                                                <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                                                    {props.errors.companyId}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            id="dept_name"
                                            name="dept_name"
                                            label="Department Name"
                                            placeholder="e.g. Research & Development"
                                            value={props.values.dept_name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.dept_name && Boolean(props.errors.dept_name)}
                                            helperText={props.touched.dept_name && props.errors.dept_name}
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate('/viewdepartments')}
                                                sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="info"
                                                disabled={isDisabled || !props.dirty}
                                                startIcon={isDisabled ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                sx={{
                                                    borderRadius: 2,
                                                    px: 4,
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    boxShadow: 4,
                                                    color: 'white'
                                                }}
                                            >
                                                {isDisabled ? "Saving..." : id === "-1" ? "Create Department" : "Save Changes"}
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </Box>
    );
}