"use strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const session = require("express-session");
const models = require("./models");

const app = express();
/** Heroku/hosting thường set PORT; local dùng SERVER_PORT trong .env gốc (tránh trùng PORT của CRA). */
const PORT = Number(process.env.PORT || process.env.SERVER_PORT) || 3000;

const frontendBuild = path.join(__dirname, "..", "frontend", "build");
const frontendIndex = path.join(frontendBuild, "index.html");

app.use(cors());
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Login endpoint
app.post("/admin/login", (req, res) => {
  const { login_name } = req.body;

  if (!login_name) {
    return res.status(400).json({ error: "login_name is required" });
  }

  const user = models.userByLoginNameModel(login_name);

  if (!user) {
    return res.status(400).json({ error: "Invalid login_name" });
  }

  // Store user info in session
  req.session.userId = user._id;
  req.session.userName = user.first_name;

  // Return user info (excluding sensitive data)
  res.json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    login_name: user.login_name,
  });
});

// Logout endpoint
app.post("/admin/logout", (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ error: "Not logged in" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Get current user endpoint (for checking authentication status)
app.get("/admin/user", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = models.userModel(req.session.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    login_name: user.login_name,
  });
});

// Protected routes - require authentication
app.get("/test/info", requireAuth, (req, res) => {
  res.json(models.schemaInfo());
});

app.get("/user/list", requireAuth, (req, res) => {
  res.json(models.userListModel());
});

app.get("/user/:id", requireAuth, (req, res) => {
  const user = models.userModel(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.get("/photosOfUser/:id", requireAuth, (req, res) => {
  res.json(models.photoOfUserModel(req.params.id));
});

app.post("/commentsOfPhoto/:photo_id", requireAuth, (req, res) => {
  const { photo_id } = req.params;
  const { comment } = req.body;

  // Validate comment is not empty
  if (!comment || typeof comment !== "string" || comment.trim() === "") {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }

  // Add comment to photo
  const newComment = models.addCommentToPhotoModel(
    photo_id,
    req.session.userId,
    comment.trim()
  );

  if (!newComment) {
    return res.status(404).json({ error: "Photo not found" });
  }

  // Return the new comment
  res.json(newComment);
});

app.use("/images", express.static(path.join(__dirname, "images")));

if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendBuild));
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    res.sendFile(frontendIndex, (err) => next(err));
  });
} else {
  app.get("/", (req, res) => {
    res
      .status(404)
      .type("text")
      .send(
        "Frontend build chưa có. Chạy: npm run build --prefix frontend\n" +
          "Hoặc dev: npm run dev (CRA + API; cổng API = SERVER_PORT trong .env gốc)."
      );
  });
}

const server = app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  if (fs.existsSync(frontendIndex)) {
    console.log("Đang phục vụ SPA từ frontend/build");
  } else {
    console.warn("Chưa có frontend/build — chỉ API + /images");
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Cổng ${PORT} đang được dùng. Đóng process khác hoặc đổi SERVER_PORT (hoặc PORT) trong .env gốc / backend/.env.`
    );
    process.exit(1);
  }
  throw err;
});
