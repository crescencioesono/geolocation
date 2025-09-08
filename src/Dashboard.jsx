import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Dashboard = ({ vendors, messages, notifications, currentUser, onUpdateVendor, onToggleActive, onSendMessage, onMarkMessageAsRead, onMarkNotificationAsRead, onRenewContract, onClose }) => {
  const [editingVendor, setEditingVendor] = useState(null);
  const [messageRecipient, setMessageRecipient] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const handleEdit = (vendor) => {
    setEditingVendor({ ...vendor });
  };

  const handleSave = () => {
    if (
      !editingVendor.name ||
      !editingVendor.address ||
      !editingVendor.phone
    ) {
      alert("Por favor, completa todos los campos (Nombre, Dirección, Teléfono).");
      return;
    }
    onUpdateVendor(editingVendor);
    setEditingVendor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "espanol" || name === "francesa") {
      setEditingVendor({
        ...editingVendor,
        cylinders: { ...editingVendor.cylinders, [name]: Number(value) || 0 },
      });
    } else {
      setEditingVendor({ ...editingVendor, [name]: value });
    }
  };

  const handleSendMessage = () => {
    if (!messageContent) {
      alert("Por favor, escribe un mensaje.");
      return;
    }
    onSendMessage({ recipient: messageRecipient || "all", content: messageContent });
    setMessageContent("");
    setMessageRecipient("");
  };

  const filteredVendors =
    currentUser.role === "admin"
      ? vendors.filter((vendor) => vendor.role === "vendor")
      : vendors.filter((vendor) => vendor.userId === currentUser.username);

  const filteredMessages =
    currentUser.role === "admin"
      ? messages.filter((msg) => msg.sender === currentUser.username)
      : messages.filter(
          (msg) =>
            (msg.recipient === currentUser.username || msg.recipient === "all") &&
            msg.sender === "admin"
        );

  const filteredStockNotifications = notifications.filter(
    (notif) => currentUser.role === "admin" && notif.type === "stock" && !notif.read
  );

  const filteredContractNotifications =
    currentUser.role === "admin"
      ? notifications.filter((notif) => notif.type === "contract" && notif.recipient === "admin" && !notif.read)
      : notifications.filter(
          (notif) => notif.type === "contract" && notif.recipient === currentUser.username
        );

  const unreadMessagesCount = filteredMessages.filter((msg) => !msg.read).length;

  const getVendorStatus = (vendor) => {
    if (vendor.contractEndDate && new Date(vendor.contractEndDate) < new Date()) {
      return "Expirado";
    }
    return vendor.isActive ? "Activo" : "Inactivo";
  };

  const shouldShowRenewButton = (vendor) => {
    if (!vendor.contractEndDate) return false;
    const today = new Date();
    const endDate = new Date(vendor.contractEndDate);
    const timeDiff = endDate - today;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // Mostrar si está a 30 días o menos de caducar o ya caducó
  };

  // Calcular totales de bombonas para el administrador
  const totalEspanol = filteredVendors.reduce((sum, vendor) => sum + (vendor.cylinders.espanol || 0), 0);
  const totalFrancesa = filteredVendors.reduce((sum, vendor) => sum + (vendor.cylinders.francesa || 0), 0);
  const totalGeneral = totalEspanol + totalFrancesa;

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {currentUser.role === "admin" ? "Dashboard de Administrador" : "Dashboard de Vendedor"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {currentUser.role === "admin" && (
          <>
            <Typography variant="h6" color="primary" gutterBottom>
              Enviar Comunicado
            </Typography>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Destinatario</InputLabel>
                <Select
                  value={messageRecipient}
                  onChange={(e) => setMessageRecipient(e.target.value)}
                  label="Destinatario"
                >
                  <MenuItem value="all">Todos los vendedores</MenuItem>
                  {filteredVendors.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.username}>
                      {vendor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Mensaje"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              <Button
                onClick={handleSendMessage}
                color="primary"
                variant="contained"
                sx={{ mt: 1 }}
              >
                Enviar
              </Button>
            </Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Notificaciones de Contratos
            </Typography>
            <List>
              {filteredContractNotifications.length > 0 ? (
                filteredContractNotifications.map((notif) => (
                  <ListItem key={notif.id}>
                    <ListItemIcon>
                      <Checkbox
                        checked={notif.read}
                        onChange={() => onMarkNotificationAsRead(notif.id)}
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">No hay notificaciones de contratos.</Typography>
              )}
            </List>
            <Typography variant="h6" color="primary" gutterBottom>
              Notificaciones de Stock
            </Typography>
            <List>
              {filteredStockNotifications.length > 0 ? (
                filteredStockNotifications.map((notif) => (
                  <ListItem key={notif.id}>
                    <ListItemIcon>
                      <Checkbox
                        checked={notif.read}
                        onChange={() => onMarkNotificationAsRead(notif.id)}
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">No hay notificaciones de stock.</Typography>
              )}
            </List>
            <Typography variant="h6" color="primary" gutterBottom>
              Total de Bombonas Disponibles
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                Bombonas Españolas: {totalEspanol}
              </Typography>
              <Typography variant="body1">
                Bombonas Francesas: {totalFrancesa}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Total General: {totalGeneral}
              </Typography>
            </Box>
          </>
        )}
        {currentUser.role === "vendor" && (
          <>
            <Typography variant="h6" color="primary" gutterBottom>
              Notificaciones de Contrato
            </Typography>
            <List>
              {filteredContractNotifications.length > 0 ? (
                filteredContractNotifications.map((notif) => (
                  <ListItem key={notif.id}>
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">No hay notificaciones de contratos.</Typography>
              )}
            </List>
            <Typography variant="h6" color="primary" gutterBottom>
              Mensajes Recibidos
              {unreadMessagesCount > 0 && (
                <Badge
                  badgeContent={unreadMessagesCount}
                  color="error"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            <List>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <ListItem
                    key={msg.id}
                    onClick={() => !msg.read && onMarkMessageAsRead(msg.id)}
                    sx={{
                      backgroundColor: msg.read ? "inherit" : "rgba(2, 136, 209, 0.1)",
                      cursor: "pointer",
                    }}
                  >
                    <ListItemText
                      primary={msg.content}
                      secondary={`De: ${msg.sender} - ${new Date(msg.timestamp).toLocaleString()}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">No hay mensajes.</Typography>
              )}
            </List>
          </>
        )}
        <Typography variant="h6" color="primary" gutterBottom>
          Puntos de Venta
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Cant. Española</TableCell>
              <TableCell>Cant. Francesa</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Expiración</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.address}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>{vendor.cylinders.espanol}</TableCell>
                <TableCell>{vendor.cylinders.francesa}</TableCell>
                <TableCell>{getVendorStatus(vendor)}</TableCell>
                <TableCell>
                  {vendor.contractEndDate
                    ? new Date(vendor.contractEndDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {currentUser.role === "vendor" && (
                    <>
                      <Button
                        onClick={() => onToggleActive(vendor.id)}
                        color={vendor.isActive ? "secondary" : "primary"}
                      >
                        {vendor.isActive ? "Desactivar" : "Activar"}
                      </Button>
                      <Button onClick={() => handleEdit(vendor)}>Editar</Button>
                    </>
                  )}
                  {currentUser.role === "admin" && shouldShowRenewButton(vendor) && (
                    <Button
                      onClick={() => onRenewContract(vendor.id)}
                      color="primary"
                    >
                      Renovar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {editingVendor && currentUser.role === "vendor" && (
          <Dialog open onClose={() => setEditingVendor(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Punto de Venta</DialogTitle>
            <DialogContent>
              <TextField
                label="Nombre"
                name="name"
                value={editingVendor.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Dirección"
                name="address"
                value={editingVendor.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Teléfono"
                name="phone"
                value={editingVendor.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Cantidad Española"
                name="espanol"
                type="number"
                value={editingVendor.cylinders.espanol}
                onChange={handleChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Cantidad Francesa"
                name="francesa"
                type="number"
                value={editingVendor.cylinders.francesa}
                onChange={handleChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 0 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingVendor(null)} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleSave} color="primary" variant="contained">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Dashboard;