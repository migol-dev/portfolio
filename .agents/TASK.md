# TASK.md — Rediseño Integral · migol.dev

> **Documento vivo y fuente única del plan.** Los agentes y subagentes marcan aquí su avance, dejan comentarios y registran bloqueos.
> Estado global: `🟡 PLAN APROBACIÓN PENDIENTE` · Creado: 15 oct 2026 · 22:43 (UTC-6)

---

## 0. Protocolo para Agentes (léelo antes de tocar nada)

### 0.1 Reglas de marcado
| Marca | Significado |
|---|---|
| `- [ ]` | Pendiente |
| `- [~]` | En progreso (añade `@agente` y la hora) |
| `- [x]` | Terminado y verificado |
| `- [!]` | Bloqueado (explica el motivo en el Registro de Bloqueos §9) |
| `- [-]` | Descartado (justifica en comentario) |

### 0.2 Formato de comentario (debajo de la tarea correspondiente)
```
> 💬 **@agente-id** · 2026-10-16 10:42 · `estado`
> Qué se hizo / qué se encontró / archivos tocados / siguiente paso.
```

### 0.3 Reglas obligatorias
1. **Next.js no es el que conoces**: antes de escribir código, lee la guía relevante en `node_modules/next/dist/docs/` y respeta los avisos de deprecación (regla `AGENTS.md` del proyecto).
2. Aplicar las reglas de `frontend-ui-craft` (Razonamiento de Diseño de 4 puntos antes de codificar cada componente + las 5 Leyes Anti-IA).
3. No avanzar a la fase siguiente sin que su **Checkpoint** esté en `[x]`.
4. No inventar datos presentados como reales. Métricas simuladas = etiqueta visible `SIMULACIÓN`.
5. Cualquier dependencia nueva (`npm install`) requiere aprobación del usuario y se anota en §8.
6. Mantener comentarios/docstrings existentes que no estén relacionados con el cambio.

### 0.4 Roster de agentes
| ID | Rol | Fases |
|---|---|---|
| `@lead` | Orquestador, integra y valida checkpoints | Todas |
| `@backend-sec` | Seguridad y API | F1 |
| `@design-system` | Tokens, tipografía, primitivas UI | F2 |
| `@frontend-craft` | Secciones públicas, 3D, ⌘K | F3 |
| `@admin-ui` | Panel `/admin` | F4 |
| `@qa-viewport` | QA visual multi-dimensión en navegador | F5 |
| `@qa-security` | Pentest / auditoría backend | F5 |
| `@qa-perf` | Rendimiento, accesibilidad, Leyes Anti-IA | F5 |

---

## 1. Contexto y Objetivo

Rediseñar completamente el portfolio de **Miguel García (MIGOL)** — Next.js 16 · React 19 · TypeScript · Tailwind v4 · Prisma 7 · PostgreSQL — para:

- Posicionarlo como **Desarrollador Junior en C/C++ + Full Stack Web (React, JS, TS, Vite, PostgreSQL)**.
- Integrar su perfil cognitivo **INFP · SO/SX · 9w1 · Tritipo 946**.
- Eliminar los clichés de IA del diseño actual (tarjetas por todas partes, fuente `Inter`, paleta pastel de editor, mockup estático `whoami.ts`).
- Blindar el backend.
- Verificar con agentes en 5 tamaños de pantalla, rendimiento y seguridad.

### 1.1 Diagnóstico del estado actual
| Área | Problema detectado | Archivo |
|---|---|---|
| Ley 1 — Card-itis | Cada skill / contacto / métrica admin en tarjeta | `Skills.tsx`, `Contact.tsx`, `admin/page.tsx` |
| Ley 2 — Paleta | Azulados genéricos + 5 acentos pastel simultáneos, `shadow-2xl` | `globals.css` |
| Ley 3 — Simetría | `grid-cols-3` / `grid-cols-2` uniformes | `Skills.tsx`, `Projects.tsx` |
| Ley 4 — Fuentes | `Inter` como fuente de cuerpo; sin `tabular-nums` | `layout.tsx` |
| Ley 5 — Estático | Hero con `<pre>` animado no interactivo; Lucide con stroke 2 | `Hero.tsx` |
| Contenido | Perfil centrado en Discord bots, no en C/C++ ni Vite | `fallback-content.ts`, `seed.ts`, `layout.tsx` |

