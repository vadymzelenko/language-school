# Вылет — сайт школы иностранных языков

Next.js 16 (App Router, JavaScript) + GSAP 3 (ScrollTrigger, SplitText, Flip, CustomEase).

Идея: школа языков, оформленная как аэропорт. Курсы — рейсы на табло вылетов
с перекидными буквами, заявка — посадочный талон, который собирается на странице
и уходит в Telegram-бот уже заполненным.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Что поменять перед запуском

Всё содержимое — в `src/data/site.js`:

- название, телефон, e-mail, адрес, часы работы, ссылка на карту;
- `bot` / `botHref` — Telegram-бот для записи, `telegram`, `instagram`;
- расписание групп (`flights`), цены (`plans`), вопросы (`faq`), сравнение (`compare`);
- `photos` — сейчас атмосферные фото с picsum.photos (Unsplash), замените на свои.

Кнопки записи открывают бота с параметром `start`, чтобы бот знал, откуда пришёл человек:
`site_hero`, `flight_EN-B1`, `plan_group`, а из конструктора билета — `en_b1_group_adult`
(язык_уровень_формат_возраст).

## Структура

- `src/app` — layout (шрифты Unbounded + Onest с кириллицей, SEO, JSON-LD), страница, 404, robots, sitemap.
- `src/components` — секции: Hero (иллюминатор со сменой городов), Marquee, Departures (табло),
  Statement, Compare, Baggage, Route, BoardingPass (живой конструктор билета), Pricing, Faq,
  Contact, Footer (открывается из-под страницы), MobileBar.
- `src/lib/gsap.js` — регистрация плагинов и кривые анимаций.

Все анимации уважают `prefers-reduced-motion`; без JavaScript контент остаётся видимым.
