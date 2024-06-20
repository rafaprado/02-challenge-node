import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../../db/connection";
import { randomUUID } from "node:crypto";
import { checkIfSessionExists } from "../middlewares/checkIfSessionExists";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const userParseBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string()
    });

    const userData = userParseBodySchema.parse(request.body);
  
    const id = randomUUID();
    await knex("users").insert({id, ...userData});

    reply.cookie("session", id, {
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day
    })

    return reply.status(201).send("");
  });

  app.get("/metrics", {preHandler: checkIfSessionExists}, async(request, reply) => {
    const { session: user_id } = request.cookies;

    const userMeals = await knex("meals").where({user_id});

    const mealsTotalCount = userMeals.length;
    const mealsOnDiet = userMeals.reduce((acc, meal) => (meal.on_diet === 1) ? ++acc : acc, 0);
    const bestSequence = userMeals.reduce((acc, meal) => {

      acc.currentSet = meal.on_diet === 1 ? [...acc.currentSet, meal] : []; 
      
      if(acc.currentSet.length >= acc.finalSet.length)  acc.finalSet = acc.currentSet;

      return acc;

    }, {finalSet: [], currentSet: []});

    return reply.send({
      total_meals: mealsTotalCount,
      meals_on_diet: mealsOnDiet,
      meals_off_diet: mealsTotalCount - mealsOnDiet,
      best_sequence: bestSequence.finalSet
    });
  });
}