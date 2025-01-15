import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Configure axios with proper headers
      const response = await axios({
        method: "post",
        url: "https://tendergenricapi-hvfmegbnf4d9e0gb.centralindia-01.azurewebsites.net/login",
        data: {
          username,
          password,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: false, // Disable sending credentials
      });

      const { access_token, token_type } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("token_type", token_type);

      // Clear form and show success
      setUsername("");
      setPassword("");
      setError("");
    } catch (err) {
      console.error("Login Failed:", err);
      if (err.response?.status === 405) {
        setError("Server error: Method not allowed. Please try again later.");
      } else if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        p: 4,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 500,
          color: "text.primary",
        }}
      >
        Login
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            size="medium"
            sx={{ bgcolor: "background.paper", mt: "3px" }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            size="medium"
            sx={{ bgcolor: "background.paper", mt: "3px" }}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              position: "relative",
            }}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    left: "50%",
                    marginLeft: "-12px",
                    color: "white",
                  }}
                />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LoginPage;
