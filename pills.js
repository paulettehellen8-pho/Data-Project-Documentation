/* Falling data pills inside the title-slide diamond.
   Each pill is one piece of "data collected"; the pile never covers the logo. */
(() => {
  if (typeof Matter === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const WORDS = ["submissions", "flags", "records", "follow-ups", "reviews", "decisions", "checks", "evidence", "audits", "queues"]; // edit to suit the proposal
  const TONES = [["#f4f4f4", "#111"], ["#cfcfcf", "#111"], ["#9c9c9c", "#111"], ["#6e6e6e", "#fff"], ["#3b3b3b", "#fff"]];
  const MAX = 13, EVERY = 650, S = 424, H = 28;

  const { Engine, Bodies, Composite, Body } = Matter;
  const box = document.getElementById("collector");
  const tally = document.getElementById("tally");
  const stage = document.getElementById("stage");
  const intro = document.getElementById("intro");
  const engine = Engine.create({ gravity: { y: 1 } });
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = '600 13px "Sora", sans-serif';

  // walls follow the lower two edges of the diamond (a V funnel) and the upper two edges
  const wall = (ax, ay, bx, by, nx, ny) => {
    const len = Math.hypot(bx - ax, by - ay) + 120, t = 80;
    return Bodies.rectangle((ax + bx) / 2 + nx * t / 2, (ay + by) / 2 + ny * t / 2, len, t,
      { isStatic: true, angle: Math.atan2(by - ay, bx - ax), friction: 0.4, restitution: 0.2 });
  };
  const c = S / 2, k = Math.SQRT1_2;
  Composite.add(engine.world, [
    wall(0, c, c, S, -k, k), wall(S, c, c, S, k, k),
    wall(0, c, c, 0, -k, -k), wall(S, c, c, 0, k, -k)
  ]);

  const live = [];
  let spawned = 0, last = 0;

  function spawn() {
    const word = WORDS[spawned % WORDS.length], [bg, fg] = TONES[(spawned * 3 + (spawned >> 2)) % TONES.length];
    const w = Math.ceil(ctx.measureText(word).width) + 30;
    const el = document.createElement("div");
    el.className = "pill"; el.textContent = word;
    Object.assign(el.style, { width: w + "px", background: bg, color: fg });
    box.appendChild(el);
    requestAnimationFrame(() => el.classList.add("in"));
    const body = Bodies.rectangle(c + (Math.random() - 0.5) * 70, 90, w, H,
      { chamfer: { radius: H / 2 }, restitution: 0.25, friction: 0.35, frictionAir: 0.012, angle: (Math.random() - 0.5) * 1.2 });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
    Composite.add(engine.world, body);
    live.push({ body, el, w });
    spawned++;
    tally.textContent = String(spawned).padStart(4, "0") + " records collected";
    if (live.length > MAX) {            // oldest record fades out so the pile stays below the logo
      const old = live.shift();
      old.el.classList.replace("in", "out");
      setTimeout(() => { Composite.remove(engine.world, old.body); old.el.remove(); }, 520);
    }
  }

  function frame(t) {
    requestAnimationFrame(frame);
    const running = stage.dataset.mode === "title" && intro.classList.contains("done");
    if (!running) { last = t; return; }
    if (t - last > EVERY) { spawn(); last = t; }
    Engine.update(engine, 1000 / 60);
    live.forEach(({ body, el, w }) => {
      el.style.transform = `translate(${body.position.x - w / 2}px,${body.position.y - H / 2}px) rotate(${body.angle}rad)`;
    });
  }
  requestAnimationFrame(frame);
})();