---

## 2. Sistema de Diseño (decisiones cerradas)

### 2.1 Razonamiento de Diseño
- **Intención UX y punto focal**: en 3 s el visitante entiende "C/C++ + Web moderna, junior con rigor y criterio". Foco: **Stage 3D interactivo** del Hero. Revelación progresiva: matriz cognitiva, slide-over de proyectos y `⌘K`.
- **Arquetipo**: B — *Interactive Studio* (sitio público) + C — *Invisible-Chrome Workspace* (admin, en oscuro).
- **Tipografía**: Syne + Instrument Serif (itálica) + Plus Jakarta Sans + JetBrains Mono.
- **Espacio e interacción**: canvas-first ≥65 %, retícula 1px con cruces `+`, split 7:5 / 5:7 / 4:8, `active:scale-[0.97]`, curvas cubic-bezier propias.

### 2.2 Paleta dual (sin naranja)
| Token | Var CSS | **Crimson (default)** | **Cryo (alternativa fría)** |
|---|---|---|---|
| Canvas | `--color-void` | `#07080A` | `#06080C` |
| Rail | `--color-panel` | `#0D0F12` | `#0B0F17` |
| Superficie elevada | `--color-panel-2` | `#13161B` | `#111722` |
| Hover | `--color-panel-hover` | `#1A1E26` | `#172030` |
| Tinta principal | `--color-text` | `#F3F5F8` | `#F4F7FB` |
| Tinta secundaria | `--color-text-dim` | `#8A93A2` | `#8492A6` |
| Índices / metadatos | `--color-text-faint` | `#4E5562` | `#475569` |
| Hairline | `--color-border` | `rgba(226,232,240,0.08)` | `rgba(148,163,184,0.09)` |
| Hairline activo | `--color-border-strong` | `rgba(226,232,240,0.16)` | `rgba(148,163,184,0.18)` |
| **Acento** | `--color-accent` | `#E11D48` | `#2383E2` |
| Acento hover | `--color-accent-bright` | `#F43F5E` | `#38BDF8` |
| Telemetría | `--color-telemetry` | `#38BDF8` | `#67E8F9` |
| Estado live | `--color-status-live` | `#10B981` | `#10B981` |
| Error | `--color-danger` | `#F04438` | `#F04438` |

- Profundidad por luminancia + `inset 0 1px 0 rgba(255,255,255,0.07)`; **prohibidas** las sombras negras pesadas.
- El tema se cambia con `data-theme="crimson|cryo"` en `<html>`, se guarda en `localStorage` y se aplica sin parpadeo (script inline o cookie; validar CSP).

### 2.3 Tipografía
| Rol | Fuente | Reglas |
|---|---|---|
| Display | Syne 600/700/800 | `tracking-[-0.035em] leading-[1.05]` |
| Contraste editorial | Instrument Serif italic | palabras clave del titular y del manifiesto |
| Cuerpo | Plus Jakarta Sans 400/500/600 | `leading-relaxed max-w-[60ch]` |
| Mono / datos | JetBrains Mono 400/500 | `tabular-nums` siempre en cifras, fechas y reloj |
| Micro-labels | Mono | `text-[10px] uppercase tracking-[0.08em]` |

### 2.4 Motion y micro-física
| Uso | Curva |
|---|---|
| Drawers / slide-over | `500ms cubic-bezier(0.32,0.72,0,1)` |
| Modales / ⌘K / popovers | `300ms cubic-bezier(0.165,0.84,0.44,1)`, entrada desde `scale(0.95) translateY(4px)` (nunca desde 0) |
| Botones | `120ms cubic-bezier(0.4,0,0.2,1)` + `active:scale-[0.97]` |
| 3D tilt | springs Framer Motion `stiffness:180, damping:24` |

- Solo se animan `transform` y `opacity`. `prefers-reduced-motion` desactiva tilt, pulsos y parallax.
- Radios concéntricos: `R_outer = R_inner + padding` (ej. input `6px` + `p-2` → contenedor `14px`).
- Lucide: `strokeWidth={1.5}`, tamaño `w-4 h-4` / `w-3.5 h-3.5`.

