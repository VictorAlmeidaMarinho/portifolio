'use strict';

/**
 * Script do portfólio.
 * Cada responsabilidade fica em uma função própria, iniciada em `init`.
 */

const SELECTORS = {
    menuButton: '#menu-icon',
    navLinks: '#nav-links',
    navLink: '.nav-link',
    sections: 'main section[id]',
    revealItems: '[data-reveal]',
    currentYear: '#current-year',
};

const CLASSES = {
    menuOpen: 'active',
    linkActive: 'is-active',
    revealed: 'is-visible',
    jsEnabled: 'js',
};

const ICONS = {
    open: 'fa-bars',
    close: 'fa-xmark',
};

/* --------------------------------------------------------------------------
   Menu mobile
   -------------------------------------------------------------------------- */
function setupMobileMenu() {
    const button = document.querySelector(SELECTORS.menuButton);
    const nav = document.querySelector(SELECTORS.navLinks);
    if (!button || !nav) return;

    const icon = button.querySelector('i');

    const setMenuState = (isOpen) => {
        nav.classList.toggle(CLASSES.menuOpen, isOpen);
        button.setAttribute('aria-expanded', String(isOpen));
        button.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        icon.classList.toggle(ICONS.open, !isOpen);
        icon.classList.toggle(ICONS.close, isOpen);
    };

    button.addEventListener('click', () => {
        setMenuState(!nav.classList.contains(CLASSES.menuOpen));
    });

    // Fecha o menu ao escolher um link ou pressionar Esc
    nav.addEventListener('click', (event) => {
        if (event.target.closest(SELECTORS.navLink)) setMenuState(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setMenuState(false);
    });
}

/* --------------------------------------------------------------------------
   Link ativo conforme a seção visível
   -------------------------------------------------------------------------- */
function setupActiveLinkOnScroll() {
    const sections = document.querySelectorAll(SELECTORS.sections);
    const links = document.querySelectorAll(SELECTORS.navLink);
    if (!sections.length || !links.length) return;

    const highlightLink = (sectionId) => {
        links.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle(CLASSES.linkActive, isCurrent);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries
                .filter((entry) => entry.isIntersecting)
                .forEach((entry) => highlightLink(entry.target.id));
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   Animação de entrada dos elementos
   -------------------------------------------------------------------------- */
function setupRevealOnScroll() {
    const items = document.querySelectorAll(SELECTORS.revealItems);
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add(CLASSES.revealed));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add(CLASSES.revealed);
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
}

/* --------------------------------------------------------------------------
   Ano atual no rodapé
   -------------------------------------------------------------------------- */
function setCurrentYear() {
    const target = document.querySelector(SELECTORS.currentYear);
    if (target) target.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   Tempo de transição do tema
   -------------------------------------------------------------------------- */

const THEME_TRANSITION_MS = 400;

function animateThemeChange(applyChange) {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    applyChange();
    window.setTimeout(() => root.classList.remove('theme-transition'), THEME_TRANSITION_MS);
}

/* --------------------------------------------------------------------------
   Modo escuro/claro
   -------------------------------------------------------------------------- */

function setupThemeToggle() {
    const button = document.querySelector('#theme-toggle');
    if (!button) return;

    const icon = button.querySelector('i');
    const root = document.documentElement;

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        root.dataset.theme = theme;
        button.setAttribute('aria-pressed', String(isDark));
        button.setAttribute('aria-label', isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro');
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
        try { localStorage.setItem('theme', theme); } catch { /* modo privado */ }
    };

    applyTheme(root.dataset.theme);
    button.addEventListener('click', () => {
    animateThemeChange(() => {
        applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
});

    
}

/* --------------------------------------------------------------------------
   Inicialização
   -------------------------------------------------------------------------- */
function init() {
    document.documentElement.classList.add(CLASSES.jsEnabled);
    setupMobileMenu();
    setupActiveLinkOnScroll();
    setupRevealOnScroll();
    setCurrentYear();
    setupThemeToggle();
}

init();
