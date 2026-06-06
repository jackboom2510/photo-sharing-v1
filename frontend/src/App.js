import "./App.css";

import React, { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import LoginRegister from "./components/LoginRegister";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserLayout from "./components/UserLayout";
import { api } from "./lib/fetchModelData";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await api.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <LoginRegister onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="app-root">
        <TopBar currentUser={currentUser} onLogout={handleLogout} />
        <Grid
          container
          columnSpacing={{ xs: 0, md: 2 }}
          rowSpacing={{ xs: 1, md: 2 }}
          className="app-grid-container"
        >
          <Grid item xs={12} md={3} className="app-grid-item--stretch">
            <Paper className="main-grid-item app-sidebar-paper" elevation={2}>
              <UserList />
            </Paper>
          </Grid>
          <Grid item xs={12} md={9} className="app-grid-item--stretch">
            <Box className="main-grid-item app-main-surface">
              <Routes>
                <Route path="/" element={<Box className="app-route-placeholder" />} />
                <Route path="/users/:userId" element={<UserLayout />}>
                  <Route index element={<UserDetail />} />
                </Route>
                <Route path="/photos/:userId" element={<UserLayout />}>
                    <Route index element={<UserPhotos />} />
                    <Route path=":photoIndex" element={<UserPhotos />} />
                </Route>
                <Route path="/users" element={<UserList />} />
              </Routes>
            </Box>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
