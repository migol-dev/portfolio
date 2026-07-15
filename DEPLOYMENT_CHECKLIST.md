# ✅ Pre-Deployment Checklist para Vercel

Antes de hacer deploy en Vercel, verifica estos items:

## 📦 Código y Configuración

- [x] `package.json` con scripts correctos (dev, build, start, db:*)
- [x] `prisma.config.ts` configurado correctamente
- [x] `.env.example` con variables de ejemplo
- [x] `.env.local.example` con instrucciones de desarrollo
- [x] `.gitignore` excluye archivos sensibles (.env, .next, node_modules)
- [x] `.vercelignore` configurado
- [x] `vercel.json` con configuración de build
- [x] `next.config.ts` optimizado con headers de seguridad
- [x] `src/middleware.ts` protege `/admin`
- [x] `tsconfig.json` y `eslint.config.mjs` presentes

## 🔐 Seguridad

- [x] No hay credenciales hardcodeadas en el código
- [x] Las credenciales están solo en `.env` (excluido de git)
- [x] `AUTH_SECRET` se genera aleatoriamente
- [x] Contraseñas se hashean con bcryptjs
- [x] Headers de seguridad configurados (HSTS, CSP, X-Frame-Options)
- [x] Rate limiting en rutas sensibles (/api/auth/login, /api/contact)
- [x] `/admin` bloqueado a buscadores (noindex, nofollow)

## 📚 Documentación

- [x] `README.md` completo y actualizado
- [x] `VERCEL_DEPLOYMENT.md` con guía paso a paso
- [x] Instrucciones de variables de entorno
- [x] Ejemplos de conexión a diferentes bases de datos

## 🚀 Build y Performance

- [x] Build completa sin errores críticos
- [x] TypeScript type-checks correcto
- [x] ESLint pasa sin problemas
- [x] Prisma Client se genera correctamente
- [x] No hay importaciones faltantes

## 🗄️ Base de Datos

- [x] Prisma 7.8.0 instalado y configurado
- [x] `prisma/schema.prisma` con todos los modelos
- [x] `prisma/migrations/` existe (versionado en git)
- [x] `prisma/seed.ts` con datos iniciales
- [x] Connection string usa `sslmode=verify-full`

## 🔧 Desarrollo

- [x] `npm run dev` funciona localmente
- [x] `npm run build` funciona sin errores
- [x] `npm run db:push` está listo para usar
- [x] `npm run db:seed` crea admin user correctamente

---

## 📋 Antes de hacer Deploy en Vercel

1. **Sube a GitHub**
   ```bash
   git add .
   git commit -m "Preparado para Vercel"
   git push origin main
   ```

2. **En el dashboard de Vercel**:
   - Importa el repositorio
   - Configura Environment Variables (ver VERCEL_DEPLOYMENT.md)
   - Haz clic en Deploy

3. **Después del Deploy**:
   - Espera a que compile (2-5 minutos)
   - Accede a tu URL
   - Corre `npm run db:push` y `npm run db:seed` localmente

---

## 🆘 Si algo falla

1. **Revisa los logs en Vercel**: `Deployments > [tu deploy] > Logs`
2. **Verifica variables de entorno**: Settings > Environment Variables
3. **Consulta VERCEL_DEPLOYMENT.md**: Sección Troubleshooting
4. **Compila localmente**: `npm run build` para diagnosticar

---

¡Listo para desplegar! 🚀
