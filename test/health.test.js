const test = require("node:test");
const assert = require("node:assert/strict");

test("health endpoint returns OK", async () => {
    const response = await fetch("http://localhost:3000/health");

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.status, "OK");
    assert.equal(data.application, "Wanderlust");
});