import { Routes, Route } from "react-router-dom";
import App from "./App";
import Conta from "./components/conta/conta";
import { Friends } from "./components/friends/friends";
import Likes from "./components/likes/likes";
import MinhasPostagens from "./components/minhas-postagens/minhas-postasgens";
import LandingPage from "./landing-page/landing-page";
import Perfil from "./perfil/perfil";

const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/minhas-postagens" element={<MinhasPostagens />} />
      <Route path="/amigos" element={<Friends />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="/likes" element={<Likes />} />
    </Routes>
  );
};
export default Main;
