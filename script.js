/* ── LÓGICA DA INTRO ── */
const intro = document.getElementById('intro');
const botaoPular = document.getElementById('skip-btn');
const DURACAO_INTRO = 6800; // ms antes de sumir automaticamente

function ocultarIntro() {
    intro.classList.add('hidden');
    document.body.style.overflow = '';
}

document.body.style.overflow = 'hidden';
setTimeout(ocultarIntro, DURACAO_INTRO);

// Permite que qualquer clique na tela pule a intro
function pularIntroAoClicar(e) {
    // Só pula se a intro ainda estiver visível
    if (!intro.classList.contains('hidden')) {
        ocultarIntro();
        // Remove o listener após o primeiro clique
        document.removeEventListener('click', pularIntroAoClicar);
    }
}
document.addEventListener('click', pularIntroAoClicar);
botaoPular.addEventListener('click', ocultarIntro);

/* ── REVELAR AO ROLAR ── */
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observador.observe(el));

/* ── BOTÃO DE JOGAR IFRAME ── */
const sobreposicao = document.getElementById('iframe-overlay');
const botaoJogar = document.getElementById('play-btn');
const iframeJogo = document.getElementById('game-iframe');

function iniciarJogo() {
    const src = iframeJogo.dataset.src;
    if (src && src !== 'about:blank') {
        iframeJogo.src = src;
    }
    sobreposicao.classList.add('hidden');
}

botaoJogar.addEventListener('click', iniciarJogo);
sobreposicao.addEventListener('click', iniciarJogo);

/* ── ESTADO DO NAV AO ROLAR ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
        ? 'rgba(13,13,13,0.95)'
        : 'rgba(13,13,13,0.7)';
});

/* ── TEXTO ZIGZAG ANIMADO ── */
document.querySelectorAll('.zigzag').forEach(el => {
    el.innerHTML = el.textContent.split('').map((caractere, i) =>
        caractere === ' '
            ? ' '
            : `<span class="wl" style="animation-delay:${(i * 0.09).toFixed(2)}s">${caractere}</span>`
    ).join('');
});

/* ── MENU HAMBURGUER ── */
const hamburguer = document.getElementById('hamburger');
const linksNav = document.getElementById('nav-links');

hamburguer.addEventListener('click', () => {
    linksNav.classList.toggle('active');
});

const musica = document.getElementById('bg-music');

function iniciarMusica() {
    musica.volume = 0.15;
    musica.play().catch(() => { });
}

document.addEventListener('click', iniciarMusica, { once: true });
