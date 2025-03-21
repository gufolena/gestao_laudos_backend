const express = require('express');
const router = express.Router();
const EvidenceController = require('../controllers/evidenceController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/evidences:
 *   post:
 *     summary: Cria uma nova evidência
 *     description: Cria uma nova evidência e retorna os detalhes da evidência criada.
 *     tags: [Evidence]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               imagemURL:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evidência criada com sucesso.
 *       400:
 *         description: Erro ao criar evidência.
 */
router.post('/', authMiddleware, EvidenceController.createEvidence);

/**
 * @swagger
 * /api/evidences:
 *   get:
 *     summary: Retorna todas as evidências
 *     description: Retorna uma lista com todas as evidências cadastradas.
 *     tags: [Evidence]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de evidências retornada com sucesso.
 *       500:
 *         description: Erro ao buscar evidências.
 */
router.get('/', authMiddleware, EvidenceController.getAllEvidences);

/**
 * @swagger
 * /api/evidences/{id}:
 *   get:
 *     summary: Retorna uma evidência específica
 *     description: Busca e retorna uma evidência pelo seu ID.
 *     tags: [Evidence]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência a ser buscada
 *     responses:
 *       200:
 *         description: Evidência encontrada com sucesso.
 *       404:
 *         description: Evidência não encontrada.
 */
router.get('/:id', authMiddleware, EvidenceController.getEvidenceById);

/**
 * @swagger
 * /api/evidences/{id}:
 *   put:
 *     summary: Atualiza uma evidência
 *     description: Atualiza os dados de uma evidência existente.
 *     tags: [Evidence]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               imagemURL:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evidência atualizada com sucesso.
 *       404:
 *         description: Evidência não encontrada.
 */
router.put('/:id', authMiddleware, EvidenceController.updateEvidence);

/**
 * @swagger
 * /api/evidences/{id}:
 *   delete:
 *     summary: Remove uma evidência
 *     description: Remove uma evidência existente com base no ID.
 *     tags: [Evidence]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência a ser removida
 *     responses:
 *       200:
 *         description: Evidência removida com sucesso.
 *       404:
 *         description: Evidência não encontrada.
 */
router.delete('/:id', authMiddleware, EvidenceController.deleteEvidence);

module.exports = router;
