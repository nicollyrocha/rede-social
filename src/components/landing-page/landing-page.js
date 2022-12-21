import * as React from "react";
import { useNavigate } from "react-router-dom";
import { usuario } from "../../services/usuario";
import ReturnLanding from "./return-landing";

function LandingPage({
  setPagina,
  pagina,
  setErro,
  setMsgErro,
  setSeveridade,
}) {
  const navigate = useNavigate();

  React.useEffect(() => {
    session();
  }, []);

  async function session() {
    try {
      const session = await usuario.get(`/session`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "x-access-token": `${sessionStorage.getItem("token")}`,
        },
      });
    } catch (e) {}
  }

  const onClickPerfil = () => {
    setPagina("perfil");
    navigate("/perfil");
  };

  return (
    <>
      <ReturnLanding
        onClickPerfil={onClickPerfil}
        pagina={pagina}
        setErro={setErro}
        setMsgErro={setMsgErro}
        setSeveridade={setSeveridade}
      />
    </>
  );
}

export default LandingPage;
