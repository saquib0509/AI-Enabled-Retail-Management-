import React, { useState } from "react";
import { Container, Box, Tabs, Tab, Paper } from "@mui/material";
import EmployeeList from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeAttendance from "../components/EmployeeAttendance";
import EmployeeSalary from "../components/EmployeeSalary";

const Employees: React.FC = () => {
  const [value, setValue] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEmployeeSuccess = () => {
    setEditingId(null); // Reset edit mode after saving
    setRefresh(!refresh);
  };

  // Called when Edit button is clicked
  const handleEdit = (employeeId: number) => {
    setEditingId(employeeId);
    setValue(0); // Switch to form tab automatically
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper>
        <Tabs value={value} onChange={handleTabChange} aria-label="employee tabs">
          <Tab label="Employee Details (CRUD)" />
          <Tab label="Attendance" />
          <Tab label="Salary Management" />
        </Tabs>

        {value === 0 && (
          <Box sx={{ p: 3 }}>  
            <Box sx={{ mt: 3 }}>
              <EmployeeList refresh={refresh} onEdit={handleEdit} />
            </Box>
            <EmployeeForm editingId={editingId} onSuccess={handleEmployeeSuccess} />
          </Box>
        )}

        {value === 1 && (
          <Box sx={{ p: 3 }}>
            <EmployeeAttendance />
          </Box>
        )}

        {value === 2 && (
          <Box sx={{ p: 3 }}>
            <EmployeeSalary />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Employees;
