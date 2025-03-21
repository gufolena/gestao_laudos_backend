const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Função para lidar com erros
const handleError = (res, error, message = "Erro interno do servidor") => {
    console.error(message, error);
    return res.status(500).json({ message });
};

const UserController = {
    // Registro de novo usuário
    async register(req, res) {
        try {
            const { nome, email, senha, role } = req.body;

            // Verifica se o e-mail já está cadastrado
            if (await User.findOne({ email })) {
                return res.status(409).json({ message: "E-mail já cadastrado" });
            }

            // Criptografa a senha com maior segurança
            const hashedPassword = await bcrypt.hash(senha, 12);

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
            return handleError(res, error, "Erro ao registrar usuário");
        }
    },

    // Login do usuário
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Verifica se o usuário existe
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "E-mail ou senha incorretos" });
            }

            // Verifica se a senha está correta
            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "E-mail ou senha incorretos" });
            }

            // Verifica se a chave JWT_SECRET está configurada
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET não definido.");
                return res.status(500).json({ message: "Erro interno do servidor" });
            }

            // Gera um token JWT
            const token = jwt.sign(
                { id: user._id, nome: user.nome, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "3h" }
            );

            return res.status(200).json({ 
                message: "Login bem-sucedido", 
                token,
                user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
            });

        } catch (error) {
            return handleError(res, error, "Erro ao fazer login");
        }
    }
};

module.exports = UserController;
