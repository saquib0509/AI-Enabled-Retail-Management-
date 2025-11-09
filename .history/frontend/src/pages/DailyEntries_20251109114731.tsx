import React from "react";
import { Box, Container, Tabs, Tab, Paper } from "@mui/material";
import { useState } from "react";
import DailyEntryForm from "../components/DailyEntryForm";
import DailyEntriesList from "../components/DailyEntriesList";

const DailyEntry: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshList, setRefreshList] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEntryAdded = () => {
    setRefreshList(!refreshList);
    setActiveTab(1); // Switch to list tab after adding
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: "1px solid #e0e0e0",
            background: "#f5f5f5",
          }}
        >
          <Tab label="Add New Entry" />
          <Tab label="View Entries" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Form Tab */}
          {activeTab === 0 && (
            <Box>
              <DailyEntryForm onEntryAdded={handleEntryAdded} />
            </Box>
          )}

          {/* List Tab */}
          {activeTab === 1 && <DailyEntriesList key={refreshList.toString()} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default DailyEntry;
