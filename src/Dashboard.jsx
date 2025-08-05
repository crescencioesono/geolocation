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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Dashboard = ({ vendors, onUpdateVendor, onClose }) => {
  const [editingVendor, setEditingVendor] = useState(null);

  const handleEdit = (vendor) => {
    setEditingVendor({ ...vendor });
  };

  const handleSave = () => {
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

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Dashboard de Vendedores
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Cant. Española</TableCell>
              <TableCell>Cant. Francesa</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.address}</TableCell>
                <TableCell>{vendor.cylinders.espanol}</TableCell>
                <TableCell>{vendor.cylinders.francesa}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(vendor)}>Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {editingVendor && (
          <Dialog open onClose={() => setEditingVendor(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Vendedor</DialogTitle>
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