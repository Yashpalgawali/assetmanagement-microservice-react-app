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
import { toast } from "react-toastify";
import { getAssetType, updateAssetType, saveAssetType as saveAssetTypeApi } from "../../api/AssetTypeApiClient";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import SaveIcon from '@mui/icons-material/Save';

export default function AssetTypeComponent() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [type_name, setTypeName] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState("Add New Asset Category");

    useEffect(() => {
        if (id && id !== "-1") {
            setTitle("Update Asset Category");
            getAssetType(id).then((response) => {
                setTypeName(response.data.type_name);
            }).catch((error) => {
                toast.error('Error: Could not retrieve asset category details.');
            });
        } else {
            setTitle("Add New Asset Category");
            setTypeName('');
        }
    }, [id]);

    function handleSubmit(values, { resetForm }) {
        setIsDisabled(true);
        const assetTypeObject = {
            type_id: id,
            type_name: values.type_name
        };

        const apiCall = id === "-1" 
            ? saveAssetTypeApi(assetTypeObject) 
            : updateAssetType(assetTypeObject);

        apiCall.then((response) => {
            toast.success(id === "-1" ? "Asset category successfully registered!" : "Asset category details have been updated.");
            setIsDisabled(false);
            if (id === "-1") resetForm();
            navigate('/viewassettypes');
        }).catch((error) => {
            toast.error(error.response?.data?.errorMessage || "An unexpected error occurred while saving the asset category.");
            setIsDisabled(false);
        });
    }

    function validate(values) {
        let errors = {};
        if (!values.type_name) {
            errors.type_name = 'Please enter Asset Category name';
        } else if (values.type_name.length < 2) {
            errors.type_name = 'Name must be at least 2 characters';
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
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        color: 'white',
                        borderRadius: '16px 16px 0 0',
                        position: 'relative'
                    }}
                >
                    <IconButton 
                        onClick={() => navigate('/viewassettypes')} 
                        sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <CategoryIcon sx={{ fontSize: 32 }} />
                        <Typography variant="h5" fontWeight="bold">
                            {title}
                        </Typography>
                    </Stack>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Formik
                        initialValues={{ type_name }}
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                        validate={validate}
                    >
                        {(props) => (
                            <Form>
                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            Classification Details
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="type_name"
                                            name="type_name"
                                            label="Asset Type / Category"
                                            placeholder="e.g. Laptop, Mobile, Furniture"
                                            value={props.values.type_name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.type_name && Boolean(props.errors.type_name)}
                                            helperText={props.touched.type_name && props.errors.type_name}
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
                                            onClick={() => navigate('/viewassettypes')}
                                            sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="success"
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
                                            {isDisabled ? "Saving..." : id === "-1" ? "Create Category" : "Save Changes"}
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
