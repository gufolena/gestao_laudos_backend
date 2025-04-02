document.getElementById("formCadastroUsuario").addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtendo os valores do formulário
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const role = document.getElementById("role").value;
    const mensagemDiv = document.getElementById("mensagem");
    const erroSenha = document.getElementById("erroSenha");

    mensagemDiv.style.display = "none";
    erroSenha.textContent = "";

    // Validação dos campos
    if (!nome || !email || !senha || !role) {
        mensagemDiv.textContent = "Todos os campos são obrigatórios!";
        mensagemDiv.className = "mensagem erro";
        mensagemDiv.style.display = "block";
        return;
    }

    if (senha.length < 6) {
        erroSenha.textContent = "A senha deve ter pelo menos 6 caracteres.";
        erroSenha.style.color = "red";
        return;
    }

    // Criando objeto do usuário
    const usuarioData = { nome, email, senha, role };

    try {
        const response = await fetch("http://localhost:5000/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioData)
        });

        const result = await response.json();

        if (response.ok) {
            mensagemDiv.textContent = "Usuário cadastrado com sucesso!";
            mensagemDiv.className = "mensagem sucesso";
            mensagemDiv.style.display = "block";
            document.getElementById("formCadastroUsuario").reset();
        } else {
            mensagemDiv.textContent = "Erro: " + (result.message || "Não foi possível cadastrar.");
            mensagemDiv.className = "mensagem erro";
            mensagemDiv.style.display = "block";
        }
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        mensagemDiv.textContent = "Erro ao cadastrar usuário. Verifique sua conexão.";
        mensagemDiv.className = "mensagem erro";
        mensagemDiv.style.display = "block";
    }
});
