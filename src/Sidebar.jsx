import { Drawer, Button, Typography } from "@mui/material";

const Sidebar = ({ onToggleForm, isFormOpen }) => {
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
      <Typography variant="h6" gutterBottom>
        Puntos de Venta
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onToggleForm}
        fullWidth
        sx={{ marginTop: "16px" }}
      >
        {isFormOpen ? "Cerrar Registro" : "Registrar Vendedor"}
      </Button>
    </Drawer>
  );
};

export default Sidebar;