import axios from "axios";

export const usuario = axios.create({
  baseURL: "http://localhost:3030/api/user",
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  timeout: 15000,
});
