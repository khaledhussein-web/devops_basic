const http = require("http");

const URL = process.env.TARGET_URL || "http://php:80";
const EXPECTED = "Hello World";

function fail(msg) {
  console.error("TEST FAILED:", msg);
  process.exit(1);
}

http.get(URL, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    const body = data.trim();
    console.log("Response:", body);

    if (body !== EXPECTED) {
      fail(`Expected "${EXPECTED}" but got "${body}"`);
    }

    console.log("✅ TEST PASSED");
    process.exit(0);
  });
}).on("error", (err) => fail(err.message));
