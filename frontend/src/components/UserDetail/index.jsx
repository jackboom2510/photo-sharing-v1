import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Divider, Paper, Stack } from "@mui/material";
import { useParams, useOutletContext } from "react-router-dom";
import DOMPurify from "dompurify";
import { api, photoImageUrl } from "../../lib/fetchModelData";

import "./styles.css";

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
        console.log(data);
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
    <Paper elevation={3} className="user-detail-paper">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 4 }}
        alignItems={{ xs: "center", sm: "flex-start" }}
        className="user-detail-stack"
      >
        <Avatar
          alt={`${user.first_name} ${user.last_name}`}
          src={firstPhotoFileName ? photoImageUrl(firstPhotoFileName) : undefined}
          className="user-detail-avatar"
        />
        <Box className="user-detail-info">
          <Typography variant="h5" fontWeight="medium" gutterBottom className="user-detail-name">
            {`${user.first_name} ${user.last_name}`}
          </Typography>
          <Box className="user-detail-meta">
            <Typography variant="body1" className="user-detail-line">
              <strong>Location:</strong> {user.location}
            </Typography>
            <Typography variant="body1" className="user-detail-line">
              <strong>Occupation:</strong> {user.occupation}
            </Typography>
            <Typography variant="caption" color="text.secondary" className="user-detail-caption">
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

      <Divider className="user-detail-divider" />

      <Box className="user-detail-about">
        <Typography variant="h6" gutterBottom>
          About me
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="user-detail-description"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(user.description),
          }}
        />
      </Box>
    </Paper>
  );
}
