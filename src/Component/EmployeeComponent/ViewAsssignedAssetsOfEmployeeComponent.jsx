import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    IconButton,
    alpha,
    useTheme,
    Button,
    Divider,
    Chip
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { exportAllAssignedAssetsByEmployeeId, getAllAssignedAssetsByEmpId } from "../../api/EmployeeApiClient";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BadgeIcon from '@mui/icons-material/Badge';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import AOS from "aos";
import "aos/dist/aos.css";

export default function ViewAsssignedAssetsOfEmployeeComponent() {
    const [assignedAssetsList, setAssignedAssetsList] = useState([]);
    const [employee, setEmployee] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        getAllAssignedAssetsByEmpId(id).then((response) => {
            if (response.data && response.data.length > 0) {
                setAssignedAssetsList(response.data);
                setEmployee(response.data[0].employee);
            }
        });
    }, [id]);

    if (!employee) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">No records found for this employee.</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/viewemployees')} sx={{ mt: 2 }}>
                    Go Back to Employees
                </Button>
            </Box>
        );
    }

    function downloadAssignedAssetsByEmpId(id) {
        exportAllAssignedAssetsByEmployeeId(id).then((response) => {
            console.log(response.data)
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Assigned Assets List - ${employee.emp_name}.xlsx`;
            link.click();
        })
    }
    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Navigation & Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                        onClick={() => navigate('/viewemployees')}
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" fontWeight="800">Assignee Profile</Typography>
                        <Typography variant="body2" color="text.secondary">Detailed view of assets assigned to this employee</Typography>
                    </Box>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<CloudDownloadIcon />}
                    onClick={() => downloadAssignedAssetsByEmpId(id)}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        px: 3,
                        py: 1.2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white',
                        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
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
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            transition: 'left 0.7s ease',
                            transform: 'skewX(-20deg)',
                        },
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.6)}`,
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
            </Stack>

            <Grid container spacing={4}>
                {/* Employee Profile Card */}
                <Grid item xs={12} lg={4}>
                    <Card
                        data-aos="fade-right"
                        sx={{
                            borderRadius: 5,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                            boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
                            overflow: 'hidden',
                            position: 'sticky',
                            top: 100
                        }}
                    >
                        <Box sx={{ height: 100, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` }} />
                        <CardContent sx={{ pt: 0, px: 3, pb: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -6 }}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        border: '4px solid white',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        bgcolor: theme.palette.primary.main,
                                        fontSize: '2rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {employee.emp_name.charAt(0)}
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                                    {employee.emp_name}
                                </Typography>
                                <Chip
                                    label={employee.designation.desig_name}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ mt: 1, fontWeight: 'bold' }}
                                />
                            </Box>

                            <Stack spacing={2.5} sx={{ mt: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, width: 36, height: 36 }}>
                                        <EmailIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Email Address</Typography>
                                        <Typography variant="body2" fontWeight="600">{employee.emp_email}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, width: 36, height: 36 }}>
                                        <CorporateFareIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Department</Typography>
                                        <Typography variant="body2" fontWeight="600">{employee.department.dept_name}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, width: 36, height: 36 }}>
                                        <BusinessIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Company</Typography>
                                        <Typography variant="body2" fontWeight="600">{employee.department.company.comp_name}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, width: 36, height: 36 }}>
                                        <BadgeIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                                        <Typography variant="body2" fontWeight="600">EMP-00{employee.id}</Typography>
                                    </Box>
                                </Box>
                            </Stack>
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ textAlign: 'center', pb: 2 }}>
                                <Typography variant="h4" fontWeight="800" color="primary">{assignedAssetsList.length}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Assets Assigned</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Asset List Section */}
                <Grid item xs={12} lg={8}>
                    <Paper
                        data-aos="fade-left"
                        sx={{
                            borderRadius: 5,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                        }}
                    >
                        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: alpha(theme.palette.divider, 0.05), bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Inventory2Icon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Assigned Hardware & Software</Typography>
                            </Stack>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Asset Category</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Item Details</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Allocation Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignedAssetsList.map((asset, index) => (
                                        <TableRow key={asset.asset_id} hover sx={{ transition: '0.2s' }}>
                                            <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={asset.asset.atype.type_name}
                                                    size="small"
                                                    variant="soft"
                                                    color="primary"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">{asset.asset.asset_name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Model: {asset.asset.model_number}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2">{asset.assign_date}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{asset.assign_time}</Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
