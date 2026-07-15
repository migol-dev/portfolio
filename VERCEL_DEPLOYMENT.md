# 🚀 Guía de Deploy en Vercel

Esta guía te ayudará a desplegar tu portfolio en Vercel.

## 📋 Requisitos Previos

- Proyecto subido a GitHub
- Cuenta en Vercel (https://vercel.com)
- Base de datos PostgreSQL (Supabase, Neon, Vercel Postgres, etc.)
- Las variables de entorno necesarias

## 🔧 Paso 1: Preparar la Base de Datos

### Opción A: Supabase (Recomendado)

1. Crea una cuenta en https://supabase.com
2. Crea un nuevo proyecto
3. Ve a `Settings > Database > Connection string`
4. Copia la opción `Connection string > URI`
5. Asegúrate que usa `sslmode=verify-full`

Ejemplo:
```
postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=verify-full
```

### Opción B: Vercel Postgres

1. En tu dashboard de Vercel, ve a `Storage`
2. Crea una nueva base de datos PostgreSQL
3. Copia la `CONNECTION_STRING` desde la pestaña `.env.local`

### Opción C: Neon

1. Crea una cuenta en https://neon.tech
2. Crea un nuevo proyecto
3. Copia la connection string desde el dashboard
4. Usa `sslmode=verify-full`

## 📤 Paso 2: Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

**⚠️ Importante**: El `.gitignore` ya excluye `.env`, así que tus credenciales NO se subirán.

## ⚙️ Paso 3: Importar en Vercel

1. Ve a https://vercel.com/new
2. Selecciona "Import Git Repository"
3. Conecta tu repositorio de GitHub
4. Selecciona el proyecto

## 🔐 Paso 4: Configurar Variables de Entorno

En Vercel, ve a `Settings > Environment Variables` y agrega:

### `DATABASE_URL` (Requerido)
Tu connection string de PostgreSQL con `sslmode=verify-full`

```
postgresql://postgres:PASSWORD@host:5432/postgres?sslmode=verify-full
```

### `AUTH_SECRET` (Requerido)
Genera un secreto fuerte. En tu terminal local:

```bash
openssl rand -base64 32
```

Copia el resultado y pégalo como `AUTH_SECRET`.

### `ADMIN_EMAIL` (Requerido)
El email para el usuario admin, ejemplo:
```
admin@migol.dev
```

### `ADMIN_PASSWORD` (Requerido)
Una contraseña segura para el usuario admin (cámbiala después en `/admin`):
```
Un-Secreto-Muy-Seguro-Aqui
```

### `NEXT_PUBLIC_SITE_URL` (Requerido)
Tu dominio de producción (con https):
```
https://migol.dev
```

O si usas el dominio de Vercel:
```
https://migol-portfolio.vercel.app
```

## 🚀 Paso 5: Desplegar

1. Haz clic en `Deploy`
2. Espera a que se complete (normalmente 2-5 minutos)
3. Vercel te dará una URL para acceder a tu sitio

## 💾 Paso 6: Inicializar la Base de Datos (Primera Vez)

Después del primer deploy, **desde tu máquina local**, corre:

```bash
# Asegúrate que .env tiene la DATABASE_URL de producción
npm run db:push   # Crea las tablas

npm run db:seed   # Inserta datos iniciales (proyectos, habilidades, admin)
```

Luego accede a `https://tu-dominio.com/admin` con las credenciales que configuraste.

## 🔄 Paso 7: Despliegues Posteriores

Cada vez que hagas push a `main` en GitHub, Vercel automáticamente:
1. Detecta los cambios
2. Corre `npm install`
3. Ejecuta `npm run build`
4. Despliega la nueva versión

## 🛠️ Troubleshooting

### Error: "self-signed certificate in certificate chain"

**Solución**: Usa `sslmode=verify-full` en tu `DATABASE_URL`.

Si aún tienes problemas, no agregues `NODE_TLS_REJECT_UNAUTHORIZED` en Vercel
(eso solo es para desarrollo local).

### Error: "PrismaClientConstructorValidationError"

Asegúrate que `DATABASE_URL` esté configurada en Vercel y que sea una
**conexión directa**, no de pooling.

### La página carga pero no muestra datos

1. Verifica que `npm run db:seed` se ejecutó correctamente localmente
2. Revisa los logs en Vercel: `Deployments > [tu deploy] > Logs`
3. Asegúrate que el admin user existe: accede a `/admin/login`

### No puedo acceder a `/admin`

1. Asegúrate que corriste `npm run db:seed` con `ADMIN_EMAIL` y `ADMIN_PASSWORD`
2. Intenta con esas credenciales en `/admin/login`
3. Si lo olvidaste, puedes actualizar directamente en la base de datos o
   reejecutar seed con nuevas credenciales

## 📊 Monitorear en Producción

1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Tab `Deployments`: ver historial de deploys
4. Tab `Analytics`: ver tráfico y performance
5. Tab `Logs`: ver logs en tiempo real

## 🔗 Enlaces Útiles

- [Documentación de Vercel + Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Variables de Entorno en Vercel](https://vercel.com/docs/projects/environment-variables)
- [Prisma con PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)

---

¿Preguntas? Revisa los logs de Vercel o ejecuta `npm run build` localmente para diagnosticar.
