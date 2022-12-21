import axios from "axios";

export const favoritos = axios.create({
  baseURL: "http://localhost:3030/api/fav",
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
  timeout: 15000,
});
