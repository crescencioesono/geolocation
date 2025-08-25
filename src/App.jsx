import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import VendorForm from "./VendorForm";
import Map from "./Map";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Login from "./Login";

const MALABO_CENTER = { lat: 3.7523, lng: 8.7742 }; // Coordenadas de Malabo

// Tema personalizado con azul oscuro
const theme = createTheme({
  palette: {
    primary: {
      main: "#0288d1", // Azul oscuro
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
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "6px",
        },
      },
    },
  },
});

const App = () => {
  const [vendors, setVendors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(null);
  const [cylinderTypeFilter, setCylinderTypeFilter] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Datos de prueba para Malabo, incluyendo admin y contratos variados
  const testVendors = [
    {
      id: 0,
      username: "admin",
      password: "admin123",
      userId: "admin",
      name: "Administrador",
      address: "Oficina Central, Malabo",
      phone: "555-000-000",
      cylinders: { espanol: 0, francesa: 0 },
      position: { lat: 3.7523, lng: 8.7742 },
      role: "admin",
      isActive: false,
      contractStartDate: null,
      contractEndDate: null,
    },
    {
      id: 1,
      username: "vendedor1",
      password: "12345",
      userId: "vendedor1",
      name: "Gas Malabo Centro",
      address: "Avenida de la Independencia, Malabo",
      phone: "555-123-456",
      cylinders: { espanol: 5, francesa: 8 },
      position: { lat: 3.755, lng: 8.775 },
      role: "vendor",
      isActive: true,
      contractStartDate: new Date("2024-08-22").toISOString(),
      contractEndDate: new Date("2026-02-22").toISOString(), // Vigente (> 30 días)
    },
    {
      id: 2,
      username: "vendedor2",
      password: "12345",
      userId: "vendedor2",
      name: "Gas Ela Nguema",
      address: "Calle Ela Nguema, Malabo",
      phone: "555-789-012",
      cylinders: { espanol: 0, francesa: 5 },
      position: { lat: 3.749, lng: 8.780 },
      role: "vendor",
      isActive: true,
      contractStartDate: new Date("2024-08-22").toISOString(),
      contractEndDate: new Date("2025-09-06").toISOString(), // A punto de caducar (15 días)
    },
    {
      id: 3,
      username: "vendedor3",
      password: "12345",
      userId: "vendedor3",
      name: "Gas Los Ángeles",
      address: "Barrio Los Ángeles, Malabo",
      phone: "555-345-678",
      cylinders: { espanol: 8, francesa: 0 },
      position: { lat: 3.760, lng: 8.770 },
      role: "vendor",
      isActive: true,
      contractStartDate: new Date("2024-08-21").toISOString(),
      contractEndDate: new Date("2025-08-21").toISOString(), // Caducado (ayer)
    },
  ];

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const savedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    if (savedVendors.length === 0) {
      console.log("Inicializando con datos de prueba:", testVendors);
      localStorage.setItem("vendors", JSON.stringify(testVendors));
      setVendors(testVendors);
    } else {
      console.log("Vendedores cargados desde localStorage:", savedVendors);
      setVendors(savedVendors);
    }
    const savedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(savedMessages);
    const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(savedNotifications);
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Usuario cargado desde localStorage:", savedUser);
    setCurrentUser(savedUser);
    checkContracts(savedVendors.length === 0 ? testVendors : savedVendors);
    // eslint-disable-next-line
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    console.log("Guardando vendedores en localStorage:", vendors);
    localStorage.setItem("vendors", JSON.stringify(vendors));
    checkContracts(vendors);
    // eslint-disable-next-line
  }, [vendors]);

  useEffect(() => {
    console.log("Guardando mensajes en localStorage:", messages);
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    console.log("Guardando notificaciones en localStorage:", notifications);
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Obtener la ubicación del usuario al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación del usuario:", error);
          setUserLocation(MALABO_CENTER);
        }
      );
    } else {
      setUserLocation(MALABO_CENTER);
    }
  }, []);

  // Verificar contratos y generar notificaciones
  const checkContracts = (vendorsToCheck) => {
    const today = new Date();
    const newNotifications = [];
    vendorsToCheck.forEach((vendor) => {
      if (vendor.role === "vendor" && vendor.contractEndDate) {
        const endDate = new Date(vendor.contractEndDate);
        const timeDiff = endDate - today;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        
        // Notificación para contrato a punto de caducar (30 días o menos)
        if (daysDiff <= 30 && daysDiff > 0) {
          const existingNearExpiry = notifications.some(
            (notif) =>
              notif.vendorId === vendor.id &&
              notif.type === "contract" &&
              notif.recipient === vendor.username &&
              notif.message.includes("está a") &&
              !notif.read
          );
          if (!existingNearExpiry) {
            newNotifications.push({
              id: Date.now() + vendor.id * 2,
              vendorId: vendor.id,
              type: "contract",
              recipient: vendor.username,
              message: `Tu contrato con ${vendor.name} está a ${Math.ceil(daysDiff)} días de caducar. Por favor, renueva tu contrato.`,
              timestamp: new Date().toISOString(),
              read: false,
            });
          }
          const existingAdminNearExpiry = notifications.some(
            (notif) =>
              notif.vendorId === vendor.id &&
              notif.type === "contract" &&
              notif.recipient === "admin" &&
              notif.message.includes("está a") &&
              !notif.read
          );
          if (!existingAdminNearExpiry) {
            newNotifications.push({
              id: Date.now() + vendor.id * 2 + 1,
              vendorId: vendor.id,
              type: "contract",
              recipient: "admin",
              message: `El contrato de ${vendor.name} está a ${Math.ceil(daysDiff)} días de caducar.`,
              timestamp: new Date().toISOString(),
              read: false,
            });
          }
        }
        // Notificación para contrato caducado
        if (daysDiff <= 0) {
          const existingExpired = notifications.some(
            (notif) =>
              notif.vendorId === vendor.id &&
              notif.type === "contract" &&
              notif.recipient === vendor.username &&
              notif.message.includes("ha caducado") &&
              !notif.read
          );
          if (!existingExpired) {
            newNotifications.push({
              id: Date.now() + vendor.id * 2 + 2,
              vendorId: vendor.id,
              type: "contract",
              recipient: vendor.username,
              message: `Tu contrato con ${vendor.name} ha caducado. Por favor, renueva tu contrato.`,
              timestamp: new Date().toISOString(),
              read: false,
            });
          }
          const existingAdminExpired = notifications.some(
            (notif) =>
              notif.vendorId === vendor.id &&
              notif.type === "contract" &&
              notif.recipient === "admin" &&
              notif.message.includes("ha caducado") &&
              !notif.read
          );
          if (!existingAdminExpired) {
            newNotifications.push({
              id: Date.now() + vendor.id * 2 + 3,
              vendorId: vendor.id,
              type: "contract",
              recipient: "admin",
              message: `El contrato de ${vendor.name} ha caducado.`,
              timestamp: new Date().toISOString(),
              read: false,
            });
          }
        }
      }
    });
    if (newNotifications.length > 0) {
      setNotifications([...notifications, ...newNotifications]);
    }
  };

  // Añadir un nuevo vendedor y verificar stock
  const addVendor = (vendorData) => {
    if (vendorData) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
      const newVendor = {
        ...vendorData,
        userId: vendorData.username,
        role: "vendor",
        isActive: false,
        contractStartDate: startDate.toISOString(),
        contractEndDate: endDate.toISOString(),
      };
      const newVendors = [...vendors, newVendor];
      setVendors(newVendors);
      // Generar notificaciones de stock en 0
      if (vendorData.cylinders.espanol === 0 || vendorData.cylinders.francesa === 0) {
        const newNotifications = [];
        if (vendorData.cylinders.espanol === 0) {
          newNotifications.push({
            id: Date.now(),
            vendorId: vendorData.id,
            type: "stock",
            recipient: "admin",
            message: `El vendedor ${vendorData.name} tiene 0 bombonas Españolas.`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
        if (vendorData.cylinders.francesa === 0) {
          newNotifications.push({
            id: Date.now() + 1,
            vendorId: vendorData.id,
            type: "stock",
            recipient: "admin",
            message: `El vendedor ${vendorData.name} tiene 0 bombonas Francesas.`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
        setNotifications([...notifications, ...newNotifications]);
      }
    }
    setIsFormOpen(false);
    setIsDashboardOpen(false);
    setIsLoginOpen(false);
  };

  // Actualizar un vendedor y verificar stock
  const updateVendor = (updatedVendor) => {
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === updatedVendor.id ? updatedVendor : vendor
    );
    setVendors(updatedVendors);
    // Generar notificaciones de stock en 0
    if (updatedVendor.cylinders.espanol === 0 || updatedVendor.cylinders.francesa === 0) {
      const newNotifications = [];
      if (updatedVendor.cylinders.espanol === 0) {
        newNotifications.push({
          id: Date.now(),
          vendorId: updatedVendor.id,
          type: "stock",
          recipient: "admin",
          message: `El vendedor ${updatedVendor.name} tiene 0 bombonas Españolas.`,
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
      if (updatedVendor.cylinders.francesa === 0) {
        newNotifications.push({
          id: Date.now() + 1,
          vendorId: updatedVendor.id,
          type: "stock",
          recipient: "admin",
          message: `El vendedor ${updatedVendor.name} tiene 0 bombonas Francesas.`,
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
      setNotifications([...notifications, ...newNotifications]);
    }
  };

  // Renovar contrato de un vendedor
  const renewContract = (vendorId) => {
    const today = new Date();
    const newEndDate = new Date(today);
    newEndDate.setFullYear(today.getFullYear() + 1);
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === vendorId
        ? {
            ...vendor,
            contractStartDate: today.toISOString(),
            contractEndDate: newEndDate.toISOString(),
          }
        : vendor
    );
    setVendors(updatedVendors);
    const vendor = vendors.find((v) => v.id === vendorId);
    // Marcar como leídas todas las notificaciones de contrato previas para este vendedor
    const updatedNotifications = notifications.map((notif) =>
      notif.type === "contract" && notif.vendorId === vendorId
        ? { ...notif, read: true }
        : notif
    );
    const newNotifications = [
      {
        id: Date.now(),
        vendorId: vendorId,
        type: "contract",
        recipient: vendor.username,
        message: `Tu contrato con ${vendor.name} ha sido renovado hasta ${newEndDate.toLocaleDateString()}.`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: Date.now() + 1,
        vendorId: vendorId,
        type: "contract",
        recipient: "admin",
        message: `El contrato de ${vendor.name} ha sido renovado hasta ${newEndDate.toLocaleDateString()}.`,
        timestamp: new Date().toISOString(),
        read: false,
      },
    ];
    setNotifications([...updatedNotifications, ...newNotifications]);
    // Verificar contratos nuevamente para limpiar notificaciones obsoletas
    checkContracts(updatedVendors);
  };

  // Marcar notificación como leída
  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
  };

  // Activar/desactivar punto de venta
  const toggleVendorActive = (vendorId) => {
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === vendorId ? { ...vendor, isActive: !vendor.isActive } : vendor
    );
    setVendors(updatedVendors);
  };

  // Enviar un mensaje
  const sendMessage = (messageData) => {
    const newMessage = {
      id: Date.now(),
      sender: currentUser.username,
      recipient: messageData.recipient,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages([...messages, newMessage]);
  };

  // Marcar mensaje como leído
  const markMessageAsRead = (messageId) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    setMessages(updatedMessages);
  };

  // Iniciar sesión
  const handleLogin = (username, password) => {
    const savedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    const vendor = savedVendors.find(
      (v) => v.username === username && v.password === password
    );
    if (vendor) {
      setCurrentUser({ username, role: vendor.role });
      localStorage.setItem("currentUser", JSON.stringify({ username, role: vendor.role }));
      setIsLoginOpen(false);
      setIsFormOpen(false);
      setIsDashboardOpen(true);
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setIsDashboardOpen(false);
    setIsFormOpen(false);
    setIsLoginOpen(false);
  };

  // Funciones para abrir/cerrar modales
  const openForm = () => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("Solo el administrador puede registrar vendedores.");
      return;
    }
    setIsFormOpen(true);
    setIsDashboardOpen(false);
    setIsLoginOpen(false);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openDashboard = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      setIsFormOpen(false);
      setIsDashboardOpen(false);
    } else {
      setIsDashboardOpen(true);
      setIsFormOpen(false);
      setIsLoginOpen(false);
    }
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsFormOpen(false);
    setIsDashboardOpen(false);
  };

  // Fórmula de Haversine para calcular distancia en km
  const calculateDistance = (pos1, pos2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(pos2.lat - pos1.lat);
    const dLng = toRad(pos2.lng - pos1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  // Filtrar vendedores según distancia, tipo de bombona, estado activo, stock y contrato no expirado
  const filteredVendors = userLocation && (distanceFilter || cylinderTypeFilter)
    ? vendors.filter((vendor) => {
        const today = new Date();
        const contractEndDate = vendor.contractEndDate ? new Date(vendor.contractEndDate) : null;
        const isContractValid = contractEndDate && contractEndDate >= today;
        let passesDistanceFilter = true;
        let passesCylinderTypeFilter = true;
        if (distanceFilter) {
          const distance = calculateDistance(userLocation, vendor.position);
          passesDistanceFilter = distance <= distanceFilter;
        }
        if (cylinderTypeFilter) {
          passesCylinderTypeFilter =
            cylinderTypeFilter === "Española"
              ? vendor.cylinders.espanol > 0
              : vendor.cylinders.francesa > 0;
        }
        return (
          passesDistanceFilter &&
          passesCylinderTypeFilter &&
          vendor.isActive &&
          vendor.role === "vendor" &&
          (vendor.cylinders.espanol > 0 || vendor.cylinders.francesa > 0) &&
          isContractValid
        );
      })
    : vendors.filter((vendor) => {
        const today = new Date();
        const contractEndDate = vendor.contractEndDate ? new Date(vendor.contractEndDate) : null;
        const isContractValid = contractEndDate && contractEndDate >= today;
        return (
          vendor.isActive &&
          vendor.role === "vendor" &&
          (vendor.cylinders.espanol > 0 || vendor.cylinders.francesa > 0) &&
          isContractValid
        );
      });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        <Sidebar
          onToggleForm={openForm}
          isFormOpen={isFormOpen}
          onToggleDashboard={openDashboard}
          isDashboardOpen={isDashboardOpen}
          onToggleLogin={openLogin}
          isLoginOpen={isLoginOpen}
          onLogout={handleLogout}
          isAuthenticated={!!currentUser}
          currentUser={currentUser}
          onDistanceFilter={setDistanceFilter}
          onCylinderTypeFilter={setCylinderTypeFilter}
        />
        {isFormOpen && <VendorForm onAddVendor={addVendor} onClose={closeForm} />}
        {isDashboardOpen && currentUser && (
          <Dashboard
            vendors={vendors}
            messages={messages}
            notifications={notifications}
            currentUser={currentUser}
            onUpdateVendor={updateVendor}
            onToggleActive={toggleVendorActive}
            onSendMessage={sendMessage}
            onMarkMessageAsRead={markMessageAsRead}
            onMarkNotificationAsRead={markNotificationAsRead}
            onRenewContract={renewContract}
            onClose={() => setIsDashboardOpen(false)}
          />
        )}
        {isLoginOpen && <Login onLogin={handleLogin} onClose={() => setIsLoginOpen(false)} />}
        <Map vendors={filteredVendors} center={userLocation || MALABO_CENTER} />
      </div>
    </ThemeProvider>
  );
};

export default App;