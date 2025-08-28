const express = require('express');
const dotenv = require('dotenv').config();
const routes = require('./routes/router');
const cors = require('cors');
const http = require('http');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación en http://localhost:${PORT}/api-docs`);
});
