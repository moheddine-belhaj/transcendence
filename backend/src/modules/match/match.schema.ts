import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Core match schema
const matchCore = {
  player1Id: z.number(),
  player2Id: z.number()
};

// ID schemas
const matchIdSchema = z.object({
  matchId: z.string().regex(/^\d+$/, "Must be a numeric string")
});

const userIdSchema = z.object({
  userId: z.string().regex(/^\d+$/, "Must be a numeric string")
});

// Request schemas
const createMatchSchema = z.object({
  ...matchCore
});

const updateMatchSchema = z.object({
  scorePlayer1: z.number(),
  scorePlayer2: z.number(),
  winnerId: z.number().optional()
});

// // Response schemas
// const matchResponseSchema = z.object({
//   id: z.number(),
//   ...matchCore,
//   scorePlayer1: z.number(),
//   scorePlayer2: z.number(),
//   winnerId: z.number().nullable(),
//   status: z.string(),
//   matchDate: z.string().datetime()
// });


// Export types
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;


const matchResponseSchema = z.object({
  id: z.number(),
  player1Id: z.number(),
  player2Id: z.number(),
  player1: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string().optional()  // Optional if you're including avatar
  }),
  player2: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string().optional()  // Optional if you're including avatar
  }),
  scorePlayer1: z.number(),
  scorePlayer2: z.number(),
  winnerId: z.number().nullable(),
  winner: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),
  status: z.string(),
  matchDate: z.string().datetime()
});

const matchesResponseSchema = z.array(matchResponseSchema);

// Build and export schemas
export const { schemas: matchSchemas, $ref } = buildJsonSchemas({
  createMatchSchema,
  updateMatchSchema,
  matchResponseSchema,
  matchesResponseSchema,
  matchIdSchema,
  userIdSchema
}, { $id: "MatchSchemas" });