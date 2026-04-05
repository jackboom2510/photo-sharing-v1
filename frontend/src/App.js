import "./App.css";

import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserLayout from "./components/UserLayout";

const App = () => {
  return (
    <Router>
      <div className="app-root">
        <TopBar />
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
