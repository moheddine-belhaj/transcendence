import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createMatch,
  updateMatchResult,
  getUserMatches,
  deleteMatch
} from './match.service';
import { CreateMatchInput, UpdateMatchInput } from './match.schema';

export async function createMatchHandler(
  request: FastifyRequest<{ Body: CreateMatchInput }>,
  reply: FastifyReply
) {
  try {
    const { player1Id, player2Id } = request.body;
    const match = await createMatch(player1Id, player2Id);
    return reply.code(201).send(match);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return reply.code(400).send({ error: errorMessage });
  }
}

export async function updateMatchResultHandler(
  request: FastifyRequest<{ 
    Params: { matchId: string },
    Body: UpdateMatchInput 
  }>,
  reply: FastifyReply
) {
  try {
    const matchId = parseInt(request.params.matchId);
    const { scorePlayer1, scorePlayer2, winnerId } = request.body;
    const result = await updateMatchResult(matchId, scorePlayer1, scorePlayer2, winnerId);
    return reply.code(200).send(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return reply.code(400).send({ error: errorMessage });
  }
}

export async function getUserMatchesHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = parseInt(request.params.userId);
    const matches = await getUserMatches(userId);
    return reply.code(200).send(matches);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return reply.code(400).send({ error: errorMessage });
  }
}

export async function deleteMatchHandler(
  request: FastifyRequest<{ Params: { matchId: string } }>,
  reply: FastifyReply
) {
  try {
    const matchId = parseInt(request.params.matchId);
    await deleteMatch(matchId);
    return reply.code(200).send({ message: 'Match deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return reply.code(400).send({ error: errorMessage });
  }
}