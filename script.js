/* ---------------------------------------------------------
   GCASTRO ARMAÇÕES — interações da página
   --------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* -----------------------------------------------------
       1) MENU RESPONSIVO (mobile) — acessibilidade
       ----------------------------------------------------- */
    const toggleBtn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.navbar');
    const backdrop = document.querySelector('.nav-backdrop');

    const closeMenu = () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Abrir menu');
        nav.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        if (backdrop) backdrop.hidden = true;
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.setAttribute('aria-label', 'Fechar menu');
        nav.classList.add('active');
        if (backdrop) { backdrop.hidden = false; backdrop.classList.add('active'); }
        document.body.style.overflow = 'hidden';
    };

    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            expanded ? closeMenu() : openMenu();
        });

        // Fecha o menu ao clicar em um link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Fecha o menu ao clicar fora (backdrop)
        if (backdrop) backdrop.addEventListener('click', closeMenu);

        // Fecha o menu com a tecla Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    /* -----------------------------------------------------
       2) HEADER COM SOMBRA AO ROLAR
       ----------------------------------------------------- */
    const header = document.getElementById('site-header');
    const backToTop = document.querySelector('.back-to-top');

    const handleScroll = () => {
        const scrolled = window.scrollY > 30;
        if (header) header.classList.toggle('is-scrolled', scrolled);

        if (backToTop) {
            const showButton = window.scrollY > 500;
            backToTop.hidden = false;
            backToTop.classList.toggle('visible', showButton);
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* -----------------------------------------------------
       3) BOTÃO VOLTAR AO TOPO
       ----------------------------------------------------- */
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    /* -----------------------------------------------------
       4) ANIMAÇÃO DE ENTRADA AO ROLAR (scroll reveal)
       ----------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    } else {
        // Sem suporte a IntersectionObserver ou movimento reduzido: mostra tudo direto
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    /* -----------------------------------------------------
       5) ANO DINÂMICO NO RODAPÉ
       ----------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});