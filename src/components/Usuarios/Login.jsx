import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Global } from '../../helpers/global';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar la pantalla de carga
    setError(''); // Limpiar cualquier error previo
    try {
      const response = await axios.post(Global.url + 'Usuario/login', {
        email,
        password
      });
      const data = await response.data;
      localStorage.setItem('token', data.token);
      
      if(data.token){
        window.location.href = '/inventory/dashboard';
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Correo electrónico o contraseña incorrectos.');
      } else {
        console.error('Error al iniciar sesión:', error);
        setError('Error al iniciar sesión. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false); // Desactivar la pantalla de carga
    }
  };

  return (
    <Container sx={{p:3, border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: 2 }} maxWidth="xs">
      <Typography sx={{letterSpacing: 3, fontWeight: 'bolder', color: '#666666'}} variant="h4" align="center" gutterBottom>
        Iniciar Sesión
      </Typography>
      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleLogin}>
        <TextField
          label="Correo electrónico"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Typography sx={{mt:2}}>
          No tiene cuenta? <Link to="/registro">Regístrese aquí</Link>
        </Typography>
        <Button  sx={{mt:1}} type="submit" variant="contained" color="primary" fullWidth>
          Iniciar Sesión
        </Button>
      </form>
      <Backdrop style={{ color: '#fff', zIndex: 1000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default Login;
