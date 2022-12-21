import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { publicacao } from "../../services/publicacao";
import { CircularProgress, TextareaAutosize } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

export default function ModalPostagem({ open, setOpen }) {
  const [dadosPublicacao, setDadosPublicacao] = useState({
    texto: "",
    username: sessionStorage.getItem("username"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [msgSnackBar, setMsgSnackBar] = useState("");
  const [severity, setSeverity] = useState("");
  const navigate = useNavigate();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  function onChangeTexto(e) {
    setDadosPublicacao({ ...dadosPublicacao, texto: e.target.value });
  }

  async function Postar() {
    if (dadosPublicacao.texto !== "") {
      try {
        setIsLoading(true);
        await publicacao.post(`/postar`, dadosPublicacao, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        });
        setIsLoading(false);
        setOpenSnackBar(true);
        setSeverity("success");
        setMsgSnackBar("Publicação criada com sucesso!");
        setDadosPublicacao({
          ...dadosPublicacao,
          nome: "",
          username: "",
          password: "",
        });
        setOpen(true);
        setOpen(false);
        window.location.reload();
      } catch (error) {
        setIsLoading(false);
        setOpenSnackBar(true);
        setSeverity("error");
        setMsgSnackBar(error.response.data.message);
        console.log(error);
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
      <div style={{ backgroundColor: "white" }}>
        <Dialog open={open}>
          <hr style={{ color: "black", width: "400px" }} />
          <DialogTitle style={{ textAlign: "center" }}>Publicação</DialogTitle>
          <hr style={{ color: "black", width: "400px" }} />

          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center",
            }}
          >
            <TextareaAutosize
              id="outlined-basic2"
              label="Texto"
              variant="outlined"
              style={{
                width: "20vw",
                borderRadius: "5px",
                backgroundColor: "white",
                height: "35vh",
              }}
              onChange={(e) => onChangeTexto(e)}
              value={dadosPublicacao.texto}
              rows={10}
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
                onClick={() => setOpen(false)}
                style={{ marginRight: "1vw" }}
              >
                Voltar
              </Button>
              <Button variant="contained" onClick={() => Postar()}>
                {isLoading ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Postar"
                )}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
