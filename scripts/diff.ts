import fs from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROUTES = ["hero", "created", "experienced", "written", "designed"];
const names = process.argv.slice(2).filter((n) => !n.startsWith("--"));
const targets = names.length ? names : ROUTES;

let failed = false;
for (const name of targets) {
  const site = `.screenshots/site-${name}.png`;
  const figma = `.screenshots/figma-${name}.png`;
  if (!fs.existsSync(site) || !fs.existsSync(figma)) {
    console.log(`${name}: missing ${fs.existsSync(site) ? figma : site}`);
    failed = true;
    continue;
  }
  const a = PNG.sync.read(fs.readFileSync(site));
  const b = PNG.sync.read(fs.readFileSync(figma));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(
      `${name}: SIZE MISMATCH site=${a.width}x${a.height} figma=${b.width}x${b.height}`,
    );
    failed = true;
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const mismatches = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0.1,
  });
  const pct = ((mismatches / (a.width * a.height)) * 100).toFixed(2);
  fs.writeFileSync(`.screenshots/diff-${name}.png`, PNG.sync.write(diff));
  console.log(`${name}: ${pct}% mismatched (${mismatches} px) -> .screenshots/diff-${name}.png`);
}
process.exit(failed ? 1 : 0);
