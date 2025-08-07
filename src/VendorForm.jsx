import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const VendorForm = ({ onAddVendor, onClose }) => {
  const [formData, setFormData] = useState({
    id: Date.now(),
    username: "",
    password: "",
    name: "",
    address: "",
    cylinders: { espanol: 0, francesa: 0 },
    position: { lat: 3.7523, lng: 8.7742 },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "espanol" || name === "francesa") {
      setFormData({
        ...formData,
        cylinders: { ...formData.cylinders, [name]: Number(value) || 0 },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.name ||
      !formData.address ||
      (formData.cylinders.espanol === 0 && formData.cylinders.francesa === 0)
    ) {
      alert("Por favor, completa todos los campos. Debe haber al menos una bombona.");
      return;
    }
    onAddVendor(formData);
    setFormData({
      id: Date.now(),
      username: "",
      password: "",
      name: "",
      address: "",
      cylinders: { espanol: 0, francesa: 0 },
      position: { lat: 3.7523, lng: 8.7742 },
    });
  };

  // Obtener ubicación del usuario para el formulario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error("Error obteniendo ubicación del usuario:", error);
        }
      );
    }
  }, []);

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Vendedor</DialogTitle>
      <DialogContent>
        <TextField
          label="Usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Dirección"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cantidad Española"
          name="espanol"
          type="number"
          value={formData.cylinders.espanol}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Cantidad Francesa"
          name="francesa"
          type="number"
          value={formData.cylinders.francesa}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VendorForm;