import React, { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import { favoritos } from "../../services/favoritos";
import { useNavigate } from "react-router-dom";

function BodyLikes({
  idsPubli,
  likesUser,
  setErro,
  setMsgErro,
  setSeveridade,
}) {
  const texto = [];
  const [numComentarios, setNumComentarios] = useState(0);
  const [numLikes, setNumLikes] = useState([]);
  const [openComment, setOpenComment] = useState({ value: false, id: 0 });
  const [comentarioValue, setComentarioValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [valueSnackBar, setValueSnackBar] = useState(false);
  const [msgSnackBar, setMsgSnackBar] = useState("");
  const [severity, setSeverity] = useState("");
  const [openModalComents, setOpenModalComents] = useState(false);
  const [id, setId] = useState(0);
  const [coments, setComents] = useState([]);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [favoritosUser, setFavoritosUser] = useState([]);
  const [publis, setPublis] = useState([]);
  const [auth, setAuth] = React.useState(true);
  const navigate = useNavigate();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    getLikes();
  }, [likesUser]);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  async function getLikes(like) {
    try {
      const publis = await publicacao.post(`/likes/`, likesUser, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "x-access-token": `${sessionStorage.getItem("token")}`,
        },
      });

      setPublis(publis.data.dados);
      texto.push(publis.data.dados);
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

  async function onClickSendComentario(idPubli) {
    const dadosComment = {
      username: sessionStorage.getItem("username"),
      comentario: comentarioValue,
      idPubli: idPubli,
    };
    setIsLoading(true);
    try {
      const comments = await comentario.post(`/comentario`, dadosComment, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "x-access-token": `${sessionStorage.getItem("token")}`,
        },
      });
      await publicacao.put(
        `/comentarios/${idPubli}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );
      setIsLoading(false);
      setValueSnackBar(true);
      setMsgSnackBar("Comentário enviado com sucesso!");
      setSeverity("success");
      setOpenComment({ ...openComment, value: false, id: 0 });

      window.location.reload();
    } catch (e) {
      setIsLoading(false);
      setValueSnackBar(true);
      setSeverity("error");
      //setMsgSnackBar(e.data.message);
    }
  }
  async function getComentarios(t) {
    try {
      const publis = await comentario.get(`/coments/${t.id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "x-access-token": `${sessionStorage.getItem("token")}`,
        },
      });

      setComents(publis.data.dados);
    } catch (e) {}
  }
  function openComentarios(t) {
    getComentarios(t);

    setId(t.id);
    setOpenModalComents(true);
  }

  async function openModalDeletePubli(t) {
    setOpenModalDelete(true);
    setId(t.id);
  }

  return (
    <div>
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
        {publis.length === 0 ? (
          <div
            style={{
              fontSize: "25px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              marginTop: "35vh",
              marginLeft: "30vw",
            }}
          >
            Nada para ver aqui Zzz{" "}
          </div>
        ) : (
          publis.map((t) => {
            return (
              <Grid item xs={2} sm={4} md={5} key={t.id}>
                {" "}
                <CardContent
                  style={{
                    backgroundColor: "#DCDCDC",
                    borderRadius: "10px",
                    width: "30vw",
                    margin: "1vw",
                  }}
                  id={t.id}
                  key={t.id}
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
                    {t.texto}
                    <IconButton>
                      {" "}
                      <DeleteIcon
                        style={{ color: "#C71585" }}
                        onClick={() => openModalDeletePubli(t)}
                      />
                    </IconButton>
                  </Typography>

                  <Typography
                    sx={{ fontSize: 14, fontStyle: "italic" }}
                    color="text.secondary"
                    gutterBottom
                  >
                    • {t.username}
                  </Typography>
                  <Divider sx={{ marginTop: "3vh" }} />
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <IconButton
                      id={t.id}
                      style={{ marginTop: "3vh" }}
                      onClick={() =>
                        openComment.value === false
                          ? setOpenComment({
                              ...openComment,
                              value: true,
                              id: document.getElementById(t.id).id,
                            })
                          : setOpenComment({
                              ...openComment,
                              value: false,
                              id: 0,
                            })
                      }
                    >
                      {" "}
                      <CommentIcon style={{ color: "white" }} />
                    </IconButton>
                    <div style={{ marginTop: "4vh" }}>{t.comentarios}</div>
                    {favoritosUser.length > 0 ? (
                      favoritosUser.map((f) => {
                        if (f.idpubli === t.id) {
                          return (
                            <FavoriteIcon
                              style={{
                                color: "white",
                                marginTop: "4vh",
                                marginLeft: "0.7vw",
                                marginRight: "0.3vw",
                              }}
                            />
                          );
                        } else {
                          return (
                            <FavoriteIcon
                              style={{
                                color: "white",
                                marginTop: "4vh",
                                marginLeft: "0.7vw",
                                marginRight: "0.3vw",
                              }}
                            />
                          );
                        }
                      })
                    ) : (
                      <FavoriteIcon
                        style={{
                          color: "white",
                          marginTop: "4vh",
                          marginLeft: "0.7vw",
                          marginRight: "0.3vw",
                        }}
                      />
                    )}

                    <div style={{ marginTop: "4vh" }}>{t.likes}</div>
                  </div>
                  {openComment.value === true &&
                  openComment.id === document.getElementById(t.id).id ? (
                    <>
                      {" "}
                      <TextField
                        id="standard-basic"
                        label={`Digite...`}
                        variant="standard"
                        onChange={(e) => setComentarioValue(e.target.value)}
                      ></TextField>
                      {isLoading === true ? (
                        <CircularProgress color="inherit" size="20px" />
                      ) : (
                        <IconButton
                          style={{ marginTop: "2vh" }}
                          onClick={(e) =>
                            onClickSendComentario(
                              document.getElementById(t.id).id
                            )
                          }
                        >
                          <SendIcon style={{ color: "#FF69B4" }} />
                        </IconButton>
                      )}
                      <br />
                      <Button onClick={() => openComentarios(t)}>
                        Ver comentários
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </CardContent>
              </Grid>
            );
          })
        )}
      </Grid>
    </div>
  );
}

export default BodyLikes;
