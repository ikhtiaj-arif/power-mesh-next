/**
 * Probe Vercel static detail routes + rewrite fingerprint.
 * Writes NDJSON to workspace debug-a75d46.log
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logPath = path.resolve(__dirname, "../../debug-a75d46.log");
const BASE = process.env.PROBE_APP_URL || "https://power-mesh-next.vercel.app";

function log(hypothesisId, location, message, data) {
  const line = JSON.stringify({
    sessionId: "a75d46",
    runId: "sheet-404-verify",
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  });
  fs.appendFileSync(logPath, `${line}\n`);
  console.log(line);
}

async function probe(pathname, hypothesisId) {
  const url = `${BASE}${pathname}`;
  const res = await fetch(url, { redirect: "manual" });
  const text = await res.text();
  const looksLikeNext = text.includes("__NEXT_DATA__") || text.includes("/_next/");
  const titleMatch = text.match(/<title[^>]*>([^<]*)<\/title>/i);
  log(hypothesisId, "probe-static-detail.mjs", pathname, {
    url,
    status: res.status,
    redirected: res.headers.get("location"),
    contentType: res.headers.get("content-type"),
    looksLikeNext,
    title: titleMatch?.[1] ?? null,
    bodyLen: text.length,
    has404Text: /404|not found/i.test(text.slice(0, 2000)),
  });
  return res.status;
}

await probe("/admin/users/229befee-8af3-4564-b9a6-7661fc577f6f", "H1");
await probe("/admin/events/7700d409-ae30-4174-9a52-134b31a30127", "H2");
await probe("/admin/users/_", "H3");
await probe("/admin/events/_", "H4");
await probe("/admin/users", "H5");

console.log("Wrote", logPath);
