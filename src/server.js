require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");  // Adicione esta linha

const app = express();

console.log("🔍 Rotas carregadas:", authRoutes); // Adicione essa linha

// Conectar ao MongoDB
connectDB();

// Configurações básicas
app.use(express.json()); // Para aceitar JSON no corpo das requisições
app.use(cors()); // Para permitir requisições de diferentes origens


// Configurar rotas de autenticação
app.use("/api/auth", authRoutes);

// Rota inicial para teste
app.get("/", (req, res) => {
    res.send("API de Laudos Periciais Rodando...");
});

// Definição da porta e inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