### 2.5 Elementos 3D
- **CSS 3D + Framer Motion** (sin WebGL/Three.js: menos peso y 60 fps en móvil).
- Hero Stage: `perspective:1200px`, `preserve-3d`, 3 planos `translateZ(0/28/56px)`, reflejo especular `radial-gradient` que sigue al cursor.
- Proyectos: tilt sutil (máx. ±6°) en el stage sticky.
- En móvil o táctil: sin tilt por puntero; vista isométrica fija + leve parallax por scroll.

---

## 3. Contenido

### 3.1 Posicionamiento
- **SEO title**: `Miguel García (MIGOL) — C/C++ & Full Stack Web Developer (React · TypeScript · Vite · PostgreSQL)`
- **Badge hero**: `SYS.READY // C/C++ & FULL-STACK WEB — DISPONIBLE`
- **Titular**: *"Del control de memoria en C/C++ a interfaces reactivas en la web."*
- **Subtítulo**: "Soy Miguel García — desarrollador enfocado en C/C++ y en aplicaciones web con React, TypeScript, Vite y PostgreSQL. Bilingüe español/inglés."

### 3.2 Perfil cognitivo — `INFP · SO/SX · 9w1 · 946`
| Nodo | Token | Etiqueta | Traducción al trabajo |
|---|---|---|---|
| `COG_01` | **INFP** | MBTI · Mediador (Fi-Ne-Si-Te) | Conecta la lógica del sistema con la experiencia humana; cuida arquitectura y detalle visual. |
| `COG_02` | **SO/SX** | Variante instintiva · Social / Sexual (uno a uno) | Construye para comunidades reales (+5,000 miembros) y crea vínculos cercanos y leales en equipo. |
| `COG_03` | **9w1** | Eneatipo 9 ala 1 | Calma ante bugs críticos, media en conflictos técnicos (9) + estándar ético de calidad y orden (ala 1). |
| `COG_04` | **946** | Tritipo 9-4-6 ("The Seeker") | Armonía (9) + voz/estética propia (4) + análisis y prevención de casos límite (6). |

> ⚠️ El tritipo **no** especifica alas para el 4 y el 6 — no escribir "4w5 / 6w5".
> ⚠️ Redactar como autodescripción, no como afirmación científica.

**Ubicaciones**:
1. **Principal**: `About.tsx` → módulo interactivo `[02.B // COGNITIVE TOPOLOGY]` (4 nodos con hover/clic y panel de detalle).
2. **Easter egg**: vista `SOURCE CODE` del Hero Stage → `migol_core.cpp` con `struct DeveloperProfile { ... cognitive = "INFP · SO/SX · 9w1 · 946"; }`.
3. **Ambiental**: badge en `StatusBar` (clic → scroll a `#about` + pulso en el color de acento) + comando ⌘K (`infp`, `mbti`, `9w1`, `946`, `so/sx`, `personalidad`).

### 3.3 Skills (fallback + seed)
| Idx | Nombre | Categoría | Nivel | Icono |
|---|---|---|---|---|
| 0x01 | C / C++ | LANGUAGE | INTERMEDIO | `Cpu` |
| 0x02 | TypeScript | LANGUAGE | INTERMEDIO | `FileCode2` |
| 0x03 | JavaScript (ES6+) | LANGUAGE | INTERMEDIO | `Braces` |
| 0x04 | React | FRONTEND | INTERMEDIO | `Atom` |
| 0x05 | Vite | TOOLING | INTERMEDIO | `Zap` |
| 0x06 | PostgreSQL & SQL | DATABASE | APRENDIENDO | `Database` |
| 0x07 | Next.js | FRONTEND | APRENDIENDO | `Layers` |
| 0x08 | Tailwind CSS | FRONTEND | INTERMEDIO | `Palette` |
| 0x09 | Node.js & Discord.js | BACKEND | AVANZADO | `Bot` |
| 0x0A | Git, CLI & Capacitor | TOOLING | INTERMEDIO | `GitBranch` |

> ❓ **El usuario debe confirmar los niveles.**

