const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Votaciones',
      version: '1.0.0',
      description: 'Documentación de la API de votaciones',
    },
    servers: [
      {
        url: 'http://localhost:9999', // cambia si usas otro puerto
      },
    ],
  },
  apis: ['./routes/*.js'], // aquí se documentarán tus rutas
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
