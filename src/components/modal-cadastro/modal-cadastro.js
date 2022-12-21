import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { usuario } from "../../services/usuario";
import { CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

export default function ModalCadastro({
  openCadastro,
  setOpenCadastro,
  setOpen,
}) {
  const [dadosCadastro, setDadosCadastro] = useState({
    nome: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    username: false,
    password: false,
  });
  const [errorMsg, setErrorMsg] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [msgSnackBar, setMsgSnackBar] = useState("");
  const [severity, setSeverity] = useState("");
  const navigate = useNavigate();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  function onChangeUsername(e) {
    const regex = e.target.value.replace(/\s/g, "");

    setDadosCadastro({ ...dadosCadastro, username: regex });
    if (e.target.value.length < 3) {
      setError({ ...error, username: true });
      setErrorMsg({
        ...errorMsg,
        username: "Username deve conter pelo menos 3 caracteres",
      });
    } else {
      setError({ ...error, username: false });
      setErrorMsg({
        ...errorMsg,
        username: "",
      });
    }
  }

  function onChangePassword(e) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const teste = regex.test(e.target.value);

    if (teste === false) {
      setError({ ...error, password: true });
      setErrorMsg({
        ...errorMsg,
        password:
          "Senha deve conter pelo menos 8 caracteres, 1 letra maiúscula, 1 minúscula e 1 número",
      });
    } else {
      setDadosCadastro({ ...dadosCadastro, password: e.target.value });
      setError({ ...error, password: false });
      setErrorMsg({ ...errorMsg, password: "" });
    }
  }

  async function Cadastrar() {
    if (
      error.password === false &&
      error.username === false &&
      dadosCadastro.password !== "" &&
      dadosCadastro.username !== "" &&
      dadosCadastro.nome !== ""
    ) {
      try {
        setIsLoading(true);
        await usuario.post(`/cadastro`, dadosCadastro);
        setIsLoading(false);
        setOpenSnackBar(true);
        setSeverity("success");
        setMsgSnackBar("Usuário criado com sucesso!");
        setDadosCadastro({
          ...dadosCadastro,
          nome: "",
          username: "",
          password: "",
        });
        setOpen(true);
        setOpenCadastro(false);
        navigate("/");
      } catch (error) {
        setIsLoading(false);
        setOpenSnackBar(true);
        setSeverity("error");
        setMsgSnackBar(error.response.data.message);

        throw new Error(error);
      }
    }
  }

  return (
    <>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {msgSnackBar ? msgSnackBar : ""}
        </Alert>
      </Snackbar>
      <div>
        <Dialog open={openCadastro} className="teste">
          <hr style={{ color: "black", width: "300px" }} />
          <DialogTitle
            style={{
              textAlign: "center",
              textShadow: "1px 0px 3px black",
              color: "#FF1493",
              marginTop: "0",
            }}
          >
            Cadastrar
          </DialogTitle>
          <hr style={{ color: "black", width: "300px" }} />

          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Nome"
              variant="outlined"
              style={{
                width: "15vw",
                marginTop: "1vh",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              onChange={(e) =>
                setDadosCadastro({ ...dadosCadastro, nome: e.target.value })
              }
            />
            <TextField
              id="outlined-basic2"
              label="Userame"
              variant="outlined"
              style={{
                width: "15vw",
                marginTop: "1vh",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              onChange={(e) => onChangeUsername(e)}
              value={dadosCadastro.username}
              error={error.username}
              helperText={errorMsg.username}
            />
            <TextField
              id="outlined-basic3"
              label="Password"
              variant="outlined"
              type={"password"}
              style={{
                width: "15vw",
                marginTop: "1vh",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              onChange={(e) => onChangePassword(e)}
              error={error.password}
              helperText={errorMsg.password}
            />
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              alignSelf: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "5%",
              }}
            >
              {" "}
              <Button
                variant="contained"
                onClick={() => (
                  setOpen(true), setOpenCadastro(false), navigate("/")
                )}
                style={{ marginRight: "1vw" }}
              >
                Voltar
              </Button>
              <Button variant="contained" onClick={() => Cadastrar()}>
                {isLoading ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Confirmar"
                )}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
