import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

const Employees: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleEditEmployee = (id: number) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSuccess = () => {
    setEditingId(null);
    setRefreshList(!refreshList);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>

        <EmployeeList
          refresh={refreshList}
          onEdit={(emp) => handleEditEmployee(emp.id)}
        />
        <EmployeeForm
          editingId={editingId}
          onSuccess={handleFormSuccess}
        />
        
      </Box>
    </Container>
  );
};

export default Employees;
