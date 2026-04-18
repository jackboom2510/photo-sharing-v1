import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_BASE || "",
  withCredentials: process.env.REACT_APP_FETCH_CREDENTIALS === "include",
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
  userList: () => fetchModel("/api/user/list"),
  user: (userId) => 
    fetchModel(`/api/user/${encodeURIComponent(userId)}`),
  photosOfUser: (userId) =>
    fetchModel(`/api/photo/photosOfUser/${encodeURIComponent(userId)}`),
};

export function photoImageUrl(fileName) {
  if (!fileName) return "";
  const baseName = String(fileName).replace(/^.*[/\\]/, "");
  const path = `/images/${encodeURIComponent(baseName)}`;
  return API_BASE ? `${API_BASE}${path}` : path;
}

export default fetchModel;