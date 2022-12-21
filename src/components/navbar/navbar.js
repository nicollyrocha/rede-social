import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

export default function NavBarLogin() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          textAlign: "center",
          fontSize: "24px",
          display: "flex",
          height: "7vh",
          justifyContent: "center",
        }}
      >
        Rede Social
      </AppBar>
    </Box>
  );
}
