const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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
    },

    // Atualizar dados do usuário (nome, email, senha)
    async updateUser(req, res) {
        try {
            const { id } = req.params; // ID do usuário vindo da URL
            const { nome, email, senha } = req.body;

            // Verifica se o usuário autenticado é o mesmo que está tentando atualizar os dados
            if (req.user.id !== id) {
                return res.status(403).json({ message: "Acesso negado. Você só pode alterar seus próprios dados." });
            }

            // Busca o usuário no banco
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Atualiza nome se foi enviado
            if (nome) user.nome = nome;

            // Atualiza email se foi enviado e verifica se já existe outro usuário com esse email
            if (email && email !== user.email) {
                const emailExists = await User.findOne({ email });
                if (emailExists) {
                    return res.status(409).json({ message: "Este e-mail já está em uso" });
                }
                user.email = email;
            }

            // Atualiza senha se foi enviada, criptografando antes de salvar
            if (senha) {
                user.senha = await bcrypt.hash(senha, 12);
            }

            // Salva as alterações
            await user.save();

            return res.status(200).json({ 
                message: "Usuário atualizado com sucesso!", 
                user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
            });

        } catch (error) {
            return handleError(res, error, "Erro ao atualizar usuário");
        }
    },

    // Listar todos os usuários
    async getAllUsers(req, res) {
        try {
            const users = await User.find({}, "id nome email role");
            return res.status(200).json(users);
        } catch (error) {
            return handleError(res, error, "Erro ao buscar usuários");
        }
    },

    // Deletar um usuário (Somente Admin pode excluir)
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            console.log("Tentando excluir o usuário com ID:", id);
            console.log("Usuário autenticado:", req.user);
    
            // Verifica se o usuário autenticado é ADMIN (ignora maiúsculas/minúsculas)
            if (req.user.role.toLowerCase() !== "admin") {
                return res.status(403).json({ message: "Acesso negado. Somente administradores podem excluir usuários." });
            }
                
            // Verifica se o ID é válido
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }
    
            // Busca o usuário no banco
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
    
            // Exclui o usuário
            await User.findByIdAndDelete(id);
            console.log("Usuário excluído com sucesso!");
    
            return res.status(200).json({ message: "Usuário excluído com sucesso!" });
    
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            return res.status(500).json({ message: "Erro ao excluir usuário", error: error.message });
        }
    }


};

module.exports = UserController;
