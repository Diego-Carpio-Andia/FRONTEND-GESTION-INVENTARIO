import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { Grid, TableFooter, TableRow, TablePagination, Typography, TextField, Card } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';


export default function TablaHome() {
    const [rowsPerPage, setRowsPerPage] = useState(5); // Estado para la cantidad de filas por página
    const [informesCompra, setInformesCompra] = useState([]);
    const [informesVenta, setInformesVenta] = useState([]);
    const [informesTendencia, setInformesTendencia] = useState([]);
    const [informesActividad, setInformesActividad] = useState([]);
    const {auth} = useAuth();
    const Bearer = 'Bearer ' + auth.token; 

    useEffect(() => {        
        // Función para obtener los informes de tendencia
        const fetchInformesTendencia = async () => {
          try {
            const response = await fetch(Global.url + 'Informes/InformeTendencia', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization' : Bearer
              },
              body: JSON.stringify({ Cantidad: rowsPerPage })
            });
            const data = await response.json();
            setInformesTendencia(data);
          } catch (error) {
            console.error('Error al obtener informes de tendencia:', error);
          }
        };
    
       
        fetchInformesTendencia();
      }, [rowsPerPage]);
     // Actualizar cuando cambia la página


    const columnsTendencia = ["Nombre", "Precio", "Categoría", "Cantidad Pronosticada"];
    const dataTendencia = informesTendencia.map(item => [item.nombre, item.precio, item.categoria, item.cantidadPronosticada]);
    // Función para manejar el cambio en la cantidad de filas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };
 
  const options = {
    filterType: 'checkbox',
    responsive: 'standard',
    selectableRows: false,    
    elevation: 0,
    rowsPerPage: 4,    
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
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <TableFooter>
        <TableRow>
          <TablePagination
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => changePage(newPage)}
            onRowsPerPageChange={(event) => changeRowsPerPage(event.target.value)}
            labelRowsPerPage="Filas por página"
            rowsPerPageOptions={[3, 8, 18]}
          />
        </TableRow>
      </TableFooter>
    )
  };


    return (
        <>        
            <Card  sx={{mt:1.5,border: '2px solid #e6ebf1', boxShadow: '2px 2px 4px #e6ebf1'}}>
                <Grid container spacing={3}> 
                    <Grid item xs={12} xl={12} sx={{minHeight:500}}>
                    <MUIDataTable
                        title={<Typography sx={{ color:"#5a1acb" }} variant='h5'>Productos Tendencia</Typography>}
                        data={dataTendencia}
                        columns={columnsTendencia}
                        options={options}
                    />
                    </Grid>                
                </Grid>
            </Card>
        </>
    )
}
