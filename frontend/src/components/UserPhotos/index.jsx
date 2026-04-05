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
	Button,
	Stack,
	IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward, ContentCopy } from "@mui/icons-material";
import { useParams, Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { api, photoImageUrl } from "../../lib/fetchModelData";

import "./styles.css";

export default function UserPhotos() {
	const { userId, photoIndex } = useParams();
	const navigate = useNavigate();

	const [advancedEnabled, setAdvancedEnabled] = useState(
		localStorage.getItem("advancedFeatures") === "true",
	);
	const [photos, setPhotos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	let index = parseInt(photoIndex || 0);

	if (isNaN(index)) index = 0;
	if (index < 0) index = 0;
	if (index >= photos.length) index = photos.length - 1;

	const currentPhoto = photos[index];

	useEffect(() => {
		const handler = () => {
			setAdvancedEnabled(localStorage.getItem("advancedFeatures") === "true");
		};

		window.addEventListener("advancedToggle", handler);
		return () => window.removeEventListener("advancedToggle", handler);
	}, []);

	useEffect(() => {
		if (!photos.length) return;

		let validIndex = parseInt(photoIndex || 0);

		if (isNaN(validIndex)) validIndex = 0;
		if (validIndex < 0) validIndex = 0;
		if (validIndex >= photos.length) validIndex = photos.length - 1;

		// ❗ nếu index không hợp lệ → redirect
		if (validIndex !== parseInt(photoIndex)) {
			navigate(`/photos/${userId}/${validIndex}`, { replace: true });
		}
	}, [photoIndex, photos, userId, navigate]);

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
				<Typography color="error">
					Không tải được ảnh: {error.message}
				</Typography>
			</Paper>
		);
	}

	if (advancedEnabled && photos.length > 0) {
		const goNext = () => {
			if (index < photos.length - 1) {
				navigate(`/photos/${userId}/${index + 1}`);
			}
		};

		const goPrev = () => {
			if (index > 0) {
				navigate(`/photos/${userId}/${index - 1}`);
			}
		};

		const photo = currentPhoto;

		if (!currentPhoto) {
			return (
				<Paper sx={{ p: 3 }}>
					<Typography color="error">Invalid photo index.</Typography>
				</Paper>
			);
		}
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					mt: 4,
					px: 2,
				}}
			>
				<Paper
					elevation={4}
					sx={{
						maxWidth: 900,
						width: "100%",
						borderRadius: 4,
						overflow: "hidden",
					}}
				>
					<Box sx={{ p: 2, textAlign: "center" }}>
						<Typography variant="h6" fontWeight={600}>
							Photo {index + 1} / {photos.length}
						</Typography>
					</Box>

					<Card sx={{ boxShadow: "none" }}>
						<CardMedia
							component="img"
							image={photoImageUrl(photo.file_name)}
							sx={{
								maxHeight: 500,
								objectFit: "cover",
							}}
						/>

						<CardContent>
							<Typography variant="caption" color="text.secondary">
								Uploaded: {new Date(photo.date_time).toLocaleDateString()}
							</Typography>

							<Divider sx={{ my: 2 }} />

							<Typography variant="subtitle1" fontWeight={600}>
								Comments ({photo.comments?.length || 0})
							</Typography>

							<Stack spacing={2} mt={2}>
								{photo.comments?.map((c) => (
									<Box key={c._id} sx={{ display: "flex", gap: 1.5 }}>
										<Avatar sx={{ width: 36, height: 36 }}>
											{c.user?.first_name?.[0]}
										</Avatar>

										<Box>
											<Typography
												component={Link}
												to={`/users/${c.user?._id}`}
												sx={{
													fontWeight: 600,
													textDecoration: "none",
													color: "text.primary",
													"&:hover": { textDecoration: "underline" },
												}}
											>
												{c.user?.first_name} {c.user?.last_name}
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
							</Stack>
						</CardContent>
					</Card>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							p: 2,
						}}
					>
						<Button
							variant="outlined"
							startIcon={<ArrowBack />}
							onClick={goPrev}
							disabled={index === 0}
						>
							Previous
						</Button>

						<IconButton
							onClick={() =>
								navigator.clipboard.writeText(window.location.href)
							}
						>
							<ContentCopy />
						</IconButton>

						<Button
							variant="contained"
							endIcon={<ArrowForward />}
							onClick={goNext}
							disabled={index === photos.length - 1}
						>
							Next
						</Button>
					</Box>
				</Paper>
			</Box>
		);
	}
	return (
		<Paper elevation={3} className="user-photos-root">
			<Typography
				variant="h5"
				fontWeight="medium"
				gutterBottom
				className="user-photos-heading"
			>
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
														<Link
															to={`/users/${c.user?._id}`}
															className="user-photos-comment-link"
														>
															{c.user
																? `${c.user.first_name} ${c.user.last_name}`
																: "Unknown"}
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
