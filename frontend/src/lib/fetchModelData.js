import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_BASE || "",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

function fetchModel(url) {
  if (!url || typeof url !== "string") {
    return Promise.reject(new Error("fetchModel: url is required"));
  }
  return apiClient
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      const err = new Error(
        `${error.response?.status || ""} ${error.response?.statusText || "Request failed"}`
      );
      err.status = error.response?.status;
      err.body = error.response?.data;
      throw err;
    });
}

export const api = {
  schemaInfo: () => fetchModel("/test/info"),
  userList: () => fetchModel("/user/list"),
  user: (userId) => 
    fetchModel(`/user/${encodeURIComponent(userId)}`),
  photosOfUser: (userId) =>
    fetchModel(`/photosOfUser/${encodeURIComponent(userId)}`),
  login: (loginName) =>
    apiClient
      .post("/admin/login", { login_name: loginName })
      .then((res) => res.data)
      .catch((error) => {
        const err = new Error(
          `${error.response?.status || ""} ${error.response?.statusText || "Login failed"}`
        );
        err.status = error.response?.status;
        err.body = error.response?.data;
        throw err;
      }),
  logout: () =>
    apiClient
      .post("/admin/logout")
      .then((res) => res.data)
      .catch((error) => {
        const err = new Error(
          `${error.response?.status || ""} ${error.response?.statusText || "Logout failed"}`
        );
        err.status = error.response?.status;
        err.body = error.response?.data;
        throw err;
      }),
  getCurrentUser: () =>
    fetchModel("/admin/user"),
  addComment: (photoId, commentText) =>
    apiClient
      .post(`/commentsOfPhoto/${encodeURIComponent(photoId)}`, { comment: commentText })
      .then((res) => res.data)
      .catch((error) => {
        const err = new Error(
          `${error.response?.status || ""} ${error.response?.statusText || "Failed to add comment"}`
        );
        err.status = error.response?.status;
        err.body = error.response?.data;
        throw err;
      }),
};

export function photoImageUrl(fileName) {
  if (!fileName) return "";
  const baseName = String(fileName).replace(/^.*[/\\]/, "");
  const path = `/images/${encodeURIComponent(baseName)}`;
  return API_BASE ? `${API_BASE}${path}` : path;
}

export default fetchModel;