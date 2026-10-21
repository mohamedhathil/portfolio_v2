/* ===== script block 1 ===== */
const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* particle network */
const cv = document.getElementById('bg');
const cx = cv.getContext('2d');
let W, H;
let P = [];
let mx = -999;
let my = -999;

function rs() {
  W = cv.width = innerWidth;
  H = cv.height = innerHeight;
  P = Array.from({ length: Math.min(90, (W / 14) | 0) }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));
}

rs();
addEventListener('resize', rs);
addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function draw() {
  cx.clearRect(0, 0, W, H);

  const g = cx.createRadialGradient(W * 0.8, 0, 0, W * 0.8, 0, W * 0.7);
  g.addColorStop(0, 'rgba(138,92,255,.16)');
  g.addColorStop(1, 'transparent');
  cx.fillStyle = g;
  cx.fillRect(0, 0, W, H);

  for (const p of P) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    cx.fillStyle = '#22e6ff';
    cx.fillRect(p.x, p.y, 2, 2);

    // links between nearby particles
    for (const q of P) {
      if (q === p) continue;
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        cx.strokeStyle = 'rgba(34,230,255,' + 0.16 * (1 - d / 130) + ')';
        cx.beginPath();
        cx.moveTo(p.x, p.y);
        cx.lineTo(q.x, q.y);
        cx.stroke();
      }
    }

    // link to mouse
    const dm = Math.hypot(p.x - mx, p.y - my);
    if (dm < 170) {
      cx.strokeStyle = 'rgba(138,92,255,' + 0.5 * (1 - dm / 170) + ')';
      cx.beginPath();
      cx.moveTo(p.x, p.y);
      cx.lineTo(mx, my);
      cx.stroke();
    }
  }

  if (!rm) requestAnimationFrame(draw);
}
draw();

/* typing roles */
const roles = ['Senior Angular Developer', 'Full Stack Engineer', 'Performance Obsessive'];
let ri = 0;
let ci = 0;
let del = false;
const re = document.getElementById('role');

function ty() {
  const w = roles[ri];
  re.textContent = w.slice(0, ci);

  if (!del && ci === w.length) {
    del = true;
    return setTimeout(ty, 1600);
  }
  if (del && ci === 0) {
    del = false;
    ri = (ri + 1) % roles.length;
  }

  ci += del ? -1 : 1;
  setTimeout(ty, del ? 35 : 75);
}

if (rm) re.textContent = roles[0];
else ty();

/* glitch */
const nm = document.getElementById('nm');
if (!rm) {
  setInterval(() => {
    nm.classList.add('g');
    setTimeout(() => nm.classList.remove('g'), 220);
  }, 3800);
}

/* reveal, bars, counters */
function count(el) {
  const n = +el.dataset.n;
  const d = +el.dataset.d || 0;
  const s = el.dataset.s || '';
  const t = performance.now();

  (function f(now) {
    const k = Math.min(1, (now - t) / 1800);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = (n * e).toFixed(d) + (k === 1 ? s : '');
    if (k < 1) requestAnimationFrame(f);
  })(t);
}

const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        e.target
          .querySelectorAll('[data-w]')
          .forEach((b) => (b.style.width = b.dataset.w + '%'));
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.15 }
);

document.querySelectorAll('.rv').forEach((el) => io.observe(el));
document.querySelectorAll('[data-n]').forEach(count);

/* 3D tilt */
document.querySelectorAll('.tilt,#ph').forEach((el) => {
  if (rm) return;

  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform =
      'perspective(900px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg)';
  });

  el.addEventListener('mouseleave', () => (el.style.transform = ''));
});

