import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";


describe("Users route", () => {
  beforeAll(async () => {
    await app.ready();
  });
  
  afterAll(async() => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });
  
  it("Should create a new user", async () => {

    await request(app.server)
    .post("/users")
    .send({
      name: "Test",
      email: "test@test.com",
      password: "testpass"
    }).expect(201);

  });

  it("Should get the metrics of the user", async () => {
    const createUserResponse = await request(app.server)
    .post("/users")
    .send({
      name: "Test",
      email: "test@test.com",
      password: "testpass"
    });

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
    .post("/meals")
    .set("Cookie", cookies)
    .send({
      name: "Pao de queijo",
      on_diet: 0,
      created_at_date: "2024-06-01",
      created_at_hour: "15:00:00"
    })

    await request(app.server)
    .post("/meals")
    .set("Cookie", cookies)
    .send({
      name: "Banana",
      on_diet: 1,
      created_at_date: "2024-06-01",
      created_at_hour: "15:00:00"
    })

    await request(app.server)
    .post("/meals")
    .set("Cookie", cookies)
    .send({
      name: "Café",
      on_diet: 0,
      created_at_date: "2024-06-01",
      created_at_hour: "15:00:00"
    })

    await request(app.server)
    .post("/meals")
    .set("Cookie", cookies)
    .send({
      name: "Barra de cereal integral",
      on_diet: 1,
      created_at_date: "2024-06-01",
      created_at_hour: "17:00:00"
    })

    await request(app.server)
    .post("/meals")
    .set("Cookie", cookies)
    .send({
      name: "Copo de leite semi-desnatado",
      on_diet: 1,
      created_at_date: "2024-06-01",
      created_at_hour: "17:00:00"
    });

    const getMetrictsResponse = await request(app.server)
    .get("/users/metrics")
    .set("Cookie", cookies);

    expect(getMetrictsResponse.body).toEqual(expect.objectContaining({total_meals: 5}));
  });

});