// src/config/swaggerConfig.js

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0", // versão do OpenAPI
        info: {
            title: "API de Laudos Periciais",
            version: "1.0.0",
            description: "API para gerenciar e gerar laudos periciais odontológicos",
        },
        servers: [
            {
                url: "http://localhost:5000", // URL do seu servidor
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Caminho para os arquivos que contêm as rotas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
