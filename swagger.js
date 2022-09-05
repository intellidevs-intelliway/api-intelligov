const swaggerAutogen = require('swagger-autogen')({ language: 'pt-BR', openapi: '3.0.0' })

const doc = {
    info: {
      title: 'Intelligov',
      description: '',
    },
    servers:[
      {url:'http://localhost:3333'}, 
      // {url:'https://aplysia-backend.herokuapp.com'}
    ],
    securityDefinitions:{
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    definitions: {
      Login: {
        email: 'admin@intelligov.com.br',
        password: '17260201'
      },      
    },
  };
  

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./src/server')           // Your project's root file
});