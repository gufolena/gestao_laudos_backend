const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { body, validationResult } = require("express-validator");

const router = express.Router();


/**
 * @swagger
 * tags:
 * - name: Usuários
 * description: Operações relacionadas a usuários, incluindo autenticação (registro e login) e gerenciamento (listar, atualizar, deletar).
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags:
 *       - Usuários
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
 * /api/user/login:
 *   post:
 *     tags:
 *       - Usuários
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
 * /api/user/buscar:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Retorna todos os usuários cadastrados
 *     description: |
 *       Obtém a lista de todos os usuários cadastrados no sistema.
 *       **Apenas administradores podem acessar esta rota.**
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID do usuário.
 *                   nome:
 *                     type: string
 *                     description: Nome do usuário.
 *                   email:
 *                     type: string
 *                     description: Endereço de e-mail do usuário.
 *                   role:
 *                     type: string
 *                     enum: ["Admin", "Perito", "Assistente"]
 *                     description: Papel do usuário no sistema.
 *       403:
 *         description: Acesso negado. Apenas administradores podem visualizar todos os usuários.
 *       500:
 *         description: Erro interno do servidor.
 */

router.get("/buscar", authMiddleware, UserController.getAllUsers);


/**
 * @swagger
 * /api/user/atualizar/{id}:
 *   put:
 *     tags:
 *       - Usuários
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

router.put("/atualizar/:id", authMiddleware, UserController.updateUser);



/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     tags:
 *       - Usuários
 *     summary: Deleta um usuário
 *     description: |
 *       Permite que um **administrador** exclua um usuário do sistema. 
 *       **Somente administradores podem excluir usuários.**
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser excluído.
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *       403:
 *         description: Acesso negado. Somente administradores podem excluir usuários.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete("/delete/:id", authMiddleware, UserController.deleteUser); 


module.exports = router;
