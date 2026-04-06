const API_BASE = "https://amanah-proptech.vercel.app";
async function test() {
  console.log(`[TEST] Hitting Production API: ${API_BASE}/api/outreach/send`);
  try {
    const res = await fetch(`${API_BASE}/api/outreach/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead: { email: "test@example.com", name: "Test User" },
        dryRun: true
      })
    });
    const text = await res.text();
    console.log(`[STATUS] ${res.status}`);
    console.log(`[RESPONSE] ${text.slice(0, 500)}`);
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
  }
}
test();
