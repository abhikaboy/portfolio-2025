import { chromium } from "playwright";

// 5173 is taken by other local projects, so this site pins its dev server to 5199 (see vite.config.ts).
const BASE = process.env.BASE ?? "http://localhost:5199";

const ROUTES: Record<string, string> = {
  hero: `${BASE}/#/`,
  created: `${BASE}/#/created`,
  experienced: `${BASE}/#/experienced`,
  written: `${BASE}/#/written`,
  designed: `${BASE}/#/designed`,
};

// WebGPU + HTML-in-Canvas need real GPU access; SwiftShader fails the adapter/HIC checks.
const ARGS = [
  "--enable-experimental-web-platform-features",
  "--enable-unsafe-webgpu",
  "--enable-features=Vulkan,UseChromeOSDirectVideoDecoder,CanvasOopRasterization,WebGPUAllowUnsafeAPIs",
  "--disable-gpu-sandbox",
  "--no-sandbox",
  "--use-angle=metal",
  "--ignore-gpu-blocklist",
];

const checkGpu = process.argv.includes("--check-gpu");
const names = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const targets = names.length ? names : Object.keys(ROUTES);

const browser = await chromium.launch({
  channel: "chrome",
  headless: false,
  args: ARGS,
});
const context = await browser.newContext({
  viewport: { width: 1728, height: 1117 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

if (checkGpu) {
  await page.goto(`${BASE}/#/`);
  await page.waitForTimeout(1000);
  const result = await page.evaluate(async () => {
    if (!("gpu" in navigator)) return { hasGpu: false };
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return { hasGpu: true, hasAdapter: false };
    const device = await adapter.requestDevice();
    const hic =
      "drawElementImageToTexture" in device.queue ||
      "copyElementImageToTexture" in device.queue;
    return {
      hasGpu: true,
      hasAdapter: true,
      adapterInfo: adapter.info?.vendor + " " + adapter.info?.architecture,
      htmlInCanvas: hic,
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  process.exit("htmlInCanvas" in result && result.htmlInCanvas ? 0 : 1);
}

for (const name of targets) {
  const url = ROUTES[name];
  if (!url) {
    console.error(`Unknown route: ${name}`);
    process.exit(1);
  }
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500); // let shaders settle
  await page.screenshot({ path: `.screenshots/site-${name}.png` });
  console.log(`captured .screenshots/site-${name}.png`);
}

await browser.close();
