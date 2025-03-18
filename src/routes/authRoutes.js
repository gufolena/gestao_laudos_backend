const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rota para registro de usuário (sem autenticação necessária)
router.post("/register", authController.register);

// Rota para login de usuário (sem autenticação necessária)
router.post("/login", authController.login);


// Exemplo de rota protegida (requere autenticação)
router.get("/perfil", authMiddleware, (req, res) => {
    // Rota de exemplo que retorna os dados do usuário autenticado
    res.json({ message: "Acesso autorizado", user: req.user });
});






module.exports = router;
