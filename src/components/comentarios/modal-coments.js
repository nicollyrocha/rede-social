import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
} from "@mui/material";
import { publicacao } from "../../services/publicacao";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CommentIcon from "@mui/icons-material/Comment";
import Divider from "@mui/material/Divider";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { CircularProgress, TextareaAutosize } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { comentario } from "../../services/comentario";

export default function ModalComents({
  openModalComents,
  setOpenModalComents,
  coments,
}) {
  return (
    <>
      <Dialog open={openModalComents}>
        <hr style={{ color: "black", width: "400px" }} />

        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
          }}
        >
          <Grid>
            {" "}
            {coments.length === 0 ? (
              <div
                style={{
                  fontSize: "25px",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "35vh",
                }}
              >
                Nada para ver aqui Zzz{" "}
              </div>
            ) : (
              coments.map((c) => {
                return (
                  <Grid item xs={2} sm={4} md={3} key={c.id}>
                    {" "}
                    <CardContent
                      style={{
                        backgroundColor: "#DCDCDC",
                        borderRadius: "10px",
                        width: "20vw",
                        margin: "1vw",
                      }}
                      id={c.id}
                      key={c.id}
                      className="cardcontent"
                    >
                      <Typography
                        sx={{
                          marginBottom: "1vh",
                          fontSize: 18,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                        variant="body2"
                      >
                        {c.comentario}
                      </Typography>

                      <Typography
                        sx={{ fontSize: 14, fontStyle: "italic" }}
                        color="text.secondary"
                        gutterBottom
                      >
                        • {c.username}
                      </Typography>
                      <Divider sx={{ marginTop: "3vh" }} />
                    </CardContent>
                  </Grid>
                );
              })
            )}
          </Grid>
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
              onClick={() => setOpenModalComents(false)}
              style={{ marginRight: "1vw" }}
            >
              Voltar
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
