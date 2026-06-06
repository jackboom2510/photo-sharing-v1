/**
 * Proxy API tới backend trong dev.
 * Biến môi trường từ .env gốc (npm start dùng env-cmd -f ../.env):
 *   REACT_APP_PROXY_TARGET — ưu tiên
 *   SERVER_PORT — fallback http://localhost:<port>
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  const fromPort = process.env.SERVER_PORT
    ? `http://localhost:${process.env.SERVER_PORT}`
    : `http://localhost:8080`;
  const target =
    process.env.REACT_APP_PROXY_TARGET || fromPort || "http://localhost:8080";
  const apiProxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: "warn",
    ws: true,
  });

  app.use("/admin/", apiProxy);
  app.use("/user/", apiProxy);
  app.use("/photosOfUser/", apiProxy);
  app.use("/commentsOfPhoto/", apiProxy);
  app.use("/test/", apiProxy);
  app.use("/images", apiProxy);
};
