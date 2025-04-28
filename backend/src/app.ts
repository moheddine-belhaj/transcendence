import Fastify from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchema } from "./modules/user/user.schema";
const server = Fastify();

server.get("/health", async (request, response) => {
  response.send({ message: "Hello, World!" });
});

async function main() {

for (const schema of Object.values(userSchema)) {
    server.addSchema(schema); // Register each schema
  }

    server.register(userRoutes, { prefix: "/api/users" });
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log("Server is running on port 3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();