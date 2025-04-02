console.log("login.js carregado corretamente!");

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("formLogin").addEventListener("submit", async function (event) {
        event.preventDefault(); // Impede o envio tradicional do formulário

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        // Verifica se os campos estão preenchidos
        if (!email || !senha) {
            mostrarMensagem("Preencha todos os campos!", "red");
            return;
        }

        const loginData = { email, senha };

        try {
            const response = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok) {
                mostrarMensagem("Login realizado com sucesso!", "green");

                // Armazena o token no localStorage
                localStorage.setItem("token", result.token);

                // Redireciona após um curto delay
                setTimeout(() => {
                    window.location.href = "cadastro_caso.html";
                }, 1000);
            } else {
                mostrarMensagem(result.message || "Erro ao fazer login!", "red");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            mostrarMensagem("Erro ao conectar-se ao servidor!", "red");
        }
    });

    function mostrarMensagem(mensagem, cor) {
        const mensagemDiv = document.getElementById("mensagem");
        mensagemDiv.textContent = mensagem;
        mensagemDiv.style.color = cor;
        mensagemDiv.style.display = "block";
    }
});
