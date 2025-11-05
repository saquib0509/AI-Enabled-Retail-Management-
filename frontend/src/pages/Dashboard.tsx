import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid, Card, CardContent, Typography, Box, Avatar, Stack, Paper, Button, Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BoltIcon from '@mui/icons-material/Bolt';
import ConstructionIcon from '@mui/icons-material/Construction';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PieChartIcon from '@mui/icons-material/PieChart';
import GroupIcon from '@mui/icons-material/Group';

const stats = [
  { name: 'Total Sales', value: '₹1,25,000', change: '+12%', changeType: 'positive', icon: <CurrencyRupeeIcon /> },
  { name: 'Total Volume (Liters)', value: '5,250', change: '+5.4%', changeType: 'positive', icon: <LocalOfferIcon /> },
  { name: 'Avg. Price/Liter', value: '₹23.81', change: '-2.3%', changeType: 'negative', icon: <HomeIcon /> },
  { name: 'Total Customers', value: '1,234', change: '+8.1%', changeType: 'positive', icon: <PeopleIcon /> }
];

const recentActivity = [
  { id: 1, type: 'sale', amount: '₹5,000', product: 'Petrol', time: '2 minutes ago' },
  { id: 2, type: 'sale', amount: '₹3,500', product: 'Diesel', time: '15 minutes ago' },
  { id: 3, type: 'refill', amount: '10,000L', product: 'Petrol', time: '1 hour ago' },
  { id: 4, type: 'sale', amount: '₹4,200', product: 'CNG', time: '2 hours ago' },
  { id: 5, type: 'maintenance', amount: 'Oil Change', product: 'Pump #2', time: '5 hours ago' },
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  return (
    <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto', mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} color="primary.main">
          Dashboard
        </Typography>
        <Stack direction="row" spacing={1}>
          {['today', 'week', 'month', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'contained' : 'outlined'}
              color={selectedPeriod === period ? 'primary' : 'inherit'}
              size="small"
              onClick={() => setSelectedPeriod(period)}
              sx={{ textTransform: 'capitalize', borderRadius: 2, fontWeight: 600 }}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </Stack>
      </Stack>
      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.name}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, boxShadow: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box flex={1}>
                    <Typography fontSize={15} fontWeight={700} color="text.secondary">
                      {stat.name}
                    </Typography>
                    <Typography fontSize={22} fontWeight={700} color="text.primary">
                      {stat.value}
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" sx={{ mt: 2 }} color={stat.changeType === 'positive' ? 'success.main' : 'error.main'}>
                  <b>{stat.change}</b> from last {selectedPeriod}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 0, o: 0, borderRadius: 3 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography fontWeight={700} fontSize={20} color="primary">Recent Activity</Typography>
            </Box>
            <Box>
              {recentActivity.map((activity, idx) => (
                <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: idx !== recentActivity.length-1 ? '1px solid' : '', borderColor: 'divider' }}>
                  <Avatar sx={{ bgcolor: activity.type === 'sale' ? 'primary.main' : activity.type === 'refill' ? 'success.main' : 'warning.main', width: 34, height: 34, mr: 2 }}>
                    {activity.type === 'sale' ? <ShoppingCartIcon /> : activity.type === 'refill' ? <BoltIcon /> : <ConstructionIcon />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} noWrap fontSize={15} color="primary.main">
                      {activity.type === 'sale' 
                        ? `Sale: ${activity.amount} (${activity.product})`
                        : activity.type === 'refill'
                          ? `Tank Refill: ${activity.amount} ${activity.product}`
                          : `Maintenance: ${activity.amount} on ${activity.product}`}
                    </Typography>
                    <Typography fontSize={13} color="text.secondary">{activity.time}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ px: 2, py: 2, bgcolor: 'background.default', borderRadius: 3 }}>
              <Button component={Link} to="/entries" size="small" sx={{ fontWeight: 700 }} color="primary">
                View all activity →
              </Button>
            </Box>
          </Paper>
        </Grid>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography fontWeight={700} fontSize={20} color="primary">Quick Actions</Typography>
            </Box>
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} sm={6}>
                <Button component={Link} to="/entries/new" variant="outlined" color="success" fullWidth sx={{height:90,borderRadius:2,justifyContent:'flex-start',textAlign:'left',p:2}} startIcon={<AddCircleIcon fontSize="large" />}>
                  <Typography fontWeight={700}>New Entry</Typography>
                  <Typography fontSize={13} color="text.secondary">Record a new sale or delivery</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button component={Link} to="/inventory" variant="outlined" color="info" fullWidth sx={{height:90,borderRadius:2,justifyContent:'flex-start',textAlign:'left',p:2}} startIcon={<Inventory2Icon fontSize="large" />}>
                  <Typography fontWeight={700}>Inventory</Typography>
                  <Typography fontSize={13} color="text.secondary">View and manage stock</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button component={Link} to="/reports" variant="outlined" color="secondary" fullWidth sx={{height:90,borderRadius:2,justifyContent:'flex-start',textAlign:'left',p:2}} startIcon={<PieChartIcon fontSize="large" />}>
                  <Typography fontWeight={700}>Reports</Typography>
                  <Typography fontSize={13} color="text.secondary">Generate sales reports</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button component={Link} to="/customers" variant="outlined" color="warning" fullWidth sx={{height:90,borderRadius:2,justifyContent:'flex-start',textAlign:'left',p:2}} startIcon={<GroupIcon fontSize="large" />}>
                  <Typography fontWeight={700}>Customers</Typography>
                  <Typography fontSize={13} color="text.secondary">Manage customer data</Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
