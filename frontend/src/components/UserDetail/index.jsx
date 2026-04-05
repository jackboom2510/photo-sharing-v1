import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Divider, Paper, Stack } from "@mui/material";
import { useParams, useOutletContext } from "react-router-dom";
import DOMPurify from "dompurify";
import { api, photoImageUrl } from "../../lib/fetchModelData";

export default function UserDetail() {
  const { userId } = useParams();
  const { user } = useOutletContext();
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [photosError, setPhotosError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoadingPhotos(true);
    setPhotosError(null);
    api
      .photosOfUser(userId)
      .then((data) => {
        if (!cancelled) setPhotos(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!cancelled) setPhotosError(e);
      })
      .finally(() => {
        if (!cancelled) setLoadingPhotos(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const firstPhotoFileName = photos.length > 0 ? photos[0].file_name : undefined;

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems={{ xs: "center", sm: "flex-start" }} sx={{ mb: 4 }}>
        <Avatar
          alt={`${user.first_name} ${user.last_name}`}
          src={firstPhotoFileName ? photoImageUrl(firstPhotoFileName) : undefined}
          sx={{ width: 150, height: 150, boxShadow: 3 }}
        />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", pt: 1 }}>
          <Typography variant="h5" fontWeight="medium" gutterBottom>
            {`${user.first_name} ${user.last_name}`}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body1">
              <strong>Location:</strong> {user.location}
            </Typography>
            <Typography variant="body1">
              <strong>Occupation:</strong> {user.occupation}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              User ID: {userId} | Photos Found: {loadingPhotos ? "…" : photos.length}
            </Typography>
            {photosError && (
              <Typography variant="caption" color="error">
                Không tải được ảnh: {photosError.message}
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          About me
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(user.description),
          }}
        />
      </Box>
    </Paper>
  );
}
