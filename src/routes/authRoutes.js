const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { body, validationResult } = require("express-validator");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Operações de autenticação, como login e registro de usuário
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Autenticação
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
router.post(
    "/register",
    [
        body("nome").notEmpty().withMessage("Nome é obrigatório"),
        body("email").isEmail().withMessage("E-mail inválido"),
        body("senha")
            .isLength({ min: 6 })
            .withMessage("Senha deve ter pelo menos 6 caracteres"),
        body("role")
            .isIn(["Admin", "Perito", "Assistente"])
            .withMessage("Role inválido"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    UserController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticação
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
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("E-mail inválido"),
        body("senha").notEmpty().withMessage("Senha é obrigatória"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    UserController.login
);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     tags:
 *       - Autenticação
 *     summary: Retorna os dados do usuário autenticado
 *     description: Esta rota retorna os dados do usuário autenticado (requer autenticação).
 *     responses:
 *       200:
 *         description: Acesso autorizado, dados do usuário retornados
 *       401:
 *         description: Não autorizado, token inválido ou expirado
 *       500:
 *         description: Erro no servidor
 */

// Exemplo de rota protegida (requere autenticação)
router.get("/perfil", authMiddleware, (req, res) => {
    // Rota de exemplo que retorna os dados do usuário autenticado
    res.json({ message: "Acesso autorizado", user: req.user });
});

module.exports = router;
