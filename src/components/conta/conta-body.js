import React, { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { CircularProgress, TextareaAutosize } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { usuario } from "../../services/usuario";
import ModalDelete from "./modal-delete";

function BodyConta({}) {
  const [isLoading, setIsLoading] = useState(false);
  const [valueSnackBar, setValueSnackBar] = useState(false);
  const [msgSnackBar, setMsgSnackBar] = useState("");
  const [severity, setSeverity] = useState("");
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [mudandoSenha, setMudandoSenha] = useState(false);
  const [dadosSenha, setDadosSenha] = useState({ atual: "", nova: "" });
  const [error, setError] = useState(false);
  const [msgErro, setMsgErro] = useState("");
  const [senhaNova, setSenhaNova] = useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {}, []);

  async function openModalDeletePubli(t) {
    setOpenModalDelete(true);
  }

  function onChangeSenhaNova(e) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const teste = regex.test(e.target.value);
    setSenhaNova(e.target.value);
    if (teste === false) {
      setError(true);
      setMsgErro(
        "Senha deve conter pelo menos 8 caracteres, 1 letra maiúscula, 1 minúscula e 1 número"
      );
    } else {
      setDadosSenha({ ...dadosSenha, nova: e.target.value });
      setError(false);
      setMsgErro("");
    }
  }

  async function confirmar(t) {
    if (dadosSenha.atual !== "" && dadosSenha.nova !== "" && error === false) {
      try {
        setIsLoading(true);
        const publis = await usuario.put(
          `/senha/${sessionStorage.getItem("username")}`,
          dadosSenha,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "x-access-token": `${sessionStorage.getItem("token")}`,
            },
          }
        );
        setTimeout(() => {
          setIsLoading(false);
          setDadosSenha({ ...dadosSenha, atual: "", nova: "" });
          setSenhaNova("");

          setValueSnackBar(true);
          setMsgSnackBar("Senha alterada com sucesso!");
          setSeverity("success");
        }, "1000");
      } catch (e) {
        setTimeout(() => {
          setIsLoading(false);
          setValueSnackBar(true);
          setMsgSnackBar(e);
          setSeverity("error");
        }, "1000");
      }
    }
  }

  function onClickDeleteConta(e) {
    setOpenModalDelete(true);
  }

  return (
    <div>
      <ModalDelete
        setOpenModalDelete={setOpenModalDelete}
        openModalDelete={openModalDelete}
      />
      <Snackbar
        open={valueSnackBar}
        autoHideDuration={6000}
        onClose={() => setValueSnackBar(false)}
      >
        <Alert
          onClose={() => setValueSnackBar(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {msgSnackBar ? msgSnackBar : ""}
        </Alert>
      </Snackbar>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifySelf: "center",
            marginLeft: "35vw",
            marginTop: "30vh",
          }}
        >
          <Typography variant="h5">
            Username: {sessionStorage.getItem("username")}
          </Typography>
          <br />
          <Typography variant="h5">
            <Button onClick={() => setMudandoSenha(true)}>
              Trocar a senha?
            </Button>
          </Typography>
          {mudandoSenha === true ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <TextField
                id="standard-basic"
                label={`Senha atual`}
                variant="standard"
                type="password"
                onChange={(e) =>
                  setDadosSenha({ ...dadosSenha, atual: e.target.value })
                }
                value={dadosSenha.atual}
              ></TextField>
              <TextField
                id="standard-basic"
                label={`Nova senha`}
                variant="standard"
                type="password"
                onChange={(e) => onChangeSenhaNova(e)}
                value={senhaNova}
              ></TextField>
              {error === true ? (
                <span style={{ width: "20vw", color: "red" }}>{msgErro}</span>
              ) : (
                ""
              )}
              <div style={{ display: "flex", flexDirection: "row" }}>
                {isLoading === true ? (
                  <CircularProgress />
                ) : (
                  <Button
                    variant="contained"
                    style={{ marginTop: "2vh", marginRight: "2vw" }}
                    onClick={() => confirmar()}
                  >
                    Confirmar
                  </Button>
                )}

                <Button
                  variant="contained"
                  style={{ marginTop: "2vh", backgroundColor: "#FF1493" }}
                  onClick={() => setMudandoSenha(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "self-end",
            marginLeft: "38vw",
            marginTop: "10vh",
          }}
        >
          {" "}
          <Typography variant="h5">
            <Button
              variant="contained"
              style={{ backgroundColor: "red" }}
              onClick={() => onClickDeleteConta()}
            >
              Excluir conta
            </Button>
          </Typography>
        </div>
      </Grid>
    </div>
  );
}

export default BodyConta;
