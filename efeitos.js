document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Entrada suave do banner (só na página inicial)
    document.querySelectorAll(".banner-conteudo > *").forEach((el, i) => {
        el.animate(
            [{ opacity: 0, transform: "translateY(35px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 1000, delay: i * 200, easing: "ease-out", fill: "backwards" }
        );
    });

    // Aparecer ao rolar
    const observador = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.animate(
                [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "translateY(0)" }],
                { duration: 800, easing: "ease-out", fill: "backwards" }
            );
            observador.unobserve(e.target);
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".beneficio, .produto, .sobre, .chamada").forEach(el => observador.observe(el));
});