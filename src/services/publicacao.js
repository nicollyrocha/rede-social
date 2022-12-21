import axios from "axios";

export const publicacao = axios.create({
  baseURL: "http://localhost:3030/api/post",
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  timeout: 15000,
});
