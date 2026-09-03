import {
    Avatar,
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment,
    Stack,
    IconButton,
    Tooltip,
    alpha,
    useTheme,
    Chip,
    Button
} from "@mui/material";
import { useEffect, useState } from "react";
import { exportAllAssignedAssets, getAllAssignedAssets } from "../../api/EmployeeApiClient";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from '@mui/icons-material/History';
import FilterListIcon from '@mui/icons-material/FilterList';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ViewAsssignedAssetsComponent() {
    const [assignedAssetsList, setAssignedAssetsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        getAllAssignedAssets().then((response) => {
            console.log(response.data)
            setAssignedAssetsList(response.data);
        });
    }, []);

    const filteredAssets = assignedAssetsList.filter(asset =>
        asset.employee.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assigned_types.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function downloadAssignedAssets() {
        exportAllAssignedAssets().then((response) => {
            console.log(response.data)
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Assigned Assets List.xlsx`;
            link.click();
        })
    }
    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header Section */}
            <Card
                elevation={0}
                sx={{
                    mb: 4,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(37, 99, 235, 0.2)'
                }}
            >
                <Box sx={{ p: 4, position: 'relative' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                        <Box>
                            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ letterSpacing: -0.5 }}>
                                Assignment History
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Tracking {assignedAssetsList.length} total asset assignments across the organization.
                            </Typography>
                            <Button
                                startIcon={<CloudDownloadIcon />}
                                onClick={() => downloadAssignedAssets()}
                                sx={{ 
                                    mt: 2,
                                    borderRadius: '12px', 
                                    textTransform: 'none', 
                                    fontWeight: 'bold',
                                    fontSize: '0.95rem',
                                    px: 3,
                                    py: 1,
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '50%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                        transition: 'left 0.7s ease',
                                        transform: 'skewX(-20deg)',
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.4)',
                                        '&::before': {
                                            left: '150%',
                                        }
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    }
                                }}
                            >
                                Export Excel
                            </Button>
                        </Box>
                        <Avatar
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                width: 64,
                                height: 64,
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <HistoryIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                    </Stack>
                </Box>
            </Card>

            {/* Table Section */}
            <Paper
                elevation={0}
                data-aos="fade-up"
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
            >
                {/* Toolbar */}
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: alpha(theme.palette.divider, 0.05) }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Search by employee, asset name..."
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            slotProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3, bgcolor: alpha(theme.palette.action.focus, 0.02) }
                            }}
                        />
                        <Tooltip title="Filter">
                            <IconButton sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <FilterListIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Asset Category</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Asset Details</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Assignment Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAssets.length > 0 ? (
                                filteredAssets.map((asset, index) => (
                                    <TableRow
                                        key={asset.asset_id}
                                        hover
                                        sx={{
                                            transition: '0.2s',
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        fontSize: '0.8rem',
                                                        bgcolor: theme.palette.primary.light
                                                    }}
                                                >
                                                    {asset.employee.emp_name.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="600">
                                                    {asset.employee.emp_name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={asset.assigned_types}
                                                size="small"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    color: theme.palette.primary.main
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">{asset.assigned}</Typography>
                                                <Typography variant="caption" color="text.secondary">SN: {asset.model_numbers}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2">{asset.assign_date}</Typography>
                                                <Typography variant="caption" color="text.secondary">{asset.assign_time}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View Employee Profile">

                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => navigate(`/viewassignedassets/${asset.emp_id}`)}
                                                >

                                                    <OpenInNewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Typography color="text.secondary">No assignments found matching your criteria.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
