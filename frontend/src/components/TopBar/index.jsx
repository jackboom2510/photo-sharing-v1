import React, { useEffect, useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Grid,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { api } from "../../lib/fetchModelData";

import "./styles.css";

function TopBar() {
	const location = useLocation();
	const segments = location.pathname.split("/");
	const userId = segments[2] || null;

	const [user, setUser] = useState(null);
	const [advancedEnabled, setAdvancedEnabled] = useState(false);

	const isPhotos = location.pathname.startsWith("/photos");

	useEffect(() => {
		const saved = localStorage.getItem("advancedFeatures");
		setAdvancedEnabled(saved === "true");
	}, []);

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

	const handleToggle = (e) => {
		const value = e.target.checked;
		setAdvancedEnabled(value);
		localStorage.setItem("advancedFeatures", value);
		window.dispatchEvent(new Event("advancedToggle"));
	};

	const subtitle = user
		? `${isPhotos ? "Photos of " : ""}${user.first_name} ${user.last_name}`
		: "";

	return (
		<AppBar position="fixed" elevation={2} className="topbar-app-bar">
			<Toolbar className="topbar-toolbar">
				<Grid container alignItems="center">
					<Grid item xs={4}>
						<Typography variant="h6" className="topbar-title">
							Photo Sharing App
						</Typography>
					</Grid>

					<Grid item xs={4} textAlign="center">
						<FormControlLabel
							control={
								<Checkbox
									checked={advancedEnabled}
									onChange={handleToggle}
									sx={{
										color: "#ffffff",
										"&.Mui-checked": { color: "#ffffff" },
									}}
								/>
							}
							label="Enable Advanced Features"
						/>
					</Grid>

					<Grid item xs={4} textAlign="right">
						{subtitle && (
							<Typography variant="subtitle1" className="topbar-subtitle">
								{subtitle}
							</Typography>
						)}
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
}

export default TopBar;
