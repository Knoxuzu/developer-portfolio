(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const mk = (t, c, p) => { const e = document.createElement(t); e.className = c; p && p.append(e); return e; };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer:fine)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a);

  // Skills marquee
  const items = [...document.querySelectorAll(".skills li")].map(l => l.textContent).concat("Ideas become reality");
  $(".marquee .track").innerHTML = Array(8).fill(items).flat()
    .map(t => `<span>${t}</span><img src="assets/effects/sparkle.svg" alt="">`).join("");

  // Role typewriter
  const roles = ["websites", "interfaces", "ideas", "experiences"], el = $(".roles");
  if (!reduce) {
    let r = 0, c = roles[0].length, del = true;
    const tick = () => {
      const w = roles[r];
      el.textContent = w.slice(0, c);
      if (del) { c--; if (c < 0) { del = false; r = (r + 1) % roles.length; c = 0; } }
      else { c++; if (c > roles[r].length) { del = true; c = roles[r].length; return setTimeout(tick, 1600); } }
      setTimeout(tick, del ? 45 : 85);
    };
    setTimeout(tick, 3600);
  }

  if (reduce) return;

  // Headline: per-letter reveal
  const h1 = $(".welcome-content h1");
  h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
  let i = 0;
  const split = n => [...n.childNodes].forEach(c => {
    if (c.nodeType !== 3) return split(c);
    const f = document.createDocumentFragment();
    c.textContent.replace(/\s+/g, " ").split(" ").forEach((w, k, a) => {
      if (w) {
        const s = mk("span", "w"); s.setAttribute("aria-hidden", "true");
        [...w].forEach(ch => { const e = mk("span", "ch", s); e.style.setProperty("--i", i++); e.textContent = ch; });
        f.append(s);
      }
      if (k < a.length - 1) f.append(" ");
    });
    c.replaceWith(f);
  });
  split(h1);

  // Hero sparkles + shooting stars
  const fx = $(".scene-fx");
  for (let n = 0; n < 18; n++) {
    const s = mk("img", "sparkle", fx); s.src = "assets/effects/sparkle.svg"; s.alt = "";
    const z = rnd(8, 22);
    Object.assign(s.style, { left: rnd(42, 96) + "%", top: rnd(10, 85) + "%", width: z + "px", height: z + "px",
      animationDelay: rnd(0, 5) + "s", animationDuration: rnd(2.5, 5) + "s", filter: `hue-rotate(${rnd(0, 70)}deg)` });
  }
  for (let n = 0; n < 3; n++) {
    const s = mk("img", "shooting", fx); s.src = "assets/effects/shooting-star.svg"; s.alt = "";
    s.style.top = rnd(8, 35) + "%"; s.style.left = rnd(30, 60) + "%"; s.style.animationDelay = n * 3 + rnd(2, 5) + "s";
  }

  // Scroll: hero depth + header
  const hero = $(".welcome-gate");
  addEventListener("scroll", () => hero.style.setProperty("--p", Math.min(scrollY / innerHeight, 1)), { passive: true });

  if (!fine) return;

  // Cursor glow (smoothed)
  const glow = mk("div", "cursor-glow", document.body);
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
  addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; });
  document.addEventListener("pointerleave", () => (glow.style.opacity = 0));
  (function loop() { x += (tx - x) * .12; y += (ty - y) * .12; glow.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(loop); })();

  // Gateway layer depth (each layer moves a different amount)
  const gl = [...document.querySelectorAll(".scene-gateway img")], depth = [4, 8, 14, 22];
  hero.addEventListener("pointermove", e => {
    const a = e.clientX / innerWidth - .5, b = e.clientY / innerHeight - .5;
    gl.forEach((g, k) => (g.style.translate = `${a * depth[k]}px ${b * depth[k]}px`));
  });

  // Card tilt + glare
  const sel = ".card,.project";
  document.addEventListener("pointermove", e => {
    const t = e.target.closest && e.target.closest(sel); if (!t) return;
    const r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    t.style.setProperty("--ry", (px - .5) * 10 + "deg"); t.style.setProperty("--rx", (.5 - py) * 8 + "deg");
    t.style.setProperty("--mx", px * 100 + "%"); t.style.setProperty("--my", py * 100 + "%");
  });
  document.addEventListener("pointerout", e => {
    const t = e.target.closest && e.target.closest(sel);
    if (t && !t.contains(e.relatedTarget)) { t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); }
  });

  // Magnetic buttons
  document.addEventListener("pointermove", e => {
    const b = e.target.closest && e.target.closest(".button"); if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.translate = `${(e.clientX - r.left - r.width / 2) * .18}px ${(e.clientY - r.top - r.height / 2) * .28}px`;
  });
  document.addEventListener("pointerout", e => {
    const b = e.target.closest && e.target.closest(".button");
    if (b && !b.contains(e.relatedTarget)) b.style.translate = "";
  });
})();

// Paper plane on send
document.addEventListener("sent", () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const f = document.querySelector(".contact-form"), p = document.createElement("img");
  p.src = "assets/effects/paper-plane.svg"; p.alt = ""; p.className = "plane"; f.append(p);
  setTimeout(() => p.remove(), 1700);
});
