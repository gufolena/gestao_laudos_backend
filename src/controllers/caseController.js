const Case = require("../models/caseModel");
const Evidence = require("../models/evidenceModel");

const CaseController = {
    /**
     * Cria um novo caso pericial.
     */
    async createCase(req, res) {
        try {
            const { titulo, descricao } = req.body;

            const newCase = new Case({
                titulo,
                descricao
            });

            await newCase.save();
            return res.status(201).json({ message: "Caso criado com sucesso!", case: newCase });
        } catch (error) {
            console.error("Erro ao criar caso:", error);
            return res.status(500).json({ message: "Erro ao criar caso", error: error.message });
        }
    },

    /**
     * Retorna todos os casos periciais.
     */
    async getAllCases(req, res) {
        try {
            const cases = await Case.find().populate("evidencias");
            return res.status(200).json(cases);
        } catch (error) {
            console.error("Erro ao buscar casos:", error);
            return res.status(500).json({ message: "Erro ao buscar casos", error: error.message });
        }
    },

    /**
     * Retorna um caso específico pelo ID.
     */
    async getCaseById(req, res) {
        try {
            const { id } = req.params;
            const caseData = await Case.findById(id).populate("evidencias");

            if (!caseData) {
                return res.status(404).json({ message: "Caso não encontrado" });
            }

            return res.status(200).json(caseData);
        } catch (error) {
            console.error("Erro ao buscar caso:", error);
            return res.status(500).json({ message: "Erro ao buscar caso", error: error.message });
        }
    },

    /**
     * Atualiza um caso pericial.
     */
    async updateCase(req, res) {
        try {
            const { id } = req.params;
            const { titulo, descricao, status } = req.body;

            const updatedCase = await Case.findByIdAndUpdate(
                id,
                { titulo, descricao, status },
                { new: true }
            );

            if (!updatedCase) {
                return res.status(404).json({ message: "Caso não encontrado" });
            }

            return res.status(200).json({ message: "Caso atualizado com sucesso!", case: updatedCase });
        } catch (error) {
            console.error("Erro ao atualizar caso:", error);
            return res.status(500).json({ message: "Erro ao atualizar caso", error: error.message });
        }
    },

    /**
     * Adiciona uma evidência a um caso.
     */
    async addEvidenceToCase(req, res) {
        try {
            const { id } = req.params;
            const { evidenceId } = req.body;

            const caseData = await Case.findById(id);
            const evidence = await Evidence.findById(evidenceId);

            if (!caseData || !evidence) {
                return res.status(404).json({ message: "Caso ou evidência não encontrados" });
            }

            await caseData.addEvidence(evidenceId);
            return res.status(200).json({ message: "Evidência adicionada ao caso com sucesso!", case: caseData });
        } catch (error) {
            console.error("Erro ao adicionar evidência ao caso:", error);
            return res.status(500).json({ message: "Erro ao adicionar evidência ao caso", error: error.message });
        }
    },

    /**
     * Finaliza um caso, atualizando seu status e registrando a data de fechamento.
     */
    async closeCase(req, res) {
        try {
            const { id } = req.params;
            const caseData = await Case.findById(id);

            if (!caseData) {
                return res.status(404).json({ message: "Caso não encontrado" });
            }

            await caseData.updateStatus("Finalizado");
            return res.status(200).json({ message: "Caso finalizado com sucesso!", case: caseData });
        } catch (error) {
            console.error("Erro ao finalizar caso:", error);
            return res.status(500).json({ message: "Erro ao finalizar caso", error: error.message });
        }
    }
};

module.exports = CaseController;
