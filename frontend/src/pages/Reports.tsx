import { useState, FC } from 'react';

import { Box, Tabs, Tab, Typography, LinearProgress } from '@mui/material';

import DailySalesReport from '../components/Reports/DailySalesReport';
import MonthlyPerformanceReport from '../components/Reports/MonthlyPerformanceReport';
import StockMovementReport from '../components/Reports/StockMovementReport';
import PriceTrendReport from '../components/Reports/PriceTrendReport';
import RevenueVsExpenseReport from '../components/Reports/RevenueVsExpenseReport';
import EmployeeAttendanceReport from '../components/Reports/EmployeeAttendanceReport';
import PayrollReport from '../components/Reports/PayrollReport';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Reports: FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 3 }}>
        AI-Powered Reports & Analytics
      </Typography>

      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Daily Sales" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Monthly Performance" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="Stock Movement" id="tab-2" aria-controls="tabpanel-2" />
        <Tab label="Price Trend" id="tab-3" aria-controls="tabpanel-3" />
        <Tab label="Revenue vs Expense" id="tab-4" aria-controls="tabpanel-4" />
        <Tab label="Employee Attendance" id="tab-5" aria-controls="tabpanel-5" />
        <Tab label="Payroll" id="tab-6" aria-controls="tabpanel-6" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <DailySalesReport />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <MonthlyPerformanceReport />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <StockMovementReport />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <PriceTrendReport />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <RevenueVsExpenseReport />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <EmployeeAttendanceReport />
      </TabPanel>
      <TabPanel value={tabValue} index={6}>
        <PayrollReport />
      </TabPanel>
    </Box>
  );
};

export default Reports;
