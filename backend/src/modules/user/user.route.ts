import { FastifyInstance } from "fastify";
import { $ref } from "./user.schema";
import { acceptFriendHandler, addFriendHandler, deleteFriendHandler, getFriendsHandler, getUserhandler, loginHandler, refuseFriendHandler, registerUserHandler } from "./user.controller";
import { z } from "zod";

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


  server.post("/login",{
    schema: {
      body: $ref("loginSchema"),
      response: {
        200: $ref("loginResponseSchema"),
      },
    },
  }, loginHandler);


  server.get("/",
  {
    preHandler: [server.authenticate],

  }, getUserhandler);

  server.get<{ Params: { userId: number } }>('/friends/:userId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' }
        },
        required: ['userId']
      }
    },
    preHandler: [server.authenticate]
  }, getFriendsHandler);

   server.post<{
    Body: { userId: number; friendId: number; status?: "pending" | "accepted" | "rejected" }
  }>('/friends', {
    schema: {
      body: $ref('friendSchema'),
      response: {
        201: $ref('friendResponseSchema')
      }
    },
    preHandler: [server.authenticate]
  }, addFriendHandler);

  server.patch<{
    Body: { userId: number; friendId: number }
  }>('/friends/accept', {
    schema: {
      body: $ref('acceptFriendSchema'),
      response: {
        200: $ref('friendResponseSchema')
      }
    },
    preHandler: [server.authenticate]
  }, acceptFriendHandler);


server.patch<{
  Body: { userId: number; friendId: number }
}>("/friends/refuse", {
  schema: {
    body: $ref('refuseFriendSchema'),
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  },
  preHandler: [server.authenticate]
}, refuseFriendHandler);


// Add to user.routes.ts
server.delete<{
  Body: { userId: number; friendId: number }
}>("/friends", {
  schema: {
    body: $ref("deleteFriendSchema"),
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  },
  preHandler: [server.authenticate]
}, deleteFriendHandler);


}


export default userRoutes;


