// ================== BANCO DE DADOS ==================
function inicializarBanco() {
    if (!localStorage.getItem('produtosSimons')) {
        const produtosIniciais = [
            { id: 1, nome: "Camiseta Simons", preco: 59.90, imagem: "/public/images/simons.png", categoria: "camiseta" },
            { id: 2, nome: "Camisa Social Bege", preco: 159.90, imagem: "/public/images/social-bege.png", categoria: "social" },
            { id: 3, nome: "Camiseta Alice", preco: 59.90, imagem: "/public/images/alice-azul.png", categoria: "camiseta" },
            { id: 4, nome: "Camiseta Gêmeas", preco: 59.90, imagem: "/public/images/gemeas.png", categoria: "camiseta" },
            { id: 5, nome: "Camiseta Simão", preco: 59.90, imagem: "/public/images/simao.png", categoria: "camiseta" },
            { id: 6, nome: "Camiseta Amanda P&B", preco: 59.90, imagem: "/public/images/amanda-pb.png", categoria: "camiseta" }
        ];
        localStorage.setItem('produtosSimons', JSON.stringify(produtosIniciais));
    }
}

function lerProdutos() {
    inicializarBanco();
    return JSON.parse(localStorage.getItem('produtosSimons'));
}

function salvarProdutos(listaProdutos) {
    localStorage.setItem('produtosSimons', JSON.stringify(listaProdutos));
}

// --- Funções de Admin ---
function deletarProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        let produtos = lerProdutos();
        const novaLista = produtos.filter(produto => produto.id != id);
        salvarProdutos(novaLista);
        alert("Produto excluído!");
        location.reload();
    }
}

function irParaEdicao(id) {
    localStorage.setItem('produtoEditavelID', id);
    window.location.href = "/src/app/pagina-editar/pagina-editar.html";
}

function criarNovoProduto(categoriaRecebida) {
    const produtos = lerProdutos();
    const novoId = Date.now();
    const novoProduto = {
        id: novoId,
        nome: "Novo Produto",
        preco: 0.00,
        imagem: "/public/images/simons.png",
        categoria: categoriaRecebida
    };
    produtos.push(novoProduto);
    salvarProdutos(produtos);
    irParaEdicao(novoId);
}

function verDetalhesProduto(id) {
    localStorage.setItem('produtoSelecionadoID', id);
    window.location.href = "/src/app/pagina-compras/pagina-compras.html";
}


// ================== LÓGICA DO CARRINHO ==================

function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoSimons')) || [];
    carrinho.push(produto);
    localStorage.setItem('carrinhoSimons', JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho com sucesso!");
}

function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoSimons')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoSimons', JSON.stringify(carrinho));
    location.reload();
}

