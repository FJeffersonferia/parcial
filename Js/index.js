const express = require('express');
const cors = require('cors');
const app = express();

// Configuración básica de CORS
app.use(cors());

// Rutas y otras configuraciones de tu servidor
app.post('/login', (req, res) => {
    // Lógica para manejar el inicio de sesión
    // Aquí deberías verificar el usuario y la contraseña
    // y luego responder con la información necesaria
    res.json({ success: true }); // Ejemplo de respuesta exitosa
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor iniciado en http://127.0.0.1:3000');
});
