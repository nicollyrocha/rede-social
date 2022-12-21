import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PostAddIcon from "@mui/icons-material/PostAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Avatar from "@mui/material/Avatar";
import "./return-landing.css";
import EditIcon from "@mui/icons-material/Edit";
import {
  AvatarGroup,
  Button,
  FormControlLabel,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import ModalPostagem from "../modal-postagem/modal-postagem";
import PeopleIcon from "@mui/icons-material/People";
import BodyPostagens from "../minhas-postagens/body-postagens";
import BodyFriends from "../friends/body-friends";
import { friends } from "../../services/friends";
import Home from "./home";
import { friendsTable } from "../../services/friendsTable";
import Switch from "@mui/material/Switch";

import BodyConta from "../conta/conta-body";
import { favoritos } from "../../services/favoritos";
import BodyLikes from "../likes/likes-body";

const drawerWidth = 240;

function ReturnLanding({
  props,
  onClickPerfil,
  dadosPerfil,
  setDadosPerfil,
  updatePerfil,
  formData,
  isLoading,
  openSnackBar,
  setOpenSnackBar,
  msgSnackBar,
  severity,
  setErro,
  setMsgErro,
  setSeveridade,
}) {
  const window = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openModalPost, setOpenModalPost] = useState(false);
  const [amigos, setAmigos] = useState([]);
  const [likesUser, setLikesUser] = useState([]);
  const idsPubli = [];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [auth, setAuth] = React.useState(true);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  useEffect(() => {
    if (document.documentURI === "http://localhost:3000/perfil") {
      const image_input = document.querySelector("#image-input");
      if (image_input !== null) {
        image_input.addEventListener("change", function () {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            const uploaded_image = reader.result;
            document.querySelector(
              "#display-image"
            ).style.backgroundImage = `url(${uploaded_image})`;
          });
          reader.readAsDataURL(this.files[0]);
        });
      }
    }
    getSolicitacoes();
  }, []);

  useEffect(() => {
    getLikes();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  async function getSolicitacoes() {
    try {
      const user = await friendsTable.get(
        `/friends/${sessionStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );

      setAmigos(user.data.body.data);
    } catch (e) {
      setTimeout(() => {}, "1000");
      if (e.response.data.message === "Failed to authenticate token.") {
        sessionStorage.clear();
        setErro(true);
        setMsgErro("Tempo de sessão expirou. Faça login novamente.");
        setSeveridade("error");
        navigate("/");
      }
    }
  }

  async function getLikes() {
    try {
      const user = await favoritos.get(
        `/get/${sessionStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );

      setLikesUser(user.data.body);
    } catch (e) {
      setTimeout(() => {}, "1000");

      if (e.response.data.message === "Failed to authenticate token.") {
        sessionStorage.clear();
        setErro(true);
        setMsgErro("Tempo de sessão expirou. Faça login novamente.");
        setSeveridade("error");
        navigate("/");
      }
    }
    likesUser.map((like) => idsPubli.push(like.idpubli));
  }

  async function onChangeFoto(e) {
    let imageBlob = await new Promise((resolve) =>
      e.target.files[0].toBlob(resolve, "image/png")
    );

    formData.append("image", imageBlob, "image.png");
    setDadosPerfil({
      ...dadosPerfil,
      foto: formData,
    });
  }

  const drawer = (
    <div>
      <ModalPostagem open={openModalPost} setOpen={setOpenModalPost} />
      <Toolbar />
      <IconButton
        color="inherit"
        style={{ marginLeft: "100px" }}
        edge="center"
        onClick={() => setOpenModalPost(true)}
      >
        <PostAddIcon />
      </IconButton>
      <Divider />
      <List>
        <ListItem key={"Dashboard"} disablePadding>
          <ListItemButton onClick={() => navigate("/home")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Perfil"} disablePadding>
          <ListItemButton onClick={() => navigate("/perfil")}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Friends"} disablePadding>
          <ListItemButton onClick={() => navigate("/amigos")}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Friends" />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Liked"} disablePadding>
          <ListItemButton onClick={() => navigate("/likes")}>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Liked" />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Postagens"} disablePadding>
          <ListItemButton onClick={() => navigate("/minhas-postagens")}>
            <ListItemIcon>
              <GridViewIcon />
            </ListItemIcon>
            <ListItemText primary="Minhas Postagens" />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Conta"} disablePadding>
          <ListItemButton onClick={() => navigate("/conta")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Conta" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  function onClickLogout() {
    sessionStorage.removeItem("amigos");
    sessionStorage.removeItem("foto");
    sessionStorage.removeItem("nome");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("token");
    navigate("/");
    setAnchorEl(null);
  }

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
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
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Rede Social</Typography>
          <div style={{ display: "flex", marginLeft: "2vw" }}>
            {" "}
            <IconButton color="inherit" edge="end" onClick={handleMenu}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {sessionStorage.getItem("nome")
                  ? sessionStorage.getItem("nome").substring(0, 1)
                  : ""}
              </Avatar>
            </IconButton>
            <Menu
              style={{ marginTop: "5vh", marginLeft: "3vw" }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => onClickLogout()}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {document.documentURI === "http://localhost:3000/perfil" ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                marginTop: edit === true ? "" : "20vh",
              }}
            >
              {edit === true ? (
                <>
                  <Avatar sx={{ width: 150, height: 150, fontSize: "30px" }}>
                    {sessionStorage.getItem("nome")
                      ? sessionStorage.getItem("nome").substring(0, 1)
                      : ""}
                  </Avatar>
                  <div style={{ fontWeight: 700, fontSize: "20px" }}>
                    <TextField
                      id="standard-basic"
                      label={`Nome - ${
                        sessionStorage.getItem("nome")
                          ? sessionStorage.getItem("nome")
                          : ""
                      }`}
                      variant="standard"
                      onChange={(e) =>
                        setDadosPerfil({ ...dadosPerfil, nome: e.target.value })
                      }
                    />
                  </div>

                  <TextField
                    id="standard-basic"
                    label={`Username - ${
                      sessionStorage.getItem("username")
                        ? sessionStorage.getItem("username")
                        : ""
                    }`}
                    variant="standard"
                    onChange={(e) =>
                      setDadosPerfil({
                        ...dadosPerfil,
                        username: e.target.files[0],
                      })
                    }
                  />
                  <br />
                  <input
                    type="file"
                    id="image-input"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={(e) => onChangeFoto(e)}
                  />
                  <br />
                  <div id="display-image"></div>
                  <br />
                  <Button onClick={() => updatePerfil()}>
                    {isLoading === true ? (
                      <CircularProgress color="inherit" size="20px" />
                    ) : (
                      "Confirmar"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {" "}
                  <Avatar sx={{ width: 150, height: 150, fontSize: "30px" }}>
                    {sessionStorage.getItem("nome")
                      ? sessionStorage.getItem("nome").substring(0, 1)
                      : ""}
                  </Avatar>
                  <br />
                  <div style={{ fontWeight: 700, fontSize: "20px" }}>
                    {sessionStorage.getItem("nome")
                      ? sessionStorage.getItem("nome")
                      : ""}
                  </div>
                  {sessionStorage.getItem("username")
                    ? sessionStorage.getItem("username")
                    : ""}
                  <IconButton onClick={() => setEdit(true)}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </div>
          </>
        ) : document.documentURI === "http://localhost:3000/home" ? (
          <Home amigos={amigos} />
        ) : document.documentURI ===
          "http://localhost:3000/minhas-postagens" ? (
          <BodyPostagens
            setErro={setErro}
            setMsgErro={setMsgErro}
            setSeveridade={setSeveridade}
          />
        ) : document.documentURI === "http://localhost:3000/amigos" ? (
          <BodyFriends
            setErro={setErro}
            setMsgErro={setMsgErro}
            setSeveridade={setSeveridade}
          />
        ) : document.documentURI === "http://localhost:3000/conta" ? (
          <BodyConta
            setErro={setErro}
            setMsgErro={setMsgErro}
            setSeveridade={setSeveridade}
          />
        ) : document.documentURI === "http://localhost:3000/likes" ? (
          <BodyLikes
            idsPubli={idsPubli}
            likesUser={likesUser}
            setErro={setErro}
            setMsgErro={setMsgErro}
            setSeveridade={setSeveridade}
          />
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
}

ReturnLanding.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ReturnLanding;
