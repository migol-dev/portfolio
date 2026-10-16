import { verifyOrigin, readJsonLimited } from "../src/lib/security";
import { projectSchema, safeUrl } from "../src/lib/validations";
import { rateLimit } from "../src/lib/rate-limit";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log("--- TEST SUITE: FASE 1 SECURITY & VALIDATION ---");

  // 1. External Origin check -> 403
  const badReq = new Request("http://localhost:3000/api/projects", {
    method: "POST",
    headers: {
      origin: "https://evil-attacker.com",
      host: "localhost:3000",
    },
  });
  assert(verifyOrigin(badReq) === false, "verifyOrigin rejects malicious external origin");

  // Valid same-origin check
  const goodReq = new Request("http://localhost:3000/api/projects", {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      host: "localhost:3000",
    },
  });
  assert(verifyOrigin(goodReq) === true, "verifyOrigin allows legitimate same-origin");

  // 2. safeUrl tests
  const xssUrlResult = safeUrl.safeParse("javascript:alert(1)");
  assert(!xssUrlResult.success, "safeUrl rejects javascript: scheme");

  const dataUrlResult = safeUrl.safeParse("data:text/html,<script>alert(1)</script>");
  assert(!dataUrlResult.success, "safeUrl rejects data: scheme");

  const httpUrlResult = safeUrl.safeParse("http://insecure-site.com");
  assert(!httpUrlResult.success, "safeUrl rejects insecure http: scheme");

  const httpsUrlResult = safeUrl.safeParse("https://github.com/migol-dev");
  assert(httpsUrlResult.success, "safeUrl accepts valid https: scheme");

  const relativeUrlResult = safeUrl.safeParse("/projects/demo");
  assert(relativeUrlResult.success, "safeUrl accepts relative URL path");

  // 3. Project schema with bad liveUrl -> 400
  const badProject = {
    slug: "bad-proj",
    name: "Bad Project",
    tagline: "Exploit attempt",
    description: "Trying to inject XSS into liveUrl",
    status: "LIVE" as const,
    featured: false,
    order: 0,
    tags: ["security"],
    liveUrl: "javascript:alert(1)",
  };
  const badProjectParsed = projectSchema.safeParse(badProject);
  assert(!badProjectParsed.success, "projectSchema rejects liveUrl with javascript:");

  // 4. readJsonLimited payload > 32KB -> 413
  const bigBody = JSON.stringify({ data: "A".repeat(65_536) });
  const bigReq = new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-length": String(bigBody.length),
      "content-type": "application/json",
    },
    body: bigBody,
  });
  const limitedResult = await readJsonLimited(bigReq, 32_768);
  assert(Boolean(limitedResult.error), "readJsonLimited flags payload > 32KB as error");
  assert(limitedResult.error?.status === 413, "readJsonLimited returns HTTP 413 status");

  // 5. Rate limiting with retryAfter
  const key = `test-ip-${Date.now()}`;
  for (let i = 0; i < 3; i++) {
    rateLimit(key, { limit: 3, windowMs: 60000 });
  }
  const exceeded = rateLimit(key, { limit: 3, windowMs: 60000 });
  assert(!exceeded.success, "rateLimit triggers when threshold exceeded");
  assert(exceeded.remaining === 0, "rateLimit reports 0 remaining");
  assert(exceeded.retryAfter > 0, "rateLimit returns valid retryAfter in seconds");

  console.log("--- ALL SECURITY TESTS PASSED SUCCESSFULLY! ---");
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
