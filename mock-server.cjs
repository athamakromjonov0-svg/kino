/**
 * Mock Backend Server for CineBook
 * Implements 100% of the required endpoints specified in the prompt:
 * 
 * AUTH:
 *   POST /auth/register
 *   POST /auth/login
 *   GET /auth/me
 * 
 * MOVIES:
 *   GET /movies?genre=action&page=1&limit=2
 *   GET /movies/:id
 * 
 * SESSIONS:
 *   GET /sessions/:id/seats
 * 
 * BOOKINGS:
 *   POST /bookings
 *   GET /bookings/my
 *   DELETE /bookings/:id
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5432;

// ==========================================
// SWAGGER / OPENAPI
// Spec is a plain static file so it can be validated or imported elsewhere.
// ==========================================
const OPENAPI_PATH = path.join(__dirname, 'openapi.json');
let openApiSpec = null;
try {
  openApiSpec = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
} catch (err) {
  console.warn(`⚠️  openapi.json o'qilmadi: ${err.message}`);
}

// Swagger UI is served from this server but its assets come from a CDN,
// so the mock server keeps zero extra npm dependencies.
const SWAGGER_HTML = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#09090B" />
  <title>CineBook Ultra — Mock API Docs</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    /* ---------- CineBook design tokens (tailwind.config.js bilan bir xil) ---------- */
    :root {
      --cb-bg: #09090B;
      --cb-surface: #121216;
      --cb-card: #18181F;
      --cb-border: #27272A;
      --cb-muted: #A1A1AA;
      --cb-text: #FFFFFF;
      --cb-red: #E50914;
      --cb-red-hover: #c40811;
      --cb-accent: #FF4D5A;
      --cb-success: #22C55E;
      --cb-warning: #F59E0B;
      --cb-info: #38BDF8;
      --cb-radius: 12px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background:
        radial-gradient(1100px 520px at 12% -8%, rgba(229, 9, 20, 0.16), transparent 62%),
        radial-gradient(900px 460px at 96% 4%, rgba(255, 77, 90, 0.10), transparent 60%),
        var(--cb-bg);
      background-attachment: fixed;
      color: var(--cb-text);
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* ---------- Brend header ---------- */
    .cb-header {
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid var(--cb-border);
      background: linear-gradient(180deg, rgba(18, 18, 22, 0.92) 0%, rgba(9, 9, 11, 0.72) 100%);
      backdrop-filter: blur(12px);
    }
    .cb-header::after {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 2px;
      background: linear-gradient(90deg, var(--cb-red) 0%, var(--cb-accent) 55%, transparent 100%);
    }
    .cb-header-inner {
      max-width: 1180px;
      margin: 0 auto;
      padding: 26px 20px 24px;
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
    }
    .cb-logo { display: flex; align-items: center; gap: 14px; min-width: 0; }
    .cb-logo-mark {
      width: 52px; height: 52px; flex: none;
      border-radius: 14px;
      background: var(--cb-card);
      border: 1.5px solid var(--cb-red);
      box-shadow: 0 0 26px -6px rgba(229, 9, 20, 0.65);
      display: flex; align-items: center; justify-content: center;
    }
    .cb-logo-mark svg { width: 30px; height: 30px; }
    .cb-logo-text { min-width: 0; }
    .cb-logo-text h1 {
      margin: 0;
      font-size: 21px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }
    .cb-logo-text h1 span { color: var(--cb-red); }
    .cb-slogan {
      margin: 3px 0 0;
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.16em;
      color: var(--cb-muted);
      text-transform: uppercase;
    }
    .cb-badges { display: flex; gap: 8px; margin-left: auto; flex-wrap: wrap; }
    .cb-badge {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 7px 13px;
      border-radius: 999px;
      border: 1px solid var(--cb-border);
      background: rgba(24, 24, 31, 0.85);
      color: var(--cb-muted);
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }
    .cb-badge strong { color: var(--cb-text); font-weight: 700; font-variant-numeric: tabular-nums; }
    .cb-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--cb-success); box-shadow: 0 0 9px var(--cb-success); }
    .cb-dot.is-demo { background: var(--cb-warning); box-shadow: 0 0 9px var(--cb-warning); }

    /* ---------- Swagger konteyner ---------- */
    .swagger-ui .topbar { display: none; }
    .swagger-ui { max-width: 1180px; margin: 0 auto; padding: 8px 20px 96px; }
    .swagger-ui .wrapper { max-width: none; padding: 0; }
    .swagger-ui .information-container { margin: 30px 0 8px; }
    .swagger-ui .info { margin: 0 0 8px; display: none; } /* brend header allaqachon ko'rsatadi */
    .swagger-ui .scheme-container {
      background: var(--cb-card);
      border: 1px solid var(--cb-border);
      border-radius: var(--cb-radius);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      padding: 6px 16px;
      margin: 0 0 22px;
    }
    .swagger-ui .scheme-container .schemes { display: flex; align-items: center; gap: 10px; padding: 8px 0; }
    .swagger-ui select { color: var(--cb-text); background: var(--cb-surface); border-color: var(--cb-border); border-radius: 9px; }
    .swagger-ui .auth-wrapper .authorize { border-color: var(--cb-red); color: var(--cb-red); }
    .swagger-ui .auth-wrapper .authorize svg { fill: var(--cb-red); }

    /* ---------- Tugmalar ---------- */
    .swagger-ui .btn {
      border-radius: 9px;
      font-family: inherit;
      font-weight: 600;
      font-size: 13px;
      box-shadow: none;
      transition: background .15s ease, border-color .15s ease, transform .1s ease;
    }
    .swagger-ui .btn:hover { transform: translateY(-1px); }
    .swagger-ui .btn.execute {
      background: var(--cb-red);
      border-color: var(--cb-red);
      color: #fff;
    }
    .swagger-ui .btn.execute:hover { background: var(--cb-red-hover); border-color: var(--cb-red-hover); }
    .swagger-ui .btn.cancel {
      background: transparent;
      border-color: var(--cb-border);
      color: var(--cb-muted);
    }
    .swagger-ui .btn.cancel:hover { color: var(--cb-text); border-color: #3f3f46; }
    .swagger-ui .btn.copy-to-clipboard {
      background: var(--cb-surface);
      border-color: var(--cb-border);
      color: var(--cb-muted);
    }
    .swagger-ui .btn.copy-to-clipboard:hover { color: var(--cb-text); border-color: #3f3f46; }
    .swagger-ui .btn.authorize {
      border-color: var(--cb-red);
      color: #fff;
      background: var(--cb-red);
    }
    .swagger-ui .btn.authorize svg { fill: #fff; }

    /* ---------- Filtr ---------- */
    .swagger-ui .filter .operation-filter-input {
      background: var(--cb-card);
      border: 1px solid var(--cb-border);
      border-radius: 10px;
      color: var(--cb-text);
      padding: 10px 14px 10px 36px;
      margin: 10px 0 22px;
      max-width: 420px;
      font-family: inherit;
    }
    .swagger-ui .filter .operation-filter-input::placeholder { color: #52525B; }
    .swagger-ui .filter .operation-filter-input:focus {
      border-color: var(--cb-red);
      box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.16);
      outline: none;
    }

    /* ---------- Taglar ---------- */
    .swagger-ui .opblock-tag {
      color: var(--cb-text);
      border-bottom: 1px solid var(--cb-border);
      font-family: inherit;
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin: 34px 0 12px;
      padding: 14px 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .swagger-ui .opblock-tag:hover { color: var(--cb-accent); }
    .swagger-ui .opblock-tag small {
      color: var(--cb-muted);
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      margin: 0;
      flex: 1;
    }
    .swagger-ui .opblock-tag .expand-operation,
    .swagger-ui .opblock-tag .collapse-operation { color: var(--cb-muted); }

    /* ---------- Operatsiya bloklari ---------- */
    .swagger-ui .opblock { border-width: 1px; border-radius: var(--cb-radius); margin: 0 0 12px; background: var(--cb-card); }
    .swagger-ui .opblock .opblock-summary {
      background: var(--cb-card);
      padding: 9px 12px;
      border-bottom: 1px solid var(--cb-border);
    }
    .swagger-ui .opblock .opblock-summary-method {
      background: transparent !important;
      border-radius: 7px;
      font-size: 12px;
      font-weight: 700;
      min-width: 74px;
      text-shadow: none;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 7px 0;
    }
    .swagger-ui .opblock .opblock-summary-path { color: var(--cb-text); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 13.5px; font-weight: 500; }
    .swagger-ui .opblock .opblock-summary-path__deprecated { color: var(--cb-warning); }
    .swagger-ui .opblock .opblock-summary-description { color: var(--cb-muted); font-size: 12.5px; font-family: inherit; }
    .swagger-ui .opblock:hover .opblock-summary { border-color: #3f3f46; }
    .swagger-ui .opblock .opblock-body { background: var(--cb-surface); }
    .swagger-ui .opblock-section-header { background: var(--cb-surface); box-shadow: none; border-bottom: 1px solid var(--cb-border); }
    .swagger-ui .opblock-title_normal { color: #71717a; font-size: 12px; font-family: inherit; text-transform: uppercase; letter-spacing: 0.06em; }
    .swagger-ui .parameter__name { color: var(--cb-text); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12.5px; }
    .swagger-ui .parameter__name.required { font-weight: 700; }
    .swagger-ui .parameter__name.required span { color: var(--cb-red); }
    .swagger-ui .parameter__type { color: var(--cb-accent); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; }
    .swagger-ui .parameter__in { color: var(--cb-muted); font-family: inherit; font-style: normal; font-size: 11.5px; }

    /* Input maydonlari */
    .swagger-ui input[type=text], .swagger-ui input[type=password], .swagger-ui input[type=search], .swagger-ui textarea, .swagger-ui select {
      background: var(--cb-bg);
      border: 1px solid var(--cb-border);
      color: var(--cb-text);
      border-radius: 8px;
      font-family: inherit;
      font-size: 13px;
    }
    .swagger-ui textarea { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; }
    .swagger-ui input:focus, .swagger-ui textarea:focus, .swagger-ui select:focus {
      border-color: var(--cb-red);
      box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.16);
    }
    .swagger-ui select { background: var(--cb-bg); }

    /* Jadvalar */
    .swagger-ui table { color: var(--cb-muted); font-family: inherit; font-size: 12.5px; border-collapse: collapse; }
    .swagger-ui .parameters-col_description { color: var(--cb-text); }
    .swagger-ui table thead tr th { border-bottom-color: var(--cb-border); color: #71717a; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; }
    .swagger-ui table tbody tr td { border-bottom: 1px solid rgba(39, 39, 42, 0.6); padding: 10px 0; }

    /* Kod / misollar */
    .swagger-ui .highlight-code, .swagger-ui .microlight { background: var(--cb-bg) !important; border: 1px solid var(--cb-border); border-radius: 10px; }
    .swagger-ui code, .swagger-ui pre { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace; font-size: 12px; color: #d4d4d8; }
    .swagger-ui .model-box { background: var(--cb-bg); border: 1px solid var(--cb-border); border-radius: 10px; }
    .swagger-ui .model-title { color: var(--cb-accent); font-size: 13px; font-weight: 600; }
    .swagger-ui section.models { border: 1px solid var(--cb-border); border-radius: var(--cb-radius); background: var(--cb-card); margin-top: 40px; }
    .swagger-ui section.models h4 { color: var(--cb-text); font-size: 16px; }
    .swagger-ui .model-box .model-title { color: var(--cb-accent); }
    .swagger-ui .prop-type { color: var(--cb-info); }
    .swagger-ui .prop-format { color: var(--cb-warning); }
    .swagger-ui .parameter__default { color: var(--cb-muted); }

    /* Taqdim etish (Try it out) natijalari */
    .swagger-ui .responses-inner { background: var(--cb-bg); border: 1px solid var(--cb-border); border-radius: 10px; padding: 14px; }
    .swagger-ui .response-col_status { color: var(--cb-text); font-size: 13px; }
    .swagger-ui .response-col_description { color: var(--cb-muted); font-size: 12.5px; }
    .swagger-ui .response-col_description__inner p { color: var(--cb-muted); }
    .swagger-ui .live-responses-table { background: var(--cb-card); }
    .swagger-ui .curl, .swagger-ui .microlight { color: #d4d4d8; }

    /* Modal (Authorize) */
    .swagger-ui .dialog-ux .modal-ux {
      background: var(--cb-card);
      border: 1px solid var(--cb-border);
      border-radius: var(--cb-radius);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.65);
    }
    .swagger-ui .dialog-ux .modal-ux-header {
      background: var(--cb-surface);
      border-bottom: 1px solid var(--cb-border);
      border-radius: var(--cb-radius) var(--cb-radius) 0 0;
    }
    .swagger-ui .dialog-ux .modal-ux-header h2, .swagger-ui .dialog-ux .modal-ux-header h3 { color: var(--cb-text); font-size: 16px; }
    .swagger-ui .dialog-ux .modal-ux-close { color: var(--cb-muted); }
    .swagger-ui .dialog-ux .modal-ux-footer { border-top: 1px solid var(--cb-border); }
    .swagger-ui .dialog-ux .modal-ux-footer .btn:last-child { background: var(--cb-red); border-color: var(--cb-red); color: #fff; }
    .swagger-ui .dialog-ux .modal-ux-footer .btn:last-child:hover { background: var(--cb-red-hover); border-color: var(--cb-red-hover); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 11px; height: 11px; }
    ::-webkit-scrollbar-track { background: var(--cb-bg); }
    ::-webkit-scrollbar-thumb { background: #2f2f37; border-radius: 999px; border: 2px solid var(--cb-bg); }
    ::-webkit-scrollbar-thumb:hover { background: #45454f; }

    /* Footer */
    .cb-footer {
      max-width: 1180px;
      margin: 0 auto;
      padding: 26px 20px 46px;
      border-top: 1px solid var(--cb-border);
      color: #52525B;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
    }
    .cb-footer a { color: var(--cb-muted); text-decoration: none; }
    .cb-footer a:hover { color: var(--cb-accent); }

    @media (max-width: 640px) {
      .cb-header-inner { padding: 20px 16px; }
      .cb-badges { margin-left: 0; width: 100%; }
      .swagger-ui { padding: 8px 14px 72px; }
      .cb-logo-text h1 { font-size: 18px; }
    }
  </style>
</head>
<body>
  <header class="cb-header">
    <div class="cb-header-inner">
      <div class="cb-logo">
        <div class="cb-logo-mark">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="18" y="18" width="164" height="164" rx="34" fill="none" stroke="#E50914" stroke-width="12"/>
            <path d="M78 66L140 100L78 134V66Z" fill="#E50914"/>
          </svg>
        </div>
        <div class="cb-logo-text">
          <h1>CineBook <span>Ultra</span> — Mock API</h1>
          <p class="cb-slogan">Every story starts here</p>
        </div>
      </div>
      <div class="cb-badges">
        <span class="cb-badge"><span class="cb-dot"></span> Online</span>
        <span class="cb-badge">OpenAPI <strong>3.0.3</strong></span>
        <span class="cb-badge"><strong id="cb-count-paths">–</strong> path</span>
        <span class="cb-badge"><strong id="cb-count-ops">–</strong> endpoint</span>
        <span class="cb-badge"><span class="cb-dot is-demo"></span> Demo data</span>
      </div>
    </div>
  </header>

  <div id="swagger-ui"></div>

  <footer class="cb-footer">
    <span>CineBook Ultra · Mock backend · ma'lumotlar xotirada (in-memory) saqlanadi</span>
    <span><a href="/openapi.json">openapi.json</a> · <a href="/">health check</a></span>
  </footer>

  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.addEventListener('load', function () {
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        tryItOutEnabled: true,
        displayRequestDuration: true,
        defaultModelsExpandDepth: 1,
        docExpansion: 'list',
        filter: true,
        persistAuthorization: true,
        syntaxHighlight: { activate: true, theme: 'obsidian' },
        presets: [SwaggerUIBundle.presets.apis],
        onComplete: function () {
          // Brend header statistikalarini spec'dan to'ldirish
          var spec = window.ui.getSystem().getSpecJson && window.ui.getSystem().getSpecJson();
          if (spec && spec.paths) {
            var ops = 0;
            Object.keys(spec.paths).forEach(function (p) {
              ops += Object.keys(spec.paths[p]).filter(function (m) {
                return ['get', 'post', 'put', 'patch', 'delete'].indexOf(m) !== -1;
              }).length;
            });
            var elP = document.getElementById('cb-count-paths');
            var elO = document.getElementById('cb-count-ops');
            if (elP) elP.textContent = Object.keys(spec.paths).length;
            if (elO) elO.textContent = ops;
          }
        }
      });
    });
  </script>
</body>
</html>`;

// In-memory mock database
const users = [
  { id: 1, name: 'Ali Valiyev', email: 'ali@example.com', password: 'password123', role: 'admin' },
  { id: 2, name: 'Madina Karimova', email: 'madina@example.com', password: 'password123', role: 'user' }
];

const movies = [
  {
    id: 1,
    title: 'Dune: Part Two',
    genre: 'Sci-Fi',
    description: "Pol Atreydes Chani va Fremenlar bilan birlashib, uning oilasini yo'q qilgan fitnachilardan qasos olish yo'liga chiqadi.",
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 101, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-02T15:30:00Z' },
      { id: 102, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-02T19:00:00Z' },
      { id: 103, hall: 'VIP Lounge', time: '2026-10-03T21:30:00Z' }
    ]
  },
  {
    id: 2,
    title: 'Oppenheimer',
    genre: 'Drama',
    description: "Nazariy fizik J. Robert Oppengeymerning Manxetten loyihasidagi roli va atom bombasining yaratilish tarixi.",
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 104, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-02T16:00:00Z' },
      { id: 105, hall: 'Zal 3 (Standard)', time: '2026-10-02T20:45:00Z' }
    ]
  },
  {
    id: 3,
    title: 'Spider-Man: Across the Spider-Verse',
    genre: 'Animation',
    description: "Mayls Morales multikoinot bo'ylab sayohat qiladi va boshqa O'rgimchak-odamlar bilan to'qnash keladi.",
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 106, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-02T14:00:00Z' },
      { id: 107, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-02T18:30:00Z' }
    ]
  },
  {
    id: 4,
    title: 'The Dark Knight',
    genre: 'Action',
    description: "Betmen Gotem shahrini dahshatga solayotgan xaos yaratuvchisi Jokerga qarshi kurashadi.",
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 108, hall: 'VIP Lounge', time: '2026-10-02T21:00:00Z' }
    ]
  },
  {
    id: 5,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    description: "Insoniyat kelajagini saqlab qolish uchun koinotdagi qora tuynuk orqali yangi sayyora qidirayotgan tadqiqotchilar jamoasi.",
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 109, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-03T17:00:00Z' },
      { id: 110, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-03T21:00:00Z' }
    ]
  },
  {
    id: 6,
    title: 'Inception',
    genre: 'Action',
    description: "Tushlar orqali odamlarning eng chuqur sirlarini o'g'irlaydigan mohir o'g'ri haqidagi hayratlanarli film.",
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 111, hall: 'Zal 3 (Standard)', time: '2026-10-03T19:30:00Z' }
    ]
  },
  {
    id: 7,
    title: 'The Batman',
    genre: 'Action',
    description: "Betmen Gotem shahrining eng xavfli qotili Riddler bilan kurashib, shahar ustidagi korrupsiya pardasini ochadi.",
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 112, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-03T20:00:00Z' },
      { id: 113, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-04T18:00:00Z' }
    ]
  },
  {
    id: 8,
    title: 'Avatar: The Way of Water',
    genre: 'Sci-Fi',
    description: "Salli oilasi Pandoraning suv osti dunyosini o'rganib, yangi xavflarga duch keladi.",
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 114, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-04T15:00:00Z' },
      { id: 115, hall: 'VIP Lounge', time: '2026-10-04T19:30:00Z' },
      { id: 116, hall: 'Zal 3 (Standard)', time: '2026-10-05T16:45:00Z' }
    ]
  },
  {
    id: 9,
    title: 'Barbie',
    genre: 'Comedy',
    description: "Barbie mukammal dunyosidan chiqib, haqiqiy dunyoni kashf qiladi va o'zini qayta topadi.",
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 117, hall: 'Zal 3 (Standard)', time: '2026-10-03T17:30:00Z' },
      { id: 118, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-05T14:00:00Z' }
    ]
  },
  {
    id: 10,
    title: 'John Wick: Chapter 4',
    genre: 'Action',
    description: "John Wick Yuqori Kengashga qarshi eng katta jangini boshlaydi va ozodlik uchun oxirgi qadamni tashlaydi.",
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 119, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-03T22:00:00Z' },
      { id: 120, hall: 'Zal 3 (Standard)', time: '2026-10-04T21:15:00Z' }
    ]
  },
  {
    id: 11,
    title: 'Everything Everywhere All at Once',
    genre: 'Sci-Fi',
    description: "Multiverselar orasida sayohat qilayotgan ayol oilasini qutqarish uchun barcha koinotlardagi o'zi bilan jang qiladi.",
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 121, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-04T16:30:00Z' }
    ]
  },
  {
    id: 12,
    title: 'Joker',
    genre: 'Drama',
    description: "Arthur Fleckning jamiyat tomonidan tashlab ketilgan odamdan Gothamning eng xavfli jinoyotchisiga aylanish tarixi.",
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 122, hall: 'VIP Lounge', time: '2026-10-03T21:00:00Z' },
      { id: 123, hall: 'Zal 3 (Standard)', time: '2026-10-06T18:30:00Z' }
    ]
  },
  {
    id: 13,
    title: 'Coco',
    genre: 'Animation',
    description: "Kichik Miguel o'z oilasining musiqa tarixini ochish uchun O'liklar mamlakatiga sayohat qiladi.",
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 124, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-04T12:00:00Z' },
      { id: 125, hall: 'Zal 3 (Standard)', time: '2026-10-05T12:30:00Z' }
    ]
  },
  {
    id: 14,
    title: 'Your Name (Kimi no Na wa)',
    genre: 'Animation',
    description: "Ikki yosh – qishloq qizi va Tokio o'g'li – tana almashib qoladi va o'rtalarida paydo bo'lgan his-tuyg'ularni anglashga harakat qiladi.",
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 126, hall: 'Zal 3 (Standard)', time: '2026-10-04T14:30:00Z' }
    ]
  },
  {
    id: 15,
    title: 'Get Out',
    genre: 'Horror',
    description: "Yosh fotograf qizining oilaviy yig'inda g'alati sirlarga duch keladi va hech qachon kutmagan dahshatni ochadi.",
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 127, hall: 'Zal 3 (Standard)', time: '2026-10-03T22:30:00Z' },
      { id: 128, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-05T22:00:00Z' }
    ]
  },
  {
    id: 16,
    title: 'The Conjuring',
    genre: 'Horror',
    description: "Paranormal tadqiqotchilar Ed va Lorrain Uorrenlar fermadagi oilaga yordam berishga harakat qiladi.",
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 129, hall: 'Zal 3 (Standard)', time: '2026-10-04T23:00:00Z' }
    ]
  },
  {
    id: 17,
    title: 'Parasite',
    genre: 'Thriller',
    description: "Kambag'al oila boy oilaga yaqinlashish uchun hiyla-nayrang qiladi, ammo rejalarning ortidan dahshatli sirlar ochiladi.",
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 130, hall: 'VIP Lounge', time: '2026-10-05T19:00:00Z' },
      { id: 131, hall: 'Zal 3 (Standard)', time: '2026-10-06T20:00:00Z' }
    ]
  },
  {
    id: 18,
    title: 'Se7en',
    genre: 'Thriller',
    description: "Ikki detektiv yetti gunoh asosida qotillik qilayotgan seriyali qotilni izlaydi.",
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 132, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-06T21:30:00Z' }
    ]
  },
  {
    id: 19,
    title: 'La La Land',
    genre: 'Romance',
    description: "Jaz pianisti va aktrisaga intilayotgan qiz Los-Anjelesda sevishadi, ammo orzular ularni boshqa yo'llarga yetaklaydi.",
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 133, hall: 'VIP Lounge', time: '2026-10-04T18:00:00Z' },
      { id: 134, hall: 'Zal 3 (Standard)', time: '2026-10-05T20:30:00Z' }
    ]
  },
  {
    id: 20,
    title: 'Titanic',
    genre: 'Romance',
    description: "Turli qatlamlardan bo'lgan ikki yosh taqdir to'qnashgan ulug' kema bordida sevgi haqida abadiy hikoya yozadi.",
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 135, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-05T17:00:00Z' }
    ]
  },
  {
    id: 21,
    title: 'Free Solo',
    genre: 'Documentary',
    description: "Alex Honnold himoyasiz, yalang qo'l bilan El Capitan cho'qqisini zabt etishga tayyorlanmoqda.",
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 136, hall: 'Zal 3 (Standard)', time: '2026-10-05T15:00:00Z' }
    ]
  },
  {
    id: 22,
    title: 'Won\'t You Be My Neighbor?',
    genre: 'Documentary',
    description: "Fred Rogers va uning bolalarga bag'ishlangan televidenie merosi haqidagi iliq hujjatli film.",
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 137, hall: 'Zal 3 (Standard)', time: '2026-10-06T15:30:00Z' }
    ]
  },
  {
    id: 23,
    title: 'The Grand Budapest Hotel',
    genre: 'Comedy',
    description: "Mashhur konditer va uning sodiq xizmatkori o'rtasidagi sarguzashtlar bilan to'la sirqili komediya.",
    poster: 'https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 138, hall: 'VIP Lounge', time: '2026-10-04T17:00:00Z' },
      { id: 139, hall: 'Zal 2 (Dolby Atmos)', time: '2026-10-06T19:00:00Z' }
    ]
  },
  {
    id: 24,
    title: 'Knives Out',
    genre: 'Thriller',
    description: "Mashhur detektiv Benoit Blanc boy yozuvchi o'limi sirini yechish uchun oila a'zolari orasidagi yolg'onlarni ochadi.",
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    sessions: [
      { id: 140, hall: 'Zal 1 (IMAX Laser)', time: '2026-10-04T20:30:00Z' },
      { id: 141, hall: 'Zal 3 (Standard)', time: '2026-10-05T21:00:00Z' },
      { id: 142, hall: 'VIP Lounge', time: '2026-10-06T18:00:00Z' }
    ]
  }
];

// In-memory seats database keyed by sessionId
// Generates 5 rows x 8 seats layout
const sessionSeats = {};

function initSessionSeats(sessionId) {
  if (!sessionSeats[sessionId]) {
    const list = [];
    for (let r = 1; r <= 5; r++) {
      for (let s = 1; s <= 8; s++) {
        // Preset a couple taken seats for realism
        const isInitiallyTaken = (r === 2 && s === 3) || (r === 3 && (s === 4 || s === 5));
        list.push({ row: r, seat: s, taken: isInitiallyTaken });
      }
    }
    sessionSeats[sessionId] = list;
  }
  return sessionSeats[sessionId];
}

// ==========================================
// ULTRA EXTENSIONS: actors, reviews, cinemas,
// streaming sources, admin stats, TMDB-ready metadata
// ==========================================

const actors = [
  { id: 1, name: 'Timothée Chalamet', knownFor: 'Dune: Part Two', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', biography: 'Amerikalik aktyor, 28 yoshda.' },
  { id: 2, name: 'Zendaya', knownFor: 'Dune: Part Two', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', biography: 'Amerikalik aktrisa va qo‘shiqchi.' },
  { id: 3, name: 'Cillian Murphy', knownFor: 'Oppenheimer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', biography: 'Irlandiyalik aktyor.' },
  { id: 4, name: 'Florence Pugh', knownFor: 'Oppenheimer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', biography: 'Ingliz aktrisasi.' },
  { id: 5, name: 'Shameik Moore', knownFor: 'Spider-Man: Across the Spider-Verse', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', biography: 'Amerikalik aktyor va reper.' },
  { id: 6, name: 'Christian Bale', knownFor: 'The Dark Knight', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', biography: 'Ingliz aktyori.' },
  { id: 7, name: 'Matthew McConaughey', knownFor: 'Interstellar', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', biography: 'Amerikalik aktyor.' },
  { id: 8, name: 'Anne Hathaway', knownFor: 'Interstellar', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', biography: 'Amerikalik aktrisa.' }
];

// Movie cast links (movieId -> actor ids)
const movieCast = {
  1: [1, 2],
  2: [3, 4],
  3: [5],
  4: [6],
  5: [7, 8],
  6: [6]
};

// Reviews stored in memory
let nextReviewId = 1;
const reviews = [
  { id: 1, movieId: 1, user: 'Madina K.', rating: 5, text: 'Zamonaviy kinosining shoh asari! Vizual effektlar hayratlanarli.', createdAt: '2026-09-20T10:00:00Z' },
  { id: 2, movieId: 2, user: 'Javohir T.', rating: 5, text: 'Oppenheimer — tarixiy drama surrealistik darajada kuchli.', createdAt: '2026-09-22T14:30:00Z' }
];

// Cinemas (reference data — clearly marked as catalog sample)
const cinemas = [
  { id: 1, name: 'CineBook Imax Center', address: 'Toshkent, Amir Temur shoh ko‘chasi 108', halls: 4, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'CineBook Mega Planet', address: 'Samarqand, Registon ko‘chasi 12', halls: 3, image: 'https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'CineBook Zomin', address: 'Farg‘ona, Mustaqillik ko‘chasi 45', halls: 2, image: 'https://movies.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80' }
];

// Lawful streaming sources per movie (null = unavailable)
// hlsUrl points to Apple public test stream (lawful public sample)
const streamingSources = {
  1: {
    movieId: 1,
    type: 'hls',
    url: 'https://stream-public.broadpeak.io/b20db307-6ec6-42a7-b2a2-c2f0d5c93b64/index.m3u8',
    label: 'HLS Demo Stream',
    license: 'Public sample stream (broadpeak.io)',
    ageRating: '13+'
  },
  5: {
    movieId: 5,
    type: 'hls',
    url: 'https://stream-public.broadpeak.io/b20db307-6ec6-42a7-b2a2-c2f0d5c93b64/index.m3u8',
    label: 'HLS Demo Stream',
    license: 'Public sample stream (broadpeak.io)',
    ageRating: '13+'
  },
  4: {
    movieId: 4,
    type: 'embed',
    url: 'https://www.youtube.com/embed/a2yzWJmPQWo',
    label: 'Official YouTube Embed (Trailer)',
    license: 'Official trailer via YouTube embed',
    ageRating: '13+'
  }
};

// Collections — curated from real movie metadata
const collections = [
  { id: 1, name: 'Sci-Fi Universe', description: 'Kosmik sarguzashtlar va ilmiy fantastika dunyosi', movieIds: [1, 5] },
  { id: 2, name: 'Nolan Collection', description: 'Kristofer Nolanning eng kuchli filmlari', movieIds: [2, 6] },
  { id: 3, name: 'Hero Stories', description: 'Qahramonlik hikoyalari', movieIds: [3, 4] }
];

// Admin statistics — computed lazily so counts reflect live in-memory data.
// NOTE: This is clearly marked as DEMO PREVIEW data for the admin dashboard,
// since the real backend does not yet provide statistics endpoints.
function getAdminStats() {
  return {
    isDemoPreview: true,
    totalMovies: movies.length,
    totalUsers: users.length,
    totalBookings: bookings.length,
    activeSessions: movies.reduce((acc, m) => acc + (m.sessions ? m.sessions.length : 0), 0),
    bookingsOverTime: [
      { date: '2026-09-25', count: 12 },
      { date: '2026-09-26', count: 19 },
      { date: '2026-09-27', count: 27 },
      { date: '2026-09-28', count: 24 },
      { date: '2026-09-29', count: 31 },
      { date: '2026-09-30', count: 42 },
      { date: '2026-10-01', count: 38 }
    ],
    popularMovies: movies.slice(0, 5).map((m, i) => ({ movieId: m.id, title: m.title, bookings: 120 - i * 15 })),
    userGrowth: [
      { month: 'May', users: 120 },
      { month: 'Jun', users: 180 },
      { month: 'Jul', users: 260 },
      { month: 'Aug', users: 340 },
      { month: 'Sep', users: 480 }
    ]
  };
}

// In-memory bookings database
let nextBookingId = 1;
const bookings = [
  { id: 1001, userId: 1, sessionId: 101, row: 2, seat: 3, status: 'Tasdiqlangan' },
  { id: 1002, userId: 2, sessionId: 101, row: 3, seat: 4, status: 'Tasdiqlangan' }
];

// Helper: parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Helper: send JSON response with CORS
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// Helper: authenticate user from Authorization header
function getAuthUser(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  // Simple token parser: token format "token_user_<id>_..."
  const match = token.match(/user_(\d+)/);
  if (match) {
    const userId = Number(match[1]);
    return users.find(u => u.id === userId) || null;
  }

  // Default to user 1 for any generic valid token
  return users[0] || null;
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // Health check endpoint
    if (pathname === '/' && method === 'GET') {
      return sendJSON(res, 200, {
        status: 'online',
        service: 'CineBook Mock API Server',
        docs: '/api-docs',
        spec: '/openapi.json',
        timestamp: new Date().toISOString()
      });
    }

    // ==========================================
    // AUTH ENDPOINTS
    // ==========================================

    // POST /auth/register
    if (pathname === '/auth/register' && method === 'POST') {
      const { name, email, password } = await parseBody(req);
      if (!name || !email || !password) {
        return sendJSON(res, 400, { message: "Barcha maydonlarni to'ldirish shart" });
      }

      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return sendJSON(res, 409, { message: "Ushbu email bilan foydalanuvchi allaqachon mavjud (409 xatosi)" });
      }

      const newUser = { id: users.length + 1, name, email, password };
      users.push(newUser);
      return sendJSON(res, 201, {
        message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    }

    // POST /auth/login
    if (pathname === '/auth/login' && method === 'POST') {
      const { email, password } = await parseBody(req);
      const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);
      if (!user) {
        return sendJSON(res, 401, { message: "Email yoki parol noto'g'ri (401 xatosi)" });
      }

      const token = `mock_token_user_${user.id}_${Date.now()}`;
      return sendJSON(res, 200, {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user' }
      });
    }

    // GET /auth/me
    if (pathname === '/auth/me' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, 401, { message: "Avtorizatsiyadan o'tilmagan yoki token eskirgan" });
      }
      return sendJSON(res, 200, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      });
    }

    // ==========================================
    // MOVIES ENDPOINTS
    // ==========================================

    // GET /movies?genre=action&page=1&limit=2
    if (pathname === '/movies' && method === 'GET') {
      const genre = parsedUrl.query.genre;
      const page = Math.max(1, parseInt(parsedUrl.query.page) || 1);
      const limit = Math.max(1, parseInt(parsedUrl.query.limit) || 8);

      let filtered = [...movies];
      if (genre && genre.toLowerCase() !== 'all') {
        filtered = filtered.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      return sendJSON(res, 200, {
        data: paginatedData,
        page,
        limit,
        total,
        totalPages
      });
    }

    // GET /movies/:id
    const movieMatch = pathname.match(/^\/movies\/(\d+)$/);
    if (movieMatch && method === 'GET') {
      const movieId = Number(movieMatch[1]);
      const movie = movies.find(m => m.id === movieId);
      if (!movie) {
        return sendJSON(res, 404, { message: "Film topilmadi" });
      }
      return sendJSON(res, 200, movie);
    }

    // ==========================================
    // SESSIONS ENDPOINTS
    // ==========================================

    // GET /sessions/:id/seats
    const sessionMatch = pathname.match(/^\/sessions\/(\d+)\/seats$/);
    if (sessionMatch && method === 'GET') {
      const sessionId = Number(sessionMatch[1]);
      const seats = initSessionSeats(sessionId);
      return sendJSON(res, 200, seats);
    }

    // ==========================================
    // BOOKINGS ENDPOINTS
    // ==========================================

    // POST /bookings
    // Request: { sessionId: 1, row: 3, seat: 5 }
    if (pathname === '/bookings' && method === 'POST') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, 401, { message: "Bron qilish uchun tizimga kiring" });
      }

      const { sessionId, row, seat } = await parseBody(req);
      if (!sessionId || !row || !seat) {
        return sendJSON(res, 400, { message: "sessionId, row va seat ko'rsatilishi shart" });
      }

      const sId = Number(sessionId);
      const rNum = Number(row);
      const sNum = Number(seat);

      const seatsList = initSessionSeats(sId);
      const targetSeat = seatsList.find(s => s.row === rNum && s.seat === sNum);

      if (!targetSeat) {
        return sendJSON(res, 404, { message: "Zalda bunday joy topilmadi" });
      }

      if (targetSeat.taken) {
        return sendJSON(res, 409, { message: "Ushbu joy allaqachon boshqa foydalanuvchi tomonidan band qilingan (409 xatosi)" });
      }

      // Mark seat as taken
      targetSeat.taken = true;

      const newBooking = {
        id: nextBookingId++,
        userId: user.id,
        sessionId: sId,
        row: rNum,
        seat: sNum,
        status: 'Tasdiqlangan',
        createdAt: new Date().toISOString()
      };
      bookings.push(newBooking);

      return sendJSON(res, 201, newBooking);
    }

    // GET /bookings/my
    if (pathname === '/bookings/my' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, 401, { message: "Avtorizatsiyadan o'tilmagan" });
      }

      const userBookings = bookings.filter(b => b.userId === user.id);
      return sendJSON(res, 200, userBookings);
    }

    // DELETE /bookings/:id
    const deleteMatch = pathname.match(/^\/bookings\/(\d+)$/);
    if (deleteMatch && method === 'DELETE') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, 401, { message: "Avtorizatsiyadan o'tilmagan" });
      }

      const bookingId = Number(deleteMatch[1]);
      const index = bookings.findIndex(b => b.id === bookingId);
      if (index === -1) {
        return sendJSON(res, 404, { message: "Bron topilmadi (404)" });
      }

      const booking = bookings[index];
      if (booking.userId !== user.id) {
        return sendJSON(res, 403, { message: "Bu bron boshqa foydalanuvchiga tegishli (403 xatosi)" });
      }

      // Free seat up in sessionSeats
      const sSeats = sessionSeats[booking.sessionId];
      if (sSeats) {
        const target = sSeats.find(s => s.row === booking.row && s.seat === booking.seat);
        if (target) {
          target.taken = false;
        }
      }

      bookings.splice(index, 1);
      return sendJSON(res, 200, { message: "Bron muvaffaqiyatli bekor qilindi" });
    }

    // ==========================================
    // ULTRA EXTENSION ENDPOINTS
    // ==========================================

    // GET /actors
    if (pathname === '/actors' && method === 'GET') {
      const page = Math.max(1, parseInt(parsedUrl.query.page) || 1);
      const limit = Math.max(1, parseInt(parsedUrl.query.limit) || 8);
      const total = actors.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const paginated = actors.slice((page - 1) * limit, page * limit);
      return sendJSON(res, 200, { data: paginated, page, limit, total, totalPages });
    }

    // GET /actors/:id
    const actorMatch = pathname.match(/^\/actors\/(\d+)$/);
    if (actorMatch && method === 'GET') {
      const actor = actors.find(a => a.id === Number(actorMatch[1]));
      if (!actor) return sendJSON(res, 404, { message: "Aktyor topilmadi" });
      const filmography = [];
      Object.entries(movieCast).forEach(([movieId, castIds]) => {
        if (castIds.includes(actor.id)) {
          const mv = movies.find(m => m.id === Number(movieId));
          if (mv) filmography.push({ id: mv.id, title: mv.title, poster: mv.poster, genre: mv.genre });
        }
      });
      actor.filmography = filmography;
      return sendJSON(res, 200, { ...actor, filmography });
    }

    // GET /reviews (optional movieId filter)
    if (pathname === '/reviews' && method === 'GET') {
      const movieId = parsedUrl.query.movieId ? Number(parsedUrl.query.movieId) : null;
      const filtered = movieId ? reviews.filter(r => r.movieId === movieId) : reviews;
      return sendJSON(res, 200, { data: filtered, total: filtered.length });
    }

    // POST /reviews (auth required)
if (pathname === '/reviews' && method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Sharh yozish uchun tizimga kiring" });
      const { movieId, text, rating } = await parseBody(req);
      if (!movieId || !text) return sendJSON(res, 400, { message: "movieId va text talab qilinadi" });
      const review = {
        id: nextReviewId++,
        movieId: Number(movieId),
        user: user.name,
        rating: rating ? Number(rating) : null,
        text: String(text).slice(0, 2000),
        createdAt: new Date().toISOString()
      };
      reviews.push(review);
      return sendJSON(res, 201, review);
    }

    // GET /collections
    if (pathname === '/collections' && method === 'GET') {
      const enriched = collections.map(c => ({
        ...c,
        movies: c.movieIds.map(id => movies.find(m => m.id === id)).filter(Boolean)
      }));
      return sendJSON(res, 200, { data: enriched, total: enriched.length });
    }

    // GET /collections/:id
    const collectionMatch = pathname.match(/^\/collections\/(\d+)$/);
    if (collectionMatch && method === 'GET') {
      const col = collections.find(c => c.id === Number(collectionMatch[1]));
      if (!col) return sendJSON(res, 404, { mock_note: "Kolleksiya topilmadi" });
      return sendJSON(res, 200, {
        ...col,
        movies: col.movieIds.map(id => movies.find(m => m.id === id)).filter(Boolean)
      });
    }

    // GET /cinemas — reference catalog
    if (pathname === '/cinemas' && method === 'GET') {
      return sendJSON(res, 200, { data: cinemas, total: cinemas.length });
    }

    // GET /cinemas/:id
    const cinemaMatch = pathname.match(/^\/cinemas\/(\d+)$/);
    if (cinemaMatch && method === 'GET') {
      const cinema = cinemas.find(c => c.id === Number(cinemaMatch[1]));
      if (!cinema) return sendJSON(res, 404, { message: "Kinoteatr topilmadi" });
      return sendJSON(res, 200, cinema);
    }

    // GET /streaming/:movieId — lawful source lookup (may be null)
    const streamMatch = pathname.match(/^\/streaming\/(\d+)$/);
    if (streamMatch && method === 'GET') {
      const source = streamingSources[Number(streamMatch[1])] || null;
      return sendJSON(res, 200, { source });
    }

    // GET /admin/stats (admin role required)
    if (pathname === '/admin/stats' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      return sendJSON(res, 200, getAdminStats());
    }

    // ==========================================
    // ADMIN EXTENSION ENDPOINTS (admin role required)
    // ==========================================

    // GET /users (admin)
    if (pathname === '/users' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const page = Math.max(1, parseInt(parsedUrl.query.page) || 1);
      const limit = Math.max(1, parseInt(parsedUrl.query.limit) || 10);
      const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role || 'user' }));
      const total = safeUsers.length;
      const totalPages = Math.ceil(total / limit) || 1;
      return sendJSON(res, 200, { data: safeUsers.slice((page - 1) * limit, page * limit), page, limit, total, totalPages });
    }

    // POST /movies (admin)
    if (pathname === '/movies' && method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const { title, genre, description, poster, banner } = await parseBody(req);
      if (!title) return sendJSON(res, 400, { message: "title talab qilinadi" });
      const newMovie = {
        id: movies.length ? Math.max(...movies.map(m => m.id)) + 1 : 1,
        title: String(title).slice(0, 200),
        genre: genre || 'Drama',
        description: description || '',
        poster: poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
        banner: banner || '',
        sessions: []
      };
      movies.push(newMovie);
      return sendJSON(res, 201, newMovie);
    }

    // PUT /movies/:id (admin)
    const moviePutMatch = pathname.match(/^\/movies\/(\d+)$/);
    if (moviePutMatch && method === 'PUT') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const movie = movies.find(m => m.id === Number(moviePutMatch[1]));
      if (!movie) return sendJSON(res, 404, { message: "Film topilmadi" });
      const { title, genre, description, poster, banner } = await parseBody(req);
      if (title !== undefined) movie.title = String(title).slice(0, 200);
      if (genre !== undefined) movie.genre = genre;
      if (description !== undefined) movie.description = description;
      if (poster !== undefined) movie.poster = poster;
      if (banner !== undefined) movie.banner = banner;
      return sendJSON(res, 200, movie);
    }

    // DELETE /movies/:id (admin)
    if (moviePutMatch && method === 'DELETE') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const idx = movies.findIndex(m => m.id === Number(moviePutMatch[1]));
      if (idx === -1) return sendJSON(res, 404, { message: "Film topilmadi" });
      movies.splice(idx, 1);
      return sendJSON(res, 200, { message: "Film o'chirildi" });
    }

    // GET /sessions (admin) — flattened session list with movie titles
    if (pathname === '/sessions' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const flat = [];
      movies.forEach(m => {
        (m.sessions || []).forEach(s => {
          flat.push({ ...s, movieId: m.id, movieTitle: m.title });
        });
      });
      return sendJSON(res, 200, { data: flat, total: flat.length });
    }

    // POST /sessions (admin) — { movieId, hall, time }
    if (pathname === '/sessions' && method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const { movieId, hall, time } = await parseBody(req);
      const movie = movies.find(m => m.id === Number(movieId));
      if (!movie) return sendJSON(res, 404, { message: "Film topilmadi" });
      if (!hall || !time) return sendJSON(res, 400, { message: "hall va time talab qilinadi" });
      const newSession = { id: Math.max(100, ...movies.flatMap(m => (m.sessions || []).map(s => s.id))) + 1, hall, time };
      movie.sessions.push(newSession);
      return sendJSON(res, 201, { ...newSession, movieId: movie.id, movieTitle: movie.title });
    }

    // PUT /sessions/:id (admin) — { movieId, hall, time }
    const sessionPutMatch = pathname.match(/^\/sessions\/(\d+)$/);
    if (sessionPutMatch && method === 'PUT') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const sid = Number(sessionPutMatch[1]);
      let target = null, targetMovie = null;
      movies.forEach(m => (m.sessions || []).forEach(s => { if (s.id === sid) { target = s; targetMovie = m; } }));
      if (!target) return sendJSON(res, 404, { message: "Seans topilmadi" });
      const { movieId, hall, time } = await parseBody(req);
      if (hall !== undefined) target.hall = hall;
      if (time !== undefined) target.time = time;
      if (movieId !== undefined && Number(movieId) !== targetMovie.id) {
        const newMovie = movies.find(m => m.id === Number(movieId));
        if (!newMovie) return sendJSON(res, 404, { message: "Yangi film topilmadi" });
        targetMovie.sessions = targetMovie.sessions.filter(s => s.id !== sid);
        newMovie.sessions.push(target);
        targetMovie = newMovie;
      }
      return sendJSON(res, 200, { ...target, movieId: targetMovie.id, movieTitle: targetMovie.title });
    }

    // DELETE /sessions/:id (admin)
    if (sessionPutMatch && method === 'DELETE') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const sid = Number(sessionPutMatch[1]);
      let removed = false;
      movies.forEach(m => {
        if (m.sessions) {
          const before = m.sessions.length;
          m.sessions = m.sessions.filter(s => s.id !== sid);
          if (m.sessions.length !== before) removed = true;
        }
      });
      if (!removed) return sendJSON(res, 404, { message: "Seans topilmadi" });
      return sendJSON(res, 200, { message: "Seans o'chirildi" });
    }

    // GET /bookings (admin) — all bookings with user info
    if (pathname === '/bookings' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { message: "Avtorizatsiya talab qilinadi" });
      if (user.role !== 'admin') return sendJSON(res, 403, { message: "Faqat admin foydalanuvchilar uchun (403)" });
      const enriched = bookings.map(b => {
        const u = users.find(x => x.id === b.userId);
        return { ...b, userEmail: u ? u.email : 'unknown' };
      });
      return sendJSON(res, 200, { data: enriched, total: enriched.length });
    }

    // ==========================================
    // API DOCUMENTATION
    // ==========================================

    // Swagger UI (interactive docs)
    // Favicon for the Swagger UI page (served from public/)
    if ((pathname === '/favicon.svg' || pathname === '/favicon.ico') && method === 'GET') {
      const faviconPath = path.join(__dirname, 'public', pathname === '/favicon.svg' ? 'favicon.svg' : 'favicon.svg');
      if (fs.existsSync(faviconPath)) {
        res.writeHead(200, {
          'Content-Type': 'image/svg+xml',
          'Access-Control-Allow-Origin': '*',
        });
        return res.end(fs.readFileSync(faviconPath));
      }
      res.writeHead(204);
      return res.end();
    }

    if (pathname === '/api-docs' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      });
      return res.end(SWAGGER_HTML);
    }

    // OpenAPI 3.0 specification (machine readable)
    if (pathname === '/openapi.json' && method === 'GET') {
      if (!openApiSpec) {
        return sendJSON(res, 500, { message: "openapi.json o'qilmadi" });
      }
      return sendJSON(res, 200, openApiSpec);
    }

    // 404 for any other path
    return sendJSON(res, 404, { message: "Endpoint topilmadi" });

  } catch (error) {
    console.error("Mock Server Error:", error);
    return sendJSON(res, 500, { message: "Serverda ichki xatolik yuz berdi" });
  }
});

server.listen(PORT, () => {
  console.log(`🎬 CineBook Mock Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger UI:  http://localhost:${PORT}/api-docs`);
  console.log(`📄 OpenAPI spec: http://localhost:${PORT}/openapi.json`);
  console.log(`Ready to serve API requests.`);
});
