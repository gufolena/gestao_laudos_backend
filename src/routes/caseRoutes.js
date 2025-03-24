const express = require("express");
const CaseController = require("../controllers/caseController");
const authMiddleware = require("../middlewares/authMiddleware");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();

// Middleware de validação
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   - name: Casos
 *     description: Operações relacionadas a casos periciais
 */

/**
 * @swagger
 * /api/cases:
 *   post:
 *     tags:
 *       - Casos
 *     summary: Cria um novo caso pericial
 *     description: Endpoint para cadastrar um novo caso no sistema.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar caso
 */
router.post(
  "/",
  authMiddleware,
  [
    body("titulo").notEmpty().withMessage("Título é obrigatório"),
    body("descricao").notEmpty().withMessage("Descrição é obrigatória"),
  ],
  validateRequest,
  CaseController.createCase
);

/**
 * @swagger
 * /api/cases:
 *   get:
 *     tags:
 *       - Casos
 *     summary: Retorna todos os casos
 *     description: Retorna a lista de todos os casos cadastrados no sistema.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *       500:
 *         description: Erro ao buscar casos
 */
router.get("/", authMiddleware, CaseController.getAllCases);

/**
 * @swagger
 * /api/cases/{id}:
 *   get:
 *     tags:
 *       - Casos
 *     summary: Retorna um caso pelo ID
 *     description: Busca e retorna um caso específico pelo ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caso encontrado
 *       404:
 *         description: Caso não encontrado
 */
router.get(
  "/:id",
  authMiddleware,
  param("id").isMongoId().withMessage("ID inválido"),
  validateRequest,
  CaseController.getCaseById
);

/**
 * @swagger
 * /api/cases/{id}:
 *   put:
 *     tags:
 *       - Casos
 *     summary: Atualiza um caso existente
 *     description: Permite modificar um caso pericial.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do caso
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada do caso
 *               status:
 *                 type: string
 *                 description: Status do caso
 *                 enum: ["Aberto", "Em Análise", "Finalizado"]
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       404:
 *         description: Caso não encontrado
 *       400:
 *         description: Dados inválidos
 */

router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("titulo").optional().notEmpty().withMessage("Título não pode ser vazio"),
    body("descricao").optional().notEmpty().withMessage("Descrição não pode ser vazia"),
    body("status").optional().isIn(["Aberto", "Em Análise", "Finalizado"]).withMessage("Status inválido"),
  ],
  validateRequest,
  CaseController.updateCase
);

/**
 * @swagger
 * /api/cases/{id}/evidence:
 *   post:
 *     tags:
 *       - Casos
 *     summary: Adiciona evidência a um caso
 *     description: Vincula uma evidência existente a um caso pericial.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evidenceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evidência adicionada com sucesso
 *       404:
 *         description: Caso ou evidência não encontrados
 */
router.post(
  "/:id/evidence",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("evidenceId").isMongoId().withMessage("ID da evidência inválido"),
  ],
  validateRequest,
  CaseController.addEvidenceToCase
);

/**
 * @swagger
 * /api/cases/{id}/close:
 *   put:
 *     tags:
 *       - Casos
 *     summary: Finaliza um caso pericial
 *     description: Atualiza o status de um caso para "Finalizado".
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caso finalizado com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.put(
  "/:id/close",
  authMiddleware,
  param("id").isMongoId().withMessage("ID inválido"),
  validateRequest,
  CaseController.closeCase
);

module.exports = router;
