const express = require("express");
const CaseController = require("../controllers/caseController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/cases:
 *   post:
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
 *       500:
 *         description: Erro ao criar caso
 */
router.post("/", authMiddleware, CaseController.createCase);

/**
 * @swagger
 * /api/cases:
 *   get:
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
router.get("/:id", authMiddleware, CaseController.getCaseById);

/**
 * @swagger
 * /api/cases/{id}:
 *   put:
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
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.put("/:id", authMiddleware, CaseController.updateCase);

/**
 * @swagger
 * /api/cases/{id}/evidence:
 *   post:
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
router.post("/:id/evidence", authMiddleware, CaseController.addEvidenceToCase);

/**
 * @swagger
 * /api/cases/{id}/close:
 *   put:
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
router.put("/:id/close", authMiddleware, CaseController.closeCase);

module.exports = router;
