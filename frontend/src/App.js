import './App.css';

import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserLayout from './components/UserLayout';

const App = (props) => {
  return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route path="/" element={<Box sx={{ height: "100%" }} />} />
                  <Route path="/users/:userId" element={<UserLayout />}>
                    <Route index element={<UserDetail />} />
                  </Route>
                  <Route path="/photos/:userId" element={<UserLayout />}>
                    <Route index element={<UserPhotos />} />
                  </Route>
                  <Route path="/users" element={<UserList />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
