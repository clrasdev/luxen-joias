document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const nav = header.querySelector("nav");
    const links = nav.querySelectorAll("a");

    // 1. Botão hambúrguer para celular
    const botao = document.createElement("button");
    botao.className = "menu-toggle";
    botao.setAttribute("aria-label", "Abrir menu");
    botao.setAttribute("aria-expanded", "false");
    botao.innerHTML = "<span></span><span></span><span></span>";
    header.insertBefore(botao, nav);

    const fechar = () => {
        nav.classList.remove("aberto");
        botao.classList.remove("ativo");
        botao.setAttribute("aria-expanded", "false");
    };

    botao.addEventListener("click", () => {
        const aberto = nav.classList.toggle("aberto");
        botao.classList.toggle("ativo", aberto);
        botao.setAttribute("aria-expanded", aberto);
    });

    links.forEach(l => l.addEventListener("click", fechar));
    document.addEventListener("keydown", e => { if (e.key === "Escape") fechar(); });
    document.addEventListener("click", e => { if (!header.contains(e.target)) fechar(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 750) fechar(); });

    // 2. Marca no menu a página em que o visitante está
    const atual = location.pathname.split("/").pop() || "index.html";
    links.forEach(l => {
        const destino = l.getAttribute("href").split("#")[0];
        if (destino === atual) l.classList.add("ativo");
    });

    // 3. Sombra no cabeçalho ao rolar
    const sombra = () => header.classList.toggle("rolagem", window.scrollY > 10);
    window.addEventListener("scroll", sombra);
    sombra();

    // 4. Formulário de contato -> abre o WhatsApp com a mensagem pronta
    const form = document.getElementById("formContato");
    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const nome = document.getElementById("nome").value.trim();
            const interesse = document.getElementById("interesse").value;
            const msg = document.getElementById("mensagem").value.trim();
            const texto = `Olá! Meu nome é ${nome}. Tenho interesse em: ${interesse}.` + (msg ? ` ${msg}` : "");
            window.open("https://wa.me/5581999999999?text=" + encodeURIComponent(texto), "_blank");
        });
    }
});