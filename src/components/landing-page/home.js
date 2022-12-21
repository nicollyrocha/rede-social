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
import ModalComents from "../comentarios/modal-coments";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { favoritos } from "../../services/favoritos";

function Home({ amigos }) {
  const [texto, setTexto] = useState([]);
  let textoPush = [];
  const [openComment, setOpenComment] = useState({ value: false, id: 0 });
  const [comentarioValue, setComentarioValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [valueSnackBar, setValueSnackBar] = useState(false);
  const [msgSnackBar, setMsgSnackBar] = useState("");
  const [severity, setSeverity] = useState("");
  const [openModalComents, setOpenModalComents] = useState(false);
  const [id, setId] = useState(0);
  const [coments, setComents] = useState([]);
  const [favorited, setFavorited] = useState({ value: false, id: 0 });
  const [favoritosUser, setFavoritosUser] = useState([]);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    getPosts();
  }, [amigos]);

  useEffect(() => {
    getFavoritos();
  }, []);

  async function getPosts() {
    for (const amigo of amigos) {
      try {
        const publis = await publicacao.get(
          `/publicacoes/${
            amigo.friend === sessionStorage.getItem("username")
              ? amigo.username
              : amigo.friend
          }`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "x-access-token": `${sessionStorage.getItem("token")}`,
            },
          }
        );
        for (const publi of publis.data.dados) {
          textoPush.push(publi);
        }
      } catch (e) {}
    }
    setTexto(textoPush);
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

  async function getFavoritos(t) {
    try {
      const publis = await favoritos.get(
        `/get/${sessionStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );

      setFavoritosUser(publis.data.body);
    } catch (e) {}
  }

  function openComentarios(t) {
    getComentarios(t);

    setId(t.id);
    setOpenModalComents(true);
  }

  async function onClickFavorito(t) {
    setFavorited({
      ...favorited,
      value: true,
      id: document.getElementById(t.id).id,
    });
    try {
      const publis = await favoritos.post(
        `/add/${t.id}`,
        { username: sessionStorage.getItem("username"), idPubli: t.id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );
      const publis2 = await publicacao.put(
        `/like/${t.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );
      window.location.reload();
    } catch (e) {}
  }

  async function onClickDeleteFavorito(t) {
    setFavorited({
      ...favorited,
      value: false,
      id: 0,
    });
    try {
      const publis = await favoritos.delete(
        `/delete/${t.id}/${sessionStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );
      const publis2 = await publicacao.put(
        `/like-delete/${t.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );
      window.location.reload();
    } catch (e) {}
  }

  return (
    <div>
      <ModalComents
        openModalComents={openModalComents}
        setOpenModalComents={setOpenModalComents}
        id={id}
        coments={coments}
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
        {texto.length === 0 ? (
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
          texto.map((t) => {
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
                            <IconButton
                              id={t.id}
                              style={{ marginTop: "3vh" }}
                              onClick={() => (
                                setFavorited({
                                  ...favorited,
                                  value: false,
                                  id: 0,
                                }),
                                onClickDeleteFavorito(t)
                              )}
                            >
                              <FavoriteIcon style={{ color: "white" }} />
                            </IconButton>
                          );
                        } else {
                          return (
                            <IconButton
                              id={t.id}
                              style={{ marginTop: "3vh" }}
                              onClick={() =>
                                favorited.value === false
                                  ? onClickFavorito(t)
                                  : setFavorited({
                                      ...favorited,
                                      value: false,
                                      id: 0,
                                    })
                              }
                            >
                              {favorited.value === true &&
                              favorited.id ===
                                document.getElementById(t.id).id ? (
                                <FavoriteIcon style={{ color: "white" }} />
                              ) : (
                                <FavoriteBorderIcon
                                  style={{ color: "white" }}
                                />
                              )}
                            </IconButton>
                          );
                        }
                      })
                    ) : (
                      <IconButton
                        id={t.id}
                        style={{ marginTop: "3vh" }}
                        onClick={() =>
                          favorited.value === false
                            ? onClickFavorito(t)
                            : setFavorited({
                                ...favorited,
                                value: false,
                                id: 0,
                              })
                        }
                      >
                        {favorited.value === true &&
                        favorited.id === document.getElementById(t.id).id ? (
                          <FavoriteIcon style={{ color: "white" }} />
                        ) : (
                          <FavoriteBorderIcon style={{ color: "white" }} />
                        )}
                      </IconButton>
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

export default Home;
