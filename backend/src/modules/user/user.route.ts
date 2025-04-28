import { FastifyInstance } from "fastify";
import { $ref } from "./user.schema";
import { registerUserHandler } from "./user.controller";


async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
  {
    schema: {
    body: $ref("createUserSchema"),
    response:{
      201: $ref("createUserResponseSchema"),
    }
  },
},
  registerUserHandler);
}

export default userRoutes;