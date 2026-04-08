/* ══════════════════════════════════════════════════
   VERIFICAÇÃO DE IDADE
   ══════════════════════════════════════════════════ */
const ageGate = document.getElementById('age-gate');
const ageSubmit = document.getElementById('age-submit');
const ageError = document.getElementById('age-error');
const ageInputs = document.getElementById('age-inputs');
const ageBlocked = document.getElementById('age-blocked');
const ageContent = document.querySelector('.age-gate-content');

const inputDia = document.getElementById('age-day');
const inputMes = document.getElementById('age-month');
const inputAno = document.getElementById('age-year');

// Auto-avança para o próximo campo ao preencher
inputDia.addEventListener('input', () => { if (inputDia.value.length >= 2) inputMes.focus(); });
inputMes.addEventListener('input', () => { if (inputMes.value.length >= 2) inputAno.focus(); });
inputAno.addEventListener('input', () => { if (inputAno.value.length >= 4) ageSubmit.focus(); });

// Enter para confirmar
[inputDia, inputMes, inputAno].forEach(el => {
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') ageSubmit.click();
    });
});

function sacudirInputs(msg) {
    ageError.textContent = msg;
    ageInputs.classList.remove('shake');
    void ageInputs.offsetWidth; // force reflow
    ageInputs.classList.add('shake');
    [inputDia, inputMes, inputAno].forEach(el => el.classList.add('error'));
    setTimeout(() => {
        [inputDia, inputMes, inputAno].forEach(el => el.classList.remove('error'));
    }, 1500);
}

ageSubmit.addEventListener('click', () => {
    const dia = parseInt(inputDia.value, 10);
    const mes = parseInt(inputMes.value, 10);
    const ano = parseInt(inputAno.value, 10);

    // Validação básica
    if (!dia || !mes || !ano) {
        sacudirInputs('Preencha todos os campos.');
        return;
    }
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900 || ano > 2026) {
        sacudirInputs('Data inválida. Tente novamente.');
        return;
    }

    // Calcular idade
    const hoje = new Date();
    const nascimento = new Date(ano, mes - 1, dia);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesDiff = hoje.getMonth() - nascimento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    if (idade < 18) {
        // Fallback: menor de idade
        ageContent.style.display = 'none';
        ageBlocked.classList.add('visible');
        return;
    }

    // Aprovado — esconde age gate e inicia intro
    ageGate.classList.add('hidden');
    iniciarIntro();
});


/* ══════════════════════════════════════════════════
   LÓGICA DA INTRO (só inicia após verificação)
   ══════════════════════════════════════════════════ */
const intro = document.getElementById('intro');
const botaoPular = document.getElementById('skip-btn');
const DURACAO_INTRO = 6800;

/* ── GERAR ESTRELINHAS BRILHANTES ── */
(function criarEstrelas() {
    const container = document.querySelector('.intro-stars');
    if (!container) return;
    const QTD = 60;

    for (let i = 0; i < QTD; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        if (Math.random() < 0.2) star.classList.add('bright');

        const tamanho = (Math.random() * 2 + 1).toFixed(1);
        star.style.width = tamanho + 'px';
        star.style.height = tamanho + 'px';
        star.style.left = (Math.random() * 100).toFixed(1) + '%';
        star.style.top = (Math.random() * 100).toFixed(1) + '%';
        star.style.setProperty('--dur', (Math.random() * 2.5 + 1.5).toFixed(1) + 's');
        star.style.setProperty('--delay', (Math.random() * 3).toFixed(1) + 's');

        container.appendChild(star);
    }
})();

// Intro começa pausada — as animações CSS são travadas
intro.classList.add('paused');
document.body.style.overflow = 'hidden';

let introJaOcultada = false;
let introTimeout = null;
let introAtiva = false; // flag para evitar que o clique do age gate pule a intro

function iniciarIntro() {
    // Despausa as animações da intro
    intro.classList.remove('paused');
    introTimeout = setTimeout(ocultarIntro, DURACAO_INTRO);
    // Só permite pular a intro após um curto delay
    // (evita que o clique do "ENTRAR" do age gate propague e pule a intro)
    setTimeout(() => { introAtiva = true; }, 300);
}

function ocultarIntro() {
    if (introJaOcultada) return;
    introJaOcultada = true;
    introAtiva = false;
    if (introTimeout) clearTimeout(introTimeout);

    // 1. Inicia a animação do "pôr da lua"
    intro.classList.add('moon-setting');

    // 2. Após a lua se pôr, esconde o overlay todo
    setTimeout(() => {
        intro.classList.add('hidden');
        document.body.style.overflow = '';
    }, 1200);
}

// Permite que qualquer clique na tela pule a intro (só após age gate + delay)
function pularIntroAoClicar(e) {
    if (introAtiva && !intro.classList.contains('hidden')) {
        ocultarIntro();
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
    const texto = el.textContent;
    let idx = 0;
    el.innerHTML = texto.split(' ').map(palavra => {
        const letras = palavra.split('').map(c => {
            const span = `<span class="wl" style="animation-delay:${(idx * 0.09).toFixed(2)}s">${c}</span>`;
            idx++;
            return span;
        }).join('');
        idx++; // conta o espaço
        return `<span class="wl-word">${letras}</span>`;
    }).join(' ');
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
