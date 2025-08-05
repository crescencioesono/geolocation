import { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";

const VendorForm = ({ onAddVendor }) => {
  const [vendorName, setVendorName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorName.trim()) {
      alert("Por favor, ingresa un nombre para el vendedor.");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const vendorData = {
            id: Date.now(),
            name: vendorName,
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          };
          onAddVendor(vendorData);
          setVendorName("");
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
        padding: "16px",
        maxWidth: "400px",
        width: "90%",
        zIndex: 1000,
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre del vendedor"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
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
          Registrar Vendedor
        </Button>
      </form>
    </Paper>
  );
};

export default VendorForm;