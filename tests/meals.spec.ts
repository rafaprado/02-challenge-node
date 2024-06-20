import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Meals route", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  })

  it("Should create a new meal", async() => {
    const createUserResponse = await request(app.server)
    .post("/users")
    .send({
      name: "Test",
      email: "test@email.com",
      password: "testepass"
    });

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
    .post("/meals")
    .set("Cookie", cookies)
    .send({
      name: "Arroz",
      description: "Arroz cozido",
      on_diet: "1",
      created_at_date: "2024-05-06",
      created_at_hour: "12:00:00"
    }).expect(201);

  });
})