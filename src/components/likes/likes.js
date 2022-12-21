import { useEffect, useState } from "react";
import ReturnLanding from "../landing-page/return-landing";
import { usuario } from "../../services/usuario";
import { useNavigate } from "react-router-dom";

function Likes({ setErro, setMsgErro, setSeveridade }) {
  const [dadosPerfil, setDadosPerfil] = useState({
    nome: sessionStorage.getItem("nome"),
    username: sessionStorage.getItem("username"),
    foto: sessionStorage.getItem("foto"),
    id: sessionStorage.getItem("id"),
  });
  const formData = new FormData();
  const [error, setError] = useState({
    username: false,
  });
  const [errorMsg, setErrorMsg] = useState({
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [msgSnackBar, setMsgSnackBar] = useState("");
  const [severity, setSeverity] = useState("");
  const [image, setImage] = useState(sessionStorage.getItem("foto"));
  const navigate = useNavigate();

  useEffect(() => {
    getPerfil();
  }, []);

  async function updatePerfil() {
    setIsLoading(true);
    try {
      await usuario.put(`/update`, dadosPerfil, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "x-access-token": `${sessionStorage.getItem("token")}`,
        },
      });
      setIsLoading(false);
      setOpenSnackBar(true);
      setMsgSnackBar("Dados alterados com sucesso!");
      setSeverity("success");
      window.location.reload();
    } catch (e) {
      setIsLoading(false);
      setOpenSnackBar(true);
      setMsgSnackBar(e.response.data.message);
      setSeverity("error");
    }
  }

  async function getPerfil() {
    try {
      const dadosUsuario = await usuario.get(
        `/user/${sessionStorage.getItem("id")}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (dadosUsuario.data.foto !== null) {
        let blob = new Blob([dadosUsuario.data.foto.data], {
          type: "text/plain",
        });

        setImage(blob);
      }

      sessionStorage.setItem("username", dadosUsuario.data.user.username);
      sessionStorage.setItem("nome", dadosUsuario.data.user.nome);
    } catch (e) {
      if (e.response.data.message === "Failed to authenticate token.") {
        sessionStorage.clear();
        setErro(true);
        setMsgErro("Tempo de sessão expirou. Faça login novamente.");
        setSeveridade("error");
        navigate("/");
      }
    }
  }

  return (
    <div>
      <ReturnLanding
        dadosPerfil={dadosPerfil}
        setDadosPerfil={setDadosPerfil}
        updatePerfil={updatePerfil}
        formData={formData}
        isLoading={isLoading}
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
        msgSnackBar={msgSnackBar}
        setMsgSnackBar={setMsgSnackBar}
        severity={severity}
        image={image}
      />
    </div>
  );
}

export default Likes;
