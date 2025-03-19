const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },

    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor, insira um email válido."]
    },

    senha: { type: String, required: true },

    role: { 
      type: String, 
      enum: ["Admin", "Perito", "Assistente"], 
      default: "Perito" 
    }
  },
  { timestamps: true }
);

// Remover a senha ao retornar JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
