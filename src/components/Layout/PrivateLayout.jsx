import { Box, Backdrop, CircularProgress } from "@mui/material";
import { NavBar } from "./NavBar";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import useAuth from "../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular la verificación de autenticación
    const verifyAuth = async () => {
      setLoading(true);
      // Aquí puedes llamar a una función de verificación de autenticación si es necesario
      // Por ejemplo: await auth.verifyToken();
      setTimeout(() => {
        setLoading(false); // Simulación de la verificación
      }, 1000); // Puedes ajustar el tiempo según sea necesario
    };

    verifyAuth();
  }, [auth]);

  if (loading) {
    return (
      <Backdrop style={{ color: '#fff', zIndex: 1000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      {/* HEADER */}
      <NavBar />
      {/* BODY */}
      <Box sx={{ mt: 12 }}>
        {auth.token ? <Outlet /> : <Navigate to="/login" />}
      </Box>
    </>
  );
};
