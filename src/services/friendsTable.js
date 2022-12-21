import axios from "axios";

export const friendsTable = axios.create({
  baseURL: "http://localhost:3030/api/friendsTable",
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  timeout: 15000,
});
