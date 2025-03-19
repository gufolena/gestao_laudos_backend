const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Em andamento", "Finalizado", "Arquivado"], 
        default: "Em andamento" 
    },
    dataAbertura: { type: Date, default: Date.now },
    dataFechamento: { type: Date },
    evidencias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evidence" }] // Relacionamento com evidências
}, { timestamps: true });

/**
 * Adiciona uma evidência ao caso.
 */
CaseSchema.methods.addEvidence = function (evidenceId) {
    this.evidencias.push(evidenceId);
    return this.save();
};

/**
 * Atualiza o status do caso e define a data de fechamento caso seja finalizado.
 */
CaseSchema.methods.updateStatus = function (novoStatus) {
    this.status = novoStatus;
    if (novoStatus === "Finalizado") {
        this.dataFechamento = new Date();
    }
    return this.save();
};

/**
 * Método para gerar um relatório a partir do caso.
 * Retorna um objeto com os dados principais do caso.
 */
CaseSchema.methods.generateReport = function () {
    return {
        titulo: this.titulo,
        descricao: this.descricao,
        status: this.status,
        dataAbertura: this.dataAbertura,
        dataFechamento: this.dataFechamento,
        totalEvidencias: this.evidencias.length
    };
};

const CaseModel = mongoose.model("Case", CaseSchema);
module.exports = CaseModel;
