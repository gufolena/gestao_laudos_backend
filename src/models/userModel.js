const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Perito", "Assistente"], default: "Perito" }
}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
