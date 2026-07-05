const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function buildPage() {
  const logo = document.querySelector(".nav__logo");
  logo.textContent = SITE.name + "_";
  logo.dataset.text = SITE.name + "_";

  const name = document.querySelector(".hero__name");
  name.textContent = SITE.name;
  name.dataset.text = SITE.name;
  document.querySelector(".hero__role").textContent = SITE.role;
  document.title = `${SITE.name} — ${SITE.role}`;

  const stats = document.getElementById("stats");
  SITE.stats.forEach(s => {
    const card = el("div", "stat");
    card.append(
      el("div", "stat__value", `<span class="stat__num" data-target="${s.value}">0</span>${esc(s.suffix)}`),
      el("div", "stat__label", esc(s.label))
    );
    stats.append(card);
  });

  const skillsGrid = document.getElementById("skills-grid");
  SITE.skillGroups.forEach(group => {
    const g = el("div", "skill-group reveal");
    g.append(el("h3", "skill-group__title", esc(group.title)));
    group.skills.forEach(s => {
      const item = el("div", "skill");
      item.innerHTML = `<span class="skill__marker mono">▸</span><span>${esc(s)}</span>`;
      g.append(item);
    });
    skillsGrid.append(g);
  });

  const projGrid = document.getElementById("projects-grid");
  SITE.projects.forEach(p => {
    const card = el("article", "card reveal");
    card.innerHTML =
      `<div class="card__glare"></div>` +
      `<div class="card__icon">${p.icon}</div>` +
      `<h3 class="card__title">${esc(p.title)}</h3>` +
      `<p class="card__desc">${esc(p.description)}</p>` +
      `<div class="card__tags">${p.tags.map(t => `<span class="card__tag">${esc(t)}</span>`).join("")}</div>` +
      (p.link ? `<a class="card__link" href="${esc(p.link)}" target="_blank" rel="noopener">view project →</a>` : "");
    projGrid.append(card);
  });

  const timeline = document.getElementById("timeline");
  SITE.timeline.forEach(t => {
    const item = el("div", "tl-item reveal");
    item.innerHTML =
      `<div class="tl-item__period">${esc(t.period)}</div>` +
      `<h3 class="tl-item__title">${esc(t.title)}</h3>` +
      `<div class="tl-item__place">${esc(t.place)}</div>` +
      `<ul class="tl-item__points">${t.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`;
    timeline.append(item);
  });

  document.getElementById("contact-heading").textContent = SITE.contact.heading;
  document.getElementById("contact-blurb").textContent = SITE.contact.blurb;
  const emailBtn = document.getElementById("contact-email");
  emailBtn.textContent = SITE.contact.email;
  emailBtn.href = "mailto:" + SITE.contact.email;
  const links = document.getElementById("contact-links");
  SITE.contact.links.forEach(l => {
    const a = el("a", "", esc(l.label));
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    links.append(a);
  });
  document.getElementById("footer").textContent = `© ${new Date().getFullYear()} ${SITE.name} — ${SITE.footer}`;
}

