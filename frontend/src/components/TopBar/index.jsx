import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import { api } from "../../lib/fetchModelData";

import "./styles.css";

function TopBar() {
  const location = useLocation();
  const match = location.pathname.match(/\/(users|photos)\/(.+)/);
  const userId = match ? match[2] : null;
  const [user, setUser] = useState(null);
  const isPhotos = location.pathname.startsWith("/photos");

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }
    let cancelled = false;
    api
      .user(userId)
      .then((data) => {
        if (!cancelled) setUser(data || null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const subtitle = user
    ? `${isPhotos ? "Photos of " : ""}${user.first_name} ${user.last_name}`
    : "";

  return (
    <AppBar position="fixed" elevation={2} className="topbar-app-bar">
      <Toolbar disableGutters className="topbar-toolbar">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 0.25, sm: 2 }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          className="topbar-stack"
        >
          <Typography variant="h6" component="div" className="topbar-title">
            Photo Sharing App
          </Typography>
          {subtitle ? (
            <Typography variant="subtitle1" component="div" className="topbar-subtitle">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
