/* ═══════════════════════════════════════════════════
   CORREDOR DOS SONHOS — script.js
   ═══════════════════════════════════════════════════ */

const GAME_LAUNCH_YEAR = 2026;

/* ══════════════════════════════════════════════════
   TEMA
══════════════════════════════════════════════════ */
function initTheme() {
  const saved = localStorage.getItem('cds-theme') || 'dark';
  applyTheme(saved, false);
}

function applyTheme(theme, animate = true) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cds-theme', theme);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀' : '🌑';
    btn.title = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
  });
  if (animate) document.body.style.transition = 'background 0.4s ease, color 0.3s ease';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ══════════════════════════════════════════════════
   VERIFICAÇÃO DE LANÇAMENTO
══════════════════════════════════════════════════ */
function checkLaunchYear() {
  if (new Date().getFullYear() !== GAME_LAUNCH_YEAR) return;
  const poll = setInterval(() => {
    const gate  = document.getElementById('age-gate');
    const intro = document.getElementById('intro');
    if (gate?.classList.contains('hidden') && intro?.classList.contains('hidden')) {
      clearInterval(poll);
      setTimeout(showLaunchAlert, 1500);
    }
  }, 400);
}

function showLaunchAlert() {
  document.getElementById('launch-alert')?.classList.add('visible');
  window.alert('GRANDE LANÇAMENTO: O Corredor dos Sonhos já abriu suas portas e está disponível para jogar!');
}

