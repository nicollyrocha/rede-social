import "./App.css";
import { createTheme, Snackbar } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import ModalLogin from "./components/login/login";
import React, { useState } from "react";
import ModalCadastro from "./components//modal-cadastro/modal-cadastro";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/landing-page/landing-page";
import Perfil from "./components/perfil/perfil";
import MinhasPostagens from "./components/minhas-postagens/minhas-postagens";
import { Friends } from "./components/friends/friends";
import Conta from "./components/conta/conta";
import Likes from "./components/likes/likes";
import MuiAlert from "@mui/material/Alert";

function App() {
  const [open, setOpen] = useState(true);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [pagina, setPagina] = useState("");
  const [erro, setErro] = useState(true);
  const [msgErro, setMsgErro] = useState("");
  const [severidade, setSeveridade] = useState("");

  const theme = createTheme({
    typography: {
      fontFamily: "Anton, Arial",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'Anton';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
        }
      `,
      },
    },
    palette: {
      primary: {
        light: "#FFB6C1",
        main: "#FF69B4",
        dark: "#FF1493",
        contrastText: "#fff",
      },
    },
  });

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div
      className="app"
      style={{
        backgroundSize: "100%",
      }}
    >
      <ThemeProvider theme={theme}>
        <Snackbar
          open={erro}
          autoHideDuration={6000}
          onClose={() => setErro(false)}
        >
          <Alert
            onClose={() => setErro(false)}
            severity={severidade}
            sx={{ width: "100%" }}
          >
            {msgErro ? msgErro : ""}
          </Alert>
        </Snackbar>
        <Routes>
          <Route
            path="/home"
            element={
              <LandingPage
                setPagina={setPagina}
                pagina={pagina}
                setErro={setErro}
                setMsgErro={setMsgErro}
                setSeveridade={setSeveridade}
              />
            }
          />
          <Route
            path="/"
            element={
              <ModalLogin
                open={open}
                setOpen={setOpen}
                setOpenCadastro={setOpenCadastro}
              />
            }
          />
          <Route
            path="/cadastro"
            element={
              <ModalCadastro
                openCadastro={openCadastro}
                setOpenCadastro={setOpenCadastro}
                setOpen={setOpen}
              />
            }
          />
          <Route
            path="/perfil"
            element={
              <Perfil
                setPagina={setPagina}
                setErro={setErro}
                setMsgErro={setMsgErro}
                setSeveridade={setSeveridade}
              />
            }
          />
          <Route
            path="/minhas-postagens"
            element={
              <MinhasPostagens
                setErro={setErro}
                setMsgErro={setMsgErro}
                setSeveridade={setSeveridade}
              />
            }
          />
          <Route
            path="/amigos"
            element={
              <Friends
                setErro={setErro}
                setMsgErro={setMsgErro}
                setSeveridade={setSeveridade}
              />
            }
          />
          <Route
            path="/conta"
            element={
              <Conta
                setErro={setErro}
                setMsgErro={setMsgErro}
                setSeveridade={setSeveridade}
              />
            }
          />
          <Route
            path="/likes"
            element={
              <Likes
                setErro={setErro}
                setMsgErro={setMsgErro}
                setSeveridade={setSeveridade}
              />
            }
          />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
