import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export async function checkIfSessionExists(request: FastifyRequest, reply: FastifyReply) {
  const { session } = request.cookies;
  
  if(!session) {
    return reply.status(401).send({ error: "Unauthorized." });
  }
}