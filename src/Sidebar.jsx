import { Drawer, Button, Typography, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

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
          Bienvenido, {currentUser.username} ({currentUser.role === "admin" ? "Administrador" : "Vendedor"})
        </Typography>
      )}

      {isAuthenticated && currentUser.role === "admin" && (
        <Button
          variant="contained"
          color="primary"
          onClick={onToggleForm}
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          {isFormOpen ? "Cerrar Registro" : "Registrar Vendedor"}
        </Button>
      )}
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
      <Box sx={{ mt: 5 }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Leyenda de Colores
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#800080",
              mr: 1,
              border: "1px solid #ffffff",
            }}
          />
          <Typography variant="body2">Ambos tipos</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff0000",
              mr: 1,
              border: "1px solid #ffffff",
            }}
          />
          <Typography variant="body2">Solo Española</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#0288d1",
              mr: 1,
              border: "1px solid #ffffff",
            }}
          />
          <Typography variant="body2">Solo Francesa</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;