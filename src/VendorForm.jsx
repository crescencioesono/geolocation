import { useState } from "react";
import { TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const VendorForm = ({ onAddVendor }) => {
  const [vendorData, setVendorData] = useState({
    username: "",
    password: "",
    name: "",
    address: "",
    cylinderType: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !vendorData.username.trim() ||
      !vendorData.password.trim() ||
      !vendorData.name.trim() ||
      !vendorData.address.trim() ||
      !vendorData.cylinderType ||
      !vendorData.quantity
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newVendor = {
            id: Date.now(),
            username: vendorData.username,
            password: vendorData.password,
            name: vendorData.name,
            address: vendorData.address,
            cylinderType: vendorData.cylinderType,
            quantity: Number(vendorData.quantity),
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          };
          onAddVendor(newVendor);
          setVendorData({
            username: "",
            password: "",
            name: "",
            address: "",
            cylinderType: "",
            quantity: "",
          });
        },
        (error) => {
          console.error("Error obteniendo geolocalización:", error);
          alert("No se pudo obtener la ubicación. Intenta de nuevo.");
        }
      );
    } else {
      alert("Geolocalización no soportada por el navegador.");
    }
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
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Usuario"
          name="username"
          value={vendorData.username}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Contraseña"
          name="password"
          type="password"
          value={vendorData.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Nombre del vendedor"
          name="name"
          value={vendorData.name}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Dirección"
          name="address"
          value={vendorData.address}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de bombona</InputLabel>
          <Select
            name="cylinderType"
            value={vendorData.cylinderType}
            onChange={handleChange}
            label="Tipo de bombona"
          >
            <MenuItem value="Española">Española</MenuItem>
            <MenuItem value="Francesa">Francesa</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Cantidad disponible"
          name="quantity"
          type="number"
          value={vendorData.quantity}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 0 }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: "16px" }}
        >
          Registrar Vendedor
        </Button>
      </form>
    </Paper>
  );
};

export default VendorForm;