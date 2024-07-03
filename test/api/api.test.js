import { beforeAll, describe, expect, test } from "vitest";

const BEFORE_ALL_TIMEOUT = 30000; // 30 sec

describe.skip("path: /auth/register", async () => {
  let response;

  beforeAll(async () => {
    const timestamp = Date.now();
    const userData = {
      username: `kylekatern_${timestamp}`,
      email: `kylekatern_${timestamp}@hotmail.com`,
      full_name: { first_name: "Kyle", middle_name: "", last_name: "Katern" },
      password: "123456",
    };

    response = await fetch("http://localhost:7000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  }, BEFORE_ALL_TIMEOUT);

  test("Should have response status 201", async () => {
    console.log(response);
    expect(response.status).toBe(201);
  });
});

describe.skip("path: /:userId/log-weight", async () => {
  let response;

  beforeAll(async () => {
    const timestamp = Date.now();
    const userData = {
      logObject: {
        weight: 93.2,
        date: timestamp,
      },
    };

    response = await fetch(
      "http://localhost:7000/api/667afd0b0a4954e9727b54a1/log-weight",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
  }, BEFORE_ALL_TIMEOUT);

  test("Should have response status 201", async () => {
    console.log(response.status);
    expect(response.status).toBe(201);
  });
});