### 3.4 Proyectos
1. **Finance Pal** — React · TypeScript · Vite · Zustand · Tailwind · Capacitor (existente).
2. **AutoMod Sentinel** — TypeScript · Node.js · Discord.js v14 (existente).
3. **Proyecto C/C++** — ⛔ **PENDIENTE DEL USUARIO**: nombre, descripción, repo. No publicar un proyecto inventado.

### 3.5 Experiencia (changelog)
- `v3.x · 2025—presente`: Junior C/C++ & Full Stack Web (React/TS/Vite/PostgreSQL) — ❓ confirmar fechas.
- `v2.x · 2024`: Full Stack & Discord Bot Developer.
- `v1.x · 2023`: Discord Community Manager.
- `v0.x · 2022`: Bot Developer Trainee.

---

## 4. Arquitectura de la página

```
Header 1px  [0xMIGOL] 01·02·03·04·05·06  [Crimson|Cryo] [⌘K] [Contactar]
01 HERO        7:5  titular + CTA  |  Stage 3D (C/C++ · React+Vite · PostgreSQL) + slider + vista código
02 SOBRE MÍ    5:7  manifiesto + telemetría personal  |  narrativa 01/02/03 + matriz INFP·SO/SX·9w1·946
03 HABILIDADES 4:8  sticky: buscador + filtros + distribución  |  matriz indexada 0x01–0x0A
04 PROYECTOS   5:7  índice numerado + filtros  |  stage sticky tilt → slide-over con ficha técnica
05 TRAYECTORIA 3:9  versión/periodo/hash  |  rol, impacto, detalle desplegable
06 CONTACTO    5:7  canales con copiar en 1 clic  |  formulario (radios concéntricos, honeypot)
StatusBar  [● g++20 / TS 5.x] [COG: INFP·SO/SX·9w1·946] [THEME] [scroll %] [hh:mm]
```

---

## 5. FASES, TAREAS Y SUBTAREAS

### FASE 0 — Preparación · `@lead`
- [x] **T0.1** Leer docs locales de Next 16
  - [x] T0.1.1 `node_modules/next/dist/docs/` → routing, middleware/proxy, fonts, caching/revalidate, headers
  - [x] T0.1.2 Verificar si `middleware.ts` está deprecado/renombrado (`proxy.ts`) y documentar aquí (CONFIRMADO: deprecado en Next 16 a favor de `proxy.ts`)
  - [x] T0.1.3 Confirmar la API de `revalidatePath` / `revalidateTag` en esta versión
- [x] **T0.2** Crear rama `redesign/v2` y snapshot del estado actual
- [x] **T0.3** Posicionamiento base preparado: C/C++ Lab + React/Vite/TS/PostgreSQL sin datos falsificados
- [x] **✅ CHECKPOINT 0**: docs leídas, rama creada, plan en marcha

---

### FASE 1 — Seguridad backend y datos · `@backend-sec`
- [x] **T1.1** `src/lib/prisma.ts` — TLS seguro
  - [x] T1.1.1 No eliminar los parámetros de la query (`?sslmode=...`) de `DATABASE_URL`
  - [x] T1.1.2 `rejectUnauthorized:false` solo si `NODE_ENV !== "production"` o con bandera explícita `DB_ALLOW_SELF_SIGNED=true`
  - [x] T1.1.3 Soporte de CA opcional (`DATABASE_CA_CERT`)
- [x] **T1.2** `src/lib/security.ts` [NEW]
  - [x] T1.2.1 `verifyOrigin(req)`: `Origin`/`Referer` debe coincidir con `Host` / `NEXT_PUBLIC_SITE_URL` → 403
  - [x] T1.2.2 `readJsonLimited(req, 32_768)`: rechaza payloads grandes con 413
  - [x] T1.2.3 `jsonResponse()` con `Cache-Control: no-store`
  - [x] T1.2.4 `requireAdmin()` reutilizable (sesión + 401)
- [x] **T1.3** `src/lib/rate-limit.ts`
  - [x] T1.3.1 Tope `MAX_BUCKETS = 10_000` (descartar los más antiguos)
  - [x] T1.3.2 Devolver `retryAfter` y cabecera `Retry-After`
  - [x] T1.3.3 `getClientIp`: preferir la cabecera de la plataforma (`x-real-ip` / `x-vercel-forwarded-for`); documentar que `x-forwarded-for` se puede falsificar
  - [x] T1.3.4 Nota: el rate-limit en memoria no se comparte entre instancias serverless → proponer Upstash (requiere aprobación, §8)
