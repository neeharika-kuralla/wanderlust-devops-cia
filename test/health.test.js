const test = require("node:test");
const assert = require("node:assert/strict");

process.env.NODE_ENV = "test";

const app = require("../app");

test("health endpoint returns OK", async () => {
    const server = app.listen(0);

    try {
        const port = server.address().port;
        const response = await fetch(`http://127.0.0.1:${port}/health`);

        assert.equal(response.status, 200);

        const data = await response.json();

        assert.equal(data.status, "OK");
        assert.equal(data.application, "Wanderlust");
    } finally {
        await new Promise((resolve, reject) => {
            server.close(err => err ? reject(err) : resolve());
        });
    }
});