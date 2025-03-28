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
 *     description: |
 *       Registra um novo usuário no sistema fornecendo nome, email, senha e role. 
 *       
 *       **Roles permitidas:**
 *       - **Admin**: Acesso completo ao sistema, incluindo gerenciamento de usuários.
 *       - **Perito**: Responsável por cadastrar casos, analisar evidências e gerar laudos.
 *       - **Assistente**: Auxilia na coleta e envio de evidências.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do usuário.
 *               email:
 *                 type: string
 *                 description: Endereço de e-mail válido.
 *               senha:
 *                 type: string
 *                 description: Senha com no mínimo 6 caracteres.
 *               role:
 *                 type: string
 *                 description: Papel do usuário no sistema.
 *                 enum: ["Admin", "Perito", "Assistente"]
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Erro ao registrar usuário. Possíveis motivos incluem e-mail já cadastrado ou role inválido.
 *       500:
 *         description: Erro interno do servidor.
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


/**
 * @swagger
 * /api/auth/{id}:
 *   put:
 *     tags:
 *       - Autenticação
 *     summary: Atualiza os dados do usuário autenticado
 *     description: >
 *       Permite que um usuário autenticado atualize seus próprios dados, como nome, e-mail e senha. 
 *       **Somente o próprio usuário pode modificar seus dados.**
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do usuário.
 *               email:
 *                 type: string
 *                 description: Novo e-mail do usuário.
 *               senha:
 *                 type: string
 *                 description: Nova senha do usuário.
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: >
 *           Erro na requisição. Possíveis causas:
 *           - E-mail já cadastrado.
 *           - Dados inválidos.
 *       403:
 *         description: Acesso negado. O usuário não pode modificar outro usuário.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

router.put("/:id", authMiddleware, UserController.updateUser);


module.exports = router;
