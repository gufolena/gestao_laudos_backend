const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Esta rota permite que um novo usuário se registre no sistema fornecendo nome, email, senha e role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro ao registrar usuário, e-mail já cadastrado ou role inválido
 *       500:
 *         description: Erro no servidor
 */

// Rota para registro de usuário (sem autenticação necessária)
router.post("/register", authController.register);



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     description: Esta rota realiza o login de um usuário e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *       400:
 *         description: E-mail ou senha inválidos
 *       500:
 *         description: Erro no servidor
 */

// Rota para login de usuário (sem autenticação necessária)
router.post("/login", authController.login);





// Exemplo de rota protegida (requere autenticação)
router.get("/perfil", authMiddleware, (req, res) => {
    // Rota de exemplo que retorna os dados do usuário autenticado
    res.json({ message: "Acesso autorizado", user: req.user });
});






module.exports = router;
