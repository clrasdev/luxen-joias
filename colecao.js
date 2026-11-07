document.addEventListener("DOMContentLoaded", () => {
    const pesquisa = document.getElementById("pesquisaProduto");
    const filtros = document.getElementById("filtrosProdutos");
    const mensagem = document.getElementById("mensagemPesquisa");
    const produtos = document.querySelectorAll(".produto");
    if (!pesquisa || !filtros) return;

    let categoria = "Todos";
    const nomes = ["Todos", ...Array.from(produtos).map(p => p.querySelector("h3").textContent.trim())];

    nomes.forEach(nome => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = nome;
        b.addEventListener("click", () => { categoria = nome; filtrar(); });
        filtros.appendChild(b);
    });

    function filtrar() {
        const termo = pesquisa.value.toLowerCase().trim();
        let achados = 0;
        filtros.querySelectorAll("button").forEach(b => b.classList.toggle("ativo", b.textContent === categoria));
        produtos.forEach(p => {
            const nome = p.querySelector("h3").textContent.trim();
            const texto = (nome + " " + p.querySelector("p").textContent).toLowerCase();
            const ok = (categoria === "Todos" || nome === categoria) && texto.includes(termo);
            p.style.display = ok ? "" : "none";
            if (ok) achados++;
        });
        mensagem.hidden = achados > 0;
    }

    pesquisa.addEventListener("input", filtrar);

    // Permite abrir a coleção já filtrada: colecao.html#Colares
    const inicial = decodeURIComponent(location.hash.slice(1));
    if (nomes.includes(inicial)) categoria = inicial;
    filtrar();
});