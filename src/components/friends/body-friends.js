import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import { usuario } from "../../services/usuario";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import { friends } from "../../services/friends";
import { useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { friendsTable } from "../../services/friendsTable";
import { useNavigate } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BodyFriends({ setErro, setMsgErro, setSeveridade }) {
  const [value, setValue] = React.useState(0);
  const [username, setUsername] = React.useState("");
  const [isLoading, setIsLoading] = React.useState({
    buscarUser: false,
    sendSolic: false,
    solicitacoes: false,
    aceitar: false,
    recusar: false,
  });
  const [dadosUser, setDadosUser] = React.useState();
  const [error, setError] = React.useState({
    dadosUser: false,
    sendSolic: false,
    updateSolic: false,
  });
  const [msg, setMsg] = React.useState({
    dadosUser: "",
    sendSolic: "",
    updateSolic: "",
  });
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [severity, setSeverity] = React.useState("");
  const [solicitacoes, setSolicitacoes] = React.useState([]);
  let status;
  const amigos = [];
  const navigate = useNavigate();
  useEffect(() => {
    getSolicitacoes();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  async function getSolicitacoes() {
    try {
      setIsLoading({ ...isLoading, solicitacoes: true });
      const user = await friends.get(
        `/solicitacoes/${sessionStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );
      for (const solicitacao of user.data.data) {
        if (solicitacao.status === "ACEITA") {
          amigos.push(solicitacao);
        }
      }
      setTimeout(() => {
        setIsLoading({ ...isLoading, solicitacoes: false });
        setSolicitacoes(user.data.data);
      }, "1000");
    } catch (e) {
      setTimeout(() => {
        setIsLoading({ ...isLoading, solicitacoes: false });
      }, "1000");
      if (e.response.data.message === "Failed to authenticate token.") {
        sessionStorage.clear();
        setErro(true);
        setMsgErro("Tempo de sessão expirou. Faça login novamente.");
        setSeveridade("error");
        navigate("/");
      }
    }
  }

  async function getUser() {
    try {
      setIsLoading({ ...isLoading, buscarUser: true });
      const user = await usuario.get(`/username/${username}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "x-access-token": `${sessionStorage.getItem("token")}`,
        },
      });
      setTimeout(() => {
        setIsLoading({ ...isLoading, buscarUser: false });
        if (user.data.data && user.data.status === "success") {
          setDadosUser(user.data.data);
          setError({ ...error, dadosUser: false });
          setMsg({ ...msg, dadosUser: "" });
        } else if (!user.data.data && user.data.status === "success") {
          setError({ ...error, dadosUser: true });
          setMsg({ ...msg, dadosUser: "Usuário não encontrado." });
          setDadosUser();
        }
      }, "1000");
    } catch (e) {
      setTimeout(() => {
        setIsLoading(false);
      }, "1000");
      if (e.response.data.message === "Failed to authenticate token.") {
        sessionStorage.clear();
        setErro(true);
        setMsgErro("Tempo de sessão expirou. Faça login novamente.");
        setSeveridade("error");
        navigate("/");
      }
    }
  }

  async function sendSolicitacao() {
    try {
      setIsLoading({ ...isLoading, sendSolic: true });
      const user = await friends.post(
        `/solicitacao/${sessionStorage.getItem("username")}/${username}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "x-access-token": `${sessionStorage.getItem("token")}`,
          },
        }
      );
      setTimeout(() => {
        setIsLoading({ ...isLoading, sendSolic: false });
        setOpenSnackBar(true);
        setError({ ...error, sendSolic: true });
        setSeverity("sucess");
        setMsg({ ...msg, sendSolic: "Solicitação enviada com sucesso!" });
        window.location.reload();
      }, "1000");
    } catch (e) {
      setTimeout(() => {
        setSeverity("error");
        setOpenSnackBar(true);
        setIsLoading(false);
        setError({ ...error, sendSolic: true });
        setMsg({ ...msg, sendSolic: e.response.data.message });
      }, "1000");
    }
  }

  async function updateSolicitacao(solicitacao) {
    try {
      setIsLoading({ ...isLoading, updateSolic: true });

      if (status === "ACEITA") {
        await friends.put(
          `/solicitacao/${solicitacao.fromuser}`,
          {
            from: solicitacao.fromuser,
            status: "ACEITA",
            to: sessionStorage.getItem("username"),
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "x-access-token": `${sessionStorage.getItem("token")}`,
            },
          }
        );
        await friendsTable.post(
          `/friend`,
          {
            from: solicitacao.fromuser,
            status: "ACEITA",
            to: sessionStorage.getItem("username"),
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "x-access-token": `${sessionStorage.getItem("token")}`,
            },
          }
        );
        setTimeout(() => {
          setIsLoading({ ...isLoading, aceitar: false });
          setOpenSnackBar(true);
          setError({ ...error, updateSolic: true });
          setSeverity("sucess");
          setMsg({ ...msg, updateSolic: "Solicitação aceita com sucesso!" });
          window.location.reload();
        }, "1000");
      } else if (status === "REJEITADA") {
        await friends.put(
          `/solicitacao/${solicitacao.fromuser}`,
          { from: solicitacao.fromuser, status: "REJEITADA" },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "x-access-token": `${sessionStorage.getItem("token")}`,
            },
          }
        );
        setTimeout(() => {
          setIsLoading({ ...isLoading, recusar: false });
          setOpenSnackBar(true);
          setError({ ...error, updateSolic: true });
          setSeverity("sucess");
          setMsg({ ...msg, updateSolic: "Solicitação rejeitada com sucesso!" });
          window.location.reload();
        }, "1000");
      }
    } catch (e) {
      setTimeout(() => {
        setSeverity("error");
        setOpenSnackBar(true);
        setIsLoading(false);
        setError({ ...error, updateSolic: true });
        setMsg({ ...msg, updateSolic: e.response.data.message });
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
          {msg.sendSolic ? msg.sendSolic : ""}
        </Alert>
      </Snackbar>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Amigos" {...a11yProps(0)} />
            <Tab label="Solicitações" {...a11yProps(1)} />
            <Tab label="Pesquisar" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {solicitacoes.length > 0
            ? solicitacoes.map((solicitacao) =>
                solicitacao.status === "ACEITA" ? (
                  <div>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            {solicitacao.fromuser ===
                            sessionStorage.getItem("username")
                              ? solicitacao.touser.substring(0, 1)
                              : solicitacao.fromuser.substring(0, 1)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            solicitacao.fromuser ===
                            sessionStorage.getItem("username")
                              ? solicitacao.touser
                              : solicitacao.fromuser
                          }
                        />
                      </ListItem>
                    </List>
                  </div>
                ) : null
              )
            : null}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {solicitacoes.length > 0
            ? solicitacoes.map((solicitacao) =>
                solicitacao.status === "ENVIADO" ? (
                  <div>
                    <List>
                      <ListItem
                        secondaryAction={
                          isLoading.aceitar === true ? (
                            <CircularProgress
                              color="inherit"
                              size={"20px"}
                              style={{ marginTop: "1vh", marginLeft: "1vw" }}
                            />
                          ) : (
                            <IconButton
                              edge="end"
                              aria-label="check"
                              onClick={() => (
                                (status = "ACEITA"),
                                updateSolicitacao(solicitacao)
                              )}
                            >
                              <CheckIcon />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {solicitacao.fromuser.substring(0, 1)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={solicitacao.fromuser} />
                      </ListItem>
                      <ListItem
                        secondaryAction={
                          isLoading.recusar === true ? (
                            <CircularProgress
                              color="inherit"
                              size={"20px"}
                              style={{
                                marginTop: "1vh",
                                marginLeft: "1vw",
                              }}
                            />
                          ) : (
                            <IconButton
                              edge="end"
                              aria-label="clear"
                              onClick={() => (
                                (status = "REJEITADA"),
                                updateSolicitacao(solicitacao)
                              )}
                            >
                              <ClearIcon />
                            </IconButton>
                          )
                        }
                      ></ListItem>
                    </List>
                  </div>
                ) : null
              )
            : null}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TextField
            style={{ heigth: "2vh", marginLeft: "2vw" }}
            size="small"
            onChange={(e) => setUsername(e.target.value)}
          />
          {isLoading.buscarUser === true ? (
            <CircularProgress
              color="inherit"
              size={"20px"}
              style={{ marginTop: "1vh", marginLeft: "1vw" }}
            />
          ) : (
            <IconButton onClick={() => getUser()}>
              <SearchIcon />
            </IconButton>
          )}
          {error.dadosUser ? (
            <div style={{ marginTop: "1vh", marginLeft: "2vw" }}>
              <Typography>{msg.dadosUser}</Typography>
            </div>
          ) : null}
          <br />
          {dadosUser ? (
            <div style={{ marginLeft: "1vw" }}>
              <List>
                <ListItem
                  secondaryAction={
                    isLoading.sendSolic === true ? (
                      <CircularProgress
                        color="inherit"
                        size={"20px"}
                        style={{ marginTop: "1vh", marginLeft: "1vw" }}
                      />
                    ) : (
                      <IconButton
                        edge="start"
                        aria-label="add"
                        onClick={() => sendSolicitacao()}
                      >
                        <AddIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{dadosUser.username.substring(0, 1)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={dadosUser.username} />
                </ListItem>
              </List>
            </div>
          ) : (
            ""
          )}
        </TabPanel>
      </Box>
    </>
  );
}
