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
import { usuario } from "../../services/usuario";

export default function ModalDelete({
  openModalDelete,
  setOpenModalDelete,
  id,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [msgSnackBar, setMsgSnackBar] = useState("");
  const [severity, setSeverity] = useState("");
  const navigate = useNavigate();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  async function Excluir() {
    try {
      setIsLoading(true);
      await usuario.delete(`/delete/${sessionStorage.getItem("username")}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "x-access-token": `${sessionStorage.getItem("token")}`,
        },
      });
      setTimeout(() => {
        setIsLoading(false);
        setOpenSnackBar(true);
        setSeverity("success");
        setMsgSnackBar("Conta excluída com sucesso!");
        navigate("/");

        setOpenModalDelete(false);
      }, "1000");

      //window.location.reload();
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
        setOpenSnackBar(true);
        setSeverity("error");
        //setMsgSnackBar(error.response.data.message);
      }, "1000");
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
        <Dialog open={openModalDelete}>
          <hr style={{ color: "black", width: "400px" }} />
          <DialogTitle style={{ textAlign: "center" }}>
            Certeza que deseja excluir a conta? Será excluída permanentemente.
          </DialogTitle>
          <hr style={{ color: "black", width: "400px" }} />

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
                onClick={() => setOpenModalDelete(false)}
                style={{ marginRight: "1vw" }}
              >
                Voltar
              </Button>
              <Button variant="contained" onClick={() => Excluir()}>
                {isLoading ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Sim"
                )}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
