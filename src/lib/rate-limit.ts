// Rate limiter en memoria con límite máximo de buckets para prevenir agotamiento de memoria.
// Adecuado para instancias individuales o funciones serverless Next.js en Vercel.
// NOTA DE SEGURIDAD / ESCALABILIDAD:
// Las instancias de serverless no comparten memoria global entre invocaciones concurrentes en diferentes contenedores.
// Para despliegues multi-región o clúster de alta disponibilidad, se recomienda conectar @upstash/ratelimit con Redis.

type Bucket = { count: number; resetAt: number };

const MAX_BUCKETS = 10_000;
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { success: boolean; remaining: number; resetAt: number; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    // Si alcanzamos la capacidad máxima de almacenamiento en memoria, eliminamos la entrada más antigua (LRU simple)
    if (buckets.size >= MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey) buckets.delete(oldestKey);
    }

    const resetAt = now + windowMs;
    const retryAfter = Math.max(1, Math.ceil(windowMs / 1000));
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt, retryAfter };
  }

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  if (bucket.count >= limit) {
    return { success: false, remaining: 0, resetAt: bucket.resetAt, retryAfter };
  }

  bucket.count += 1;
  return {
    success: true,
    remaining: limit - bucket.count,
    resetAt: bucket.resetAt,
    retryAfter,
  };
}

// Limpieza periódica cada 5 minutos para liberar memoria de buckets expirados
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Obtiene la dirección IP real del cliente.
 * Preferencia de cabeceras de proxy de confianza (Vercel / Cloudflare / Nginx).
 * ADVERTENCIA: La cabecera x-forwarded-for directa puede ser enviada/falsificada por el cliente
 * si no se procesa a través de un proxy inverso confiable.
 */
export function getClientIp(headers: Headers): string {
  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0].trim();

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}
