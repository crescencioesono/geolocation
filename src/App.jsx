import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import VendorForm from "./VendorForm";
import Map from "./Map";
import Sidebar from "./Sidebar";

const MALABO_CENTER = { lat: 3.7523, lng: 8.7742 }; // Coordenadas de Malabo

// Tema personalizado con azul eléctrico
const theme = createTheme({
  palette: {
    primary: {
      main: "#00f7ff", // Azul eléctrico
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h1: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
  },
});

const App = () => {
  const [vendors, setVendors] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Cargar vendedores desde localStorage al iniciar
  useEffect(() => {
    const savedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVendors(savedVendors);
  }, []);

  // Guardar vendedores en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }, [vendors]);

  // Añadir un nuevo vendedor
  const addVendor = (vendorData) => {
    setVendors([...vendors, vendorData]);
    setIsFormOpen(false); // Cerrar el formulario tras registrar
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        <Sidebar onToggleForm={() => setIsFormOpen(!isFormOpen)} isFormOpen={isFormOpen} />
        {isFormOpen && <VendorForm onAddVendor={addVendor} />}
        <Map vendors={vendors} center={MALABO_CENTER} />
      </div>
    </ThemeProvider>
  );
};

export default App;