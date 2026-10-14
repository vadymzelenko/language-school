'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Flip } from 'gsap/Flip';
import { flights, languages, statusLabel, botLink } from '@/data/site';
import FlapText from './FlapText';
import { IconArrow } from './Icons';

if (typeof window !== 'undefined') gsap.registerPlugin(Flip);

const filters = [{ code: 'all', name: 'Все' }, ...languages];

function status(f) {
  return f.status === 'few' ? `${statusLabel.few} ${f.seats}` : statusLabel[f.status];
}

export default function Departures() {
  const root = useRef(null);
  const [play, setPlay] = useState(false);
  const [filter, setFilter] = useState('all');
  const flipState = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      ScrollTrigger.create({
        trigger: q('.board')[0],
        start: 'top 75%',
        once: true,
        onEnter: () => setPlay(true),
      });
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.tablo__head > *'), {
          y: 32,
          autoAlpha: 0,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        });
        gsap.from(q('.board__row'), {
          autoAlpha: 0,
          x: -24,
          stagger: 0.06,
          duration: 0.7,
          scrollTrigger: { trigger: q('.board')[0], start: 'top 75%' },
        });
      });
    },
    { scope: root }
  );

  // Плавная перестановка строк при смене фильтра.
  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        duration: 0.6,
        ease: 'out',
        absolute: false,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.04 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.2 }),
      });
      flipState.current = null;
    },
    { dependencies: [filter], scope: root }
  );

  const choose = (code) => {
    if (code === filter) return;
    flipState.current = Flip.getState(root.current.querySelectorAll('.board__row'));
    setFilter(code);
  };

  return (
    <section ref={root} id="tablo" className="tablo" aria-labelledby="tablo-title">
      <div className="tablo__head">
        <h2 id="tablo-title" className="h2">
          Табло вылетов
        </h2>
        <p className="tablo__note">
          Ближайшие группы на ноябрь. Нажмите на рейс, и бот забронирует место и пришлёт адрес кабинета.
        </p>
        <div className="chips chips--dark" role="group" aria-label="Фильтр по языку">
          {filters.map((f) => (
            <button
              key={f.code}
              type="button"
              className="chip"
              aria-pressed={filter === f.code}
              onClick={() => choose(f.code)}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="board">
        <div className="board__labels" aria-hidden="true">
          <span>Время</span>
          <span>Рейс</span>
          <span>Курс</span>
          <span>Направление</span>
          <span>Выход</span>
          <span>Статус</span>
        </div>
        <ul className="board__list">
          {flights.map((f, i) => {
            const hidden = filter !== 'all' && f.lang !== filter;
            return (
              <li key={f.code} className="board__row" hidden={hidden} data-status={f.status}>
                <a
                  className="board__link"
                  href={botLink(`flight_${f.code}`)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${f.title}, ${f.days} в ${f.time}, ${f.gate}. ${status(f)}. Забронировать в боте`}
                >
                  <span className="board__time">
                    <FlapText text={f.time} play={play} delay={i * 90} />
                    <small>{f.days}</small>
                  </span>
                  <span className="board__code">
                    <FlapText text={f.code} length={6} play={play} delay={i * 90 + 120} />
                  </span>
                  <span className="board__title">{f.title}</span>
                  <span className="board__city">
                    <FlapText text={f.city} length={7} play={play} delay={i * 90 + 200} />
                  </span>
                  <span className="board__gate">{f.gate}</span>
                  <span className="board__status">
                    <span className="board__status-text">{status(f)}</span>
                    <span className="board__book">
                      Забронировать <IconArrow />
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
