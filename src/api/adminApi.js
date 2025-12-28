// src/api/adminApi.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // e.g. http://localhost:7000/api
});

// =====================
// TOKEN HELPERS
// =====================
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Auto-load token on refresh
const existingToken = localStorage.getItem("token");
if (existingToken) {
  setAuthToken(existingToken);
}

// =====================
// AUTH
// =====================
const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });

  /**
   * EXPECTED BACKEND RESPONSE
   * {
   *   token: "jwt-token",
   *   user: { id, name, role }
   * }
   */

  const { token, user } = res.data;

  if (token) {
    setAuthToken(token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return res.data;
};

const logout = () => {
  setAuthToken(null);
  localStorage.removeItem("user");
};

// =====================
// USERS
// =====================
const getUsers = () => api.get("/admin/users");
const createUser = (data) => api.post("/admin/users", data);
const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// =====================
// SERMONS
// =====================
const getSermons = () => api.get("/admin/sermons");

const uploadSermon = (data) =>
  api.post("/admin/sermons/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

const deleteSermon = (id) =>
  api.delete(`/admin/sermons/${id}`);

// =====================
// EVENTS
// =====================
// =====================
// EVENTS
// =====================
const getEvents = () => api.get("/events/admin");      // <- updated
const createEvent = (data) => api.post("/events/admin", data); // <- updated
const deleteEvent = (id) => api.delete(`/events/admin/${id}`); // optional for future

// =====================
// PRAYERS
// =====================
const getPrayers = () => api.get("/admin/prayers");
const approvePrayer = (id) =>
  api.put(`/admin/prayers/${id}/approve`);

// =====================
// DONATIONS
// =====================
const getDonations = () => api.get("/admin/donations");
const verifyDonation = (id) =>
  api.put(`/admin/donations/${id}/verify`);

// =====================
// DASHBOARD
// =====================
const getDashboardStats = () =>
  api.get("/admin/dashboard");

export default {
  login,
  logout,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSermons,
  uploadSermon,
  deleteSermon,
  getEvents,
  createEvent,
  deleteEvent,
  getPrayers,
  approvePrayer,
  getDonations,
  verifyDonation,
  getDashboardStats,
};
