"use strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const models = require("./models");

const app = express();
/** Heroku/hosting thường set PORT; local dùng SERVER_PORT trong .env gốc (tránh trùng PORT của CRA). */
const PORT = Number(process.env.PORT || process.env.SERVER_PORT) || 3000;

const frontendBuild = path.join(__dirname, "..", "frontend", "build");
const frontendIndex = path.join(frontendBuild, "index.html");

app.use(cors());
app.use(express.json());

app.get("/test/info", (req, res) => {
  res.json(models.schemaInfo());
});

app.get("/user/list", (req, res) => {
  res.json(models.userListModel());
});

app.get("/user/:id", (req, res) => {
  const user = models.userModel(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.get("/photosOfUser/:id", (req, res) => {
  res.json(models.photoOfUserModel(req.params.id));
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