/* ══════════════════════════════════════════════════
   ESTRELAS DA INTRO
══════════════════════════════════════════════════ */
function createStars() {
  const container = document.querySelector('.intro-stars');
  if (!container) return;
  for (let i = 0; i < 70; i++) {
    const star   = document.createElement('div');
    const bright = Math.random() > 0.78;
    const size   = bright ? Math.random() * 2.5 + 2 : Math.random() * 2 + 1;
    star.className = 'star' + (bright ? ' bright' : '');
    star.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--dur:${(Math.random()*3+2).toFixed(2)}s;--delay:${(Math.random()*5).toFixed(2)}s;`;
    container.appendChild(star);
  }
}

/* ══════════════════════════════════════════════════
   VALIDAÇÃO DE IDADE
══════════════════════════════════════════════════ */
function validateAge(day, month, year) {
  if (!day || !month || !year) return null;
  if (year < 1900 || year > new Date().getFullYear()) return null;
  if (month < 1 || month > 12) return null;
  if (day  < 1 || day  > 31)   return null;

  const birth = new Date(year, month - 1, day);
  if (isNaN(birth.getTime())) return null;
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/* ══════════════════════════════════════════════════
   AGE GATE
══════════════════════════════════════════════════ */
function initAgeGate() {
  const gate      = document.getElementById('age-gate');
  const submitBtn = document.getElementById('age-submit');
  const errorEl   = document.getElementById('age-error');
  const blockedEl = document.getElementById('age-blocked');
  const inputsEl  = document.getElementById('age-inputs');
  const intro     = document.getElementById('intro');

  if (!gate) return;

  const verified = localStorage.getItem('cds-age');

  if (verified === 'ok') {
    gate.classList.add('hidden');
    intro?.classList.remove('paused');
    return;
  }
  if (verified === 'blurred') {
    gate.classList.add('hidden');
    intro?.classList.remove('paused');
    applyBlur();
    return;
  }

  intro?.classList.add('paused');
  submitBtn.addEventListener('click', handleAgeSubmit);
  ['age-day','age-month','age-year'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') handleAgeSubmit(); });
  });

  function handleAgeSubmit() {
    const day   = parseInt(document.getElementById('age-day').value);
    const month = parseInt(document.getElementById('age-month').value);
    const year  = parseInt(document.getElementById('age-year').value);
    const age   = validateAge(day, month, year);

    if (age === null) {
      inputsEl.classList.add('shake');
      errorEl.textContent = 'DATA INVÁLIDA. VERIFIQUE OS CAMPOS.';
      ['age-day','age-month','age-year'].forEach(id => document.getElementById(id)?.classList.add('error'));
      setTimeout(() => {
        inputsEl.classList.remove('shake');
        ['age-day','age-month','age-year'].forEach(id => document.getElementById(id)?.classList.remove('error'));
      }, 600);
      return;
    }

    if (age >= 18) {
      localStorage.setItem('cds-age', 'ok');
      gate.classList.add('hidden');
      intro?.classList.remove('paused');
    } else {
      gate.querySelector('.age-gate-content').style.display = 'none';
      blockedEl?.classList.add('visible');
    }
  }
}

/* ══════════════════════════════════════════════════
   INTRO OVERLAY
══════════════════════════════════════════════════ */
function initIntro() {
  const intro   = document.getElementById('intro');
  const skipBtn = document.getElementById('skip-btn');
  if (!intro) return;

  function hideIntro() {
    if (intro.classList.contains('paused')) return;
    intro.classList.add('moon-setting');
    setTimeout(() => intro.classList.add('hidden'), 1800);
  }

  skipBtn?.addEventListener('click', hideIntro);

  setTimeout(() => {
    if (!intro.classList.contains('paused')) {
      hideIntro();
    } else {
      const obs = new MutationObserver(() => {
        if (!intro.classList.contains('paused')) {
          obs.disconnect();
          setTimeout(hideIntro, 7000);
        }
      });
      obs.observe(intro, { attributes:true, attributeFilter:['class'] });
    }
  }, 7000);
}

/* ══════════════════════════════════════════════════
   HAMBURGER
══════════════════════════════════════════════════ */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => links.classList.toggle('active'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('active')));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) links.classList.remove('active');
  });
}

/* ══════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold:0.1, rootMargin:'0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════
   ZIGZAG
══════════════════════════════════════════════════ */
function initZigzag() {
  document.querySelectorAll('.zigzag').forEach(el => {
    if (el.querySelector('.wl')) return;
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words.map((word, wi) => {
      const letters = [...word].map((letter, li) => `<span class="wl" style="animation-delay:${(wi*word.length*0.06+li*0.08).toFixed(2)}s">${letter}</span>`).join('');
      return `<span class="wl-word">${letters}</span>`;
    }).join(' ');
  });
}

/* ══════════════════════════════════════════════════
   IFRAME OVERLAY
══════════════════════════════════════════════════ */
function initIframe() {
  const overlay = document.getElementById('iframe-overlay');
  const iframe  = document.getElementById('game-iframe');
  if (!overlay || !iframe) return;
  overlay.addEventListener('click', () => {
    const src = iframe.getAttribute('data-src');
    if (src && src !== 'about:blank') iframe.src = src;
    overlay.classList.add('hidden');
    
    // Silencia a música de fundo ao iniciar o jogo
    const music = document.getElementById('bg-music');
    if (music) {
      music.pause();
    }
  });

  // Previne que setas e o botão espaço rolem a tela principal quando o jogo estiver focado
  iframe.addEventListener('load', () => {
    try {
      iframe.contentWindow.addEventListener('keydown', (e) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
          e.preventDefault();
        }
      }, { capture: true, passive: false });
    } catch (err) {
      // Falha silenciosa no initial load ou problema de CORS em testes locais.
    }
  });
}

/* ══════════════════════════════════════════════════
   BLUR (conteúdo restrito)
══════════════════════════════════════════════════ */
function applyBlur() {
  document.body.classList.add('images-blurred');
  localStorage.setItem('cds-age', 'blurred');
  showBlurBanner();
}

function removeBlur() {
  document.body.classList.remove('images-blurred');
  document.getElementById('blur-banner')?.classList.remove('visible');
}

function showBlurBanner() {
  let banner = document.getElementById('blur-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'blur-banner';
    banner.className = 'blur-banner';
    banner.innerHTML = `<span>⚠ CONTEÚDO RESTRITO · DATA DE NASCIMENTO INVÁLIDA</span><button class="blur-banner-btn" id="blur-redefine-btn">&gt;_ REDEFINIR</button>`;
    document.body.appendChild(banner);
    document.getElementById('blur-redefine-btn').addEventListener('click', promptRedefinirIdade);
  }
  setTimeout(() => banner.classList.add('visible'), 100);
}

/* ══════════════════════════════════════════════════
   REDEFINIR IDADE — prompt nativo
══════════════════════════════════════════════════ */
function promptRedefinirIdade() {
  const input = window.prompt('Insira sua data de nascimento para redefinir o acesso.\nFormato: DD/MM/AAAA');
  if (input === null) return;

  const parts = input.trim().split('/');
  if (parts.length !== 3) {
    window.alert('Formato inválido. Use DD/MM/AAAA (ex: 15/06/1990).');
    applyBlur(); return;
  }

  const age = validateAge(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
  if (age === null) {
    window.alert('Data inválida ou inexistente. Verifique os valores digitados.');
    applyBlur(); return;
  }

  if (age >= 18) {
    localStorage.setItem('cds-age', 'ok');
    removeBlur();
    window.alert('Acesso concedido. Bem-vindo ao castelo.');
  } else {
    window.alert(`Você tem ${age} anos — abaixo de 18. O conteúdo permanecerá com restrições visuais.`);
    applyBlur();
  }
}

/* ══════════════════════════════════════════════════
   LAUNCH ALERT
══════════════════════════════════════════════════ */
function initLaunchAlert() {
  const closeBtn = document.getElementById('launch-alert-close');
  const alert    = document.getElementById('launch-alert');
  if (!closeBtn || !alert) return;
  closeBtn.addEventListener('click', () => alert.classList.remove('visible'));
  alert.addEventListener('click', e => { if (e.target === alert) alert.classList.remove('visible'); });
}

/* ══════════════════════════════════════════════════
   MÚSICA
══════════════════════════════════════════════════ */
function initMusic() {
  const music = document.getElementById('bg-music');
  if (!music) return;
  const start = () => {
    music.volume = 0.25;
    music.play().catch(() => {});
    document.removeEventListener('click', start);
    document.removeEventListener('keydown', start);
  };
  document.addEventListener('click', start);
  document.addEventListener('keydown', start);
}

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));

  createStars();
  initAgeGate();
  initIntro();
  initHamburger();
  initReveal();
  initZigzag();
  initIframe();
  initLaunchAlert();
  checkLaunchYear();
  initMusic();

  document.getElementById('footer-redefine-btn')?.addEventListener('click', promptRedefinirIdade);

  if (localStorage.getItem('cds-age') === 'blurred') applyBlur();
});

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // impede envio real

    const nome = document.getElementById('nome').value;

    alert(`🕯️ Eco recebido, ${nome}...\nO castelo ouviu sua mensagem.\n\nEm breve, ele responderá.`);

    form.reset(); // limpa o form
  });
}

initForm();