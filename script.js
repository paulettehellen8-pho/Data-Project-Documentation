(() => {
   const $ = (id) => document.getElementById(id);
   const stage = $("stage"),
      deck = $("deck"),
      menu = $("menu"),
      count = $("count"),
      intro = $("intro");
   let pages = [],
      step = 0,
      firstPage = [];

   /* ---------- title page text ---------- */
   $("pName").textContent = PROJECT.name;
   $("pSub").textContent = PROJECT.subtitle;
   $("pKind").textContent = PROJECT.kind;
   $("by").textContent = "By " + PROJECT.byline;
   $("oSub").textContent = PROJECT.subtitle;

   /* ---------- flowing light along the edges and curves ---------- */
   const lines = [
      ["M-20 560 C 250 420, 520 660, 1020 440", 9, 0],
      ["M-20 70 C 300 190, 620 -50, 1020 110", 11, -4],
      ["M985 -20 C 910 210, 1040 400, 965 620", 13, -2],
      ["M30 620 C 80 400, -20 200, 55 -20", 10, -6],
      ["M120 640 C 400 520, 700 560, 1020 600", 15, -9],
   ];
   $("streaks").innerHTML = lines
      .map(
         ([d, t, delay]) =>
            `<g style="--t:${t}s">` +
            ["s-tail", "s-head"]
               .map(
                  (c) =>
                     `<path class="${c}" pathLength="1000" d="${d}" style="animation-delay:${delay}s"/>`,
               )
               .join("") +
            "</g>",
      )
      .join("");

   /* ---------- artwork for each stripe ---------- */
   const S = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");
   const ART = [
      () =>
         S(
            5,
            (i) => `<circle cx="${700 + i * 90}" cy="60" r="${14 + i * 9}"/>`,
         ) + `<circle cx="1010" cy="60" r="6" class="f"/>`,
      () =>
         `<path d="M720 60H900M900 60L1000 28M900 60L1000 92"/>` +
         [
            [720, 60],
            [900, 60],
            [1000, 28],
            [1000, 92],
         ]
            .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" class="f"/>`)
            .join(""),
      () => S(3, (i) => `<circle cx="${760 + i * 70}" cy="60" r="38"/>`),
      () =>
         S(4, (r) =>
            S(
               10,
               (c) =>
                  `<rect x="${640 + c * 46}" y="${14 + r * 26}" width="36" height="16" ${(r + c) % 4 === 0 ? 'class="f"' : ""}/>`,
            ),
         ),
      () =>
         `<rect x="720" y="18" width="320" height="84" stroke-dasharray="8 8"/>` +
         S(4, (i) => `<path d="M${770 + i * 70} 44l24 32m0-32l-24 32"/>`),
      () =>
         S(
            3,
            (i) =>
               `<rect x="${700 + i * 24}" y="${16 + i * 32}" width="300" height="24" rx="4" ${i === 1 ? 'class="f" opacity=".5"' : ""}/>`,
         ),
      () =>
         S(6, (i) => {
            const a = (i * Math.PI) / 3,
               x = 860 + Math.cos(a) * 70,
               y = 60 + Math.sin(a) * 38;
            return `<path d="M860 60L${x} ${y}"/><circle cx="${x}" cy="${y}" r="9" class="f"/>`;
         }) + `<circle cx="860" cy="60" r="12"/>`,
      () =>
         S(
            9,
            (i) =>
               `<rect x="${660 + i * 50}" y="${100 - (22 + ((i * 37) % 60))}" width="30" height="${22 + ((i * 37) % 60)}" ${i % 3 === 1 ? 'class="f" opacity=".7"' : ""}/>`,
         ),
      () =>
         `<path d="M620 70H1120"/>` +
         S(
            10,
            (i) =>
               `<circle cx="${640 + i * 50}" cy="70" r="${[2, 4, 7].includes(i) ? 9 : 5}" class="f"/>`,
         ),
      () =>
         S(
            5,
            (i) =>
               `<ellipse cx="900" cy="${96 - i * 14}" rx="${50}" ry="12" ${i === 4 ? 'class="f" opacity=".7"' : ""}/>`,
         ),
      () =>
         S(
            3,
            (i) =>
               `<path d="M${760 + i * 110} 100L${800 + i * 110} 24L${840 + i * 110} 100Z"/><path d="M${800 + i * 110} 54v24" />`,
         ),
      () =>
         S(
            4,
            (i) =>
               `<rect x="${760 + i * 70}" y="${24 - i * 0}" width="46" height="70" rx="3"/><path d="M${772 + i * 70} 62l9 9 17-20"/>`,
         ),
      () =>
         `<path d="M800 20H770V100H800M1000 20H1030V100H1000"/>` +
         S(3, (i) => `<circle cx="${850 + i * 50}" cy="60" r="7" class="f"/>`),
   ];

   /* ---------- build pages, measuring so a table is never split ---------- */
   const el = (tag, cls, html) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      return e;
   };
   const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
   const mkBlock = (b) => {
      if (typeof b === "string") return el("p", null, esc(b));
      if (b.table)
         return el(
            "div",
            "tw",
            `<table class="tbl"><thead><tr>${b.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`,
         );
      return el(
         "ol",
         "refs",
         b.refs
            .map(
               (r, i) =>
                  `<li><b>[${i + 1}]</b><span>${esc(r[0])}<a href="${r[1]}" target="_blank" rel="noopener">${r[1]}</a></span></li>`,
            )
            .join(""),
      );
   };
   const newPage = (s, si, cont) => {
      const p = el("section", "page");
      p.setAttribute("aria-hidden", "true");
      p.innerHTML = `<header class="stripe"><svg viewBox="600 0 600 120" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">${ART[si]()}</svg><span class="num">${si < 12 ? si + 1 : ""}</span><h2>${esc(s.title)}${cont ? "<small>(cont.)</small>" : ""}</h2></header><div class="body"></div>`;
      p.body = p.querySelector(".body");
      p.n = 0;
      p.si = si;
      deck.appendChild(p);
      pages.push(p);
      return p;
   };
   const attach = (page, b, e) => {
      if (typeof b === "string") {
         let pr = page.body.lastElementChild;
         if (!pr || !pr.classList.contains("prose")) {
            pr = el("div", "prose");
            page.body.appendChild(pr);
         }
         pr.appendChild(e);
      } else page.body.appendChild(e);
   };
   const detach = (e) => {
      const par = e.parentElement;
      e.remove();
      if (par.classList.contains("prose") && !par.children.length) par.remove();
   };
   const fits = (page) => page.body.scrollHeight <= page.body.clientHeight + 1;

   /* One shared text scale (--z) for every page, so type size never jumps between pages.
     Start at 1 and step down only until every page (including the biggest table) fits. */
   function paginate() {
      pages.forEach((p) => p.remove());
      pages = [];
      firstPage = [];
      SECTIONS.forEach((s, si) => {
         let page = newPage(s, si, false);
         firstPage[si] = pages.length - 1;
         s.blocks.forEach((b) => {
            const e = mkBlock(b);
            attach(page, b, e);
            if (!fits(page) && page.n > 0) {
               detach(e);
               page = newPage(s, si, true);
               attach(page, b, e);
            }
            page.n++;
         });
      });
   }
   function build() {
      const root = document.documentElement;
      for (let z = 1; z >= 0.6; z -= 0.05) {
         root.style.setProperty("--z", z.toFixed(2));
         paginate();
         if (pages.every(fits)) break;
         const probe = pages[0].querySelector(".prose,.tbl,.refs");
         if (probe && parseFloat(getComputedStyle(probe).fontSize) <= 11.5)
            break;
      }
      buildMenu();
   }

   /* ---------- outline wheel ---------- */
   function buildMenu() {
      menu.innerHTML = "";
      SECTIONS.forEach((s, i) => {
         const b = el("button", null, s.short);
         b.addEventListener("click", (e) => {
            e.stopPropagation();
            go(2 + firstPage[i]);
         });
         menu.appendChild(b);
      });
      wheel(cur());
   }
   const cur = () => (step >= 2 && pages[step - 2] ? pages[step - 2].si : 0);
   function wheel(active) {
      const H = innerHeight,
         lp = deck.getBoundingClientRect().left || innerWidth * 0.4;
      [...menu.children].forEach((b, i) => {
         const d = i - active,
            a = Math.abs(d),
            gap = Math.min(H * 0.105, b.offsetHeight * 2.1);
         b.style.transform = `translate(${lp * 0.225 - d * d * lp * 0.0125}px,${H * 0.5 + d * gap - b.offsetHeight / 2}px) rotate(${d * 6}deg) scale(${Math.max(1 - a * 0.1, 0.5)})`;
         b.style.opacity = a > 4 ? 0 : Math.max(1 - a * 0.25, 0.1);
         b.classList.toggle("on", d === 0);
      });
   }

   /* ---------- navigation ---------- */
   const total = () => 2 + pages.length;
   function render() {
      stage.dataset.mode =
         step === 0 ? "title" : step === 1 ? "outline" : "page";
      pages.forEach((p, i) => {
         const on = i === step - 2;
         p.classList.toggle("on", on);
         p.setAttribute("aria-hidden", on ? "false" : "true");
      });
      wheel(cur());
      count.textContent = `${String(step + 1).padStart(2, "0")} / ${String(total()).padStart(2, "0")}`;
   }
   function go(n) {
      n = Math.max(0, Math.min(total() - 1, n));
      if (n !== step) {
         step = n;
         render();
      }
   }

   addEventListener("keydown", (e) => {
      // arrow keys always work, even right after clicking a button; Space/Enter keep their normal job on a focused button
      if (
         ["ArrowRight", "ArrowDown", "PageDown"].includes(e.key) ||
         ([" ", "Enter"].includes(e.key) && e.target.tagName !== "BUTTON")
      ) {
         e.preventDefault();
         go(step + 1);
      }
      if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(e.key)) {
         e.preventDefault();
         go(step - 1);
      }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(total() - 1);
   });
   /* previous / next buttons next to the counter */
   const nav = (label, text, d) => {
      const b = el("button", "nav", text);
      b.setAttribute("aria-label", label);
      b.addEventListener("click", (e) => {
         e.stopPropagation();
         go(step + d);
      });
      return b;
   };
   const hud = document.querySelector(".hud");
   hud.querySelector(".hint").textContent = "scroll, swipe or use ← →";
   hud.prepend(nav("Previous page", "‹", -1));
   hud.append(nav("Next page", "›", 1));

   /* mouse wheel / trackpad: one flick = one page, with a cooldown so a long scroll can't skip ahead.
     If the text on the page itself can still scroll in that direction, let it scroll instead. */
   let acc = 0,
      locked = false,
      lastT = 0,
      lockUntil = 0;
   addEventListener(
      "wheel",
      (e) => {
         if (!intro.classList.contains("done")) return;
         const sc = e.target.closest && e.target.closest(".body");
         if (
            sc &&
            sc.scrollHeight > sc.clientHeight + 1 &&
            ((e.deltaY > 0 &&
               sc.scrollTop + sc.clientHeight < sc.scrollHeight - 1) ||
               (e.deltaY < 0 && sc.scrollTop > 0))
         )
            return;
         e.preventDefault();
         const now = performance.now(),
            gap = now - lastT;
         lastT = now;
         if (gap > 160) {
            acc = 0;
            if (now > lockUntil) locked = false;
         } // a pause means a new flick; momentum tails have no pause
         if (locked) return;
         acc += e.deltaY;
         if (Math.abs(acc) > 50) {
            go(step + (acc > 0 ? 1 : -1));
            acc = 0;
            locked = true;
            lockUntil = now + 450;
         }
      },
      { passive: false },
   );
   $("start").addEventListener("click", () => go(1));
   let tx = null;
   addEventListener(
      "touchstart",
      (e) => {
         tx = e.touches[0].clientX;
      },
      { passive: true },
   );
   addEventListener("touchend", (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 60) go(step + (dx < 0 ? 1 : -1));
      tx = null;
   });

   /* ---------- sizing, rebuild on resize (keeps the current section) ---------- */
   const fit = () =>
      document.documentElement.style.setProperty(
         "--k",
         Math.min(innerHeight * 0.5, innerWidth * 0.32) / 424,
      );
   let timer;
   function rebuild() {
      const curSec = step >= 2 && pages[step - 2] ? pages[step - 2].si : null;
      fit();
      build();
      if (curSec !== null) step = 2 + firstPage[curSec];
      render();
   }
   addEventListener("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 150);
   });
   fit();
   build();
   render();
   document.fonts && document.fonts.ready.then(rebuild);

   setTimeout(() => intro.classList.add("done"), 2400);
   intro.addEventListener("click", (e) => {
      e.stopPropagation();
      intro.classList.add("done");
   });
})();
