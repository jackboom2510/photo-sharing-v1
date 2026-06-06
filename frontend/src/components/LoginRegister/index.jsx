import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { api } from "../../lib/fetchModelData";
import "./styles.css";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function LoginRegister({ onLoginSuccess }) {
  const [tabValue, setTabValue] = useState(0);
  const [loginName, setLoginName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!loginName.trim()) {
        setError("Please enter a login name");
        setLoading(false);
        return;
      }

      const user = await api.login(loginName);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.body?.error || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="login-register-container">
      <Paper elevation={3} className="login-register-paper">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Register" disabled />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
            Photo Sharing App
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Login Name"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              margin="normal"
              placeholder="Enter your login name"
              disabled={loading}
              autoFocus
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "gray" }}>
            Try: imalcolm, eripley, ptook, rkenobi, aludgate, or jousterhout
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
            Registration coming soon...
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default LoginRegister;