- [x] **T1.4** `src/lib/validations.ts`
  - [x] T1.4.1 `safeUrl`: solo `https:` (o ruta relativa `/`), rechaza `javascript:`, `data:`, `vbscript:`, `http:`
  - [x] T1.4.2 `patchMessageSchema = z.object({ read: z.boolean() })`
  - [x] T1.4.3 Límite de longitud en `loginSchema.email`; normalizar a minúsculas
  - [x] T1.4.4 `idParamSchema` (cuid) para rutas `[id]`
- [x] **T1.5** Rutas API
  - [x] T1.5.1 `auth/login`: `verifyOrigin`, rate-limit compuesto (ip + email), try/catch en la consulta a la DB, respuesta genérica
  - [x] T1.5.2 `auth/logout`: `verifyOrigin`
  - [x] T1.5.3 `contact`: `verifyOrigin`, payload limitado, no registrar el mensaje completo en logs si no hay DB
  - [x] T1.5.4 `projects` y `projects/[id]`: `verifyOrigin`, `requireAdmin`, validar id, 404 si P2025, try/catch en GET, `revalidatePath("/")`
  - [x] T1.5.5 `skills` y `skills/[id]`: lo mismo que T1.5.4
  - [x] T1.5.6 `messages/[id]`: `patchMessageSchema`, `verifyOrigin`, 404 si P2025
- [x] **T1.6** `next.config.ts`
  - [x] T1.6.1 `remotePatterns`: lista blanca concreta (ej. `res.cloudinary.com`, `i.imgur.com`, `avatars.githubusercontent.com`) en vez de `**`
  - [x] T1.6.2 Añadir `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`
  - [x] T1.6.3 CSP: añadir `object-src 'none'`; evaluar nonce para eliminar `'unsafe-inline'` en `script-src` (según docs de Next 16)
  - [x] T1.6.4 Si las fuentes van por `next/font` (autoalojadas), quitar `fonts.googleapis.com` de la CSP
- [x] **T1.7** Middleware/proxy (según T0.1.2)
  - [x] T1.7.1 Migrar a la convención correcta (`src/proxy.ts` export function `proxy`)
  - [x] T1.7.2 `Cache-Control: no-store` en `/admin`
- [x] **T1.8** Datos
  - [x] T1.8.1 `fallback-content.ts`: skills §3.3, proyectos §3.4
  - [x] T1.8.2 `prisma/seed.ts`: sincronizado con el fallback
  - [x] T1.8.3 `src/lib/icons.ts`: añadir `Cpu`, `Terminal`, `Binary`, `Zap`, `MemoryStick`
- [x] **✅ CHECKPOINT 1**
  - [x] `npx tsc --noEmit` sin errores
  - [x] `npm run lint` sin errores
  - [x] Mutación sin sesión → 401; `Origin` externo → 403; `liveUrl: "javascript:alert(1)"` → 400; payload de 64 KB → 413

---

### FASE 2 — Design system · `@design-system`
- [x] **T2.1** `src/app/layout.tsx`
  - [x] T2.1.1 Quitar `Inter` y `Space_Grotesk`; cargar Syne, Instrument Serif, Plus Jakarta Sans, JetBrains Mono con `next/font/google`
  - [x] T2.1.2 Metadata SEO §3.1 (title, description, keywords: C++, React, Vite, PostgreSQL)
  - [x] T2.1.3 `data-theme` + script anti-parpadeo (compatible con la CSP)
  - [x] T2.1.4 `Toaster` con los tokens nuevos
  - [x] T2.1.5 Montar el proveedor de `CommandPalette`
- [x] **T2.2** `src/app/globals.css`
  - [x] T2.2.1 `@theme inline` con los tokens §2.2 y bloques `[data-theme="cryo"]`
  - [x] T2.2.2 Variables de fuente §2.3
  - [x] T2.2.3 Utilidades: `.blueprint-grid`, `.crosshair` (`+`), `.tnum`, `.hairline`
  - [x] T2.2.4 Variables de easing (`--ease-drawer`, `--ease-pop`, `--ease-press`)
  - [x] T2.2.5 `::selection`, `:focus-visible` (con el acento) y scrollbar con los tokens nuevos
  - [x] T2.2.6 Mantener el bloque `prefers-reduced-motion`
