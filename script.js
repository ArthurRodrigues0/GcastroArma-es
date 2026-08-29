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
    const navClose = document.querySelector('.nav-close');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;

    // Elementos que devem ficar "inertes" (sem clique/foco/rolagem) com o menu aberto.
    // Deixamos de fora o próprio menu e o backdrop, que continuam interativos.
    const inertTargets = [document.querySelector('main'), document.querySelector('.footer')]
        .filter(Boolean);

    const setSiteInert = (isInert) => {
        inertTargets.forEach(el => {
            if (isInert) {
                el.setAttribute('inert', '');
                el.setAttribute('aria-hidden', 'true');
            } else {
                el.removeAttribute('inert');
                el.removeAttribute('aria-hidden');
            }
        });
    };

    const closeMenu = () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Abrir menu');
        toggleBtn.classList.remove('is-open');
        if (toggleIcon) toggleIcon.className = 'fa-solid fa-bars';
        nav.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        if (backdrop) backdrop.hidden = true;
        document.body.style.overflow = '';
        setSiteInert(false);
    };

    const openMenu = () => {
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.setAttribute('aria-label', 'Fechar menu');
        toggleBtn.classList.add('is-open');
        if (toggleIcon) toggleIcon.className = 'fa-solid fa-xmark';
        nav.classList.add('active');
        if (backdrop) { backdrop.hidden = false; backdrop.classList.add('active'); }
        document.body.style.overflow = 'hidden';
        setSiteInert(true);
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

        // Fecha o menu ao clicar no botão X dentro do painel
        if (navClose) navClose.addEventListener('click', closeMenu);

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
       5) SCROLL-SPY — destaca a seção ativa no menu
       ----------------------------------------------------- */
    const navLinks = Array.from(document.querySelectorAll('.navbar ul li a'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle(
                            'is-active',
                            link.getAttribute('href') === `#${id}`
                        );
                    });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(section => spy.observe(section));
    }

    /* -----------------------------------------------------
       6) ANO DINÂMICO NO RODAPÉ
       ----------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
