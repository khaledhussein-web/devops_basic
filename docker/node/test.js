const http = require("http");

const MAX_TRIES = 60;
const WAIT_MS = 1000;

function requestOnce(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body: data.trim() })
        );
      })
      .on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function bodyHasHelloWorld(body) {
  // Accept either plain text or JSON: {"message":"Hello world"}
  if (body === "Hello world" || body === "Hello World") return true;

  try {
    const json = JSON.parse(body);
    return (
      json?.message === "Hello world" ||
      json?.message === "Hello World"
    );
  } catch {
    return false;
  }
}

(async () => {
  const healthURL = process.env.HEALTH_URL || "http://php/index.php";
  const apiURL = process.env.API_URL || "http://php/api.php";

  // ---------- TEST 1: Health ----------
  console.log(`\n[Test 1] Health check: ${healthURL} expect "OK"`);
  let healthPassed = false;

  for (let i = 1; i <= MAX_TRIES; i++) {
    try {
      const { status, body } = await requestOnce(healthURL);
      console.log(`Try ${i}: status=${status} body="${body}"`);

      if (status === 200 && body === "OK") {
        healthPassed = true;
        console.log("✅ Health TEST PASSED");
        break;
      }
    } catch (e) {
      console.log(`Try ${i}: not ready (${e.message})`);
    }
    await sleep(WAIT_MS);
  }

  if (!healthPassed) {
    console.error(`❌ Health TEST FAILED: Expected "OK" within ${MAX_TRIES}s`);
    process.exit(1);
  }

  // ---------- TEST 2: API ----------
  console.log(`\n[Test 2] API check: ${apiURL} expect Hello world`);
  let apiPassed = false;

  for (let i = 1; i <= MAX_TRIES; i++) {
    try {
      const { status, body } = await requestOnce(apiURL);
      console.log(`Try ${i}: status=${status} body="${body}"`);

      if (status === 200 && bodyHasHelloWorld(body)) {
        apiPassed = true;
        console.log("✅ API TEST PASSED");
        break;
      }
    } catch (e) {
      console.log(`Try ${i}: not ready (${e.message})`);
    }
    await sleep(WAIT_MS);
  }

  if (!apiPassed) {
    console.error(
      `❌ API TEST FAILED: Expected "Hello world" (text or JSON.message) within ${MAX_TRIES}s`
    );
    process.exit(1);
  }

  console.log("\n🎉 ALL TESTS PASSED");
  process.exit(0);
})();
