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

// light pulses that travel along the background grid lines like network packets
function initGridPulses() {
  const canvas = document.getElementById("pulse-canvas");
  if (reducedMotion) { canvas.remove(); return; }
  const ctx = canvas.getContext("2d");
  const GRID = 48;    // must match the css grid overlay size
  const TRAIL = 150;  // fading tail length in px
  const MAX = 6;
  let W, H;
  const pulses = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawn() {
    const horiz = Math.random() < 0.5;
    const dir = Math.random() < 0.5 ? 1 : -1;
    // pick a random grid line to travel on, start just offscreen
    const lanes = Math.floor((horiz ? H : W) / GRID) - 1;
    if (lanes < 2) return;
    const lane = GRID * (1 + Math.floor(Math.random() * lanes));
    const start = horiz
      ? { x: dir > 0 ? -TRAIL : W + TRAIL, y: lane }
      : { x: lane, y: dir > 0 ? -TRAIL : H + TRAIL };
    pulses.push({
      pts: [{ ...start }, { ...start }], // [tail... corners ..., head]
      dx: horiz ? dir : 0,
      dy: horiz ? 0 : dir,
      speed: 1.2 + Math.random() * 2,
      color: Math.random() < 0.6 ? "34, 228, 255" : "160, 107, 255"
    });
  }

  function step(p) {
    const head = p.pts[p.pts.length - 1];
    const before = p.dx ? head.x : head.y;
    head.x += p.dx * p.speed;
    head.y += p.dy * p.speed;

    // sometimes turn 90° when crossing a grid intersection
    const after = p.dx ? head.x : head.y;
    const line = GRID * Math.round(after / GRID);
    if ((before - line) * (after - line) < 0 && Math.random() < 0.3) {
      if (p.dx) { head.x = line; p.dy = Math.random() < 0.5 ? 1 : -1; p.dx = 0; }
      else      { head.y = line; p.dx = Math.random() < 0.5 ? 1 : -1; p.dy = 0; }
      p.pts.push({ x: head.x, y: head.y });
    }

    // trim the tail so the trail never exceeds TRAIL px
    let dist = 0;
    for (let i = p.pts.length - 1; i > 0; i--) {
      const a = p.pts[i], b = p.pts[i - 1];
      const seg = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
      if (dist + seg > TRAIL) {
        const k = (TRAIL - dist) / seg;
        b.x = a.x + (b.x - a.x) * k;
        b.y = a.y + (b.y - a.y) * k;
        p.pts.splice(0, i - 1);
        break;
      }
      dist += seg;
    }
  }

  function draw(p) {
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    let dist = 0;
    for (let i = p.pts.length - 1; i > 0; i--) {
      const a = p.pts[i], b = p.pts[i - 1];
      const seg = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
      // fade the tail out with distance from the head
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, `rgba(${p.color}, ${Math.max(0, 1 - dist / TRAIL) * 0.5})`);
      grad.addColorStop(1, `rgba(${p.color}, ${Math.max(0, 1 - (dist + seg) / TRAIL) * 0.5})`);
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      dist += seg;
    }
    // bright head dot
    const head = p.pts[p.pts.length - 1];
    ctx.fillStyle = `rgba(${p.color}, 0.9)`;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 1.7, 0, Math.PI * 2);
    ctx.fill();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      step(p);
      draw(p);
      const h = p.pts[p.pts.length - 1];
      // gone well offscreen, retire it
      if (h.x < -TRAIL - GRID || h.x > W + TRAIL + GRID || h.y < -TRAIL - GRID || h.y > H + TRAIL + GRID) {
        pulses.splice(i, 1);
      }
    }
    // stagger new spawns instead of dumping them all at once
    if (pulses.length < MAX && Math.random() < 0.02) spawn();
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  spawn(); spawn();
  frame();
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

  // after the intro script finishes, hand the prompt over to the visitor
  function startInteractive() {
    const line = el("div", "t-input-line");
    line.innerHTML = prompt;
    const input = document.createElement("input");
    input.className = "t-input mono";
    input.setAttribute("aria-label", "Terminal input, type help for commands");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("spellcheck", "false");
    line.append(input);
    body.append(line);
    body.append(el("span", "t-out t-hint", 'type "help" to look around'));

    // clicking anywhere in the terminal focuses the input
    body.closest(".terminal").addEventListener("click", () => input.focus());

    const history = [];
    let histPos = -1;

    input.addEventListener("keydown", e => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length) {
          histPos = histPos < 0 ? history.length - 1 : Math.max(0, histPos - 1);
          input.value = history[histPos];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histPos >= 0) {
          histPos++;
          if (histPos >= history.length) { histPos = -1; input.value = ""; }
          else input.value = history[histPos];
        }
      } else if (e.key === "Enter") {
        const raw = input.value.trim();
        input.value = "";
        histPos = -1;
        // echo the command as a static line above the input
        const echo = el("div", "", prompt + `<span class="t-cmd">${esc(raw)}</span>`);
        body.insertBefore(echo, line);
        if (raw) {
          history.push(raw);
          runCommand(raw.toLowerCase());
        }
        body.scrollTop = body.scrollHeight;
      }
    });

    function print(lines) {
      lines.forEach(o => body.insertBefore(el("span", "t-out", esc(o)), line));
    }

    function runCommand(raw) {
      const [cmd, ...args] = raw.split(/\s+/);
      const commands = {
        help: () => print([
          "available commands:",
          "  whoami      about       skills      projects",
          "  contact     uptime      clear       ls",
        ]),
        whoami: () => print(SITE.terminal[0].out),
        about: () => print(SITE.terminal[1].out),
        cat: () => args[0] === "about.txt" ? print(SITE.terminal[1].out) : print([`cat: ${args[0] || ""}: no such file`]),
        skills: () => print(SITE.skillGroups.flatMap(g => [g.title + ":", ...g.skills.map(s => "  " + s)])),
        projects: () => print(SITE.projects.flatMap(p => [p.title + " — " + p.tags.join(", "), ...(p.link ? ["  " + p.link] : [])])),
        contact: () => print([SITE.contact.email, ...SITE.contact.links.map(l => l.label + ": " + l.url)]),
        ls: () => print(["about.txt  interests/  projects/  homelab/"]),
        uptime: () => print(SITE.terminal[3].out),
        clear: () => body.querySelectorAll(":scope > :not(.t-input-line)").forEach(n => n.remove()),
        pwd: () => print(["/home/kyle/portfolio"]),
        sudo: () => print(["kyle is not in the sudoers file. this incident will be reported."]),
        rm: () => print(["nice try."]),
        exit: () => print(["there is no escape. try 'contact' instead."]),
        vim: () => print(["you're stuck now. (just kidding — :q works here)"]),
        ":q": () => print(["phew."]),
      };
      (commands[cmd] || (() => print([`${cmd}: command not found — try 'help'`])))();
    }
  }

  function run(i) {
    if (i >= SITE.terminal.length) {
      startInteractive();
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
  initGridPulses();
  initScramble();
  initTerminal();
  initReveals();
  initCursor();
  initTilt();
  initMagnetic();
  initNav();
});
