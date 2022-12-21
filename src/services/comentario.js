import axios from "axios";

export const comentario = axios.create({
  baseURL: "http://localhost:3030/api/coment",
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  timeout: 15000,
});
