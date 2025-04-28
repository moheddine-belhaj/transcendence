import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from "fastify-jwt";
import userRoutes from "./modules/user/user.route";
import { userSchema } from "./modules/user/user.schema";


export const server = Fastify();

server.register(fjwt, {

  secret: "42-secret-key"
});


server.decorate("auth", async (request:FastifyRequest, reply:FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }

});

async function main() {

for (const schema of Object.values(userSchema)) {
    server.addSchema(schema); // Register each schema
  }

    server.register(userRoutes, { prefix: "api/users" });
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log("Server is running on port 3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();