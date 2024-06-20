import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkIfSessionExists } from "../middlewares/checkIfSessionExists";
import { knex } from "../../db/connection";

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", checkIfSessionExists);

  app.get("/", async (request, reply) => {
    const userId = request.cookies.session;

    const userMeals = await knex("meals").where({user_id: userId});

    return reply.send(userMeals);
  });

  app.get("/:id", async (request, reply) => {
    const mealId = request.params.id;
    const userId = request.cookies.session;

    const meal = await knex("meals").where({id: mealId, user_id: userId}).first();

    return reply.send(meal);
  });

  app.post("/", async (request, reply) => {
    const mealParseBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      on_diet: z.coerce.boolean(),
      created_at_date: z.string().date(),
      created_at_hour: z.string().time(),
    });

    const mealData = mealParseBodySchema.parse(request.body);

    await knex("meals").insert({id: randomUUID(), ...mealData, user_id: request.cookies.session });
 
    return reply.status(201).send("");
  });

  app.put("/:id", async (request, reply) => {
    const mealId = request.params.id;
    const userId = request.cookies.session;

    const meal = await knex("meals").where({id: mealId, user_id: userId}).first();
    
    if(!meal) {
      return reply.status(404).send({"error": "No meals where found."})
    }
    
    const editedMeal = { ...meal, ...request.body };

    const mealSchema = z.object({
      id: z.string().uuid(),
      name: z.string().optional(),
      description: z.string(),
      on_diet: z.coerce.boolean(),
      created_at_date: z.string().date(),
      created_at_hour: z.string().time(),
      user_id: z.string().uuid()
    });

    const finalMeal = mealSchema.parse(editedMeal);

    await knex("meals").update(finalMeal).where({id: mealId, user_id: userId});

    return reply.status(200).send("");
  });

  app.delete("/:id", async(request, reply) => {
    const { id } = request.params;
    const userId = request.cookies.session;

    await knex("meals").where({id, user_id: userId}).del();

    return reply.status(200).send("");
  });
}