/* ===== script block 2 ===== */
/* ADDED: lightning nav, cursor glow, impact counters */
(function () {
  var nav = document.querySelector('nav');
  var links = [].slice.call(nav.querySelectorAll('a'));

  var prog = document.createElement('span');
  prog.className = 'prog';
  var ind = document.createElement('span');
  ind.className = 'ind';

  var NS = 'http://www.w3.org/2000/svg';
  var bolt = document.createElementNS(NS, 'svg');
  var pl = document.createElementNS(NS, 'polyline');
  bolt.setAttribute('class', 'bolt');
  bolt.setAttribute('aria-hidden', 'true');
  bolt.appendChild(pl);

  nav.appendChild(prog);
  nav.appendChild(ind);
  nav.appendChild(bolt);

  /* mobile menu */
  var burger = nav.querySelector('.burger');
  var menu = nav.querySelector('#menu');
  function toggleMenu(open) {
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  }
  burger.addEventListener('click', function () {
    toggleMenu(!menu.classList.contains('open'));
  });
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      toggleMenu(false);
    });
  });
  addEventListener('resize', function () {
    if (innerWidth > 760) toggleMenu(false);
  });

  var secs = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  var cur = null;
  var last = 0;

  function rect(a) {
    var n = nav.getBoundingClientRect();
    var r = a.getBoundingClientRect();
    return { x: r.left - n.left, w: r.width };
  }

  function place(a) {
    if (!a) return;
    var r = rect(a);
    if (!r.w) {
      ind.style.opacity = 0;
      return;
    }
    ind.style.opacity = 1;
    ind.style.left = r.x + 'px';
    ind.style.width = r.w + 'px';
  }

  // draws a jagged lightning bolt between two x positions
  function zap(x1, x2) {
    var n = Math.max(4, (Math.abs(x2 - x1) / 14) | 0);
    var p = [];
    for (var i = 0; i <= n; i++) {
      var x = (x1 + ((x2 - x1) * i) / n).toFixed(1);
      var y = (i === 0 || i === n ? 1 : 2 + Math.random() * 12).toFixed(1);
      p.push(x + ',' + y);
    }
    pl.setAttribute('points', p.join(' '));
    bolt.classList.remove('zap');
    void bolt.getBoundingClientRect(); // force reflow to restart animation
    bolt.classList.add('zap');
  }

  function set(a) {
    if (a === cur) return;
    var old = cur;
    cur = a;

    links.forEach(function (l) {
      l.classList.toggle('on', l === a);
    });
    place(a);

    if (old && !rm && performance.now() - last > 180) {
      var o = rect(old);
      var n = rect(a);
      if (o.w && n.w) {
        zap(o.x + o.w / 2, n.x + n.w / 2);
        last = performance.now();
      }
    }
  }

  function upd() {
    var y = scrollY;
    var max = document.documentElement.scrollHeight - innerHeight;

    prog.style.width = (max > 0 ? Math.min(1, y / max) * 100 : 0) + '%';
    nav.classList.toggle('sc', y > 24);

    var pos = y + innerHeight * 0.35;
    var k = 0;
    secs.forEach(function (s, i) {
      if (s && s.offsetTop <= pos) k = i;
    });
    if (max > 0 && y >= max - 4) k = secs.length - 1;

    set(links[k]);
  }

  var tk = false;
  addEventListener(
    'scroll',
    function () {
      if (!tk) {
        tk = true;
        requestAnimationFrame(function () {
          tk = false;
          upd();
        });
      }
    },
    { passive: true }
  );

  addEventListener('resize', function () {
    place(cur);
    upd();
  });

  if (document.fonts) {
    document.fonts.ready.then(function () {
      place(cur);
    });
  }
  upd();

  /* cursor glow */
  var gl = document.getElementById('glow');
  addEventListener(
    'pointermove',
    function (e) {
      gl.style.left = e.clientX + 'px';
      gl.style.top = e.clientY + 'px';
    },
    { passive: true }
  );

  /* impact counters, triggered on scroll */
  function cnt(e) {
    var n = +e.dataset.c;
    var s = e.dataset.s || '';
    var p = e.dataset.p || '';
    var t = performance.now();

    if (rm) {
      e.textContent = p + n + s;
      return;
    }

    (function f(now) {
      var k = Math.min(1, (now - t) / 1600);
      var v = n * (1 - Math.pow(1 - k, 3));
      e.textContent = p + Math.round(v) + s;
      if (k < 1) requestAnimationFrame(f);
    })(t);
  }

  var io2 = new IntersectionObserver(
    function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        io2.unobserve(en.target);
        cnt(en.target.querySelector('[data-c]'));
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.imp').forEach(function (e) {
    io2.observe(e);
  });
})();

/* ===== script block 3 ===== */
/* ADDED: scroll-driven project timeline */
(function () {
  var tl = document.querySelector('.tl');
  if (!tl) return;

  var bar = document.createElement('span');
  bar.className = 'tlp';
  tl.insertBefore(bar, tl.firstChild);

  var cards = [].slice.call(tl.querySelectorAll('.pj'));
  var tk = false;

  function upd() {
    var r = tl.getBoundingClientRect();
    var y = innerHeight * 0.6;
    var hgt = Math.max(0, Math.min(r.height, y - r.top));

    bar.style.height = hgt + 'px';
    bar.style.opacity = hgt > 0 ? 1 : 0;

    cards.forEach(function (c) {
      var d = c.getBoundingClientRect().top + 37;
      c.classList.toggle('hit', d < y);
    });
  }

  addEventListener(
    'scroll',
    function () {
      if (!tk) {
        tk = true;
        requestAnimationFrame(function () {
          tk = false;
          upd();
        });
      }
    },
    { passive: true }
  );

  addEventListener('resize', upd);
  upd();
})();
