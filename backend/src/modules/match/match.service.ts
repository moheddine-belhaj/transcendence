import prisma from "../../utils/prisma";
import { UpdateMatchInput } from "./match.schema";

export async function createMatch(player1Id: number, player2Id: number) {
  return prisma.match.create({
    data: {
      player1Id,
      player2Id,
      status: "pending",
      scorePlayer1: 0,
      scorePlayer2: 0
    }
  });
}

export async function updateMatchResult(
  matchId: number, scorePlayer1: number, scorePlayer2: number, winnerId: number | undefined
) {
  return prisma.match.update({
    where: { id: matchId },
    data: {
      scorePlayer1,
      scorePlayer2,
      winnerId,
      status : "completed"
    },
    include: {
      player1: { select: { id: true, name: true } },
      player2: { select: { id: true, name: true } },
      winner: { select: { id: true, name: true } }
    }
  });
}


export async function deleteMatch(matchId: number) {
  return prisma.match.delete({
    where: { id: matchId }
  });
}

export async function getUserMatches(userId: number) {
  return prisma.match.findMany({
    where: {
      OR: [
        { player1Id: userId },
        { player2Id: userId }
      ]
    },
    include: {
      player1: { 
        select: { 
          id: true, 
          name: true,
          avatar: true  // Add avatar if you want to include it
        } 
      },
      player2: { 
        select: { 
          id: true, 
          name: true,
          avatar: true  // Add avatar if you want to include it
        } 
      },
      winner: { 
        select: { 
          id: true, 
          name: true 
        } 
      }
    },
    orderBy: { 
      matchDate: "desc" 
    }
  });
}