- [x] **T2.3** Primitivas `src/components/ui/*`
  - [x] T2.3.1 `button.tsx`: variantes `primary` (acento), `secondary` (hairline), `ghost`, `destructive`; `active:scale-[0.97]`; `rounded-[6px]`; alto táctil ≥44px en móvil
  - [x] T2.3.2 `badge.tsx`: `rounded-[4px]`, mono 10px uppercase; variantes `accent | telemetry | live | outline`
  - [x] T2.3.3 `input.tsx` / `textarea.tsx`: superficie `panel-2`, foco con el acento, `rounded-[6px]`
  - [x] T2.3.4 `dialog.tsx`: entrada `scale-95 → 100` con `--ease-pop`; overlay con blur
  - [x] T2.3.5 `select.tsx`: misma física de popover; iconos con stroke 1.5
  - [x] T2.3.6 [NEW] `sheet.tsx` (slide-over, Radix Dialog, `--ease-drawer`, bottom-sheet en móvil)
  - [x] T2.3.7 [NEW] `kbd.tsx`
- [x] **✅ CHECKPOINT 2**
  - [x] Primitivas migradas a tokens CSS duales (Crimson/Cryo)
  - [x] Contraste AA verificado en tokens principales y secundarios
  - [x] Script anti-parpadeo y providers montados en layout raíz

---

### FASE 3 — Sitio público · `@frontend-craft`
- [ ] **T3.1** `InteractiveSystemsStage.tsx` [NEW]
  - [ ] T3.1.1 Escena 3D con 3 planos `translateZ` y tilt por puntero (springs)
  - [ ] T3.1.2 Selector de nodos: `0x01 C/C++ Native Core` (visual stack/heap) · `0x02 React+TS+Vite` (árbol de componentes) · `0x03 PostgreSQL` (tablas/relaciones)
  - [ ] T3.1.3 Slider de carga 100–10,000 ops/s → velocidad de pulsos y contadores `tabular-nums`
  - [ ] T3.1.4 Etiqueta visible `SIMULACIÓN` en las métricas
  - [ ] T3.1.5 Conmutador `3D STAGE ⇄ SOURCE CODE` (pestañas `migol_core.cpp` y `useFinanceStore.ts`)
  - [ ] T3.1.6 Fallback para táctil y `reduced-motion`
  - [ ] T3.1.7 Accesibilidad: controles con label, navegables por teclado, `aria-live` discreto
- [ ] **T3.2** `CommandPalette.tsx` [NEW]
  - [ ] T3.2.1 Atajo `⌘K` / `Ctrl+K`, cierre con `Esc`, foco atrapado
  - [ ] T3.2.2 Grupos: Navegación · Proyectos · Habilidades · Acciones (copiar email, copiar Discord, cambiar tema, ver perfil cognitivo, abrir admin)
  - [ ] T3.2.3 Filtro en vivo con navegación ↑↓ / Enter
- [ ] **T3.3** `Header.tsx`: hairline, índice 01–06 con estado activo (IntersectionObserver), switch de tema, trigger ⌘K, menú móvil con drawer
- [ ] **T3.4** `StatusBar.tsx`: compilador/TS, badge COG (clic → `#about`), tema, scroll %, reloj `tabular-nums`; visible y compacta en móvil (decidir)
- [ ] **T3.5** `Footer.tsx` y `Reveal.tsx`: easing propio; `SectionEyebrow` → `[0x02 // SOBRE MÍ]`
- [ ] **T3.6** `Hero.tsx`: layout 7:5 con crosshairs, badge, titular Syne + Instrument Serif, CTA primario y secundario, hint ⌘K
- [ ] **T3.7** `About.tsx`
  - [ ] T3.7.1 Columna 5: manifiesto + telemetría (años programando, idiomas, ubicación `Colima, MX · UTC-6`)
  - [ ] T3.7.2 Columna 7: narrativa 01/02/03 con hairlines
  - [ ] T3.7.3 **Módulo `[02.B // COGNITIVE TOPOLOGY]`** con 4 nodos §3.2 (hover/clic/teclado, panel de detalle animado, `id="cognitive"`)
