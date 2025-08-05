import { Drawer, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const Sidebar = ({
  onToggleForm,
  isFormOpen,
  onToggleDashboard,
  isDashboardOpen,
  onToggleLogin,
  isLoginOpen,
  onLogout,
  isAuthenticated,
  currentUser,
  onDistanceFilter,
  onCylinderTypeFilter,
}) => {
  const handleDistanceChange = (event) => {
    const value = event.target.value;
    onDistanceFilter(value === "" ? null : Number(value));
  };

  const handleCylinderTypeChange = (event) => {
    const value = event.target.value;
    onCylinderTypeFilter(value);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
          padding: "16px",
        },
      }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        Venta de Gas Butano
      </Typography>
      {isAuthenticated && (
        <Typography variant="body1" sx={{ marginBottom: "16px" }}>
          Bienvenido, {currentUser.username}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={onToggleForm}
        fullWidth
        sx={{ marginBottom: "16px" }}
      >
        {isFormOpen ? "Cerrar Registro" : "Registrar Vendedor"}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onToggleDashboard}
        fullWidth
        sx={{ marginBottom: "16px" }}
      >
        {isDashboardOpen ? "Cerrar Dashboard" : "Abrir Dashboard"}
      </Button>
      {isAuthenticated ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={onLogout}
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          Cerrar Sesión
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          onClick={onToggleLogin}
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          {isLoginOpen ? "Cerrar Login" : "Iniciar Sesión"}
        </Button>
      )}
      <FormControl fullWidth sx={{ marginBottom: "16px" }}>
        <InputLabel>Filtrar por distancia</InputLabel>
        <Select
          defaultValue=""
          onChange={handleDistanceChange}
          label="Filtrar por distancia"
        >
          <MenuItem value="">Sin filtro</MenuItem>
          <MenuItem value={1}>1 km</MenuItem>
          <MenuItem value={5}>5 km</MenuItem>
          <MenuItem value={10}>10 km</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Filtrar por tipo de bombona</InputLabel>
        <Select
          defaultValue=""
          onChange={handleCylinderTypeChange}
          label="Filtrar por tipo de bombona"
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="Española">Española</MenuItem>
          <MenuItem value="Francesa">Francesa</MenuItem>
        </Select>
      </FormControl>
    </Drawer>
  );
};

export default Sidebar;