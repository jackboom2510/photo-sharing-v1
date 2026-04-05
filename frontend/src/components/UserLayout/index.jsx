import { Link, Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Link as MuiLink,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { api } from "../../lib/fetchModelData";

import "./styles.css";

export default function UserLayout() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .user(userId)
      .then((data) => {
        if (!cancelled) setUser(data || null);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) {
    return (
      <Box className="user-layout-message">
        <Typography variant="h5">Thiếu user ID</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="user-layout-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box className="user-layout-message">
        <Typography variant="h5" gutterBottom>
          User not found
        </Typography>
        {error && (
          <Typography color="text.secondary" variant="body2">
            {error.message}
          </Typography>
        )}
      </Box>
    );
  }

  const isPhotosView = location.pathname.includes("/photos/");
  const currentMode = isPhotosView ? "photos" : "details";

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    if (newMode === "photos") {
      navigate(`/photos/${userId}`);
    } else {
      navigate(`/users/${userId}`);
    }
  };

  return (
    <Box className="user-layout-root">
      <Paper elevation={3} className="user-layout-header-paper">
        <Box className="user-layout-header-row">
          <Box className="user-layout-header-text">
            <Breadcrumbs aria-label="breadcrumb" className="user-layout-breadcrumbs">
              <MuiLink component={Link} to="/" underline="hover" color="inherit">
                Home
              </MuiLink>
              <MuiLink component={Link} to="/users" underline="hover" color="inherit">
                Users
              </MuiLink>
              <MuiLink component={Link} to={`/users/${userId}`} underline="hover" color="inherit">
                {user.first_name} {user.last_name}
              </MuiLink>
            </Breadcrumbs>
            <Typography variant="h4" component="h1" fontWeight="bold" className="user-layout-title">
              {user.first_name} {user.last_name}
            </Typography>
          </Box>

          <FormControl className="user-layout-mode" size="small">
            <Select value={currentMode} onChange={handleModeChange} displayEmpty>
              <MenuItem value="details">Info</MenuItem>
              <MenuItem value="photos">Gallery</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Box className="user-layout-outlet">
        <Outlet context={{ user }} />
      </Box>
    </Box>
  );
}
