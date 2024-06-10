import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { Grid, TableFooter, TableRow, TablePagination, Typography, TextField } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';

const Informes = () => {
  const [informesCompra, setInformesCompra] = useState([]);
  const [informesVenta, setInformesVenta] = useState([]);
  const [informesTendencia, setInformesTendencia] = useState([]);
  const [informesActividad, setInformesActividad] = useState([]);
  const {auth} = useAuth();
  const Bearer = 'Bearer ' + auth.token; 

  useEffect(() => {
    // Función para obtener los informes de compra
    const fetchInformesCompra = async () => {
      try {
        const response = await fetch(Global.url + 'Informes/InformeCompra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : Bearer
          },
        });
        const data = await response.json();
        setInformesCompra(data);
      } catch (error) {
        console.error('Error al obtener informes de compra:', error);
      }
    };

    // Función para obtener los informes de venta
    const fetchInformesVenta = async () => {
      try {
        const response = await fetch(Global.url + 'Informes/InformeVenta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : Bearer
          },
        });
        const data = await response.json();
        setInformesVenta(data);
      } catch (error) {
        console.error('Error al obtener informes de venta:', error);
      }
    };

    // Función para obtener los informes de tendencia
    const fetchInformesTendencia = async () => {
      try {
        const response = await fetch(Global.url + 'Informes/InformeTendencia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : Bearer
          },
        });
        const data = await response.json();
        setInformesTendencia(data);
      } catch (error) {
        console.error('Error al obtener informes de tendencia:', error);
      }
    };

    // Realizar las solicitudes cuando se monta el componente
    fetchInformesCompra();
    fetchInformesVenta();
    fetchInformesTendencia();
  }, []);

  const columnsCompra = ["Producto", "Precio", "Categoría", "Cantidad", "Total Comprado"];
  const dataCompra = informesCompra.map(item => [item.producto, item.precio, item.categoria, item.cantidad, item.totalcomprado]);

  const columnsVenta = ["Producto", "Precio", "Categoría", "Cantidad", "Total Vendido"];
  const dataVenta = informesVenta.map(item => [item.producto, item.precio, item.categoria, item.cantidad, item.totalvendido]);

  const columnsTendencia = ["Nombre", "Precio", "Categoría", "Cantidad Pronosticada"];
  const dataTendencia = informesTendencia.map(item => [item.nombre, item.precio, item.categoria, item.cantidadPronosticada]);

  const columnsActividad = ["Tipo", "Descripción"];
  const dataActividad = informesActividad.map(item => [item.Tipo, item.Descripcion]);

  const options = {
    filterType: 'checkbox',
    responsive: 'standard',
    selectableRows: false,
    rowsPerPage: 10,
    textLabels: {
      body: {
        noMatch: "No se encontraron registros",
        toolTip: "Ordenar",
      },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver columnas",
        filterTable: "Filtrar tabla",
      },
      viewColumns: {
        title: "Mostrar columnas",
        titleAria: "Mostrar/Ocultar columnas de tabla",
      },
      selectedRows: {
        text: "fila(s) seleccionada(s)",
        delete: "Eliminar",
        deleteAria: "Eliminar filas seleccionadas",
      },
    }   
  };

  

  return (
    <>
      <Typography variant='h4' component='h4' sx={{ mb: 3, color:'#666', letterSpacing:'3px' }}>Informe de algunos productos en tendencia</Typography>
      <Grid container spacing={3} sx={{mb: 6}}>
        <Grid item xs={12} xl={12}>
          <MUIDataTable
            title={<Typography sx={{ color:"#5a1acb" }} variant='h6'>Tendencia</Typography>}
            data={dataTendencia}
            columns={columnsTendencia}
            options={options}
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <MUIDataTable
            title={<Typography sx={{ color:"#5a1acb" }} variant='h6'>Compras</Typography>}
            data={dataCompra}
            columns={columnsCompra}
            options={options}
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <MUIDataTable
            title={<Typography sx={{ color:"#5a1acb" }} variant='h6'>Ventas</Typography>}
            data={dataVenta}
            columns={columnsVenta}
            options={options}
          />
        </Grid>
        {/* <Grid item xs={12} xl={4}>
          <MUIDataTable
            title={<Typography sx={{ color:"#5a1acb" }} variant='h6'>Actividad</Typography>}
            data={dataActividad}
            columns={columnsActividad}
            options={options}
          />
        </Grid> */}
      </Grid>
    </>
  );
}

export default Informes;
