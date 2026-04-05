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
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5">Thiếu user ID</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 240 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
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
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3, display: "flex", flexDirection: "column", gap: 3, minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <MuiLink component={Link} to="/users" underline="hover" color="inherit">
                Users
              </MuiLink>
              <MuiLink component={Link} to={`/users/${userId}`} underline="hover" color="inherit">
                {user.first_name} {user.last_name}
              </MuiLink>
            </Breadcrumbs>
            <Typography variant="h4" fontWeight="bold">
              {user.first_name} {user.last_name}
            </Typography>
          </Box>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select value={currentMode} onChange={handleModeChange} displayEmpty>
              <MenuItem value="details">Info</MenuItem>
              <MenuItem value="photos">Gallery</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Outlet context={{ user }} />
      </Box>
    </Box>
  );
}
