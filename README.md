# 🎬 CINEORA — Next-Gen Cinema & Streaming Platform

**CINEORA** — kino katalogi, onlayn streaming (faqat qonuniy manbalar), kinoteatr chiptalarini bron qilish, hamjamiyat va admin panelni birlashtirgan katta, ko'p sahifali, premium web application. Slogan: **EVERY STORY STARTS HERE.**

---

## 🌟 Asosiy Imkoniyatlar

### 1. Kino Katalogi & Kashf Qilish
- Cinematic hero slider, janr bo'yicha kashf qilish, afzalliklar bo'limlari.
- To'liq katalog (`/movies`) — server-side pagination, janr filtri, skeleton loader.
- Maxsus kataloglar: `/trending`, `/popular`, `/top-rated`, `/upcoming` (variantli CatalogPage).
- Janrlar (`/genres`, `/genres/:slug`), Kolleksiyalar (`/collections`, `/collections/:id`).
- Global qidiruv modali (Navbar'dagi 🔍 tugma, debounce va recent searches).
- **Archive kino** (`/catalog/archive`) — Internet Archive (archive.org) ochiq
  kutubxonasidan badiiy filmlar: server qidiruvi, paginatsiya va
  `/catalog/archive/:identifier` sahifasida qayta ishlatiladigan VideoPlayer.
  API CORS qo'llaydi, alohida backend endpoint kerak emas.

### 2. Streaming (faqat qonuniy manbalar) 🎥
- **VideoPlayer** komponenti: HLS (hls.js), MP4 va rasmiy embed qo'llab-quvvatlash.
- Play/Pause, Volume, Progress bar, Playback speed (0.5x–2x), Fullscreen, Picture-in-Picture.
- Klaviatura boshqaruvi: `Space/K` — ijro, `←/→` — ±10s, `↑/↓` — ovoz, `M` — mute, `F` — fullscreen.
- **Resume playback** — ijro holati localStorage'da saqlanadi, `/continue-watching'da ko'rinadi.
- Video manba mavjud bo'lmasa: aniq **«Streaming mavjud emas»** holati + rasmiy treyler varianti.
- Har bir video uchun litsenziya va yosh chegarasi (age rating) shaffof ko'rsatiladi.

### 3. Chipta Bron Qilish 🎟️
- Interaktiv zal xaritasi (`GET /sessions/:id/seats`): bo'sh / tanlangan / band holatlar.
- Maksimum 4 ta joy cheklovi, real vaqtda booking summary.
- **Ketma-ket bron**: har bir joy uchun alohida `POST /bookings` so'rovi.
- **409 Conflict** to'g'ri boshqariladi — qisman muvaffaqiyat ham aniq ko'rsatiladi.
- Bron natijasi: `/booking/success` (e-chipta), `/my-bookings`, `/my-bookings/:id` (bekor qilish modali bilan).

### 4. Hamjamiyat 👥
- Sharhlar: `/reviews` (barchasi), `/movies/:id/review` (yozish — 1–10 reyting bilan).
- Aktyorlar: `/actors` (pagination), `/actors/:id` (biografiya + filmografiya).
- Kolleksiyalar va Community hub (`/community`).

### 5. Foydalanuvchi Kabineti
- Auth: `/login`, `/register` (React Hook Form + Zod validatsiya), JWT token localStorage'da.
- `/profile`, `/settings` (ishlaydigan til almashtirgich: UZ/RU/EN), `/notifications`.
- `/favorites`, `/recently-viewed`, `/watchlist` — **device-local (localStorage)**, UI'da aniq belgilangan.
- Statik sahifalar: `/help`, `/about`, `/contact`, `/privacy`, `/terms`.

### 6. Admin Panel 👑 (`/admin`, rol: `admin`)
- Dashboard: statistika kartalari + Recharts grafiklar (bronlar dinamikasi, ommabop filmlar, user growth).
- **Backend `isDemoPreview: true` qaytarsa — aniq demo banner ko'rsatiladi** (soxta real raqamlar yo'q).
- Filmlar CRUD (`POST/PUT/DELETE /movies`), Seanslar CRUD (`POST/PUT/DELETE /sessions`).
- Barcha bronlar (`GET /bookings`), Foydalanuvchilar (`GET /users` — parollar hech qachon ko'rsatilmaydi).
- Hisobotlar + CSV eksport, Platforma sozlamalari (muhit holati, kerakli backend kengaytmalari ro'yxati).
- Route darajasida `AdminRoute` (role check) bilan himoyalangan. **Frontend roli faqat UI — haqiqiy tekshiruv backendda.**

### 7. Ko'p Tillilik 🌍
- i18next: **O'zbekcha / Русский / English** — Navbar'dagi til almashtirgich orqali darhol o'zgaradi.
- Tanlangan til localStorage'da saqlanadi (`cinebook_language`).

---

## 🛠️ Texnologiyalar

| Texnologiya | Vazifasi |
| :--- | :--- |
| **React 18** | UI kutubxonasi (lazy-loaded route'lar) |
| **Vite 5** | Build tool va dev server |
| **Tailwind CSS 3** | Premium dark dizayn tizimi |
| **React Router DOM 6** | 40+ route, nested admin layout |
| **TanStack Query** | Server state, caching, retry |
| **Zustand** | Client state (watchlist, settings, discovery, UI) |
| **Axios** | Markaziy API instance + interceptorlar |
| **React Hook Form + Zod** | Formalar va validatsiya |
| **hls.js** | HLS video oqimlari |
| **Recharts** | Admin grafiklari |
| **i18next** | Uch tillilik |
| **Framer Motion** | Modal/sahifa animatsiyalari |
| **Vitest + RTL** | 42 ta unit/integratsion test |

---

## 📁 Loyiha Strukturasi

```text
cineora-frontend/
│
├── public/                   # logo, favicon, _redirects (Static Site uchun zaxira)
├── src/
│   ├── app/                  # App shell, providers, router (40+ route)
│   │   ├── App.jsx
│   │   ├── providers.jsx
│   │   └── router.jsx
│   ├── components/
│   │   ├── layout/           # Navbar (til switcher), Footer, MainLayout, Sidebar
│   │   ├── movies/           # MovieCard, MovieCarousel, MovieFilters, MovieSearch...
│   │   ├── booking/          # SeatMap, Seat, BookingSummary, SessionCard
│   │   ├── streaming/        # VideoPlayer (HLS/MP4/embed, keyboard, resume)
│   │   └── common/           # Button, Input, Modal, Loader, Skeleton, EmptyState,
│   │                         # ErrorState, ErrorBoundary, ProtectedRoute, AdminRoute...
│   ├── pages/
│   │   ├── public/           # Home, Login, Register, Unauthorized
│   │   ├── movies/           # Movies, MovieDetails, Genres, GenreDetails, CatalogPage
│   │   ├── cinema/           # Cinemas, CinemaDetails, Sessions, SessionDetails
│   │   ├── streaming/        # WatchPage, WatchlistPage, ContinueWatchingPage
│   │   ├── booking/          # SeatBooking, BookingSuccess, MyBookings, BookingDetails
│   │   ├── community/        # Reviews, WriteReview, Community, Actors, ActorDetails,
│   │   │                     # Collections, CollectionDetails
│   │   ├── account/          # Profile, Settings, Notifications, Favorites,
│   │   │                     # RecentlyViewed, Help, About, Contact, Privacy, Terms
│   │   ├── admin/            # AdminLayout, Dashboard, Movies, Sessions, Bookings,
│   │   │                     # Users, Reports, Settings
│   │   └── system/           # NotFound (404)
│   ├── services/             # api, auth, movie, session, booking, streaming,
│   │                         # cinema, actor, review, collection, admin
│   ├── store/                # useUserListsStore, useSettingsStore, useDiscoveryStore, useUIStore
│   ├── context/              # AuthContext (JWT, session sync)
│   ├── hooks/                # useAuth, useMovies, useBookings, useLocalList
│   ├── i18n/                 # index.js + locales/ (uz.json, ru.json, en.json)
│   ├── schemas/              # Zod sxemalari
│   ├── utils/                # errorHandler, formatDate, validators, localLists
│   └── __tests__/            # 6 test fayl, 42 test
├── mock-server.cjs           # To'liq Mock API + Swagger UI + dist/ static serving
├── render.yaml               # Render Blueprint (bitta service: frontend + API + docs)
├── vite.config.js
└── package.json
```

---

## 🚀 O'rnatish va Ishga Tushirish

### 1. Talablar
- Node.js v18+
- npm

### 2. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 3. Muhit o'zgaruvchilari (`.env`)
```env
VITE_API_URL=http://localhost:5432
```

### 4. Mock serverni ishga tushirish
Haqiqiy backend hali tayyor bo'lmasa, loyiha ichidagi Mock API barcha endpointlarni qo'llab-quvvatlaydi:
```bash
npm run build      # frontend dist/ ga build qilinadi (ixtiyoriy, lekin tavsiya etiladi)
npm run mock-server
```
Server `http://localhost:5432` da ishlaydi va **bitta portda ham frontend, ham API, ham Swagger**
taqdim etadi:

| URL | Nima |
| :--- | :--- |
| `http://localhost:5432/` | Frontend (SPA) — `dist/` build qilingan bo'lsa |
| `http://localhost:5432/api-docs` | Swagger UI — interaktiv, "Try it out" bilan |
| `http://localhost:5432/openapi.json` | OpenAPI 3.0 spetsifikatsiyasi (JSON) |
| `http://localhost:5432/api/health` | Health check (JSON) |

Test akkauntlar:
- **Admin**: `ali@example.com` / `password123`
- **User**: `madina@example.com` / `password123`

> `dist/` mavjud bo'lmasa, mock server faqat API + Swagger beradi va logda ogohlantiradi.

### 5. API hujjatlari (Swagger) 📘

Mock server barcha endpointlar uchun OpenAPI 3.0 hujjatlarini o'zi beradi:

| URL | Nima |
| :--- | :--- |
| `http://localhost:5432/api-docs` | Swagger UI — Cineora brend dizaynida, "Try it out" bilan |
| `http://localhost:5432/openapi.json` | OpenAPI 3.0 spetsifikatsiyasi (JSON) |

- Spetsifikatsiya — loyiha ildizidagi **`openapi.json`** fayli (22 path / 31 operation,
  `components` da 28 ta umumiy sxema, `bearerAuth` security va tayyor misollar).
- Swagger UI assetlari CDN'dan yuklanadi — qo'shimcha npm paket o'rnatilmaydi.
- Swagger UI brend headerida endpoint/path statistikasini avtomatik ko'rsatadi.

### 6. Development
```bash
npm run dev
```

### 7. Production build
```bash
npm run build      # natija: dist/
npm run preview    # lokal preview
```

### 8. Testlar
```bash
npm test           # 42 test — barchasi o'tadi
```

---

## 🌐 Backend API Endpointlari

### ✅ Mavjud backend (o'zgartirilmagan)

**AUTH**
- `POST /auth/register` — `{ name, email, password }`
- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `GET /auth/me` — joriy foydalanuvchi (Bearer token)

**MOVIES**
- `GET /movies?genre=&page=&limit=` — `{ data, page, limit, total, totalPages }`
- `GET /movies/:id` — film + seanslari

**SESSIONS**
- `GET /sessions/:id/seats` — `[ { row, seat, taken } ]`

**BOOKINGS**
- `POST /bookings` — `{ sessionId, row, seat }` (har bir joy uchun alohida)
- `GET /bookings/my`
- `DELETE /bookings/:id` — 403 agar boshqa foydalanuvchiga tegishli bo'lsa

### 🔌 Backend kengaytmalari (frontend tayyor, endpoint qo'shish kerak)

Bu endpointlar mock-server'da ishlaydi. Haqiqiy backendda bo'lmasa, UI soxta muvaffaqiyat
ko'rsatmaydi — aniq xatolik holatini chiqaradi:

| Endpoint | Vazifasi | UI joyi |
| :--- | :--- | :--- |
| `GET /actors?page=&limit=` | Aktyorlar ro'yxati | `/actors` |
| `GET /actors/:id` | Aktyor + filmografiya | `/actors/:id` |
| `GET /reviews?movieId=` | Sharhlar | `/reviews` |
| `POST /reviews` | Sharh yozish (auth) | `/movies/:id/review` |
| `GET /collections` | Kolleksiyalar | `/collections` |
| `GET /collections/:id` | Kolleksiya + filmlari | `/collections/:id` |
| `GET /cinemas` | Kinoteatrlar katalogi | `/cinemas` |
| `GET /cinemas/:id` | Kinoteatr tafsilotlari | `/cinemas/:id` |
| `GET /streaming/:movieId` | `{ source: { type, url, label, license, ageRating } \| null }` | `/watch/:movieId` |
| `GET /admin/stats` | Statistika (admin) | `/admin` |
| `GET /users?page=&limit=` | Foydalanuvchilar (admin) | `/admin/users` |
| `POST /movies` | Film qo'shish (admin) | `/admin/movies` |
| `PUT /movies/:id` | Film tahrirlash (admin) | `/admin/movies` |
| `DELETE /movies/:id` | Film o'chirish (admin) | `/admin/movies` |
| `GET /sessions` | Barcha seanslar (admin) | `/admin/sessions` |
| `POST /sessions` | Seans qo'shish (admin) | `/admin/sessions` |
| `PUT /sessions/:id` | Seans tahrirlash (admin) | `/admin/sessions` |
| `DELETE /sessions/:id` | Seans o'chirish (admin) | `/admin/sessions` |
| `GET /bookings` | Barcha bronlar (admin) | `/admin/bookings` |

**Hali ham kerak bo'ladigan endpointlar** (UI shaffof holatda ko'rsatadi):
- `POST /contact` — aloqa formasi (`/contact` hozir haqiqiy kanallarni ko'rsatadi)
- `GET /notifications` — shaxsiy bildirishnomalar (hozir bronlardan hosil qilinadi)
- `PUT /users/:id/role` — rol o'zgartirish
- `GET /search?q=` — server-side global qidiruv (hozir yuklangan ma'lumot ichida)
- `PUT /watchlist` / `PUT /favorites` — server-side ro'yxatlar (hozir device-local)

### Streaming manba formati
```json
{
  "source": {
    "type": "hls",              // "hls" | "mp4" | "embed"
    "url": "https://...m3u8",
    "label": "HLS Demo Stream",
    "license": "Public sample stream (broadpeak.io)",
    "ageRating": "13+"
  }
}
```
`source: null` → Watch sahifasi **«Streaming mavjud emas»** holatini ko'rsatadi va
rasmiy treylerni taklif qiladi. Faqat qonuniy manbalar ishlatiladi (litsenziyalangan
oqimlar, ommaviy demo streamlar, rasmiy YouTube embedlar).

---

## 🔒 Xavfsizlik

- JWT token `localStorage`'da (`cinebook_token`), `Authorization: Bearer <TOKEN>` sarlavhasida.
- 401 qaytganda token darhol o'chiriladi va sessiya tozalanadi (`auth:session-expired` event).
- `ProtectedRoute` (auth) va `AdminRoute` (role) — frontend himoyasi faqat UI uchun,
  **haqiqiy ruxsatni backend har bir so'rovda tekshiradi** (mock-server'da 403 qaytaradi).
- Parollar, JWT secret, API keylar frontendga hech qachon kiritilmaydi.
- Formalar Zod bilan validatsiya qilinadi; XSS xavfi React escaping + input sanitization bilan kamaytirilgan.

---

## ☁️ Render Deploy Qo'llanmasi

Loyiha **bittaga service** sifatida deploy qilinadi: frontend, mock API va Swagger UI
bir xil domen ostida ishlaydi — shuning uchun CORS muammosi ham bo'lmaydi.

### Eng oson yo'l — Blueprint

1. Loyihani GitHub'ga yuklang.
2. [Render Dashboard](https://dashboard.render.com) → **New +** → **Blueprint**.
3. Reponi tanlang (`athamakromjonov0-svg/kino`) — `render.yaml` o'zi o'qiladi.
4. **Apply** bosing. Hammasi avtomatik sozlanadi:

| Yo'l | Nima |
| :--- | :--- |
| `/` | Frontend (SPA) |
| `/api-docs` | Swagger UI |
| `/openapi.json` | OpenAPI spetsifikatsiyasi |
| `/api/health` | Health check |

### Qo'lda sozlashtirish

[Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service**:

| Maydon | Qiymat |
| :--- | :--- |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node mock-server.cjs` |
| **Health Check Path** | `/api/health` |

Environment Variables:

| Kalit | Qiymat |
| :--- | :--- |
| `PORT` | `10000` |
| `NODE_ENV` | `production` |
| `VITE_API_URL` | **Bo'sh qoldiring** — frontend o'z domeniga (same-origin) ulanadi |

> `VITE_API_URL` faqat frontend va API **alohida** deploy qilinganda kerak
> (masalan haqiqiy backend boshqa domenda bo'lsa).

### Nima uchun bitta service?

`mock-server.cjs` `dist/` ni ham statik fayl sifatida beradi va noma'lum yo'llar uchun
`index.html` qaytaradi (SPA fallback). Shuning uchun `/admin/users` kabi deep link
to'g'ridan-to'g'ri ishlaydi — alohida Static Site yoki `_redirects` sozlamasi kerak emas.
Statik assetlar (`/assets/...`) immutable cache bilan beriladi.

---

## 🛠️ Keng Tarqalgan Muammolar

1. **Network Error** — backend ishga tushganini tekshiring. Lokal sinov uchun `npm run build && npm run mock-server`. Render'da `VITE_API_URL` **bo'sh** bo'lishi kerak (same-origin).
2. **409 Conflict** — joy boshqa foydalanuvchi tomonidan band qilingan. Xarita avtomatik yangilanadi.
3. **403 Forbidden (admin)** — rolni tekshiring: admin bilan qayta login qiling (`ali@example.com`).
4. **Streaming ishlamayapti** — `GET /streaming/:id` javobini tekshiring; `source: null` bo'lsa streaming haqiqatan mavjud emas (bu xato emas, dizayn bo'yicha).
5. **F5 dan keyin 404** — `npm run build` bajarilganini tekshiring; mock server `dist/` yo'qligini logda ogohlantiradi.
6. **HLS brauzerda ishlamasa** — Safari native HLS qo'llaydi; boshqa brauzerlarda hls.js avtomatik ulanadi. Tarmoq xatosi bo'lsa pleyer aniq xabar ko'rsatadi.
7. **Sayt JSON ko'rsatmoqda** — `/api/health` ni tekshiring. Bu endpoint frontend kabi `200` qaytarishi kerak.