- [ ] **T3.8** `Skills.tsx`: split 4:8, buscador y filtros (useState/useMemo), filas indexadas 0x01–0x0A, barra de nivel, detalle al expandir; sin tarjetas
- [ ] **T3.9** `Projects.tsx` + `ProjectCard.tsx`
  - [ ] T3.9.1 Índice numerado + filtros (Todos · C/C++ · React/Vite · TypeScript)
  - [ ] T3.9.2 Stage sticky `lg:col-span-7 lg:sticky lg:top-24` con tilt
  - [ ] T3.9.3 Slide-over con la ficha técnica, tags y enlaces (`rel="noopener noreferrer"`)
  - [ ] T3.9.4 Estado vacío elegante
- [ ] **T3.10** `Experience.tsx`: changelog 3:9 con despliegue
- [ ] **T3.11** `Contact.tsx`: copiar en 1 clic (feedback `Check`), formulario con radios concéntricos, honeypot, errores accesibles
- [ ] **✅ CHECKPOINT 3**
  - [ ] Todos los controles con estado real (3D, slider, vista código, filtros, slide-over, ⌘K, tema, copiar, formulario)
  - [ ] Sin errores de hidratación ni de consola
  - [ ] ≥65 % del contenido sobre el canvas (revisión visual)

---

### FASE 4 — Panel `/admin` · `@admin-ui`
- [ ] **T4.1** `admin/layout.tsx`: rail `panel`, navegación con estado activo, colapsable en móvil
- [ ] **T4.2** `admin/login/page.tsx`: minimalista; validar que `next` sea una ruta interna (evitar open redirect)
- [ ] **T4.3** `admin/page.tsx`: métricas en fila separadas por hairlines verticales (sin tarjetas), aviso de DB
- [ ] **T4.4** `ProjectsManager` / `SkillsManager`: tabla 1px, búsqueda, acciones en hover, edición en `Sheet`
- [ ] **T4.5** `MessagesManager`: master-detail; filtro leído/no leído; marcar como leído al abrir
- [ ] **T4.6** Reemplazar `confirm()` por un diálogo de confirmación propio
- [ ] **T4.7** `ProjectForm` / `SkillForm`: mostrar errores del servidor con toast (hoy se lanza un `throw` sin capturar)
- [ ] **✅ CHECKPOINT 4**
  - [ ] Login → CRUD completo → logout sin errores
  - [ ] El cambio en admin se ve en `/` de inmediato (revalidación)
  - [ ] `npm run build` exitoso

---

### FASE 5 — Verificación con subagentes
> Requiere servidor (`npm run build && npm start`) y una herramienta de navegador (Playwright o equivalente).

#### 5A · `@qa-viewport` — QA visual multi-dimensión
- [ ] **T5A.1** 375×812 (Mobile S): sin scroll horizontal (`scrollWidth <= innerWidth`), menú, stage fallback, objetivos táctiles ≥44px, formulario
- [ ] **T5A.2** 430×932 (Mobile L): matriz de skills, slide-over como bottom-sheet, módulo cognitivo
- [ ] **T5A.3** 768×1024 (Tablet): transición de grillas, StatusBar, switch de tema
- [ ] **T5A.4** 1280×800 y 1440×900 (Desktop): sticky 5:7, tilt por puntero, ⌘K, `/admin`
- [ ] **T5A.5** 1920×1080 (Ultra-wide): alineación de retícula y crosshairs, ancho máximo, espacio negativo
- [ ] **T5A.6** Repetir T5A.1 y T5A.4 en el tema **Cryo**
- [ ] **T5A.7** Capturas en `.agents/qa/screenshots/<viewport>-<tema>-<sección>.png`
- [ ] **T5A.8** Informe de hallazgos con severidad (P0–P3) en §7

