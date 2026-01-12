const http = require("http");

const URL = process.env.TARGET_URL || "http://php:80";
const EXPECTED = "Hello World";

const MAX_TRIES = 60;      // 60 seconds
const WAIT_MS = 1000;

function requestOnce() {
  return new Promise((resolve, reject) => {
    http.get(URL, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data.trim() }));
    }).on("error", reject);
  });
}

(async () => {
  for (let i = 1; i <= MAX_TRIES; i++) {
    try {
      const { status, body } = await requestOnce();
      console.log(`Try ${i}: status=${status} body="${body}"`);

      if (body === EXPECTED) {
        console.log("✅ TEST PASSED");
        process.exit(0);
      }
    } catch (e) {
      console.log(`Try ${i}: not ready (${e.message})`);
    }

    await new Promise(r => setTimeout(r, WAIT_MS));
  }

  console.error(`❌ TEST FAILED: Expected "${EXPECTED}" within ${MAX_TRIES}s`);
  process.exit(1);
})();
