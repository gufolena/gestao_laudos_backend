const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserController = {
    // Registro de novo usuário
    async register(req, res) {
        try {
            const { nome, email, senha, role } = req.body;

            // Verifica se o e-mail já está cadastrado
            if (await User.findOne({ email })) {
                return res.status(400).json({ message: "E-mail já cadastrado" });
            }

            // Definição de roles permitidos
            const validRoles = ["Admin", "Perito", "Assistente"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Role inválido. Escolha entre: Admin, Perito ou Assistente" });
            }

            // Criptografa a senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Cria e salva o usuário
            const newUser = await User.create({
                nome,
                email,
                senha: hashedPassword,
                role
            });

            return res.status(201).json({ 
                message: "Usuário registrado com sucesso!",
                user: { id: newUser._id, nome: newUser.nome, email: newUser.email, role: newUser.role }
            });

        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            return res.status(500).json({ message: "Erro ao registrar usuário", error: error.message });
        }
    },

    // Login do usuário
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Verifica se o usuário existe
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "E-mail ou senha incorretos" });
            }

            // Verifica se a senha está correta
            if (!await bcrypt.compare(senha, user.senha)) {
                return res.status(400).json({ message: "E-mail ou senha incorretos" });
            }

            // Gera um token JWT
            const token = jwt.sign(
                { id: user._id, nome: user.nome, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "2h" } // Tempo de expiração ajustado para 2 horas
            );

            return res.status(200).json({ 
                message: "Login bem-sucedido", 
                token,
                user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
            });

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            return res.status(500).json({ message: "Erro ao fazer login", error: error.message });
        }
    }
};

module.exports = UserController;
