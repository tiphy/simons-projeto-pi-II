const API_URL = 'http://localhost:5500/produtos';

// ================== LÓGICA DE LOGIN ==================
// Arquivo: /src/js/auth.js

// 1. Função para ir para a página de login
function login() {
    window.location.href = "/src/app/pagina-login/pagina-login.html";
}

// 2. Função para ir para a página de cadastro (Ação do botão "Criar Conta")
function criarConta() {
    window.location.href = "/src/app/pagina-login/pagina-cadastro.html";
}

// 3. FUNÇÃO DE CADASTRO (Nova!)
function realizarCadastro(event) {
    event.preventDefault(); // Não deixa a página recarregar

    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;

    // Validação: Senhas conferem?
    if (senha !== confirmaSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    // Pega a lista de usuários que já existe (ou cria uma vazia)
    let listaUsuarios = JSON.parse(localStorage.getItem('usuariosSimons')) || [];

    // Validação: Email já existe?
    const usuarioExiste = listaUsuarios.find(u => u.email === email);
    if (usuarioExiste) {
        alert("Este email já está cadastrado!");
        return;
    }

    // Cria o novo usuário
    const novoUsuario = {
        email: email,
        senha: senha
    };

    // Adiciona na lista e salva no navegador
    listaUsuarios.push(novoUsuario);
    localStorage.setItem('usuariosSimons', JSON.stringify(listaUsuarios));
    login(); // Redireciona para a tela de login
}

// 4. FUNÇÃO DE LOGIN (Atualizada para ler os cadastros)
function entrar(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Verifica se é o ADMIN (Regra Fixa)
    if (email === "admin@gmail.com" && senha === "admin123") {
        window.location.href = "/src/app/pagina-admin/pagina-admin.html";
        return;
    }

    // Se não for admin, procura na lista de usuários cadastrados
    let listaUsuarios = JSON.parse(localStorage.getItem('usuariosSimons')) || [];
    
    // Procura um usuário que tenha ESSE email E ESSA senha
    const usuarioEncontrado = listaUsuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
        alert("Login realizado com sucesso!");
        // Redireciona para a Home (Página do Cliente)
        window.location.href = "/src/app/pagina-home/pagina-home.html";
    } else {
        alert("Email ou senha incorretos!");
    }
}

// Funções auxiliares
function senha() {
    alert("Funcionalidade de recuperar senha em desenvolvimento!");
}

// ================== NAVEGAÇÃO ==================

window.camisetas = () => { window.location.href = '/src/app/pagina-camisetas/pagina-camisetas.html' };
window.socialCliente = () => { window.location.href = '/src/app/pagina-social-cliente/pagina-social-cliente.html' };
window.socialAdmin = () => { window.location.href = '/src/app/pagina-social/pagina-social.html' };
window.camisetasAdmin = () => { window.location.href = '/src/app/pagina-camisetas-admin/pagina-camisetas-admin.html' };
window.editarPrd = (id) => { 
    // Salva o ID no navegador para saber qual editar na outra página
    localStorage.setItem('idProdutoEditar', id);
    window.location.href = '/src/app/pagina-editar/pagina-editar.html' 
};

// Adiciona isto no final do ficheiro simons/src/js/auth.js

window.irParaCarrinho = () => { 
    window.location.href = '/src/app/pagina-carrinho/pagina-carrinho.html'; 
};

// ================== CRUD (ADMIN) ==================

// Função para carregar produtos na tela de admin
async function carregarProdutosAdmin(categoriaContainer) {
    // Verifica se existe o container na página antes de tentar carregar
    const container = document.getElementById('lista-produtos-dinamica');
    
    if (!container) return; // Se não estiver na página certa, não faz nada

    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();

        container.innerHTML = ''; // Limpa o HTML atual

        produtos.forEach(produto => {
            const html = `
            <div class="produto" id="${produto._id}">
                <img class="camiseta-img" src="${produto.imagem}" alt="${produto.nome}">
                
                <div class="titulo-camiseta">
                    <h3 style="font-weight: 500;">${produto.nome}</h3>
                    <h4 style="font-weight: 100; margin-top: -15px;">R$ ${produto.preco}</h4>
                </div>

                <hr class="linha-camiseta">

                <button onclick="editarPrd('${produto._id}')" class="botao" style="background-color: #ffffff;">Editar</button>
                <button onclick="deletarProduto('${produto._id}')" class="botao-dois" style="background-color: #ffffff;">Excluir</button>
            </div>
            `;
            container.innerHTML += html;
        });
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}

// Função para Deletar
window.deletarProduto = async (id) => {
    if(confirm("Tem certeza que deseja excluir este produto?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        alert("Produto excluído!");
        location.reload(); // Recarrega a página para atualizar a lista
    }
};


// Executa o carregamento se a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosAdmin();
});
