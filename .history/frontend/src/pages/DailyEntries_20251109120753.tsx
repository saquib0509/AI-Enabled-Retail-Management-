import React from "react";
import { Box, Container, Tabs, Tab, Paper } from "@mui/material";
import { useState } from "react";
import DailyEntryForm from "../components/DailyEntryForm";
import DailyEntriesList from "../components/DailyEntryList";

const DailyEntry: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshList, setRefreshList] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEntryAdded = () => {
    setRefreshList(!refreshList);
    setActiveTab(1);
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
          {activeTab === 0 && (
            <Box>
              <DailyEntryForm onEntryAdded={handleEntryAdded} />
            </Box>
          )}

          {activeTab === 1 && <DailyEntriesList key={refreshList.toString()} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default DailyEntry;
