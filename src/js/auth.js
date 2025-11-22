const API_URL = 'http://localhost:5500/produtos';

// ================== LÓGICA DE LOGIN ==================

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
    event.preventDefault();

    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;

    if (senha !== confirmaSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    let listaUsuarios = JSON.parse(localStorage.getItem('usuariosSimons')) || [];


    const usuarioExiste = listaUsuarios.find(u => u.email === email);
    if (usuarioExiste) {
        alert("Este email já está cadastrado!");
        return;
    }

    const novoUsuario = {
        email: email,
        senha: senha
    };

    listaUsuarios.push(novoUsuario);
    localStorage.setItem('usuariosSimons', JSON.stringify(listaUsuarios));
    login();
}

// 4. FUNÇÃO DE LOGIN 
function entrar(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;


    if (email === "admin@gmail.com" && senha === "admin123") {
        window.location.href = "/src/app/pagina-admin/pagina-admin.html";
        return;
    }

    let listaUsuarios = JSON.parse(localStorage.getItem('usuariosSimons')) || [];
    const usuarioEncontrado = listaUsuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
        alert("Login realizado com sucesso!");
        window.location.href = "/src/app/pagina-home/pagina-home.html";
    } else {
        alert("Email ou senha incorretos!");
    }
}

// -------- btn esqueci a senha ---------
function senha() {
    alert("Funcionalidade de recuperar senha em desenvolvimento!");
}

// ================== NAVEGAÇÃO ==================

window.camisetas = () => { window.location.href = '/src/app/pagina-camisetas/pagina-camisetas.html' };
window.socialCliente = () => { window.location.href = '/src/app/pagina-social-cliente/pagina-social-cliente.html' };
window.socialAdmin = () => { window.location.href = '/src/app/pagina-social/pagina-social.html' };
window.camisetasAdmin = () => { window.location.href = '/src/app/pagina-camisetas-admin/pagina-camisetas-admin.html' };
window.editarPrd = (id) => {

    localStorage.setItem('idProdutoEditar', id);
    window.location.href = '/src/app/pagina-editar/pagina-editar.html'
};



window.irParaCarrinho = () => {
    window.location.href = '/src/app/pagina-carrinho/pagina-carrinho.html';
};

// ================== CRUD (ADMIN) ==================


async function carregarProdutosAdmin(categoriaContainer) {

    const container = document.getElementById('lista-produtos-dinamica');

    if (!container) return;

    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();

        container.innerHTML = '';

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
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        alert("Produto excluído!");
        location.reload();
    }
};


// Executa o carregamento se a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosAdmin();
});
