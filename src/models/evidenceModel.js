const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['Imagem', 'Texto'],
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  dataColeta: {
    type: Date,
    default: Date.now
  },
  coletadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imagemURL: {
    type: String,
    required: function() { return this.tipo === 'Imagem'; }
  },
  conteudo: {
    type: String,
    required: function() { return this.tipo === 'Texto'; }
  }
});

const Evidence = mongoose.model('Evidence', EvidenceSchema);
module.exports = Evidence;
