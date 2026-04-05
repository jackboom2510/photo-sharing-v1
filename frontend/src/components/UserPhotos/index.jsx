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

import "./styles.css";

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
      <Paper elevation={3} className="user-photos-paper--centered">
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} className="user-photos-paper--error">
        <Typography color="error">Không tải được ảnh: {error.message}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} className="user-photos-root">
      <Typography variant="h5" fontWeight="medium" gutterBottom className="user-photos-heading">
        Photos
      </Typography>

      {photos.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No photos available.
        </Typography>
      ) : (
        <Box className="user-photos-grid">
          {photos.map((photo) => (
            <Card key={photo._id} className="user-photos-card">
              <CardMedia
                component="img"
                image={photoImageUrl(photo.file_name)}
                alt="User uploaded photo"
                className="user-photos-card-media"
              />
              <CardContent className="user-photos-card-content">
                <Typography variant="caption" color="text.secondary">
                  Uploaded on: {new Date(photo.date_time).toLocaleDateString()}
                </Typography>
                <Divider className="user-photos-divider" />

                <Typography variant="subtitle2">
                  Comments ({photo.comments?.length || 0})
                </Typography>

                {photo.comments && photo.comments.length > 0 ? (
                  <Box className="user-photos-comments">
                    {photo.comments.map((c) => (
                      <Box key={c._id} className="user-photos-comment-row">
                        <Avatar className="user-photos-comment-avatar">
                          {c.user?.first_name?.[0] ?? "?"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            <Link to={`/users/${c.user?._id}`} className="user-photos-comment-link">
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
