import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
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

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Photo Sharing App</Typography>
        <Typography variant="h6">
          {user ? `${isPhotos ? "Photos of " : ""}${user.first_name} ${user.last_name}` : ""}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
