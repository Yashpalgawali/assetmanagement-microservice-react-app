import { 
    Avatar, 
    Box, 
    Button, 
    Chip,
    IconButton, 
    InputAdornment, 
    Paper, 
    Stack, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField, 
    Tooltip, 
    Typography,
    useTheme,
    alpha
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssets } from "../../api/AssetApiClient";

import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DevicesIcon from '@mui/icons-material/Devices';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function ViewAssetsComponent() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [assetList, setAssetList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getAllAssets().then((response) => {
            setAssetList(response.data);
        }).catch((error) => {
            console.log('Error fetching assets', error);
        });
    }, []);

    const filteredAssets = assetList.filter(asset => 
        asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.atype && asset.atype.type_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }} className="fade-in">
            {/* Header Section */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    mb: 4, 
                    borderRadius: 4, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: 'white',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }}
            >
                <Box>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <InventoryIcon sx={{ fontSize: 32 }} />
                        <Typography variant="h4" fontWeight="bold">
                            Asset Inventory
                        </Typography>
                    </Stack>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        Track and manage all hardware and software assets across the organization
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/asset/-1`)}
                    sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                            bgcolor: theme.palette.secondary.dark
                        },
                        transition: 'all 0.3s'
                    }}
                >
                    Add New Asset
                </Button>
            </Paper>

            {/* Toolbar Section */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, model, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { 
                            borderRadius: 3, 
                            bgcolor: 'background.paper',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }
                    }}
                />
            </Stack>

            {/* Table Section */}
            <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: theme.shadows[10] }}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '70px' }}>Sr</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Asset Details</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Model Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAssets.length > 0 ? (
                            filteredAssets.map((asset, index) => (
                                <TableRow 
                                    key={asset.asset_id}
                                    sx={{ 
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: theme.palette.background.default,
                                                    color: theme.palette.primary.main,
                                                    width: 44,
                                                    height: 44,
                                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                                }}
                                            >
                                                <DevicesIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {asset.asset_name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {asset.asset_id}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={asset.atype?.type_name || 'Unassigned'} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                fontWeight: 'medium',
                                                borderRadius: 2
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: alpha(theme.palette.grey[500], 0.1), px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                                            {asset.model_number}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold" color={asset.quantity < 5 ? 'error' : 'success.main'}>
                                            {asset.quantity} units
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit Asset">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => navigate(`/asset/${asset.asset_id}`)}
                                                sx={{ 
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2), transform: 'scale(1.1)' },
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                                    <Box sx={{ opacity: 0.5 }}>
                                        <InventoryIcon sx={{ fontSize: 80, mb: 2, color: 'text.disabled' }} />
                                        <Typography variant="h5" fontWeight="medium">Inventory is empty</Typography>
                                        <Typography variant="body1">No assets found matching your search. Add some to get started!</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}