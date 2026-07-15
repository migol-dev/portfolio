# migol.dev — Portfolio

Portfolio full stack de Miguel García (MIGOL), construido con Next.js 16 (App
Router), TypeScript, Tailwind CSS v4, shadcn/ui (Radix) y PostgreSQL (Prisma).

Diseño con temática de editor de código: pestañas como navegación, tarjetas
de proyecto estilo "explorador de archivos" y una barra de estado inferior
inspirada en VS Code.

## ✨ Qué incluye

- **Sitio público**: hero animado, sobre mí, habilidades, proyectos, línea de
  tiempo de experiencia y formulario de contacto funcional.
- **Panel de administración** (`/admin`, protegido con login): CRUD completo
  de proyectos y habilidades, y bandeja de mensajes de contacto.
- **Base de datos PostgreSQL** vía Prisma: proyectos, habilidades, mensajes de
  contacto y usuario admin.
- **Seguridad**: autenticación con JWT en cookie httpOnly, contraseñas con
  bcrypt, rate limiting en login y contacto, honeypot anti-spam, cabeceras de
  seguridad (CSP, HSTS, X-Frame-Options, etc.), y `/admin` bloqueado a
  buscadores.
- **Contenido de respaldo**: si aún no conectas la base de datos, el sitio
  muestra contenido por defecto (tus proyectos actuales: AutoMod Sentinel y
  Finance Pal) para que nunca se vea vacío o roto.

## 🚀 Puesta en marcha local

### 1. Requisitos

- Node.js 20+
- Una base de datos PostgreSQL (puedes crear una gratis en
  [Neon](https://neon.tech), [Supabase](https://supabase.com) o
  [Vercel Postgres](https://vercel.com/storage/postgres))

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y completa estas variables:

- `DATABASE_URL`: usa la URL de conexión directa de Supabase. En tu proyecto de
  Supabase ve a `Settings > Database` y copia la opción `Connection string > URI`.
  Un ejemplo sería:

```text
postgresql://postgres:TU_PASSWORD@db.TU_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
```

- `AUTH_SECRET`: genera uno con `openssl rand -base64 32`.
- `ADMIN_EMAIL` y `ADMIN_PASSWORD`: serán las credenciales del usuario admin
  que usarás para entrar a `/admin`.

> Importante: para Prisma, usa la conexión directa de Supabase (no la de pooling)
> porque el cliente necesita una conexión estable y sin el proxy de PgBouncer.

### 4. Crear las tablas y sembrar datos iniciales

```bash
npm run db:push   # crea las tablas en Postgres a partir de prisma/schema.prisma
npm run db:seed   # inserta tus proyectos, habilidades y el usuario admin
```

### 5. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para el sitio y
[http://localhost:3000/admin](http://localhost:3000/admin) para el panel.

## 🗂️ Estructura del proyecto

```text
prisma/
  schema.prisma       # Modelos: Project, Skill, ContactMessage, AdminUser
  seed.ts              # Datos iniciales (tus proyectos actuales)
src/
  app/
    page.tsx           # Homepage (ensambla todas las secciones)
    admin/              # Panel de administración (protegido)
    api/                # Rutas API (contacto, proyectos, habilidades, auth)
    sitemap.ts, robots.ts
  components/
    ui/                 # Componentes base estilo shadcn/ui
    sections/           # Hero, About, Skills, Projects, Experience, Contact
    admin/               # Formularios y managers del panel
  lib/
    prisma.ts, auth.ts, validations.ts, rate-limit.ts, data.ts
    fallback-content.ts # Contenido de respaldo si no hay DB conectada
middleware.ts           # Protege /admin/*
```

## 🌐 Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. Impórtalo en [vercel.com/new](https://vercel.com/new).
3. En **Environment Variables**, agrega `DATABASE_URL`, `AUTH_SECRET`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `NEXT_PUBLIC_SITE_URL` (tu dominio final).
4. Despliega. Luego, desde tu máquina (con `DATABASE_URL` de producción en tu
   `.env`), corre una vez:
   ```bash
   npm run db:push
   npm run db:seed
   ```
5. Entra a `tudominio.com/admin` con las credenciales que definiste.

## 🎨 Personalizar

- **Colores y tipografías**: `src/app/globals.css` (bloque `@theme inline`).
- **Textos de "Sobre mí" y "Experiencia"**: `src/components/sections/About.tsx`
  y `src/components/sections/Experience.tsx` (aún son estáticos; si quieres
  que también se editen desde `/admin`, se puede agregar un modelo `Profile`
  siguiendo el mismo patrón que `Project`/`Skill`).
- **Proyectos y habilidades**: edítalos directamente desde `/admin` — no hace
  falta tocar código.
- **Logos de proyecto**: en el formulario de cada proyecto, pega la URL de una
  imagen ya subida (por ejemplo a Cloudinary, Imgur, o `/public` de tu propio
  dominio).

## 🛠️ Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Radix UI · Prisma ·
PostgreSQL · Framer Motion · React Hook Form · Zod · Sonner
