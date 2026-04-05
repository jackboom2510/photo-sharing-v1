import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { api, photoImageUrl } from "../../lib/fetchModelData";

export default function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .photosOfUser(userId)
      .then((data) => {
        if (!cancelled) setPhotos(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) return null;

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, display: "flex", justifyContent: "center", minHeight: 200 }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography color="error">Không tải được ảnh: {error.message}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" fontWeight="medium" gutterBottom>
        Photos
      </Typography>

      {photos.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No photos available.
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 3 }}>
          {photos.map((photo) => (
            <Card key={photo._id} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                height="200"
                image={photoImageUrl(photo.file_name)}
                alt="User uploaded photo"
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Uploaded on: {new Date(photo.date_time).toLocaleDateString()}
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Typography variant="subtitle2">
                  Comments ({photo.comments?.length || 0})
                </Typography>

                {photo.comments && photo.comments.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                    {photo.comments.map((c) => (
                      <Box key={c._id} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                          {c.user?.first_name?.[0] ?? "?"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            <Link to={`/users/${c.user?._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                              {c.user ? `${c.user.first_name} ${c.user.last_name}` : "Unknown"}
                            </Link>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(c.comment || ""),
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No comments yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Paper>
  );
}
