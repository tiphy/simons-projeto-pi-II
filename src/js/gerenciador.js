// 1. Inicializar o Banco de Dados (LocalStorage)
function inicializarBanco() {
    if (!localStorage.getItem('produtosSimons')) {
        const produtosIniciais = [
            { id: 1, nome: "Camiseta Simons", preco: 59.90, imagem: "/public/images/simons.png", categoria: "camiseta" },
            { id: 2, nome: "Camisa Social Bege", preco: 159.90, imagem: "/public/images/social-bege.png", categoria: "social" },
            { id: 3, nome: "Camiseta Alice", preco: 59.90, imagem: "/public/images/alice-azul.png", categoria: "camiseta" }
        ];
        localStorage.setItem('produtosSimons', JSON.stringify(produtosIniciais));
    }
}

// 2. Ler todos os produtos
function lerProdutos() {
    inicializarBanco();
    return JSON.parse(localStorage.getItem('produtosSimons'));
}

// 3. Salvar a lista inteira
function salvarProdutos(listaProdutos) {
    localStorage.setItem('produtosSimons', JSON.stringify(listaProdutos));
}

// 4. Deletar um produto
function deletarProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        let produtos = lerProdutos();
        const novaLista = produtos.filter(produto => produto.id != id);
        salvarProdutos(novaLista);
        alert("Produto excluído!");
        location.reload();
    }
}

// 5. Redirecionar para a página de edição
function irParaEdicao(id) {
    localStorage.setItem('produtoEditavelID', id);
    window.location.href = "/src/app/pagina-editar/pagina-editar.html";
}

// 6. CRIAR NOVO PRODUTO (O passo importante!)
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

// 7. IR PARA A PÁGINA DE COMPRA (Jornada do Cliente)
function verDetalhesProduto(id) {
    // Guarda o ID do produto que o cliente clicou
    localStorage.setItem('produtoSelecionadoID', id);
    
    // Redireciona para a página de detalhes/compra
    window.location.href = "/src/app/pagina-compras/pagina-compras.html";
}