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
import { getAllAssets, getAllAvailableAssets } from "../../api/AssetApiClient";
import Select from "react-select";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import WorkIcon from '@mui/icons-material/Work';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import InventoryIcon from '@mui/icons-material/Inventory';

const getAssetId = (item) => {
    if (item == null) return null;
    if (typeof item === "number" || typeof item === "string") return item;
    return (
        item.asset_id ??
        item.assetId ??
        item.asset?.assetId ??
        item.asset?.asset_id ??
        item.asset?.id ??
        item.id ??
        item.value ??
        null
    );
};

const toAssetOption = (item) => {
    if (item == null) return null;
    if (typeof item === "object" && item.value != null && item.label != null) {
        return item;
    }
    const id = getAssetId(item);
    if (id == null) return null;
    const name =
        (typeof item === "object" && (item.assetName || item.name || item.asset?.assetName || item.asset?.name)) ||
        `Asset #${id}`;
    const model =
        (typeof item === "object" && (item.modelNumber || item.model || item.asset?.modelNumber || item.asset?.model)) ||
        "";
    const typeObj =
        typeof item === "object"
            ? item.assetType || item.atype || item.asset?.assetType || item.asset?.atype
            : null;
    const type =
        (typeObj && (typeof typeObj === "string" ? typeObj : typeObj.assetType || typeObj.typeName || typeObj.type_name)) ||
        (typeof item === "object" && (item.assettype || item.type)) ||
        "";

    const typePrefix = type ? `(${type}) ` : "";
    const modelSuffix = model ? ` (${model})` : "";
    return {
        value: id,
        label: `${typePrefix}${name}${modelSuffix}`
    };
};

export default function EmployeeComponent() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const empId = id ? Number(id) : -1;

    const [initialValues, setInitialValues] = useState({
        employeeName: "",
        employeeCode: "",
        departmentId: "",
        companyId: "",
        designationId: "",
        employeeEmail: "",
        employeeContact: "",
        asset_ids: []
    });

    const [compList, setCompList] = useState([]);
    const [deptList, setDeptList] = useState([]);
    const [desigList, setDesigList] = useState([]);
    const [assetList, setAssetList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("Add Employee");

    const fetchAvailableOrAllAssets = async () => {
        try {
            const res = await getAllAvailableAssets();
            const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
            if (data.length > 0) {
                return data;
            }
        } catch (err) {
            console.warn("getAllAvailableAssets call failed, attempting getAllAssets fallback:", err);
        }
        try {
            const resAll = await getAllAssets();
            return Array.isArray(resAll.data) ? resAll.data : (resAll.data?.content || []);
        } catch (err) {
            console.error("getAllAssets call failed:", err);
            return [];
        }
    };

    useEffect(() => {
        // Load initial lists
        getAllCompaniesList().then(res => setCompList(res.data));
        getAllDesignations().then(res => setDesigList(res.data));

        if (empId !== -1) {
            setTitle("Update Employee Profile");

            Promise.all([
                fetchAvailableOrAllAssets(),
                retrieveEmployeeById(empId),
                getAllAssignedAssetsByEmpId(empId)
            ]).then(([availableAssets, empRes, assignedRes]) => {
                const empData = empRes.data || {};
                const assignedAssets = Array.isArray(assignedRes.data)
                    ? assignedRes.data
                    : (assignedRes.data?.content || assignedRes.data?.assets || []);

                // Fetch departments for the employee's company
                if (empData.companyId) {
                    retrieveDepartmentsByCompanyId(empData.companyId).then(res => {
                        setDeptList(res.data || []);
                    });
                }

                // Extract assigned asset IDs safely
                const assignedIds = assignedAssets
                    .map(getAssetId)
                    .filter((id) => id != null);

                // Build a combined map of all available assets + already assigned assets
                const combinedMap = new Map();

                (availableAssets || []).forEach((asset) => {
                    const opt = toAssetOption(asset);
                    if (opt && opt.value != null) {
                        combinedMap.set(String(opt.value), opt);
                    }
                });

                assignedAssets.forEach((assigned) => {
                    const opt = toAssetOption(assigned);
                    if (opt && opt.value != null) {
                        combinedMap.set(String(opt.value), opt);
                    }
                });

                const combinedOptions = Array.from(combinedMap.values());
                setAssetList(combinedOptions);

                setInitialValues({
                    employeeName: empData.employeeName || "",
                    employeeCode: empData.employeeCode || "",
                    designationId: empData.designationId || "",
                    departmentId: empData.departmentId || "",
                    companyId: empData.companyId || "",
                    employeeEmail: empData.employeeEmail || "",
                    employeeContact: empData.employeeContact || "",
                    asset_ids: assignedIds
                });
            }).catch(err => {
                console.error("Error retrieving employee data:", err);
                toast.error("Error: Could not retrieve employee profile information.");
            });
        } else {
            fetchAvailableOrAllAssets().then(assets => {
                const combinedMap = new Map();
                (assets || []).forEach((asset) => {
                    const opt = toAssetOption(asset);
                    if (opt && opt.value != null) {
                        combinedMap.set(String(opt.value), opt);
                    }
                });
                setAssetList(Array.from(combinedMap.values()));
            });
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
            backgroundColor: state.isSelected
                ? alpha(theme.palette.primary.main, 0.15)
                : state.isFocused
                ? alpha(theme.palette.primary.main, 0.08)
                : "white",
            color: state.isSelected || state.isFocused ? theme.palette.primary.main : "black",
            fontWeight: state.isSelected ? 'bold' : 'normal',
            '&:active': {
                backgroundColor: alpha(theme.palette.primary.main, 0.25)
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
            employeeId: empId !== -1 ? empId : -1
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

        const selectedValues = (values.asset_ids || [])
            .map((val) => {
                const id = getAssetId(val);
                if (id == null) return null;
                const found = options.find((opt) => String(opt.value) === String(id));
                if (found) return found;
                return toAssetOption(val) || { value: id, label: `Asset #${id}` };
            })
            .filter(Boolean);

        return (
            <Select
                styles={customStyles}
                name="asset_ids"
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Assign assets to employee..."
                value={selectedValues}
                onChange={(selected) => {
                    const ids = selected ? selected.map((opt) => opt.value) : [];
                    setFieldValue("asset_ids", ids);
                }}
            />
        );
    }

    const assetOptions = assetList.map((asset) => toAssetOption(asset) || asset);

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
                                                        id="designationId"
                                                        name="designationId"
                                                        label="Designation"
                                                        value={values.designationId}
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
                                                        id="companyId"
                                                        name="companyId"
                                                        label="Company"
                                                        value={values.companyId}
                                                        onChange={(e) => {
                                                            setFieldValue("companyId", e.target.value);
                                                            setFieldValue("departmentId", ""); // Reset dept
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
                                                        id="departmentId"
                                                        name="departmentId"
                                                        label="Department"
                                                        value={values.departmentId}
                                                        disabled={!values.companyId}
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