import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Avatar,
  Stack,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
  LinearProgress
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { BarChart, PieChart } from "@mui/x-charts";
import { getAllAssets, getAllAssetsCount } from "../api/AssetApiClient";
import { getAllAssignedAssets, getAllEmployeesList } from "../api/EmployeeApiClient";
import AOS from "aos";
import "aos/dist/aos.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const theme = useTheme();
  const [assetCount, setAssetCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [assignedAssetsCount, setAssignedAssetsCount] = useState(0);
  const [assetCategoryData, setAssetCategoryData] = useState([]);

  const navigate = useNavigate()

  // Mock data for trend and activity
  const assetUsageData = [
    { month: "Jan", assets: 45, value: 3000 },
    { month: "Feb", assets: 52, value: 4500 },
    { month: "Mar", assets: 38, value: 2800 },
    { month: "Apr", assets: 65, value: 7200 },
    { month: "May", assets: 48, value: 5100 },
    { month: "Jun", assets: 75, value: 8900 },
  ];

  const recentActivity = [
    { id: 1, name: "Dell Latitude 5420", type: "Laptop", user: "John Doe", date: "2 hours ago", status: "Assigned" },
    { id: 2, name: "Logitech MX Master", type: "Peripherals", user: "Jane Smith", date: "5 hours ago", status: "In Repair" },
    { id: 3, name: "Samsung 27\" Monitor", type: "Display", user: "Michael Ross", date: "1 day ago", status: "Assigned" },
    { id: 4, name: "MacBook Pro M1", type: "Laptop", user: "Harvey Specter", date: "2 days ago", status: "Available" },
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    // Fetch actual data
    getAllEmployeesList().then(res => setEmployeeCount(res.data.length));
    getAllAssetsCount().then(res => setAssetCount(res.data));
    getAllAssignedAssets().then(res => setAssignedAssetsCount(res.data.length));
    
    getAllAssets().then((response) => {
      const formattedData = response.data.slice(0, 5).map((item, index) => ({
        id: index,
        value: Number(item.quantity) || 1,
        label: item.atype.type_name
      }));
      setAssetCategoryData(formattedData.length > 0 ? formattedData : [
        { id: 0, value: 10, label: "Laptops" },
        { id: 1, value: 15, label: "Monitors" },
        { id: 2, value: 5, label: "Printers" }
      ]);
    });
  }, []);

  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <Card 
      elevation={0} 
      data-aos="zoom-in"
      sx={{ 
        borderRadius: 4, 
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 12px 24px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.3)
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Avatar 
            sx={{ 
              bgcolor: alpha(color, 0.1), 
              color: color,
              width: 56,
              height: 56,
              borderRadius: 3
            }}
          >
            {icon}
          </Avatar>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5 }}>
          {value}
        </Typography>
        <Typography color="text.secondary" variant="body2" fontWeight="600" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {trend === 'up' ? <TrendingUpIcon sx={{ color: '#10b981', fontSize: 18 }} /> : <TrendingDownIcon sx={{ color: '#ef4444', fontSize: 18 }} />}
          <Typography variant="caption" fontWeight="bold" sx={{ color: trend === 'up' ? '#10b981' : '#ef4444' }}>
            {trendValue}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vs last month
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ pb: 4 }}>
      {/* Welcome Banner */}
      <Paper 
        elevation={0}
        data-aos="fade-down"
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 5, 
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ letterSpacing: -1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: 600, fontWeight: 'medium' }}>
            Track, manage and optimize your organizational assets in real-time. Everything is under control.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: 'white', 
                color: theme.palette.primary.main,
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 'bold',
                '&:hover': { bgcolor: alpha('#fff', 0.9) }
              }}
              startIcon={<AssignmentTurnedInIcon />}
              onClick={() => navigate(`/asset/-1`)}
            >
              Add New Asset
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: 'rgba(255,255,255,0.3)', 
                color: 'white',
                px: 3,
                borderRadius: 2,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              View Reports
            </Button>
          </Stack>
        </Box>
        {/* Decorative Circles */}
        <Box sx={{ position: 'absolute', right: -50, top: -50, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', right: 50, bottom: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
      </Paper>

      {/* KPI Section */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Inventory"
            value={assetCount}
            icon={<InventoryIcon sx={{ fontSize: 32 }} />}
            color={theme.palette.primary.main}
            trend="up"
            trendValue="+12.5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assets In Use"
            value={assignedAssetsCount}
            icon={<ComputerIcon sx={{ fontSize: 32 }} />}
            color="#10b981"
            trend="up"
            trendValue="+8.2%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Workforce"
            value={employeeCount}
            icon={<PersonIcon sx={{ fontSize: 32 }} />}
            color="#f59e0b"
            trend="up"
            trendValue="+3.1%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estimated Value"
            value="$428.5K"
            icon={<AttachMoneyIcon sx={{ fontSize: 32 }} />}
            color="#8b5cf6"
            trend="down"
            trendValue="-1.4%"
          />
        </Grid>
      </Grid>

      {/* Charts & Activity Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0}
            data-aos="fade-right"
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: alpha(theme.palette.divider, 0.08),
              height: '100%'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Asset Allocation Trend</Typography>
                <Typography variant="caption" color="text.secondary">Monthly overview of asset distribution</Typography>
              </Box>
              <Button size="small" endIcon={<ArrowForwardIcon />}>Details</Button>
            </Stack>
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                xAxis={[{ scaleType: "band", data: assetUsageData.map(d => d.month) }]}
                series={[
                  { data: assetUsageData.map(d => d.assets), label: 'Inventory', color: theme.palette.primary.main },
                  { data: assetUsageData.map(d => d.value / 100), label: 'Value ($K)', color: alpha(theme.palette.primary.main, 0.4) }
                ]}
                height={320}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={0}
            data-aos="fade-left"
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: alpha(theme.palette.divider, 0.08),
              height: '100%'
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={1}>Category Breakdown</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={3}>Distribution by asset type</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart
                series={[{
                  data: assetCategoryData,
                  innerRadius: 80,
                  outerRadius: 120,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  cx: 140
                }]}
                width={300}
                height={300}
                legend={{ hidden: true }}
              />
            </Box>
            <Stack spacing={2} mt={2}>
              {assetCategoryData.slice(0, 3).map((item, idx) => (
                <Box key={idx}>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight="medium">{item.label}</Typography>
                    <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.value} 
                    sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1) }} 
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            elevation={0}
            data-aos="fade-up"
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: alpha(theme.palette.divider, 0.08)
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Recent Transactions</Typography>
                <Typography variant="caption" color="text.secondary">Latest asset assignments and updates</Typography>
              </Box>
              <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>View All History</Button>
            </Stack>
            <TableContainer sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Asset Details</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Transaction Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((row) => (
                    <TableRow key={row.id} hover sx={{ transition: '0.2s' }}>
                      <TableCell sx={{ fontWeight: '600' }}>{row.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ bgcolor: alpha(theme.palette.action.focus, 0.5), px: 1.5, py: 0.5, borderRadius: 2, display: 'inline-block' }}>
                          {row.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>{row.user.charAt(0)}</Avatar>
                          <Typography variant="body2">{row.user}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell color="text.secondary">{row.date}</TableCell>
                      <TableCell>
                        <Typography 
                          variant="caption" 
                          fontWeight="bold"
                          sx={{ 
                            color: row.status === 'Assigned' ? '#10b981' : row.status === 'Available' ? theme.palette.primary.main : '#f59e0b',
                            bgcolor: alpha(row.status === 'Assigned' ? '#10b981' : row.status === 'Available' ? theme.palette.primary.main : '#f59e0b', 0.1),
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 10
                          }}
                        >
                          {row.status}
                        </Typography>
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

function TableContainer({ children, sx }) {
  return <Box sx={{ width: '100%', overflowX: 'auto', ...sx }}>{children}</Box>;
}