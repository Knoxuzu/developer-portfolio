(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== EDIT YOUR CONTENT HERE =====
  const SKILLS = ["HTML", "CSS", "JavaScript", "Responsive Design", "Accessibility", "Git & GitHub"];
  const PROJECTS = [
    { title: "KNOXUZU Portfolio", type: "Web", desc: "This site: a layered illustrated hero, scroll effects and an accessible UI.", tags: ["HTML", "CSS", "JS"], live: "", code: "" },
    { title: "Project Two", type: "Web", desc: "Replace with a short description of what it does and what you learned.", tags: ["JavaScript", "API"], live: "", code: "" },
    { title: "Project Three", type: "Design", desc: "Replace with a UI/UX or design experiment you are proud of.", tags: ["Figma", "UI"], live: "", code: "" },
  ];
  const EMAIL = "your@email.com"; // EDIT: your email
  const LINKS = { github: "", linkedin: "" }; // EDIT: paste full URLs; empty ones are hidden
  // ==================================

  $("#year").textContent = new Date().getFullYear();

  // Skills
  $(".skills").innerHTML = SKILLS.map(s => `<li>${s}</li>`).join("");

  // Projects + filters
  const grid = $(".project-grid"), bar = $(".filters");
  const types = ["All", ...new Set(PROJECTS.map(p => p.type))];
  const esc = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const linkHtml = p => [["live", "Live"], ["code", "Code"]].filter(([k]) => p[k])
    .map(([k, l]) => `<a href="${esc(p[k])}" target="_blank" rel="noopener">${l} ↗</a>`).join("") || '<span class="soon">Coming soon</span>';
  const render = f => {
    grid.innerHTML = PROJECTS.filter(p => f === "All" || p.type === f).map(p => `
      <article class="project">
        <div class="project-thumb" aria-hidden="true"><div class="mock"><div class="mock-bar"><i></i><i></i><i></i></div><div class="mock-body"><b></b><b></b><b></b><b></b></div></div></div>
        <div class="project-body">
          <h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
          <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
          <div class="project-links">${linkHtml(p)}</div>
        </div>
      </article>`).join("");
  };
  bar.innerHTML = types.map((t, i) => `<button type="button" aria-pressed="${i === 0}">${t}</button>`).join("");
  bar.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", bar).forEach(x => x.setAttribute("aria-pressed", x === b));
    render(b.textContent);
  });
  render("All");

  // Header: scrolled state, progress bar, active link
  const header = $(".site-header"), prog = $(".scroll-progress");
  const onScroll = () => {
    header.classList.toggle("scrolled", scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const links = $$("#nav a");
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section").forEach(s => spy.observe(s));

  // Mobile menu
  const toggle = $(".nav-toggle"), nav = $("#nav");
  const setMenu = o => { nav.classList.toggle("open", o); toggle.setAttribute("aria-expanded", o); };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", e => e.target.closest("a") && setMenu(false));
  addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

  // Reveal on scroll (staggered)
  $$(".reveal").forEach((el, i) => el.style.setProperty("--d", (i % 4) * 90 + "ms"));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  $$(".reveal").forEach(el => io.observe(el));

  // Hero parallax
  if (!reduce && matchMedia("(pointer:fine)").matches) {
    const hero = $(".welcome-gate"), layers = [[".scene-clouds", 10], [".scene-particles", 22], [".foreground-clouds", 16]];
    hero.addEventListener("mousemove", e => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      layers.forEach(([s, d]) => { $(s).style.translate = `${x * d}px ${y * d}px`; });
    });
  }

  // Email copy + socials
  $(".email-text").textContent = EMAIL;
  $(".copy-email").addEventListener("click", async () => {
    const l = $(".copy-label");
    try { await navigator.clipboard.writeText(EMAIL); l.textContent = "Copied ✓"; setTimeout(() => (l.textContent = "Copy"), 1800); }
    catch { location.href = "mailto:" + EMAIL; }
  });
  $(".socials").innerHTML = Object.entries(LINKS).filter(([, u]) => u)
    .map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`).join("");

  // Contact form: validation + mailto (no backend needed)
  const form = $(".contact-form"), status = $(".form-status");
  const check = f => {
    const msgs = { name: "Please enter your name.", email: "Please enter a valid email.", message: "Message should be at least 10 characters." };
    let ok = true;
    ["name", "email", "message"].forEach(n => {
      const el = f.elements[n], bad = !el.checkValidity();
      el.setAttribute("aria-invalid", bad);
      el.nextElementSibling.textContent = bad ? msgs[n] : "";
      ok = ok && !bad;
    });
    return ok;
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!check(form)) return;
    const d = new FormData(form);
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + d.get("name"))}&body=${encodeURIComponent(d.get("message") + "\n\n— " + d.get("name") + " (" + d.get("email") + ")")}`;
    status.textContent = "Opening your email app…";
  });
})();
