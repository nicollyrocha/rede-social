import axios from "axios";

export const friends = axios.create({
  baseURL: "http://localhost:3030/api/friends",
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  timeout: 15000,
});
