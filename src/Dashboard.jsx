import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Dashboard = ({ vendors, onUpdateVendor, onClose }) => {
  const [editingVendor, setEditingVendor] = useState(null);

  const handleEdit = (vendor) => {
    setEditingVendor({ ...vendor });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingVendor({ ...editingVendor, [name]: name === "quantity" ? Number(value) : value });
  };

  const handleSave = () => {
    if (
      !editingVendor.name.trim() ||
      !editingVendor.address.trim() ||
      !editingVendor.cylinderType ||
      !editingVendor.quantity
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    onUpdateVendor(editingVendor);
    setEditingVendor(null);
  };

  const handleCancel = () => {
    setEditingVendor(null);
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
        maxWidth: "600px",
        width: "90%",
        zIndex: 1000,
        maxHeight: "80vh",
        overflow: "auto",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: "8px", right: "8px" }}
      >
        <CloseIcon />
      </IconButton>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Tipo de bombona</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                {editingVendor && editingVendor.id === vendor.id ? (
                  <>
                    <TableCell>
                      <TextField
                        name="name"
                        value={editingVendor.name}
                        onChange={handleChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="address"
                        value={editingVendor.address}
                        onChange={handleChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          name="cylinderType"
                          value={editingVendor.cylinderType}
                          onChange={handleChange}
                        >
                          <MenuItem value="Española">Española</MenuItem>
                          <MenuItem value="Francesa">Francesa</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="quantity"
                        type="number"
                        value={editingVendor.quantity}
                        onChange={handleChange}
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={handleSave} color="primary" variant="contained" size="small">
                        Guardar
                      </Button>
                      <Button onClick={handleCancel} color="secondary" size="small" sx={{ ml: 1 }}>
                        Cancelar
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.address}</TableCell>
                    <TableCell>{vendor.cylinderType}</TableCell>
                    <TableCell>{vendor.quantity}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(vendor)} color="primary" size="small">
                        Editar
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Dashboard;