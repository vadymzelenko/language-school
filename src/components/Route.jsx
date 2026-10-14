'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { steps } from '@/data/site';

const PER = 48;
const PALE = ['#5a2306', '#8a3f12'];
const ACCENT = '#ff7a1f';

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Беспорядок → сжатие → порядок. Позиции считаются детерминированно, чтобы SSR и клиент совпали.
function layout(vertical) {
  const r = rng(vertical ? 11 : 7);
  const W = vertical ? 300 : 1200;
  const H = vertical ? 400 : 270;
  const s = vertical ? 9 : 12;
  const out = [];
  for (let i = 0; i < PER * 3; i++) {
    const zone = Math.floor(i / PER);
    const k = i % PER;
    let x, y, fill;
    if (zone === 0) {
      x = vertical ? 10 + r() * (W - 30) : 10 + r() * 360;
      y = vertical ? 6 + r() * 110 : 10 + r() * (H - 30);
      fill = PALE[k % 2];
    } else if (zone === 1) {
      const col = k % 16;
      const row = Math.floor(k / 16);
      if (vertical) {
        x = W / 2 - 1.5 * (s + 3) + row * (s + 3);
        y = 140 + col * (s + 2);
      } else {
        x = 420 + col * 23;
        y = H / 2 - 1.5 * (s + 4) + row * (s + 4);
      }
      fill = PALE[(k + row) % 2];
    } else {
      const col = k % 8;
      const row = Math.floor(k / 8);
      if (vertical) {
        x = 30 + col * 32;
        y = 318 + row * 13;
      } else {
        x = 840 + col * 44;
        y = 22 + row * 42;
      }
      fill = ACCENT;
    }
    // Стартовая точка — общий хаос в левой (верхней) части.
    const sx = vertical ? 10 + r() * (W - 30) : 10 + r() * 380;
    const sy = vertical ? 6 + r() * 120 : 10 + r() * (H - 30);
    out.push({ x, y, sx, sy, s, fill, zone });
  }
  return { W, H, squares: out };
}

const wide = layout(false);
const tall = layout(true);

function Diagram({ data, className }) {
  return (
    <svg className={className} viewBox={`0 0 ${data.W} ${data.H}`} aria-hidden="true">
      {data.squares.map((q, i) => (
        <rect
          key={i}
          className="sq"
          x={q.x}
          y={q.y}
          width={q.s}
          height={q.s}
          fill={q.fill}
          data-sx={q.sx}
          data-sy={q.sy}
          data-x={q.x}
          data-y={q.y}
          data-zone={q.zone}
        />
      ))}
    </svg>
  );
}

export default function Route() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.route__head > *'), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        });

        q('.route__svg').forEach((svg) => {
          const rects = svg.querySelectorAll('.sq');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: svg, start: 'top 85%', end: 'bottom 45%', scrub: 0.8 },
          });
          rects.forEach((r, i) => {
            const zone = +r.dataset.zone;
            tl.fromTo(
              r,
              { attr: { x: +r.dataset.sx, y: +r.dataset.sy, fill: zone === 2 ? PALE[i % 2] : r.getAttribute('fill') } },
              { attr: { x: +r.dataset.x, y: +r.dataset.y, fill: r.getAttribute('fill') }, ease: 'inOut', duration: 1 },
              (i % PER) * 0.012 + zone * 0.18
            );
          });
        });

        gsap.from(q('.route__step'), {
          y: 24,
          autoAlpha: 0,
          stagger: 0.12,
          scrollTrigger: { trigger: q('.route__steps')[0], start: 'top 85%' },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="kak" className="route" aria-labelledby="route-title">
      <div className="route__head">
        <h2 id="route-title" className="h2">
          Три шага <br />
          до урока
        </h2>
        <p>Без звонков и анкет на сайте. Вся запись идёт в Telegram-боте, администратор подключается, если нужен.</p>
      </div>
      <div className="route__body">
        <Diagram data={wide} className="route__svg route__svg--wide" />
        <Diagram data={tall} className="route__svg route__svg--tall" />
        <ol className="route__steps">
          {steps.map((s) => (
            <li key={s.name} className="route__step">
              <strong>{s.name}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
