import {
    Avatar,
    Box,
    Button,
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
import { useNavigate } from "react-router-dom";
import { exportAllEmployees, getAllEmployeesList } from "../../api/EmployeeApiClient";
import { useEffect, useState } from "react";

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function ViewEmployeeComponent() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [empList, setEmpList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getAllEmployeesList().then((response) => {
            setEmpList(response.data);
        }).catch((error) => {
            console.log('Error while fetching Employees List ', error);
        });
    }, []);

    const filteredEmployees = empList.filter(emp =>
        emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.emp_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.dept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.emp_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function downloadAllEmployees() {
        exportAllEmployees().then((response) => {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `All Employees List.xlsx`;
            link.click();
        })
    }
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 4,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: 'white',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Employee Directory
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                        Manage and track your company's talent effortlessly
                    </Typography>
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/employee/-1`)}
                        sx={{
                            borderRadius: '12px',
                            px: 3,
                            py: 1.2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
                            },
                            transition: 'all 0.3s'
                        }}
                    >
                        Add Employee
                    </Button>
                    <Button
                        color="warning"
                        variant="contained"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => downloadAllEmployees()}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            px: 3,
                            py: 1.2,
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
                </Stack>
            </Paper>

            {/* toolbar Section */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email, department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    slotProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3, bgcolor: 'background.paper' }
                    }}
                />
            </Stack>

            {/* Table Section */}
            <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: theme.shadows[4] }}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Designation</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <TableRow
                                    key={emp.emp_id}
                                    sx={{
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                sx={{
                                                    bgcolor: theme.palette.primary.light,
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                {emp.emp_name.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {emp.emp_name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {emp.emp_email}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{emp.emp_contact}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{emp.designation.desig_name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                                            {emp.department.dept_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">{emp.department.company.comp_name}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Edit Employee">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => navigate(`/employee/${emp.emp_id}`)}
                                                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View Assets">
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => navigate(`/viewassignedassets/${emp.emp_id}`)}
                                                    sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) } }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                    <Box sx={{ opacity: 0.5 }}>
                                        <PersonIcon sx={{ fontSize: 64, mb: 1, color: 'text.disabled' }} />
                                        <Typography variant="h6">No employees found</Typography>
                                        <Typography variant="body2">Try adjusting your search criteria</Typography>
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