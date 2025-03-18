const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Obter o token do cabeçalho Authorization
    const token = req.header("Authorization") && req.header("Authorization").replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    try {
        // Verificar o token usando a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Colocar os dados do usuário na requisição
        req.user = decoded;

        // Continuar para a próxima função ou rota
        next();
    } catch (error) {
        return res.status(400).json({ message: "Token inválido" });
    }
};

module.exports = authMiddleware;