// Desenha a página do CARRINHO
function carregarCarrinhoNaTela() {
    const container = document.getElementById('lista-carrinho-dinamica');
    const contador = document.getElementById('contador-itens');
    const labelTotal = document.getElementById('preco-total-carrinho');
    const resumoBox = document.getElementById('resumo-carrinho-box');

    if (!container) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinhoSimons')) || [];

    if (carrinho.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666; width: 100%;">
                <img src="/public/images/carrinho.png" style="width: 50px; opacity: 0.3; margin-bottom: 20px;">
                <p style="font-size: 18px; margin-bottom: 20px;">Seu carrinho está vazio.</p>
                <button class="btn-dark-small" onclick="window.location.href='/src/app/pagina-camisetas/pagina-camisetas.html'">
                    Continuar Comprando
                </button>
            </div>
        `;
        if (resumoBox) resumoBox.style.display = 'none';
        if (contador) contador.innerText = `{ 0 Itens }`;
        return;
    }

    if (resumoBox) resumoBox.style.display = 'block';
    container.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        let precoFormatado = item.preco.toFixed(2).replace('.', ',');

        const htmlItem = `
        <div class="cart-item">
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="item-details">
                <h3>${item.nome}</h3>
                <div class="tags">
                    <span class="tag">1 unid.</span>
                    <span class="tag">M</span> 
                </div>
                <p class="item-price">R$ ${precoFormatado}</p>
            </div>
            <div class="item-actions">
                <img src="/public/images/excluir.png" alt="excluir" title="Remover" onclick="removerDoCarrinho(${index})">
            </div>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;">
        `;
        container.innerHTML += htmlItem;
    });

    if (contador) contador.innerText = `{ ${carrinho.length} Itens }`;
    if (labelTotal) labelTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function carregarSugestoes() {
    const container = document.getElementById('lista-sugestoes');
    if (!container) return;

    const produtos = lerProdutos();
    const sugestoes = produtos.slice(0, 3);

    container.innerHTML = '';
    sugestoes.forEach(p => {
        const html = `
        <div class="produto-card-clean">
            <img src="${p.imagem}" alt="${p.nome}">
            <p class="nome">${p.nome}</p>
            <p class="preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</p>
            <button class="btn-round" onclick="verDetalhesProduto(${p.id})">Comprar</button>
            <br><br>
        </div>
        `;
        container.innerHTML += html;
    });
}

// ================== PÁGINA DE ENTREGA ==================

function carregarResumoEntrega() {
    const contador = document.getElementById('contador-itens-entrega');
    const labelTotal = document.getElementById('preco-total-entrega');
    const listaItens = document.getElementById('lista-itens-resumo');

    if (!listaItens) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinhoSimons')) || [];
    const frete = 9.90;
    let subtotal = 0;

    listaItens.innerHTML = '';

    carrinho.forEach((item, index) => {
        subtotal += item.preco;
        let precoFormatado = item.preco.toFixed(2).replace('.', ',');

        const htmlItem = `
        <div class="review-box">
            <img class="product-img" src="${item.imagem}" alt="${item.nome}">
            
            <div class="review-details">
                <h3>${item.nome}</h3>
                
                <div class="tags">
                    <span class="tag">1 unid.</span>
                    <span class="tag">M</span>
                </div>

                <hr class="price-divider">
                
                <p class="review-price">R$ ${precoFormatado}</p>
            </div>

            <div class="item-actions">
                <img src="/public/images/lapis.png" alt="editar" title="Editar">
                <img src="/public/images/excluir.png" alt="excluir" title="Remover" onclick="removerDoCarrinho(${index})">
            </div>
        </div>
        `;
        listaItens.innerHTML += htmlItem;
    });

    let totalFinal = subtotal + frete;

    if (contador) contador.innerText = `( ${carrinho.length} Item${carrinho.length !== 1 ? 's' : ''} )`;
    if (labelTotal) labelTotal.innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}



// ================== PÁGINA DE PAGAMENTO ==================

function carregarResumoPagamento() {
    const contador = document.getElementById('contador-itens-pagamento');
    const labelTotal = document.getElementById('preco-total-pagamento');
    const listaItens = document.getElementById('lista-itens-pagamento');

    if (!listaItens) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinhoSimons')) || [];
    const frete = 9.90;
    let subtotal = 0;

    listaItens.innerHTML = '';

    carrinho.forEach((item, index) => {
        subtotal += item.preco;
        let precoFormatado = item.preco.toFixed(2).replace('.', ',');

        const htmlItem = `
        <div class="review-box">
            <img class="product-img" src="${item.imagem}" alt="${item.nome}">
            <div class="review-details">
                <h3>${item.nome}</h3>
                <div class="tags">
                    <span class="tag">1 unid.</span>
                    <span class="tag">M</span>
                </div>
                <hr class="price-divider">
                <p class="review-price">R$ ${precoFormatado}</p>
            </div>
            <div class="item-actions">
                <img src="/public/images/lapis.png" alt="editar">
                <img src="/public/images/excluir.png" alt="excluir" onclick="removerDoCarrinho(${index})">
            </div>
        </div>
        `;
        listaItens.innerHTML += htmlItem;
    });

    let totalFinal = subtotal + frete;

    if (contador) contador.innerText = `( ${carrinho.length} Item${carrinho.length !== 1 ? 's' : ''} )`;
    if (labelTotal) labelTotal.innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}



function alternarBusca() {
    const input = document.getElementById('input-busca');
    const container = document.querySelector('.container-busca');

    // Alterna a classe 'ativo' no input
    input.classList.toggle('ativo');

    // Alterna classe no container para efeitos extras (opcional)
    container.classList.toggle('aberto');

    // Se abriu, coloca o foco no input para digitar logo
    if (input.classList.contains('ativo')) {
        input.focus();
    } else {
        input.value = ''; // Limpa se fechar (opcional)
    }
}

// (Opcional) Adicionar evento para pesquisar ao apertar "Enter"
document.getElementById('input-busca').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const termo = this.value.toLowerCase();
        alert(`Você pesquisou por: ${termo}`);
        // Aqui você pode chamar sua função de filtro futuramente
        // Exemplo: filtrarProdutos(termo);
    }
});


// Função para abrir o menu
function abrirMenu() {
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('overlay-menu');
    
    sidebar.classList.add('aberto');
    overlay.classList.add('ativo');
    
    // Impede a rolagem da página de fundo enquanto o menu está aberto
    document.body.style.overflow = 'hidden';
}

// Função para fechar o menu
function fecharMenu() {
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('overlay-menu');
    
    sidebar.classList.remove('aberto');
    overlay.classList.remove('ativo');
    
    // Volta a permitir a rolagem da página
    document.body.style.overflow = 'auto';
}