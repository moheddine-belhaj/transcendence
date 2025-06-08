import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from "@fastify/jwt";
import cors from "@fastify/cors";
import userRoutes from "./modules/user/user.route";
import matchRoutes from "./modules/match/match.routes";
import { matchSchemas } from "./modules/match/match.schema";
import { userSchema } from "./modules/user/user.schema";
import avatarRoutes from './modules/avatar/avatar.routes';
import fastifyMultipart from "@fastify/multipart";

export const server = Fastify({
  logger: true
});

// Type extensions
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    customUser?: {
      id: number;
      email: string;
      name: string;
    };
  }
}

// Register plugins
async function registerPlugins() {
  // JWT setup
  await server.register(fjwt, {
    secret: process.env.JWT_SECRET || "42-secret-key"
  });

  //   await server.register(fastifyMultipart, {
  //   limits: {
  //     fileSize: 5 * 1024 * 1024, // 5MB limit
  //     files: 1 // Only allow one file
  //   }
  // })
  // CORS setup
  server.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
  // Authentication decorator
  server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        throw new Error("Authorization token is missing");
      }
      const decoded = server.jwt.decode(token);
      if (!decoded || typeof decoded !== 'object') {
        throw new Error("Invalid token");
      }
      request.customUser = decoded as { id: number; email: string; name: string };
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
}

// Register routes
async function registerRoutes() {
  // Add schemas
  for  (const schema of [...Object.values(userSchema), ...Object.values(matchSchemas)])  {
    server.addSchema(schema);
  }

  // Register user routes
  await server.register(userRoutes, { prefix: "/api/users" });
  await server.register(matchRoutes, { prefix: "/api/matches" });
    // await server.register(avatarRoutes, { prefix: '/api/users' });

  // Health check endpoint
server.get('/api/health', async () => {
  return { 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
});
}
// Start server
async function startServer() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = parseInt(process.env.PORT || "3000");
    const host = process.env.HOST || "0.0.0.0";

    await server.listen({ port, host });
    console.log(`Server running on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Start the application
startServer();