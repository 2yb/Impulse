import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import Login from "./Login";
import axios from "axios";

const PageLayout = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    documentName: "",
    documentDate: "",
    dpName: "",
  });
  const [apiResults, setApiResults] = useState(null);
  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type");

      if (!token) {
        setError("Please login first");
        return;
      }

      const response = await axios.post(
        "https://tendergenricapi-hvfmegbnf4d9e0gb.centralindia-01.azurewebsites.net/dp_extract",
        formData,
        {
          headers: {
            Authorization: `${tokenType} ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setApiResults(response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("API call failed:", error);
      setError(error.response?.data?.message || "Failed to process request");
    }
  };

  const renderResponseTable = () => {
    if (!apiResults) return null;

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Field</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(apiResults).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{value?.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* Left Section - Login */}
      <Box
        sx={{
          width: "30%",
          height: "100vh",
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <Login />
      </Box>

      {/* Right Section - Tabs */}
      <Box sx={{ width: "70%", p: 3 }}>
        <Card sx={{ height: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="Tab 1" />
              <Tab label="Tab 2" />
            </Tabs>
          </Box>

          {/* Tab 1 Content */}
          <Box role="tabpanel" hidden={tabValue !== 0} sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {!isSubmitted ? (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ "& > *": { mb: 2 } }}
              >
                <TextField
                  fullWidth
                  label="Document Name"
                  placeholder="Enter document name"
                  value={formData.documentName}
                  onChange={(e) =>
                    setFormData({ ...formData, documentName: e.target.value })
                  }
                  sx={{ mb: "30px" }}
                />
                <TextField
                  fullWidth
                  label="Document Date"
                  type="date"
                  value={formData.documentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, documentDate: e.target.value })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ mb: "30px" }}
                />
                <TextField
                  fullWidth
                  label="DP Name"
                  placeholder="Enter DP name"
                  value={formData.dpName}
                  onChange={(e) =>
                    setFormData({ ...formData, dpName: e.target.value })
                  }
                  sx={{ mb: "30px" }}
                />
                <Button type="submit" variant="contained" fullWidth>
                  Submit
                </Button>
              </Box>
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Response Details
                </Typography>
                {renderResponseTable()}
                <Button
                  variant="contained"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      documentName: "",
                      documentDate: "",
                      dpName: "",
                    });
                    setApiResults(null);
                    setError("");
                  }}
                  sx={{ mt: 2 }}
                >
                  Make Another Request
                </Button>
              </Box>
            )}
          </Box>

          {/* Tab 2 Content */}
          <Box
            role="tabpanel"
            hidden={tabValue !== 1}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              Tab 2 Content Will Be Added Later
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default PageLayout;
