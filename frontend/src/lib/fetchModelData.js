/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

/** "omit" tránh gửi Cookie — cookie localhost quá lớn hay gây 431 Request Header Fields Too Large. */
const FETCH_CREDENTIALS =
  process.env.REACT_APP_FETCH_CREDENTIALS === "include" ? "include" : "omit";

function resolveUrl(url) {
  if (!url || typeof url !== "string") {
    throw new Error("fetchModel: url is required");
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const path = url.startsWith("/") ? url : `/${url}`;
  return API_BASE ? `${API_BASE}${path}` : path;
}

function fetchModel(url) {
  let fullUrl;
  try {
    fullUrl = resolveUrl(url);
  } catch (e) {
    return Promise.reject(e);
  }
  return fetch(fullUrl, {
    method: "GET",
    credentials: FETCH_CREDENTIALS,
    headers: { Accept: "application/json" },
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        const err = new Error(`${response.status} ${response.statusText}`);
        err.status = response.status;
        err.body = text;
        throw err;
      });
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  });
}

/** Gợi ý gọi API — cùng chữ ký với models.* trong modelData. */
export const api = {
  schemaInfo: () => fetchModel("/test/info"),
  userList: () => fetchModel("/user/list"),
  user: (userId) => fetchModel(`/user/${encodeURIComponent(userId)}`),
  photosOfUser: (userId) =>
    fetchModel(`/photosOfUser/${encodeURIComponent(userId)}`),
};

/**
 * URL ảnh tĩnh trên backend (thường Express phục vụ thư mục images tại /images).
 */
export function photoImageUrl(fileName) {
  if (!fileName) return "";
  const baseName = String(fileName).replace(/^.*[/\\]/, "");
  const path = `/images/${encodeURIComponent(baseName)}`;
  return API_BASE ? `${API_BASE}${path}` : path;
}

export default fetchModel;
