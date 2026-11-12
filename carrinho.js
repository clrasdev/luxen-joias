document.addEventListener("DOMContentLoaded", () => {
    const CHAVE_CARRINHO = "luxenCarrinho";

    function lerCarrinho() {
        try {
            const dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO) || "[]");
            if (!Array.isArray(dados)) return [];
            return dados.filter(item =>
                item &&
                typeof item.nome === "string" &&
                Number.isFinite(item.preco) &&
                item.preco >= 0 &&
                Number.isInteger(item.quantidade) &&
                item.quantidade > 0 &&
                typeof item.imagem === "string"
            );
        } catch (erro) {
            console.error("Não foi possível ler o carrinho.", erro);
            return [];
        }
    }

    function salvarCarrinho(itens) {
        try {
            localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
            atualizarContagem();
            return true;
        } catch (erro) {
            console.error("Não foi possível salvar o carrinho.", erro);
            alert("Não foi possível salvar o carrinho neste navegador.");
            return false;
        }
    }

    function formatarPreco(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor);
    }

    function atualizarContagem() {
        const contador = document.getElementById("contagemCarrinho");
        if (!contador) return;
        const quantidade = lerCarrinho().reduce((total, item) => total + item.quantidade, 0);
        contador.textContent = "(" + quantidade + ")";
    }

    // Na página da coleção, cria um botão de compra em cada cartão existente.
    const produtos = document.querySelectorAll(".grade-produtos .produto");
    produtos.forEach(produto => {
        if (produto.querySelector(".adicionar-carrinho")) return;

        const nome = produto.querySelector("h3")?.textContent.trim();
        const descricao = produto.querySelector("p")?.textContent.trim() || "";
        const precoTexto = produto.querySelector(".preco")?.textContent || "";
        const preco = Number(precoTexto.replace(/[^\d,]/g, "").replace(",", "."));
        const imagem = produto.querySelector("img")?.getAttribute("src") || "";
        const area = produto.querySelector(".produto-info");
        if (!nome || !Number.isFinite(preco) || !area) return;

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "adicionar-carrinho";
        botao.textContent = "ADICIONAR AO CARRINHO";
        botao.addEventListener("click", () => {
            const carrinho = lerCarrinho();
            const existente = carrinho.find(item => item.nome === nome);
            if (existente) {
                existente.quantidade += 1;
            } else {
                carrinho.push({ nome, descricao, preco, imagem, quantidade: 1 });
            }
            if (salvarCarrinho(carrinho)) {
                botao.textContent = "ADICIONADO!";
                window.setTimeout(() => { botao.textContent = "ADICIONAR AO CARRINHO"; }, 1300);
            }
        });
        const linkConsulta = area.querySelector(".consultar");
        if (linkConsulta) area.insertBefore(botao, linkConsulta);
        else area.appendChild(botao);
    });

    // Na página do carrinho, monta a lista e o resumo.
    const lista = document.getElementById("itensCarrinho");
    const totalElemento = document.getElementById("totalCarrinho");
    const limpar = document.getElementById("limparCarrinho");

    function renderizarCarrinho() {
        if (!lista || !totalElemento) return;
        const carrinho = lerCarrinho();
        lista.replaceChildren();
        let total = 0;

        if (carrinho.length === 0) {
            const vazio = document.createElement("p");
            vazio.className = "carrinho-vazio";
            vazio.textContent = "Seu carrinho está vazio. Volte à coleção para escolher suas peças favoritas.";
            lista.appendChild(vazio);
        }

        carrinho.forEach(item => {
            total += item.preco * item.quantidade;
            const linha = document.createElement("article");
            linha.className = "item-carrinho";

            const imagem = document.createElement("img");
            imagem.src = item.imagem;
            imagem.alt = item.nome;
            imagem.loading = "lazy";

            const detalhes = document.createElement("div");
            detalhes.className = "detalhes-carrinho";
            const titulo = document.createElement("h3");
            titulo.textContent = item.nome;
            const preco = document.createElement("p");
            preco.textContent = formatarPreco(item.preco) + " cada";

            const controles = document.createElement("div");
            controles.className = "controles-quantidade";
            const menos = document.createElement("button");
            menos.type = "button";
            menos.textContent = "−";
            menos.setAttribute("aria-label", "Diminuir quantidade de " + item.nome);
            const quantidade = document.createElement("span");
            quantidade.textContent = String(item.quantidade);
            const mais = document.createElement("button");
            mais.type = "button";
            mais.textContent = "+";
            mais.setAttribute("aria-label", "Aumentar quantidade de " + item.nome);

            menos.addEventListener("click", () => alterarQuantidade(item.nome, -1));
            mais.addEventListener("click", () => alterarQuantidade(item.nome, 1));
            controles.append(menos, quantidade, mais);
            detalhes.append(titulo, preco, controles);

            const subtotal = document.createElement("strong");
            subtotal.className = "subtotal-item";
            subtotal.textContent = formatarPreco(item.preco * item.quantidade);
            linha.append(imagem, detalhes, subtotal);
            lista.appendChild(linha);
        });

        totalElemento.textContent = formatarPreco(total);
        if (limpar) limpar.disabled = carrinho.length === 0;
        atualizarContagem();
    }

    function alterarQuantidade(nome, variacao) {
        const carrinho = lerCarrinho();
        const item = carrinho.find(produto => produto.nome === nome);
        if (!item) return;
        item.quantidade += variacao;
        const atualizado = carrinho.filter(produto => produto.quantidade > 0);
        if (salvarCarrinho(atualizado)) renderizarCarrinho();
    }

    if (limpar) {
        limpar.addEventListener("click", () => {
            if (salvarCarrinho([])) renderizarCarrinho();
        });
    }

    window.addEventListener("storage", evento => {
        if (evento.key === CHAVE_CARRINHO) renderizarCarrinho();
    });

    atualizarContagem();
    renderizarCarrinho();
});
