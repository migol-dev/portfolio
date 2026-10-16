import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BROWSER_PATH = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

const SCREENSHOT_DIR = path.resolve(".agents/qa/screenshots");
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "375x812-mobile-s", width: 375, height: 812 },
  { name: "430x932-mobile-l", width: 430, height: 932 },
  { name: "768x1024-tablet", width: 768, height: 1024 },
  { name: "1280x800-desktop", width: 1280, height: 800 },
  { name: "1920x1080-ultrawide", width: 1920, height: 1080 },
];

async function runBrowserQa() {
  console.log("=== BROWSER QA & MULTI-VIEWPORT VERIFICATION ===");
  console.log(`Browser executable: ${BROWSER_PATH}`);

  // 1. Fetch public home page & check response
  console.log("\n[1] Testing GET http://localhost:3000 ...");
  const res = await fetch("http://localhost:3000");
  if (res.status !== 200) {
    throw new Error(`Expected HTTP 200, got ${res.status}`);
  }
  console.log("✅ HTTP Status 200 OK");

  // Check critical security headers
  const csp = res.headers.get("content-security-policy");
  const xfo = res.headers.get("x-frame-options");
  const xcto = res.headers.get("x-content-type-options");
  const coop = res.headers.get("cross-origin-opener-policy");

  if (!csp || !csp.includes("default-src 'self'")) throw new Error("Missing or invalid CSP");
  if (xfo !== "DENY") throw new Error(`Invalid X-Frame-Options: ${xfo}`);
  if (xcto !== "nosniff") throw new Error(`Invalid X-Content-Type-Options: ${xcto}`);
  if (coop !== "same-origin") throw new Error(`Invalid COOP: ${coop}`);
  console.log("✅ Security headers verified: CSP, XFO, XCTO, COOP");

  const html = await res.text();

  // Check presence of key sections
  const requiredMarkers = [
    'id="hero"',
    'id="about"',
    'id="skills"',
    'id="projects"',
    'id="experience"',
    'id="contact"',
    'SYS.READY // C/C++ &amp; FULL-STACK WEB — DISPONIBLE',
    'Del control de memoria en',
    'INFP · SO/SX · 9w1 · 946',
    '0x0A', // Validated hexadecimal index for 10th skill!
  ];

  for (const marker of requiredMarkers) {
    if (!html.includes(marker)) {
      throw new Error(`Missing required marker in HTML: ${marker}`);
    }
  }
  console.log("✅ All required page sections and typography markers found in HTML");

  // Verify that the broken 'x010' string is NOT in the HTML
  if (html.includes("x010")) {
    throw new Error("Found broken 'x010' index in HTML!");
  }
  console.log("✅ Verified: 'x010' bug is absent, '0x0A' is present!");

  // 2. Test Admin Route Protection (Redirect to /admin/login)
  console.log("\n[2] Testing GET http://localhost:3000/admin redirect ...");
  const adminRes = await fetch("http://localhost:3000/admin", { redirect: "manual" });
  console.log(`Admin response status: ${adminRes.status}`);
  if (adminRes.status !== 307 && adminRes.status !== 302 && adminRes.status !== 308) {
    throw new Error(`Expected redirect 307/302, got ${adminRes.status}`);
  }
  const location = adminRes.headers.get("location");
  console.log(`Redirect Location: ${location}`);
  if (!location || !location.includes("/admin/login?next=%2Fadmin") && !location.includes("/admin/login?next=/admin")) {
    throw new Error(`Unexpected redirect location: ${location}`);
  }
  console.log("✅ Admin proxy redirects unauthenticated user to login");

  // 3. Capture Screenshots across all 5 viewports using headless browser
  console.log("\n[3] Capturing multi-viewport screenshots with headless browser ...");
  for (const vp of VIEWPORTS) {
    const outFile = path.join(SCREENSHOT_DIR, `${vp.name}-crimson.png`);
    const cmd = `"${BROWSER_PATH}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=${vp.width},${vp.height} --screenshot="${outFile}" http://localhost:3000`;
    console.log(`Capturing ${vp.name} (${vp.width}x${vp.height})...`);
    execSync(cmd, { stdio: "pipe", timeout: 15000 });
    const stats = fs.statSync(outFile);
    console.log(`  -> Saved ${outFile} (${Math.round(stats.size / 1024)} KB)`);
  }

  // Capture /admin/login
  const loginOutFile = path.join(SCREENSHOT_DIR, "1280x800-admin-login.png");
  console.log("Capturing admin login (1280x800)...");
  execSync(
    `"${BROWSER_PATH}" --headless --disable-gpu --virtual-time-budget=2000 --window-size=1280,800 --screenshot="${loginOutFile}" http://localhost:3000/admin/login`,
    { stdio: "pipe", timeout: 15000 }
  );
  const loginStats = fs.statSync(loginOutFile);
  console.log(`  -> Saved ${loginOutFile} (${Math.round(loginStats.size / 1024)} KB)`);

  console.log("\n=== ALL BROWSER & VIEWPORT QA CHECKS PASSED SUCCESSFULLY! ===");
}

runBrowserQa().catch((err) => {
  console.error("❌ BROWSER QA FAILED:", err);
  process.exit(1);
});