#### 5B · `@qa-security` — Auditoría backend
- [ ] **T5B.1** Cabeceras: CSP, HSTS, XFO, XCTO, Referrer, Permissions, COOP, `X-Robots-Tag` en admin
- [ ] **T5B.2** Rutas protegidas sin cookie → 401 / redirect
- [ ] **T5B.3** JWT manipulado o expirado → rechazado
- [ ] **T5B.4** CSRF con `Origin: https://evil.example` → 403
- [ ] **T5B.5** XSS: `javascript:` y `data:` en URLs → 400; HTML en el mensaje de contacto renderizado escapado en admin
- [ ] **T5B.6** Rate-limit: 6.º mensaje de contacto → 429; 9.º login → 429 con `Retry-After`
- [ ] **T5B.7** Honeypot relleno → 200 silencioso sin escribir en la DB
- [ ] **T5B.8** Open redirect en `/admin/login?next=https://evil` → bloqueado
- [ ] **T5B.9** `npm audit --omit=dev` revisado
- [ ] **T5B.10** Ningún secreto en el bundle de cliente (buscar `AUTH_SECRET` y `DATABASE_URL` en `.next/static`)

#### 5C · `@qa-perf` — Rendimiento, accesibilidad y Leyes Anti-IA
- [ ] **T5C.1** Lighthouse móvil y escritorio: Performance ≥90, A11y ≥95, Best Practices ≥95, SEO 100
- [ ] **T5C.2** CLS < 0.05, LCP < 2.5 s (móvil)
- [ ] **T5C.3** Animaciones solo con `transform` y `opacity`; 60 fps en el stage (Performance panel)
- [ ] **T5C.4** `prefers-reduced-motion` respetado
- [ ] **T5C.5** Navegación completa por teclado y foco visible
- [ ] **T5C.6** Checklist Anti-IA: sin Inter · sin paletas Tailwind por defecto · sin filas de 3 tarjetas · Lucide stroke 1.5 · `tabular-nums` en cifras · sin clichés de copy
- [ ] **✅ CHECKPOINT 5 (FINAL)**: P0/P1 = 0 · todos los checklists en `[x]` · walkthrough escrito

---

## 6. Archivos afectados (índice rápido)
| Capa | Archivos |
|---|---|
| Seguridad | `src/lib/{prisma,rate-limit,validations,security*}.ts`, `next.config.ts`, `src/middleware.ts` (o `proxy.ts`), `src/app/api/**` |
| Datos | `src/lib/fallback-content.ts`, `prisma/seed.ts`, `src/lib/icons.ts` |
| Design system | `src/app/layout.tsx`, `src/app/globals.css`, `src/components/ui/*` (+ `sheet*`, `kbd*`) |
| Público | `src/components/{Header,StatusBar,Footer,Reveal,ProjectCard}.tsx`, `src/components/sections/*`, `InteractiveSystemsStage*`, `CommandPalette*` |
| Admin | `src/app/admin/**`, `src/components/admin/**` |

`*` = archivo nuevo

---

## 7. Registro de QA / Hallazgos
| ID | Agente | Viewport/Ruta | Severidad | Descripción | Estado |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## 8. Dependencias propuestas (requieren aprobación)
| Paquete | Motivo | Estado |
|---|---|---|
| `@playwright/test` (dev) | QA multi-viewport automatizado (F5A/5B) | ⏳ pendiente |
| `@upstash/ratelimit` + `@upstash/redis` | Rate-limit compartido entre instancias | ⏳ opcional |
| `cmdk` | Base accesible para ⌘K (alternativa: implementación propia) | ⏳ opcional |

## 9. Registro de Bloqueos
| Fecha | Tarea | Bloqueo | Responsable | Resolución |
|---|---|---|---|---|
| 2026-10-15 | T0.3 / §3.4 | Falta el proyecto C/C++ real del usuario | usuario | — |

## 10. Decisiones abiertas para el usuario
- [ ] Proyecto(s) C/C++ a mostrar (nombre, descripción, repo)
- [ ] Niveles de skills definitivos (§3.3)
- [ ] Fechas de experiencia (§3.5)
- [ ] ¿StatusBar visible en móvil?
- [ ] Aprobación de las dependencias de §8

## 11. Bitácora de agentes
> 💬 **@lead** · 2026-10-15 22:43 · `plan`
> Plan consolidado. Esperando la aprobación del usuario para iniciar la FASE 0.