import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { usuario } from "../../services/usuario";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function ModalLogin({ open, setOpen, setOpenCadastro }) {
  const [dadosLogin, setDadosLogin] = useState({ username: "", password: "" });
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
  const [cookie, setCookie] = useState("");
  const navigate = useNavigate();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleOpenCadastro = () => {
    setOpenCadastro(true);
    setOpen(false);
    navigate("/cadastro");
  };

  async function onClickLogin() {
    if (dadosLogin.username !== "" && dadosLogin.password !== "") {
      try {
        setIsLoading(true);
        const login = await usuario.post(`/login`, dadosLogin);

        setCookie(login.data.token);
        setDadosLogin({
          ...dadosLogin,
          username: "",
          password: "",
        });
        sessionStorage.setItem("username", login.data.user.username);
        sessionStorage.setItem("nome", login.data.user.nome);
        sessionStorage.setItem("foto", login.data.user.foto);
        sessionStorage.setItem("token", login.data.token);
        sessionStorage.setItem("id", login.data.id);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/home");
        }, 2000);
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
      <div className="teste">
        <Dialog open={open} className="teste">
          <hr style={{ color: "black", width: "300px" }} />
          <DialogTitle
            style={{
              textAlign: "center",
              textShadow: "1px 0px 3px black",
              color: "#FF1493",
              marginTop: "0",
            }}
          >
            Login
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
              label="Userame"
              variant="outlined"
              style={{
                width: "15vw",
                marginTop: "1vh",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              onChange={(e) =>
                setDadosLogin({ ...dadosLogin, username: e.target.value })
              }
            />
            <TextField
              id="outlined-basic2"
              label="Password"
              variant="outlined"
              type={"password"}
              style={{
                width: "15vw",
                marginTop: "1vh",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              onChange={(e) =>
                setDadosLogin({ ...dadosLogin, password: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <div
              style={{ display: "flex", flexDirection: "row", padding: "5%" }}
            >
              {" "}
              <Button
                variant="contained"
                style={{ marginRight: "1vw" }}
                onClick={() => onClickLogin()}
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Login"
                )}
              </Button>
              <Button variant="contained" onClick={handleOpenCadastro}>
                Cadastrar-se
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
