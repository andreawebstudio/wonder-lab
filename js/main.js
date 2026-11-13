/* WONDER LAB — JavaScript essenziale, nessuna libreria */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '393792788458';

  /* ---------- Header: stato allo scroll ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mobile-nav');
  var toggleLabel = toggle.querySelector('.sr-only');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    toggleLabel.textContent = open ? 'Chiudi il menu' : 'Apri il menu';
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 1180px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Voce di menu attiva ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a'));
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) sectionObserver.observe(target);
    });
  }

  /* ---------- Reveal all'ingresso delle sezioni ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    var item = btn.closest('.faq-item');
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    panel.setAttribute('aria-hidden', 'true');
    panel.querySelectorAll('a').forEach(function (a) { a.setAttribute('tabindex', '-1'); });

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      panel.querySelectorAll('a').forEach(function (a) {
        if (open) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1');
      });
    });
  });

  /* ---------- Servizi: "Scopri di più" ---------- */
  document.querySelectorAll('.more-btn').forEach(function (btn) {
    var card = btn.closest('.service-card');
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    var label = btn.querySelector('.more-label');
    panel.setAttribute('aria-hidden', 'true');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      card.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      label.textContent = open ? 'Mostra meno' : 'Scopri di più';
    });
  });

  /* ---------- Approccio: la parola grande segue il principio al centro dello schermo ---------- */
  var philo = document.getElementById('philo');
  if (philo && 'IntersectionObserver' in window) {
    var points = Array.prototype.slice.call(philo.querySelectorAll('.pp'));
    var words = philo.querySelectorAll('.pw');
    var pearls = philo.querySelectorAll('.philo-pearls span');
    var setCurrent = function (idx) {
      [points, words, pearls].forEach(function (list) {
        Array.prototype.forEach.call(list, function (el, i) { el.classList.toggle('is-current', i === idx); });
      });
    };
    var philoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(points.indexOf(entry.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    points.forEach(function (p) { philoObserver.observe(p); });
  }

  /* ---------- Come funziona: percorso che si disegna con lo scroll ---------- */
  var journey = document.getElementById('journey');
  if (journey) {
    var track = journey.querySelector('.journey-track');
    var steps = Array.prototype.slice.call(journey.querySelectorAll('.jstep'));
    var nums = steps.map(function (s) { return s.querySelector('.jnum'); });
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var vertical = window.matchMedia('(max-width: 959px)');
    var ticking = false;

    // Posiziona la linea esattamente tra il centro del primo e dell'ultimo numero
    function layoutTrack() {
      var base = journey.getBoundingClientRect();
      var a = nums[0].getBoundingClientRect();
      var b = nums[nums.length - 1].getBoundingClientRect();
      var ax = a.left + a.width / 2 - base.left, ay = a.top + a.height / 2 - base.top;
      var bx = b.left + b.width / 2 - base.left, by = b.top + b.height / 2 - base.top;
      if (vertical.matches) {
        track.style.cssText = 'left:' + ax + 'px;top:' + ay + 'px;height:' + (by - ay) + 'px;right:auto;bottom:auto;width:1px';
      } else {
        track.style.cssText = 'left:' + ax + 'px;top:' + ay + 'px;width:' + (bx - ax) + 'px;right:auto;bottom:auto;height:1px';
      }
    }

    function update() {
      ticking = false;
      var p;
      if (reduce.matches) {
        p = 1;
      } else {
        var r = track.getBoundingClientRect();
        var vh = window.innerHeight;
        if (vertical.matches) {
          p = (vh * 0.62 - r.top) / Math.max(r.height, 1);
        } else {
          // orizzontale: il percorso avanza mentre la sezione attraversa il viewport
          var sec = journey.getBoundingClientRect();
          p = (vh * 0.85 - sec.top) / (vh * 0.55);
        }
      }
      p = Math.min(1, Math.max(0, p));
      journey.style.setProperty('--p', p.toFixed(4));
      var n = steps.length - 1;
      steps.forEach(function (s, i) {
        if (p >= i / n - 0.001) s.classList.add('is-active');
        else s.classList.remove('is-active');
      });
    }
    function requestUpdate() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    layoutTrack();
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', function () { layoutTrack(); requestUpdate(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layoutTrack(); update(); });
  }

  /* ---------- Form contatti ---------- */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var statusBox = document.getElementById('form-status');

  var rules = {
    nome: function (v) {
      if (!v.trim()) return 'Inserisci il tuo nome.';
      if (v.trim().length < 2) return 'Il nome deve contenere almeno 2 caratteri.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Inserisci il tuo indirizzo email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Inserisci un indirizzo email valido (es. nome@dominio.it).';
      return '';
    },
    telefono: function (v) {
      if (v.trim() && !/^\+?[0-9\s().-]{6,20}$/.test(v.trim())) return 'Inserisci un numero di telefono valido oppure lascia il campo vuoto.';
      return '';
    },
    trattamento: function (v) { return v ? '' : 'Seleziona il trattamento di interesse.'; },
    messaggio: function (v) {
      if (!v.trim()) return 'Scrivi un breve messaggio.';
      if (v.trim().length < 10) return 'Il messaggio deve contenere almeno 10 caratteri.';
      return '';
    },
    privacy: function (v, el) { return el.checked ? '' : 'Per inviare la richiesta è necessario il consenso al trattamento dei dati.'; }
  };

  function validateField(el) {
    var rule = rules[el.name];
    if (!rule) return true;
    var msg = rule(el.value, el);
    var field = el.closest('.field');
    var err = document.getElementById(el.getAttribute('aria-describedby'));
    field.classList.toggle('has-error', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.textContent = msg;
    return !msg;
  }

  Array.prototype.forEach.call(form.elements, function (el) {
    if (!rules[el.name]) return;
    el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') validateField(el); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('has-error')) validateField(el); });
    el.addEventListener('change', function () { if (el.closest('.field').classList.contains('has-error')) validateField(el); });
  });

  function showStatus(html, isError) {
    statusBox.innerHTML = html;
    statusBox.hidden = false;
    statusBox.classList.toggle('is-error', !!isError);
    statusBox.focus();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (rules[el.name] && !validateField(el) && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var data = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefono: form.telefono.value.trim(),
      trattamento: form.trattamento.value,
      messaggio: form.messaggio.value.trim(),
      privacy: true
    };
    var endpoint = form.getAttribute('data-endpoint');
    var submitBtn = form.querySelector('button[type="submit"]');

    if (endpoint) {
      // Backend reale configurato: invio effettivo
      submitBtn.disabled = true;
      submitBtn.textContent = 'Invio in corso…';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        showStatus('<strong>Grazie, ' + escapeHtml(data.nome) + '.</strong>La tua richiesta è stata inviata. Ti risponderemo il prima possibile.');
      }).catch(function () {
        showStatus('<strong>Invio non riuscito.</strong>Si è verificato un problema tecnico. Puoi chiamarci al <a href="tel:+393792788458">+39 379 278 8458</a> o scriverci su WhatsApp.', true);
      }).then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Invia la richiesta';
      });
      return;
    }

    // Nessun backend: non simuliamo l'invio. Proponiamo WhatsApp con i dati già compilati.
    var text = 'Buongiorno, sono ' + data.nome + '. Vorrei ricevere informazioni sui trattamenti Wonder Lab e prenotare una consulenza.\n\n' +
      'Trattamento di interesse: ' + data.trattamento + '\n' +
      'Messaggio: ' + data.messaggio + '\n\n' +
      'Email: ' + data.email + (data.telefono ? '\nTelefono: ' + data.telefono : '') + '\n\nGrazie!';
    var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);

    showStatus(
      '<strong>Ci siamo quasi.</strong>' +
      'L\'invio online del modulo non è ancora attivo, quindi la tua richiesta <em>non è stata inviata</em>. ' +
      'Abbiamo preparato un messaggio WhatsApp con i dati che hai inserito: ti basta aprirlo e premere invia.' +
      '<br><a class="btn btn-primary" href="' + waUrl + '" target="_blank" rel="noopener">Invia la richiesta su WhatsApp</a>'
    );
  });
})();
