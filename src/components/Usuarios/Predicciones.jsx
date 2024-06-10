import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Typography, Box,
  Checkbox, CircularProgress
} from '@mui/material';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';

const Predicciones = () => {
  const { auth } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [selectedVentas, setSelectedVentas] = useState([]);
  const [openVentaDialog, setOpenVentaDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(6);
  const [predictionSuccess, setPredictionSuccess] = useState(false); // Nuevo estado para controlar la visibilidad del mensaje de éxito
  const [predictionMessage, setPredictionMessage] = useState(""); // Nuevo estado para almacenar el mensaje de la predicción
  const [prediccion, setPrediccion] = useState();
  const [predictedAmount, setPredictedAmount] = useState(null); // Nuevo estado para almacenar la cantidad pronosticada

  useEffect(() => {
    fetchVentas();
  }, [currentPage]);

  const fetchVentas = async () => {
    try {
      const requestData = {
        NumeroPagina: currentPage,
        CantidadElementos: elementsPerPage,
      };
      const response = await axios.post(Global.url + 'venta/report', requestData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = response.data;
      setVentas(data.listaRecords || []);
    } catch (error) {
      console.error('Error al obtener ventas:', error);
    }
  };

  const handleCheck = (venta) => {
    setSelectedVentas((prevSelected) =>
      prevSelected.includes(venta)
        ? prevSelected.filter((v) => v !== venta)
        : [...prevSelected, venta]
    );
  };

  const handleOpenVentaDialog = () => {
    setOpenVentaDialog(true);
  };

  const handleCloseVentaDialog = () => {
    setOpenVentaDialog(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Registrar datos
      for (let venta of selectedVentas) {
        

        const data = {
          Producto: venta.Nombre,
          Metodo_Pago: venta.MetodoPago,
          Categoria: venta.Categoria,
          Proveedor: venta.RazonSocial,
          Frecuencia: venta.Frecuencia,
          PrecioTotal: venta.Precio * venta.Cantidad,
          PrecioDolar: venta.DolarActual || 1.0, // Assuming default value
          PrecioUnitario: venta.Precio,
          PrecioProveedor: venta.PrecioProveedor,
          Cantidad: venta.Cantidad,
          Fecha: venta.FechaCreacion,
        };


        const registrarResponse = await axios.post(Global.url2 + 'predict', data);
        const registrarData = registrarResponse.data;


        // Verificar si la predicción se realizó con éxito
        if (registrarData.mensaje === "Predicción realizada exitosamente") {
          // Mostrar el mensaje de éxito
          setPredictionSuccess(true);
          setPrediccion(registrarData);
          // Guardar el mensaje de la predicción
          setPredictionMessage(registrarData.mensaje);
          // Guardar la cantidad pronosticada
          setPredictedAmount(registrarData.inventario_predicho);
        } else {
          console.error('Error en la predicción:', registrarData.mensaje);
        }

        // Llamar API de PronosticoDemanda solo si la predicción se realizó con éxito
        
          const pronosticoData = {
            CantidadPronosticada: registrarData.inventario_predicho,
            Productos: [venta.Productoid]
          };


          const pronosticoResponse = await axios.post(Global.url + 'PronosticoDemanda', pronosticoData, {
              headers: { Authorization: `Bearer ${auth.token}` },
            });
          const pronosticoResult = pronosticoResponse.data;
              
          setDialogData((prevData) => [
            ...prevData,
            { ...venta, inventario_actual: registrarData.inventario_actual, inventario_predicho: registrarData.inventario_predicho, pronosticoResult }
          ]);
        
      }
    } catch (error) {
      console.error('Error en el proceso de predicción:', error);
} finally {
setLoading(false);
handleCloseVentaDialog();
}
};
return (
  <div>
  <Typography variant='h4' component='h4' sx={{ color: '#666', letterSpacing: '3px' }}>Gestión de Predicciones</Typography>
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow sx={{ backgroundColor: '#5a1acb' }}>
          <TableCell sx={{ color: 'white' }} align="center">Seleccionar</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Producto</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Cantidad</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Precio Unitario</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Precio Total</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Categoría</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Stock Actual</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Razon Social</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Frecuencia de Venta</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Fecha de Creación</TableCell>
          <TableCell sx={{ color: 'white' }} align="center">Método de Pago</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ventas.length > 0 ? (
          ventas.map((venta) => (
            <TableRow key={venta.VentaId}>
              <TableCell align="center">
                <Checkbox
                  checked={selectedVentas.includes(venta)}
                  onChange={() => handleCheck(venta)}
                />
              </TableCell>
              <TableCell align="center">{venta.Nombre}</TableCell>
              <TableCell align="center">{venta.Cantidad}</TableCell>
              <TableCell align="center">{venta.Precio}</TableCell>
              <TableCell align="center">{venta.Cantidad * venta.Precio}</TableCell>
              <TableCell align="center">{venta.Categoria}</TableCell>
              <TableCell align="center">{venta.CantidadInventario}</TableCell>
              <TableCell align="center">{venta.RazonSocial}</TableCell>
              <TableCell align="center">{venta.Frecuencia}</TableCell>
              <TableCell align="center">{new Date(venta.FechaCreacion).toLocaleDateString()}</TableCell>
              <TableCell align="center">{venta.MetodoPago}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} align="center">No hay Ventas disponibles</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>

  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
    <Button sx={{ m: 0, p: 0 }} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
      Anterior
    </Button>
    <Typography sx={{ mx: 2 }}>{currentPage}</Typography>
    <Button sx={{ m: 0, p: 0 }} disabled={ventas.length < elementsPerPage} onClick={() => setCurrentPage(currentPage + 1)}>
      Siguiente
    </Button>
  </Box>

  <Button
    sx={{ mt: 2 }}
    variant="outlined"
    color="primary"
    onClick={handleSubmit}
    disabled={selectedVentas.length === 0 || loading}
  >
    Realizar Predicción
  </Button>

  {/* Mensaje emergente de éxito */}
  <Dialog open={predictionSuccess} onClose={() => setPredictionSuccess(false)}>
    <DialogTitle>Predicción Realizada con Éxito</DialogTitle>
    <DialogContent>
      {/* Mostrar el mensaje de la predicción y la cantidad pronosticada */}
      <DialogContentText>{predictionMessage}</DialogContentText>
      {predictedAmount !== null && (
        <DialogContentText>Cantidad Pronosticada: {predictedAmount}</DialogContentText>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setPredictionSuccess(false)}>Cerrar</Button>
    </DialogActions>
  </Dialog>
</div>
);
};

export default Predicciones;