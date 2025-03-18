const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
    // Registro de novo usuário
    async register(req, res) {
        try {
            const { nome, email, senha, role } = req.body;

            // Verifica se o e-mail já está cadastrado
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "E-mail já cadastrado" });
            }

            // Verificação do role (você pode modificar essa lógica conforme os papéis no seu sistema)
            const validRoles = ["Admin", "Perito", "Assistente"]; // Adicione roles válidos
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Role inválido" });
            }

            // Criptografa a senha antes de salvar
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(senha, salt);

            // Cria o usuário
            const newUser = new User({
                nome,
                email,
                senha: hashedPassword,
                role
            });

            await newUser.save();

            return res.status(201).json({ message: "Usuário registrado com sucesso!" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao registrar usuário", error });
        }
    },

    // Login do usuário
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Verifica se o usuário existe
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Credenciais inválidas" });
            }

            // Verifica se a senha está correta
            const isMatch = await bcrypt.compare(senha, user.senha);
            if (!isMatch) {
                return res.status(400).json({ message: "Credenciais inválidas" });
            }

            // Gera um token JWT
            const token = jwt.sign(
                { id: user._id, nome: user.nome, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" } // Tempo de expiração ajustado para 1 hora
            );

            return res.status(200).json({ message: "Login bem-sucedido", token });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao fazer login", error });
        }
    }
};

module.exports = authController;
