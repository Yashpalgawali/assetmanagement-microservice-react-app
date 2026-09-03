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
import { useEffect, useState } from "react";
import { getAllCompaniesList } from "../../api/CompanyApiClient";
import { useNavigate } from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';

export default function ViewCompanyComponent() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [companyList, setCompanyList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getAllCompaniesList().then((response) => {
            setCompanyList(response.data);
        }).catch((error) => {
            console.log('Error fetching companies', error);
        });
    }, []);

    const filteredCompanies = companyList.filter(comp => 
        comp.comp_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }} className="fade-in">
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
                        Company Directory
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                        Maintain and manage company profiles across the organization
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/company/-1`)}
                    sx={{ 
                        borderRadius: 3, 
                        px: 3, 
                        py: 1.5,
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
                    Add Company
                </Button>
            </Paper>

            {/* Toolbar Section */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search companies by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
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
                <Table sx={{ minWidth: 600 }}>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>Sr</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map((company, index) => (
                                <TableRow 
                                    key={company.comp_id}
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
                                                    bgcolor: theme.palette.secondary.light,
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                <BusinessIcon />
                                            </Avatar>
                                            <Typography variant="subtitle1" fontWeight="medium">
                                                {company.comp_name}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Update Company">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => navigate(`/company/${company.comp_id}`)}
                                                sx={{ 
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } 
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
                                <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                                    <Box sx={{ opacity: 0.5 }}>
                                        <BusinessIcon sx={{ fontSize: 64, mb: 1, color: 'text.disabled' }} />
                                        <Typography variant="h6">No companies found</Typography>
                                        <Typography variant="body2">Try adjusting your search criteria or add a new company</Typography>
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