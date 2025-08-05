import { useState } from "react";
import { TextField, Button, Paper, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const Login = ({ onLogin, onClose }) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    onLogin(loginData.username, loginData.password);
    setLoginData({ username: "", password: "" });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "24px",
        maxWidth: "400px",
        width: "90%",
        zIndex: 1000,
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: "8px", right: "8px" }}
      >
        <CloseIcon />
      </IconButton>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Usuario"
          name="username"
          value={loginData.username}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Contraseña"
          name="password"
          type="password"
          value={loginData.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: "16px" }}
        >
          Iniciar Sesión
        </Button>
      </form>
    </Paper>
  );
};

export default Login;