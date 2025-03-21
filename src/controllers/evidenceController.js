const Evidence = require('../models/evidenceModel');

const EvidenceController = {
  /**
   * Cria uma nova evidência
   */
  async createEvidence(req, res) {
    try {
      const { tipo, descricao, imagemURL, conteudo } = req.body;
      const userId = req.user.id;

      const evidence = new Evidence({
        tipo,
        descricao,
        imagemURL,
        conteudo,
        coletadoPor: userId
      });

      await evidence.save();
      return res.status(201).json({ message: 'Evidência criada com sucesso', evidence });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar evidência', error });
    }
  },

  /**
   * Busca todas as evidências
   */
  async getAllEvidence(req, res) {
    try {
      const evidences = await Evidence.find().populate('coletadoPor', 'nome email');
      return res.status(200).json(evidences);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar evidências', error });
    }
  },

  /**
   * Busca uma evidência por ID
   */
  async getEvidenceById(req, res) {
    try {
      const { id } = req.params;
      const evidence = await Evidence.findById(id).populate('coletadoPor', 'nome email');

      if (!evidence) {
        return res.status(404).json({ message: 'Evidência não encontrada' });
      }

      return res.status(200).json(evidence);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar evidência', error });
    }
  },

  /**
   * Atualiza uma evidência
   */
  async updateEvidence(req, res) {
    try {
      const { id } = req.params;
      const { descricao, imagemURL, conteudo } = req.body;

      const evidence = await Evidence.findByIdAndUpdate(
        id,
        { descricao, imagemURL, conteudo },
        { new: true }
      );

      if (!evidence) {
        return res.status(404).json({ message: 'Evidência não encontrada' });
      }

      return res.status(200).json({ message: 'Evidência atualizada com sucesso', evidence });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao atualizar evidência', error });
    }
  },

  /**
   * Deleta uma evidência
   */
  async deleteEvidence(req, res) {
    try {
      const { id } = req.params;

      const evidence = await Evidence.findByIdAndDelete(id);

      if (!evidence) {
        return res.status(404).json({ message: 'Evidência não encontrada' });
      }

      return res.status(200).json({ message: 'Evidência removida com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar evidência', error });
    }
  }
};

module.exports = EvidenceController;