// background particles. took way too long to get the mouse push to feel right
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    // scale particle count with screen size, capped so big monitors dont melt
    const count = Math.min(130, Math.floor((W * H) / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const linkDist = 130;

    for (const p of particles) {
      // push away from the mouse
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 150 * 150 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const force = (150 - d) / 150 * 0.6;
        p.vx += (dx / d) * force * 0.15;
        p.vy += (dy / d) * force * 0.15;
      }

      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.985; p.vy *= 0.985;
      // keep them drifting a bit so they never fully stop
      if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.04;
      if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.04;

      // wrap at the edges
      if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 228, 255, 0.55)";
      ctx.fill();
    }

    // lines between close particles. n^2 but fine at this count
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkDist * linkDist) {
          ctx.strokeStyle = `rgba(34, 228, 255, ${(1 - Math.sqrt(d2) / linkDist) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseout", () => { mouse.x = -9999; mouse.y = -9999; });
  resize();

  if (reducedMotion) {
    // just draw one static frame
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 228, 255, 0.4)";
      ctx.fill();
    }
  } else {
    frame();
  }
}

// hero tagline decode effect
function initScramble() {
  const target = document.getElementById("scramble-text");
  const glyphs = "!<>-_\\/[]{}—=+*^?#01";
  let index = 0;

  if (reducedMotion) { target.textContent = SITE.taglines[0]; return; }

  function scrambleTo(text) {
    const from = target.textContent;
    const length = Math.max(from.length, text.length);
    // each char gets its own random start/end frame, thats what makes it look organic
    const queue = [];
    for (let i = 0; i < length; i++) {
      queue.push({
        to: text[i] || "",
        start: Math.floor(Math.random() * 30),
        end: Math.floor(Math.random() * 30) + 20
      });
    }
    let frameCount = 0;
    function update() {
      let out = "", done = 0;
      for (const q of queue) {
        if (frameCount >= q.end) { done++; out += q.to; }
        else if (frameCount >= q.start) {
          out += `<span style="color:var(--accent);opacity:.6">${glyphs[Math.floor(Math.random() * glyphs.length)]}</span>`;
        }
      }
      target.innerHTML = out;
      frameCount++;
      if (done < queue.length) requestAnimationFrame(update);
      else setTimeout(next, 2800);
    }
    update();
  }

  function next() {
    scrambleTo(SITE.taglines[index]);
    index = (index + 1) % SITE.taglines.length;
  }
  next();
}

// fake terminal in the about section
function initTerminal() {
  const body = document.getElementById("terminal-body");
  const prompt = `<span class="t-prompt">kyle@portfolio:~$ </span>`;

  function typeCommand(entry, then) {
    const line = document.createElement("div");
    line.innerHTML = prompt + `<span class="t-cmd"></span>`;
    body.append(line);
    const cmdSpan = line.querySelector(".t-cmd");
    let i = 0;

    (function tick() {
      if (i <= entry.cmd.length) {
        cmdSpan.textContent = entry.cmd.slice(0, i++);
        // random delay so it feels like actual typing
        setTimeout(tick, reducedMotion ? 0 : 40 + Math.random() * 50);
      } else {
        entry.out.forEach(o => body.append(el("span", "t-out", esc(o))));
        setTimeout(then, reducedMotion ? 0 : 450);
      }
    })();
  }

  function run(i) {
    if (i >= SITE.terminal.length) {
      body.insertAdjacentHTML("beforeend", `<div>${prompt}<span class="caret">▌</span></div>`);
      return;
    }
    typeCommand(SITE.terminal[i], () => run(i + 1));
  }

  // dont start typing until its actually on screen
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      run(0);
      obs.disconnect();
    }
  }, { threshold: 0.35 }).observe(document.getElementById("terminal"));
}

// fade-in on scroll + the stat counters
function initReveals() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");

      entry.target.querySelectorAll(".stat__num").forEach(n => {
        const target = +n.dataset.target;
        if (reducedMotion) { n.textContent = target; return; }
        const start = performance.now(), dur = 1400;
        (function step(t) {
          const k = Math.min((t - start) / dur, 1);
          // ease-out cubic
          n.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        })(start);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(r => observer.observe(r));
}

// custom cursor, dot follows instantly and the ring lags behind
function initCursor() {
  if (isTouch) return;
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  (function follow() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();

  document.addEventListener("mouseover", e => {
    if (e.target.closest("a, button, .card, .stat")) ring.classList.add("is-hovering");
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest("a, button, .card, .stat")) ring.classList.remove("is-hovering");
  });
}

// project card tilt + glare postion
function initTilt() {
  if (isTouch || reducedMotion) return;
  document.querySelectorAll(".card").forEach(card => {
    const glare = card.querySelector(".card__glare");
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(700px) rotateX(${(py - 0.5) * -10}deg) rotateY(${(px - 0.5) * 10}deg) scale(1.02)`;
      glare.style.left = px * 100 + "%";
      glare.style.top = py * 100 + "%";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// buttons lean towards the cursor a little
function initMagnetic() {
  if (isTouch || reducedMotion) return;
  document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });
}

// nav border on scroll, progress bar, mobile menu
function initNav() {
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".scroll-progress");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }, { passive: true });

  const burger = document.querySelector(".nav__burger");
  const links = document.querySelector(".nav__links");
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-open");
    links.classList.toggle("is-open");
  });
  // close the menu when a link gets clicked
  links.addEventListener("click", e => {
    if (e.target.tagName === "A") {
      burger.classList.remove("is-open");
      links.classList.remove("is-open");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildPage();
  initParticles();
  initScramble();
  initTerminal();
  initReveals();
  initCursor();
  initTilt();
  initMagnetic();
  initNav();
});
