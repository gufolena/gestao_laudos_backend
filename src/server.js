require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const caseRoutes = require("./routes/caseRoutes"); 
const setupSwagger = require("./config/swaggerConfig");

const app = express();

// Garantir que a pasta 'logs' exista
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Criar um stream para salvar os logs em um arquivo
const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });

// Middleware para registrar logs no arquivo
app.use(morgan("combined", { stream: accessLogStream }));

// Middleware para exibir logs no terminal (opcional)
app.use(morgan("dev"));

console.log("🔍 Rotas carregadas:", userRoutes); 

// Conectar ao MongoDB
connectDB();

// Configurações básicas
app.use(express.json()); // Para aceitar JSON no corpo das requisições
app.use(cors()); // Para permitir requisições de diferentes origens

// Configurar rotas de autenticação
app.use("/api/user", userRoutes);

// Configurar rotas de Casos Periciais
app.use("/api/cases", caseRoutes); 

// Configurar a documentação do Swagger
setupSwagger(app);

// Rota inicial para teste
app.get("/", (req, res) => {
    res.send("API de Laudos Periciais Rodando...");
});

// Definição da porta e inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
