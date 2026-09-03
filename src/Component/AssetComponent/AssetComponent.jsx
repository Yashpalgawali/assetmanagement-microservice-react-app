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
    alpha,
    Grid
} from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { retrieveAssetById, saveAsset, updateAsset } from "../../api/AssetApiClient";
import { getAllAssetTypes } from "../../api/AssetTypeApiClient";
import { toast } from "react-toastify";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import SaveIcon from '@mui/icons-material/Save';

export default function AssetComponent() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [initialValues, setInitialValues] = useState({
        asset_name: "",
        asset_id: "",
        model_number: "",
        asset_number: "",
        quantity: "",
        atype: ""
    });
    
    const [atypelist, setAssetTypeList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("Register New Asset");

    useEffect(() => {
        getAllAssetTypes().then((response) => {
            setAssetTypeList(response.data);
        });
        
        if (id && id !== "-1") {
            setTitle("Update Asset Specifications");
            retrieveAssetById(id).then((response) => {
                setInitialValues({
                    asset_name: response.data.asset_name,
                    asset_id: response.data.asset_id,
                    model_number: response.data.model_number,
                    asset_number: response.data.asset_number,
                    quantity: response.data.quantity,
                    atype: response.data.atype.type_id
                });
            }).catch(error => {
                toast.error("Error: Could not retrieve asset details from the server.");
            });
        } else {
            setTitle("Register New Asset");
            setInitialValues({
                asset_name: "",
                asset_id: "",
                model_number: "",
                asset_number: "",
                quantity: "",
                atype: ""
            });
        }
    }, [id]);

    function handleSubmit(values, { resetForm }) {
        setIsDisabled(true);
        const assetData = { 
            ...values,
            atype: { type_id: values.atype } // API expects object for type
        };
             
        const apiCall = id === "-1" ? saveAsset(assetData) : updateAsset(assetData);

        apiCall.then((response) => {
            toast.success(id === "-1" ? "Asset successfully added to inventory!" : "Asset details have been successfully updated.");
            setIsDisabled(false);
            if (id === "-1") resetForm();
            navigate('/viewassets');
        }).catch((error) => {
            toast.error(error.response?.data?.errorMessage || "An unexpected error occurred while saving the asset.");
            setIsDisabled(false);
        });
    }

    function validate(values) {
        let errors = {};
        if (!values.asset_name) errors.asset_name = "Name is required";
        if (!values.atype) errors.atype = "Type is required";
        if (!values.quantity) errors.quantity = "Quantity is required";
        return errors;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }} className="fade-in">
            <Card 
                sx={{ 
                    width: '100%', 
                    maxWidth: 800, 
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
                        onClick={() => navigate('/viewassets')} 
                        sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <DesktopMacIcon sx={{ fontSize: 32 }} />
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
                        validate={validate}
                    >
                        {(props) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            General Information
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant="outlined" error={props.touched.atype && Boolean(props.errors.atype)}>
                                            <InputLabel id="asset-type-label">Asset Type</InputLabel>
                                            <Select
                                                labelId="asset-type-label"
                                                id="atype"
                                                name="atype"
                                                label="Asset Type"
                                                value={props.values.atype}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                {atypelist.map((type) => (
                                                    <MenuItem key={type.type_id} value={type.type_id}>
                                                        {type.type_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {props.touched.atype && props.errors.atype && (
                                                <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                                                    {props.errors.atype}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            id="asset_name"
                                            name="asset_name"
                                            label="Asset Name"
                                            placeholder="e.g. Dell Latitude 5420"
                                            value={props.values.asset_name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.asset_name && Boolean(props.errors.asset_name)}
                                            helperText={props.touched.asset_name && props.errors.asset_name}
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>
                                            Inventory Details
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            id="model_number"
                                            name="model_number"
                                            label="Model Number"
                                            placeholder="MI-12345"
                                            value={props.values.model_number}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            id="asset_number"
                                            name="asset_number"
                                            label="Serial/Asset Number"
                                            placeholder="SN-987654"
                                            value={props.values.asset_number}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            id="quantity"
                                            name="quantity"
                                            label="Quantity"
                                            type="number"
                                            value={props.values.quantity}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.quantity && Boolean(props.errors.quantity)}
                                            helperText={props.touched.quantity && props.errors.quantity}
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ mt: 2, mb: 1 }} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate('/viewassets')}
                                                sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
                                            >
                                                Discard
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
                                                {isDisabled ? "Processing..." : id === "-1" ? "Add to Inventory" : "Update Asset"}
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