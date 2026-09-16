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
    Select as MuiSelect,
    Stack,
    TextField,
    Typography,
    useTheme,
    Grid,
    Paper,
    alpha
} from "@mui/material";
import { ErrorMessage, Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCompaniesList } from "../../api/CompanyApiClient";
import { getAllAssignedAssetsByEmpId, retrieveEmployeeById, saveEmployee, updateEmployee } from "../../api/EmployeeApiClient";
import { retrieveDepartmentsByCompanyId } from "../../api/DepartmentApiClient";
import { getAllDesignations } from "../../api/DesignationApiClient";
import { toast } from "react-toastify";
import { getAllAssets } from "../../api/AssetApiClient";
import Select from "react-select";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import WorkIcon from '@mui/icons-material/Work';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function EmployeeComponent() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const empId = id ? Number(id) : -1;

    const [initialValues, setInitialValues] = useState({
        emp_name: "",
        emp_code: "",
        department: "",
        company: "",
        designation: "",
        emp_email: "",
        emp_contact: "",
        asset_ids: []
    });

    const [compList, setCompList] = useState([]);
    const [deptList, setDeptList] = useState([]);
    const [desigList, setDesigList] = useState([]);
    const [assetList, setAssetList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("Add Employee");

    useEffect(() => {
        // Load initial lists
        getAllCompaniesList().then(res => setCompList(res.data));
        getAllDesignations().then(res => setDesigList(res.data));
        getAllAssets().then(res => {
            console.log("All assets data ", res.data);
            setAssetList(res.data)
        });

        if (empId !== -1) {
            setTitle("Update Employee Profile");
            retrieveEmployeeById(empId).then((response) => {
                const empData = response.data;

                // Fetch departments for the employee's company
                retrieveDepartmentsByCompanyId(empData.department.company.companyId).then(res => setDeptList(res.data));

                // Fetch assigned assets
                getAllAssignedAssetsByEmpId(empId).then((res) => {
                    const assignedIds = res.data.map((item) => item.asset.assetId);
                    setInitialValues({
                        employeeName: empData.emp_name,
                        employeeCode: empData.emp_code || "",
                        departmentId: empData.department.dept_id,
                        companyId: empData.department.company.comp_id,
                        designationId: empData.designation.desig_id,
                        employeeEmail: empData.emp_email || "",
                        employeeContact: empData.emp_contact || "",
                        asset_ids: assignedIds
                    });
                });
            }).catch(err => toast.error("Error: Could not retrieve employee profile information."));
        }
    }, [empId]);

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: '8px',
            borderColor: state.isFocused ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.23),
            boxShadow: 'none',
            '&:hover': {
                borderColor: theme.palette.text.primary
            },
            padding: '2px'
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "white",
            zIndex: 9999
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? alpha(theme.palette.primary.main, 0.1) : "white",
            color: state.isFocused ? theme.palette.primary.main : "black",
            '&:active': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2)
            }
        })
    };

    function resetForm() {
        setInitialValues({
            employeeName: "",
            employeeCode: "",
            departmentId: "",
            companyId: "",
            designationId: "",
            employeeEmail: "",
            employeeContact: "",
            asset_ids: []
        });
    }

    function handleSubmit(values) {
        setIsDisabled(true);
        // const assetIdsString = values.asset_ids.join(",");
        const submissionValues = {
            ...values,
            asset_ids: values.asset_ids,
            emp_id: empId !== -1 ? empId : -1
        };

        console.log("object is ", submissionValues)

        const apiCall = empId === -1 ? saveEmployee(submissionValues) : updateEmployee(submissionValues);

        apiCall.then((response) => {

            toast.success(empId === -1 ? "Employee profile has been successfully created!" : "Employee details have been successfully updated.");
            setIsDisabled(false);
            if (empId === -1) resetForm();
            navigate('/viewemployees');
        }).catch((error) => {
            toast.error(error.response?.data?.errorMessage || "An unexpected error occurred while saving employee records.");
            setIsDisabled(false);
        });
    }

    function AssetMultiSelect({ options }) {
        const { setFieldValue, values } = useFormikContext();
        return (
            <Select
                styles={customStyles}
                name="asset_ids"
                isMulti
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Assign assets to employee..."
                onChange={(selectedOptions) => {
                    const ids = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
                    setFieldValue("asset_ids", ids);
                }}
                value={options.filter((opt) => (
                    values.asset_ids?.includes(opt.value))
                )
                }
            />
        );
    }

    const assetOptions = assetList.map((asset) => ({
        value: asset.assetId,
        label: "(" + asset.assetType?.assetType + ") " + asset.assetName + " (" + asset.modelNumber + ")"
    }));

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }} className="fade-in">
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 900,
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
                        onClick={() => navigate('/viewemployees')}
                        sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <PersonAddIcon sx={{ fontSize: 32 }} />
                        <Typography variant="h5" fontWeight="bold">
                            {title}
                        </Typography>

                    </Stack>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, values, handleChange, handleBlur, touched, errors, dirty }) => (
                            <Form>
                                <Grid container spacing={4}>
                                    {/* Personal Section */}
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <ContactMailIcon color="primary" fontSize="small" />
                                            <Typography variant="subtitle1" fontWeight="bold">Personal & Contact Details</Typography>
                                        </Stack>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    id="employeeName"
                                                    label="Full Name"
                                                    name="employeeName"
                                                    variant="outlined"
                                                    value={values.employeeName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.employeeName && Boolean(errors.employeeName)}
                                                    helperText={touched.employeeName && errors.employeeName}
                                                    slotProps={{ sx: { borderRadius: 2 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    id="employeeEmail"
                                                    label="Corporate Email"
                                                    name="employeeEmail"
                                                    type="email"
                                                    variant="outlined"
                                                    value={values.employeeEmail}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    slotProps={{ sx: { borderRadius: 2 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    id="employeeCode"
                                                    label="Employee ID / Code"
                                                    name="employeeCode"
                                                    variant="outlined"
                                                    value={values.employeeCode}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    slotProps={{ sx: { borderRadius: 2 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    id="employeeContact"
                                                    label="Contact Number"
                                                    name="employeeContact"
                                                    variant="outlined"
                                                    value={values.employeeContact}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    slotprops={{ sx: { borderRadius: 2 } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}><Divider /></Grid>

                                    {/* Work Section */}
                                    <Grid item xs={12} >
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <WorkIcon color="primary" fontSize="small" />
                                            <Typography variant="subtitle1" fontWeight="bold">Organizational Assignment</Typography>
                                        </Stack>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={12}>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel id="designation-label">Designation</InputLabel>
                                                    <MuiSelect
                                                        labelId="designation-label"
                                                        id="designation"
                                                        name="designation"
                                                        label="Designation"
                                                        value={values.designation}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        sx={{ borderRadius: 2, minWidth: 150 }}
                                                    >
                                                        {desigList.map(desig => (
                                                            <MenuItem key={desig.designationId} value={desig.designationId}>{desig.designationName}</MenuItem>
                                                        ))}
                                                    </MuiSelect>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6}  >
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel id="company-label">Company</InputLabel>
                                                    <MuiSelect
                                                        labelId="company-label"
                                                        id="company"
                                                        name="company"
                                                        label="Company"
                                                        value={values.company}
                                                        onChange={(e) => {
                                                            setFieldValue("company", e.target.value);
                                                            setFieldValue("department", ""); // Reset dept
                                                            retrieveDepartmentsByCompanyId(e.target.value).then(res => setDeptList(res.data));
                                                        }}
                                                        onBlur={handleBlur}
                                                        sx={{ borderRadius: 2, minWidth: 150 }}
                                                    >
                                                        {compList.map(comp => (
                                                            <MenuItem key={comp.companyId} value={comp.companyId}>{comp.companyName}</MenuItem>
                                                        ))}
                                                    </MuiSelect>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel id="department-label">Department</InputLabel>
                                                    <MuiSelect
                                                        labelId="department-label"
                                                        id="department"
                                                        name="department"
                                                        label="Department"
                                                        value={values.department}
                                                        disabled={!values.company}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        sx={{ borderRadius: 2, minWidth: 150 }}
                                                    >
                                                        {deptList.map(dept => (
                                                            <MenuItem key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</MenuItem>
                                                        ))}
                                                    </MuiSelect>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}><Divider /></Grid>

                                    {/* Assets Section */}
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <InventoryIcon color="primary" fontSize="small" />
                                            <Typography variant="subtitle1" fontWeight="bold">Asset Allocations</Typography>
                                        </Stack>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                minHeight: '100px', // Anchor vertical position
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <AssetMultiSelect options={assetOptions} />
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate('/viewemployees')}
                                                sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={isDisabled || !dirty}
                                                startIcon={isDisabled ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                sx={{
                                                    borderRadius: 2,
                                                    px: 4,
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    boxShadow: 4
                                                }}
                                            >
                                                {isDisabled ? "Saving..." : empId === -1 ? "Create Employee" : "Update Profile"}
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