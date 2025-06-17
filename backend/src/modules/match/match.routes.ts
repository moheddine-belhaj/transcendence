import { FastifyInstance } from "fastify";
import {
  createMatchHandler,
  updateMatchResultHandler,
  getUserMatchesHandler
} from "./match.controller";
import { $ref } from "./match.schema";

async function matchRoutes(server: FastifyInstance) {
  server.post<{
    Body: { player1Id: number; player2Id: number; }
  }>("/", {
    schema: {
      body: $ref("createMatchSchema"),
      response: {
        201: $ref("matchResponseSchema")
      }
    },
    preHandler: [server.authenticate]
  }, createMatchHandler);

  server.put<{
    Params: { matchId: string };
    Body: { scorePlayer1: number; scorePlayer2: number; winnerId?: number };
  }>("/:matchId/result", {
    schema: {
      params: $ref("matchIdSchema"),
      body: $ref("updateMatchSchema"),
      response: {
        200: $ref("matchResponseSchema")
      }
    },
    preHandler: [server.authenticate]
  }, updateMatchResultHandler);

  server.get<{ Params: { userId: string } }>("/user/:userId", {
    schema: {
      params: $ref("userIdSchema"),
      response: {
        200: $ref("matchesResponseSchema")
      }
    },
    preHandler: [server.authenticate]
  }, getUserMatchesHandler);
}

export default matchRoutes;