'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { photos } from '@/data/site';

const lines = ['Мы учим говорить', 'с первого занятия:', 'две трети урока', 'разговариваете вы,', 'а не преподаватель'];

export default function Statement() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } });
        tl.from(q('.stairs__line > span'), { yPercent: 110, duration: 1, stagger: 0.09 })
          .from(q('.stairs__photo'), { clipPath: 'inset(100% 0 0 0)', duration: 1.1, stagger: 0.12, ease: 'inOut' }, 0.2)
          .from(q('.stairs__photo img'), { scale: 1.2, duration: 1.6, stagger: 0.12, ease: 'soft' }, 0.2)
          .from(q('.stairs__note'), { y: 20, autoAlpha: 0 }, 0.6);

        // Ступени слегка «расходятся» по мере прокрутки.
        q('.stairs__line').forEach((line, i) => {
          gsap.to(line, {
            x: `${(i - 2) * 1.2}vw`,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="stairs" aria-label="Как мы учим">
      <p className="stairs__text">
        {lines.map((l, i) => (
          <span key={i} className="stairs__line" style={{ '--step': i }}>
            <span>{l}</span>{' '}
          </span>
        ))}
      </p>
      <div className="stairs__photos">
        <figure className="stairs__photo">
          <img src={photos.skyline.src} alt={photos.skyline.alt} width="1200" height="800" loading="lazy" />
        </figure>
        <figure className="stairs__photo">
          <img src={photos.waterfront.src} alt={photos.waterfront.alt} width="1200" height="800" loading="lazy" />
        </figure>
      </div>
      <p className="stairs__note">
        Коммуникативная методика и шкала CEFR. Преподаватели с опытом от пяти лет. Носители приходят в разговорный клуб.
      </p>
    </section>
  );
}
